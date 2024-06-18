import Joi from "joi";
import Client from "../database/models/Client.js";
import Account from "../database/models/Account.js";
import path from "path";
import fs from "fs";
import {getDirName} from "../helper/utils.js";

const __dirname = getDirName(import.meta.url);

const clientRequestSchema = Joi.object({
    account: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }).required(),
    name: Joi.string().min(3).required(),
    tel: Joi.string().pattern(/^\d{11}$/).required(),
    address: Joi.string().required(),
    birthDate: Joi.date().iso().required(),
    gender: Joi.string().valid('M', 'F').required(),
    profilePicture: Joi.string().optional()
});

const clientUpdateSchema = Joi.object({
    name: Joi.string().min(3).required(),
    tel: Joi.string().pattern(/^\d{11}$/).required(),
    address: Joi.string().required(),
    birthDate: Joi.date().iso().required(),
    gender: Joi.string().valid('M', 'F').required(),
    profilePicture: Joi.string().optional()
});

class ClientController {
    /*
     * Admin methods.
     */
    async getAll(req, res) {
        try {
            const sortParam = req.query.sort || 'id';
            const orderParam = req.query.order || 'DESC';
            const limitParam = req.query.limit ? parseInt(req.query.limit, 10) : null;

            const clients = await Client.findAll({
                attributes: ['id', 'name', 'tel', 'address', 'birthDate', 'gender', 'profilePicture'],
                order: [[sortParam, orderParam]],
                limit: limitParam,
                include: {
                    model: Account,
                    attributes: ['email', 'role']
                }
            });
            return res.json(clients);
        } catch (err) {
            app_logger.error(err.message);
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(422).json({
                    message: 'Campo(s) inválido(s).',
                    details: ['Campo \'id\' é obrigatório.']
                });
            }

            const client = await Client.findByPk(id, {
                attributes: ['id', 'name', 'tel', 'address', 'birthDate', 'gender', 'profilePicture'],
                include: {
                    model: Account,
                    attributes: ['email', 'role']
                }
            });
            if (!client) {
                return res.status(404).json({
                    message: 'Cliente com o id informado não encontrado.'
                });
            }

            return res.json(client);
        } catch (err) {
            app_logger.error(err);
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }

    async create(req, res) {
        const {error, value} = clientRequestSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                message: 'Campo(s) inválido(s).',
                details: error.details
            });
        }

        const t = await app_db.transaction();
        try {
            const data = value;

            if (req.file) {
                data.profilePicture = req.file.filename;
            }

            const account = await Account.create({
                email: data.account.email,
                password: data.account.password,
                role: 'USER'
            }, {transaction: t});

            data.account_id = account.id;
            delete data.account;

            const client = await Client.create(data, {transaction: t});
            await t.commit();

            return res.status(201).json(client);
        } catch (err) {
            await t.rollback();

            if (req.file) {
                removeOldProfilePicture(req.file.filename)
            }

            app_logger.error(err);
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async update(req, res) {
        const {id} = req.params;
        if (!id) {
            return res.status(422).json({
                message: 'Campo(s) inválido(s).',
                details: ['Campo \'id\' é obrigatório.']
            });
        }

        const {error, value} = clientUpdateSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                message: 'Campo(s) inválido(s).',
                details: error.details
            });
        }

        try {
            const data = value;
            const client = await Client.findByPk(id);
            if (!client) {
                return res.status(404).json({
                    message: 'Cliente com o id informado não encontrado.'
                });
            }

            await client.update(data);
            return res.json(client);
        } catch (err) {
            app_logger.error(err);
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async delete(req, res) {
        const {id} = req.params;
        if (!id) {
            return res.status(422).json({
                message: 'Campo(s) inválido(s).',
                details: ['Campo \'id\' é obrigatório.']
            });
        }

        try {
            await Client.destroy({
                where: {
                    id: id
                }
            });
            return res.status(204).send();
        } catch (err) {
            app_logger.error(err);
            return res.status(400).json({
                message: err.message
            });
        }
    }

    async updateProfilePicture(req, res) {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(422).json({
                    message: 'Campo(s) inválido(s).',
                    details: ['Campo \'id\' é obrigatório.']
                });
            }

            const client = await Client.findByPk(id);
            if (!client) {
                return res.status(404).json({
                    message: 'Cliente com o id informado não encontrado.'
                });
            }

            if (client.profilePicture) {
                removeOldProfilePicture(client.profilePicture);
            }

            client.profilePicture = req.file.filename;
            await client.save();

            return res.json({
                profilePicture: client.profilePicture
            });
        } catch (err) {
            app_logger.error(err.message);
            return res.status(400).json({
                message: 'Erro ao atualizar foto de perfil.',
                details: err.message
            });
        }
    }

    /*
     * Client methods.
     */
    async getSelfDetails(req, res) {
        try {
            const client = await Client.findOne({
                where: {
                    account_id: req.userId
                },
                attributes: ['id', 'name', 'tel', 'address', 'birthDate', 'gender', 'profilePicture'],
                include: {
                    model: Account,
                    attributes: ['email', 'role']
                }
            });

            if (!client) {
                return res.status(404).json({
                    message: 'Não foi possível obter os detalhes do perfil do cliente.'
                });
            }

            return res.json(client);
        } catch (err) {
            app_logger.error(err);
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }

    async updateSelfDetails(req, res) {
        const {error, value} = clientUpdateSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
                message: 'Campo(s) inválido(s).',
                details: error.details
            });
        }

        try {
            const data = value;
            const client = await Client.findOne({
                where: {
                    account_id: req.userId
                }
            });

            if (!client) {
                return res.status(404).json({
                    message: 'Não foi possível atualizar os detalhes do perfil do cliente.'
                });
            }

            await client.update(data);
            return res.json(client);
        } catch (err) {
            app_logger.error(err);
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }

    async updateSelfPassword(req, res) {
        const {password} = req.body;
        if (!password || password.length < 6) {
            return res.status(422).json({
                message: 'Campo(s) inválido(s).',
                details: ['Campo \'password\' é obrigatório e precisa ter pelo menos 6 caracteres.']
            });
        }

        try {
            const account = await Account.findByPk(req.userId);
            if (!account) {
                return res.status(404).json({
                    message: 'Não foi possível atualizar a senha do cliente.'
                });
            }

            await account.update({password});
            return res.status(204).send();
        } catch (err) {
            app_logger.error(err);
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }

    async updateSelfProfilePicture(req, res) {
        try {
            const client = await Client.findOne({
                where: {
                    account_id: req.userId
                }
            });

            if (!client) {
                return res.status(404).json({
                    message: 'Não foi possível localizar o cliente.'
                });
            }

            if (client.profilePicture) {
                removeOldProfilePicture(client.profilePicture);
            }

            client.profilePicture = req.file.filename;
            await client.save();

            return res.json({
                profilePicture: client.profilePicture
            });
        } catch (err) {
            app_logger.error(err.message);
            return res.status(400).json({
                message: 'Erro ao atualizar foto de perfil.',
                details: err.message
            });
        }
    }
}

const removeOldProfilePicture = (profilePicture) => {
    const oldPath = path.join(__dirname, '../../uploads/', profilePicture);
    if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
    }
}

export default new ClientController();
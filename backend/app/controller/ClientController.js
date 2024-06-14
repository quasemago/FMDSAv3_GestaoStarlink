import Joi from "joi";
import Client from "../database/models/Client.js";
import Account from "../database/models/Account.js";

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

class ClientController {
    async getAll(req, res) {
        try {
            const clients = await Client.findAll({
                attributes: ['id', 'name', 'tel', 'address', 'birthDate', 'gender', 'profilePicture'],
                order: [['id', 'DESC']],
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

        try {
            const data = value;
            const account = await Account.create({
                email: data.account.email,
                password: data.account.password,
                role: 'USER'
            });

            data.account_id = account.id;
            delete data.account;

            const client = await Client.create(data);
            return res.status(201).json(client);
        } catch (err) {
            app_logger.error(err);
        }
    }
}

export default new ClientController();
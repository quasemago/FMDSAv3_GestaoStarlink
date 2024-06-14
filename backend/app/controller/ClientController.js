import Client from "../database/models/Client.js";
import Account from "../database/models/Account.js";

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
                    message: 'Client ID is required'
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
}

export default new ClientController();
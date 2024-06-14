import Client from "../database/models/Client.js";

class ClientController {
    async getAll(req, res) {
        if (req.userRole !== 'ADMIN') {
            res.status(403)
                .json({message: "Acesso negado!"});
            return;
        }

        try {
            const clients = await Client.findAll({
                order: [['id', 'DESC']]
            });
            return res.json(clients);
        } catch (err) {
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }

    async getById(req, res) {
        if (req.userRole !== 'ADMIN') {
            res.status(403)
                .json({message: "Acesso negado!"});
            return;
        }

        try {
            const {id} = req.params;
            if (!id) {
                return res.status(422).json({
                    message: 'Client ID is required'
                });
            }

            const client = await Client.findByPk(id);
            if (!client) {
                return res.status(404).json({
                    message: 'Cliente com o id informado não encontrado.'
                });
            }

            return res.json(client);
        } catch (err) {
            return res.status(400).json({
                message: ERROR_MESSAGES.GENERIC_ERROR
            });
        }
    }
}

export default new ClientController();
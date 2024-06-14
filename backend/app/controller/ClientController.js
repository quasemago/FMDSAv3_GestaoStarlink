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
}

export default new ClientController();
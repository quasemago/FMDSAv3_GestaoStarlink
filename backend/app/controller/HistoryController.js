import Client from "../database/models/Client.js";
import BrowsingHistory from "../database/models/history/BrowsingHistory.js";
import InterestsHistory from "../database/models/history/InterestsHistory.js";
import PurchasesHistory from "../database/models/history/PurchasesHistory.js";
import LocationHistory from "../database/models/history/LocationHistory.js";
import SessionsHistory from "../database/models/history/SessionsHistory.js";
import OnlineActivity from "../database/models/OnlineActivity.js";

class HistoryController {

    async getById(req, res) {
        const {id, type} = req.params;
        try {
            const onlineActivity = await OnlineActivity.findOne({where: {client_id: id}});
            if (!onlineActivity) {
                res.status(404).json({message: "Atividade online não encontrada para o cliente " + id});
                return;
            }
            let history;

            switch (type) {
                case "browsing":
                    history = await BrowsingHistory.findAll({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "interests":
                    history = await InterestsHistory.findAll({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "purchases":
                    history = await PurchasesHistory.findAll({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "location":
                    history = await LocationHistory.findAll({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "sessions":
                    history = await SessionsHistory.findAll({where: {online_activity_id: onlineActivity.id}});
                    break;
                default:
                    res.status(400).json({message: "Tipo de histórico inválido!"});
                    return;
            }
            res.json(history);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }

    deleteById(req, res) {

    }
}

export default new HistoryController();
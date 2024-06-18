import Client from "../database/models/Client.js";
import BrowsingHistory from "../database/models/history/BrowsingHistory.js";
import InterestsHistory from "../database/models/history/InterestsHistory.js";
import PurchasesHistory from "../database/models/history/PurchasesHistory.js";
import LocationHistory from "../database/models/history/LocationHistory.js";
import SessionsHistory from "../database/models/history/SessionsHistory.js";
import OnlineActivity from "../database/models/OnlineActivity.js";
import {DateTime} from "luxon";

class HistoryController {
    async saveSelfSession(req, res) {
        const accountId = req.userId;
        try {
            const client = await Client.findOne({where: {account_id: accountId}});
            if (!client) {
                res.status(404).json({message: "Cliente não encontrado!"});
                return;
            }
            const [onlineActivity, created]  = await OnlineActivity.findOrCreate({where: {client_id: client.id}});
            if (!onlineActivity) {
                res.status(404).json({message: "Atividade online não encontrada para o cliente " + client.id});
                return;
            }
            const date = DateTime.now().setZone('America/Cuiaba').toISO()
                .slice(0,19).replace('T', ' ');

            await SessionsHistory.create({date:date, online_activity_id: onlineActivity.id});
            res.status(201).send();
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }

    //admin methods
    async getById(req, res) {
        const {id, type} = req.params;
        try {
            const onlineActivity = await OnlineActivity.findOne({where: {client_id: id}});
            if (!onlineActivity) {
                res.status(200).json([]);
                return;
            }
            let history;

            switch (type) {
                case "browsing":
                    history = await BrowsingHistory.findAll({
                        where: {online_activity_id: onlineActivity.id},
                        order: [['date', 'DESC']]
                    });
                    break;
                case "interests":
                    history = await InterestsHistory.findAll({
                        where: {online_activity_id: onlineActivity.id},
                        order: [['date', 'DESC']]
                    });
                    break;
                case "purchases":
                    history = await PurchasesHistory.findAll({
                        where: {online_activity_id: onlineActivity.id},
                        order: [['date', 'DESC']]
                    });
                    break;
                case "location":
                    history = await LocationHistory.findAll({
                        where: {online_activity_id: onlineActivity.id},
                        order: [['date', 'DESC']]
                    });
                    break;
                case "sessions":
                    history = await SessionsHistory.findAll({
                        where: {online_activity_id: onlineActivity.id},
                        order: [['date', 'DESC']]
                    });
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

    async deleteById(req, res) {
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
                    history = await BrowsingHistory.destroy({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "interests":
                    history = await InterestsHistory.destroy({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "purchases":
                    history = await PurchasesHistory.destroy({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "location":
                    history = await LocationHistory.destroy({where: {online_activity_id: onlineActivity.id}});
                    break;
                case "sessions":
                    history = await SessionsHistory.destroy({where: {online_activity_id: onlineActivity.id}});
                    break;
                default:
                    res.status(400).json({message: "Tipo de histórico inválido!"});
                    return;
            }
            res.status(204).send();
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }

    async getRecentSessions(req, res) {
        try {
            const data = await app_db.query(`SELECT c.id AS id, c.name AS name, a.email AS email, s.date AS date
                                             FROM clients c
                                                 JOIN accounts a
                                             ON a.id = c.account_id
                                                 JOIN (
                                                 SELECT o.client_id, MAX (s.date) AS date
                                                 FROM sessions_history s
                                                 JOIN online_activity o ON s.online_activity_id = o.id
                                                 GROUP BY o.client_id order by date desc limit 6
                                                 ) AS last_sessions ON c.id = last_sessions.client_id
                                                 JOIN sessions_history s ON s.date = last_sessions.date
                                                 AND s.online_activity_id IN (
                                                 SELECT id FROM online_activity WHERE client_id = c.id
                                                 )
                                             order by date desc;`);
            res.json(data[0]);
        } catch (err) {
            res.status(400).json({message: err.message});
        }

    }

    async getCountByYear(req, res) {
        try {
            const {type, year} = req.params;
            const data = await app_db.query(`SELECT MONTH(sh.date) as month, COUNT(*) as count
                                             FROM ${type}_history sh
                                             WHERE YEAR(sh.date) = ${year}
                                             GROUP BY MONTH(sh.date)
                                             order by month asc;`);
            res.json(data[0]);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }
}

export default new HistoryController();
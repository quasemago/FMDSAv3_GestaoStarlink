import {Sequelize} from 'sequelize';
import Account from "./models/Account.js";
import Client from "./models/Client.js";
import OnlineActivity from "./models/OnlineActivity.js";
import BrowsingHistory from "./models/history/BrowsingHistory.js";
import InterestsHistory from "./models/history/InterestsHistory.js";
import LocationHistory from "./models/history/LocationHistory.js";
import PurchasesHistory from "./models/history/PurchasesHistory.js";
import SessionsHistory from "./models/history/SessionsHistory.js";

const models = [
    Account, Client, OnlineActivity,
    BrowsingHistory, InterestsHistory, LocationHistory, PurchasesHistory, SessionsHistory
];

global.app_db = new Sequelize(
    app_config.DATABASE_DB,
    app_config.DATABASE_USER,
    app_config.DATABASE_PASSWORD,
    {
        dialect: app_config.DATABASE_DIALECT,
        host: app_config.DATABASE_HOST,
        port: parseInt(app_config.DATABASE_PORT),
        timezone: '-04:00',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            charset: 'utf8',
        }
    }
);

models.forEach((model) => model.init(app_db));
models.forEach((model) => model.associate && model.associate(app_db.models));
import express from 'express';
import {getDirName, testDbConnection} from "./helper/utils.js";
import {resolve} from 'path';
import cors from 'cors';
import './database/database.js';
import accountRouter from "./router/accountRouter.js";
import clientRouter from "./router/clientRouter.js";

const __dirname = getDirName(import.meta.url);

export default class GestaoStarlink {
    constructor() {
        this.app = express();
        this.port = app_config.SERVER_PORT;
    }

    async start() {
        try {
            await this.app.listen(this.port);
            await testDbConnection(app_db);
            this.middlewares();
            this.routes();
        } catch (err) {
            throw new Error(err);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use("/uploads", express.static(resolve(__dirname, '../uploads')));
    }

    routes() {
        this.app.use(`${API_URL}/login/`, accountRouter);
        this.app.use(`${API_URL}/clients/`, clientRouter);
    }
}
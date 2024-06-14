import express from 'express';
import {testDbConnection} from "./helper/utils.js";
import './database/database.js';

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
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
    }

    routes() {
        //
    }
}
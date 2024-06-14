import './app/helper/config.js';
import './app/helper/constants.js';
import './app/helper/logger.js';
import GestaoStarlink from "./app/App.js";

global.app = new GestaoStarlink();
app.start()
    .then(() => {
        app_logger.info(`Server is running on port ${app.port}!`);
    })
    .catch((err) => {
        app_logger.fatal(err);
        process.exit();
    });
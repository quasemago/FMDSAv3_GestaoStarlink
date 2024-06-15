import {config} from 'dotenv';

config();

global.app_config = {
    // Database
    DATABASE_HOST: '',
    DATABASE_PORT: '',
    DATABASE_USER: '',
    DATABASE_PASSWORD: '',
    DATABASE_DB: '',
    DATABASE_DIALECT: '',

    // Server
    SERVER_PORT: '',

    // JWT
    JWT_TOKEN_SECRET: '',
    JWT_TOKEN_EXPIRATION: ''
}

Object.keys(app_config).forEach(key => {
    app_config[key] = process.env[key];
});

let required_fields = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_DB',
    'DATABASE_DIALECT'
];

required_fields.forEach(field => {
    if (!app_config[field]) {
        throw new Error(`Missing required field ${field} in .env file`);
    }
});
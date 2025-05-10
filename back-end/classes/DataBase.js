const {Sequelize} = require('sequelize');


class DataBase{

    constructor() {
        this.db = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                dialect: 'postgres',
                host: process.env.DB_HOST,
                port: process.env.DB_PORT
            }
        );
    }
}

module.exports = new DataBase();
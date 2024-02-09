const { Sequelize } = require("sequelize");
const { dbPort, dbUser, dbPass, dbHost, dbName } = require("./env");

const sequezlie = new Sequelize({
    dialect: 'postgres',
    host: dbHost,
    database: dbName,
    port: dbPort+"",
    username: dbUser,
    password: dbPass,
})

module.exports = {sequezlie}
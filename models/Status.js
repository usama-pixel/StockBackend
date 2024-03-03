const { DataTypes } = require('sequelize')
const { sequelize: sequezlie } = require("../utils/db");

const Status = sequezlie.define('Status', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Status
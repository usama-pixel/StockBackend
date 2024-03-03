const { DataTypes } = require('sequelize')
const { sequelize: sequezlie } = require("../utils/db");

const History = sequezlie.define('History', {
    id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    person_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {paranoid: true})

module.exports = History
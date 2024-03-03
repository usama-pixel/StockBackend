const { DataTypes } = require('sequelize')
const { sequelize: sequezlie } = require("../utils/db");

const User = sequezlie.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {paranoid: true})

module.exports = User
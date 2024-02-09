const { DataTypes } = require('sequelize')
const { sequezlie } = require("../utils/db");
const User = require('./User');

const Invoice = sequezlie.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
    party_acc_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    party_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    proreitor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    licence_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salesman: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cnic_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, { paranoid: true })

module.exports = Invoice
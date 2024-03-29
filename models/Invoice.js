const { DataTypes } = require('sequelize')
const { sequelize: sequezlie } = require("../utils/db");
const User = require('./User');

const Invoice = sequezlie.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true
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
    discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true,
    },
    tax: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
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
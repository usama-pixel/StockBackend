const { DataTypes } = require('sequelize')
const { sequezlie } = require("../utils/db");

const Batch = sequezlie.define('Batch', {
    id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true,
        allowNull: false,
    },
    batch_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    packing: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    tax: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
}, { paranoid: true })

module.exports = Batch
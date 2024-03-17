const { DataTypes } = require('sequelize')
const { sequelize: sequezlie } = require("../utils/db");

const Batch = sequezlie.define('Batches', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
    to: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_amt: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true
    }
}, { paranoid: true })

module.exports = Batch
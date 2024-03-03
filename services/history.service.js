const Batch = require('../models/Batch')
const History = require("../models/History");
const { v4: uuidv4 } = require('uuid');

async function getHistory(batch_id, user_id) {
    // const 
    // return "ues";
    const result = await History.findAll({
        where: {
            batch_id
        },
        include: {
            model: Batch,
            where: {
                user_id
            }
        }
    })
    return result;
}

async function createHistory(data) {
    data = { id: uuidv4(), ...data }
    const history = await History.create({ ...data })
    return history;
}

module.exports = {
    getHistory,
    createHistory
}
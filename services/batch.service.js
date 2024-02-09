const Batch = require("../models/Batch");
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");

async function getBatches(user_id) {
    const result = await Batch.findAll({where: {user_id}})
    return result
}

async function createBatch(data) {
    data = { id: uuidv4(), ...data }
    const batch = new Batch({ ...data })
    await batch.save()
    return batch
}

async function deleteBatch(id, user_id) {
    const batch = await Batch.findOne({where: {id, user_id}})
    if(!batch) throw new ApiError({message: 'Batch not found', status: 404})
    const result = await batch.destroy()
    // const result = await Batch.destroy({where: {id, user_id}})
    console.log({result})
    return result;
}

async function updateBatch(data, user_id) {
    const {id, ...revised_data} = data;
    const batch = await Batch.findOne({where: {id, user_id}})
    batch.update({
        ...revised_data
    })
    await batch.save()
    return batch;
}

module.exports = {
    getBatches,
    createBatch,
    deleteBatch,
    updateBatch
}
const batchService = require('../services/batch.service')

async function getBatches(req, res, next) {
    try {
        const result = await batchService.getBatches(req.user.id)
        res.json(result);
    } catch(err) {
        next(err)
    }
}

async function createBatch(req, res, next) {
    try {
        const data = req.body
        const result = batchService.createBatch(data, req.user.id)
        res.json(result);
    } catch(err) {
        next(err)
    }
}

async function deleteBatch(req, res, next) {
    try {
        const { id } = req.body
        const data = await batchService.deleteBatch(id, req.user.id)
        res.json({message: 'Batch deleted successfully', data: data})
    } catch(err) {
        next(err)
    }
}

async function updateBatch(req, res, next) {
    try {
        const data = req.body
        const batch = await batchService.updateBatch(data)
        res.json(batch)

    } catch(err) {
        next(err)
    }
}

module.exports = {
    getBatches,
    createBatch,
    deleteBatch,
    updateBatch
}
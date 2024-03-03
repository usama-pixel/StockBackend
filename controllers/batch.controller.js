const batchService = require('../services/batch.service')

async function getBatches(req, res, next) {
    try {
        const {page, limit} = req.query
        const result = await batchService.getBatches(req.user.id, page, limit)
        res.json(result);
    } catch(err) {
        next(err)
    }
}

async function createBatch(req, res, next) {
    try {
        const data = {user_id: req.user.id, ...req.body}
        const result = await batchService.createBatch(data)
        res.json(result);
    } catch(err) {
        next(err)
    }
}

async function deleteBatch(req, res, next) {
    try {
        const { id } = req.params
        const data = await batchService.deleteBatch(id, req.user.id)
        res.json({message: 'Batch deleted successfully', data: data})
    } catch(err) {
        next(err)
    }
}

async function updateBatch(req, res, next) {
    try {
        const {status, ...data} = req.body
        const batch = await batchService.updateBatch(data, req.user.id, status)
        res.json(batch)

    } catch(err) {
        next(err)
    }
}

async function sendBatch(req, res, next) {
    try {
        const {to, batchId: batch_id} = req.body
        const batch = await batchService.sendBatch(to, batch_id, req.user.id)
        res.json(batch)
    } catch(err) {
        next(err)
    }
}

async function batchSent(req, res, next) {
    try {
        const { page, limit, search } = req.query
        const data = await batchService.batchSent(req.user.id, page, limit, search)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

async function getStats(req, res, next) {
    try {
        const data = await batchService.getStats(req.user.id)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

async function getBatchCount(req, res, next) {
    try {
        const data = await batchService.getBatchCount(req.user.id)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getBatches,
    createBatch,
    deleteBatch,
    updateBatch,
    sendBatch,
    batchSent,
    getStats,
    getBatchCount,
}
const historyService = require('../services/history.service')

async function getHistory(req, res, next) {
    try {
        const { batch_id } = req.params
        // console.log(req.user)
        const history = await historyService.getHistory(batch_id, req.user.id)
        res.json(history)
    } catch(err) {
        next(err)
    }
}

async function createHistory(req, res, next) {
    try {
        const data = req.body
        const history = await historyService.createHistory(data)
        res.json(history)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getHistory,
    createHistory
}
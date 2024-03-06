const dashboardService = require('../services/dashboard.service')

async function getTax(req, res, next) {
    try {
        const { monthIndex, year, mode } = req.query
        const data = await dashboardService.getTax(req.user.id, monthIndex, year, mode)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

async function getSales(req, res, next) {
    try {
        const { monthIndex, year, mode } = req.query
        const data = await dashboardService.getSales(req.user.id, monthIndex, year, mode)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

async function getRevenue(req, res, next) {
    try {
        const { monthIndex, year, mode } = req.query
        const data = await dashboardService.getRevenue(req.user.id, monthIndex, year, mode)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

async function getDataPoints(req, res, next) {
    try {
        const { monthIndex, year, mode } = req.query
        const data = await dashboardService.getDataPoints(req.user.id, monthIndex, year, mode)
        res.json(data)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getTax,
    getSales,
    getRevenue,
    getDataPoints,
}
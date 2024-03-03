const { Op } = require("sequelize")
const Batch = require("../models/Batch")
const Status = require("../models/Status")
const { sequelize } = require("../utils/db")
const { ApiError } = require("../utils/ApiError")
const { startOfMonth, endOfMonth } = require("date-fns")

async function getTax(user_id, monthIndex, year) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    const startDate = startOfMonth(new Date(year, monthIndex));
    const endDate = endOfMonth(new Date(year, monthIndex));
    const monthYearCondition = {
        [Op.between]: [
            startDate,
            endDate
        ]
    }
    const d = await Batch.sum('tax', {
        where: {
            user_id,
            status_id: status.dataValues.id,
            updatedAt: monthYearCondition
        }
    })
    return d
}
async function getSales(user_id, monthIndex, year) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    const startDate = startOfMonth(new Date(year, monthIndex));
    const endDate = endOfMonth(new Date(year, monthIndex));
    const monthYearCondition = {
        [Op.between]: [
            startDate,
            endDate
        ]
    }
    const totalSales = await Batch.sum('total_amt', {
        where: {
            user_id,
            status_id: status.dataValues.id,
            updatedAt: monthYearCondition
        }
    });
    console.log({totalSales})
    return totalSales;
}

async function getRevenue(user_id, monthIndex, year) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    const startDate = startOfMonth(new Date(year, monthIndex));
    const endDate = endOfMonth(new Date(year, monthIndex));
    const monthYearCondition = {
        [Op.between]: [
            startDate,
            endDate
        ]
    }
    const totalSales = await Batch.sum('total_amt', {
        where: {
            user_id,
            status_id: status.dataValues.id,
            updatedAt: monthYearCondition
        }
    });
    const totalDiscount = await Batch.sum('discount', {
        where: {
            user_id,
            status_id: status.dataValues.id,
            updatedAt: monthYearCondition,
        }
    });
    const totalTax = await Batch.sum('tax', {
        where: {
            user_id,
            status_id: status.dataValues.id,
            updatedAt: monthYearCondition,
        }
    });
    const totalRevenue = totalSales-totalDiscount-totalTax

    console.log({disc_plus_tax: totalDiscount+totalTax})
    console.log({totalDiscount})
    console.log({totalTax})
    console.log({totalSales})
    console.log({totalRevenue})

    return totalRevenue;
}

module.exports = {
    getTax,
    getSales,
    getRevenue
}
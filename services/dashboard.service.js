const { Op } = require("sequelize")
const Batch = require("../models/Batch")
const Invoices = require("../models/Invoice")
const Status = require("../models/Status")
const { sequelize } = require("../utils/db")
const { ApiError } = require("../utils/ApiError")
const { startOfMonth, endOfMonth } = require("date-fns")

async function getTax(user_id, monthIndex, year, mode) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    let startDate = startOfMonth(new Date(year, monthIndex));
    let endDate = endOfMonth(new Date(year, monthIndex));
    if(mode&&mode == '1') {
        startDate = new Date(year, 0, 1)
        let d = endOfMonth(new Date(year, 11, 1)).getDate()
        endDate = new Date(year, 11, d)
    }
    const monthYearCondition = {
        [Op.between]: [
            startDate,
            endDate
        ]
    }
    const d = await Invoices.sum('tax', {
        where: {
            user_id,
            // status_id: status.dataValues.id,
            updatedAt: monthYearCondition
        }
    })
    return d
}
async function getSales(user_id, monthIndex, year, mode) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    let startDate = startOfMonth(new Date(year, monthIndex));
    let endDate = endOfMonth(new Date(year, monthIndex));
    if(mode&&mode == '1') {
        startDate = new Date(year, 0, 1)
        let d = endOfMonth(new Date(year, 11, 1)).getDate()
        endDate = new Date(year, 11, d)
    }
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

async function getRevenue(user_id, monthIndex, year, mode) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    let startDate = startOfMonth(new Date(year, monthIndex));
    let endDate = endOfMonth(new Date(year, monthIndex));
    if(mode&&mode == '1') {
        startDate = new Date(year, 0, 1)
        let d = endOfMonth(new Date(year, 11, 1)).getDate()
        endDate = new Date(year, 11, d)
    }
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
    const totalDiscount = await Invoices.sum('discount', {
        where: {
            user_id,
            updatedAt: monthYearCondition,
        }
    });
    const totalTax = await Invoices.sum('tax', {
        where: {
            user_id,
            updatedAt: monthYearCondition,
        }
    });
    const totalRevenue = totalSales-totalDiscount-totalTax
    return totalRevenue;
}

async function getDataPoints(user_id, monthIndex, year, mode) {
    const status = await Status.findOne({where: {
        name: 'sent'
    }})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})
    let startDate = new Date(year, monthIndex, 1);
    let endDate = new Date(year, +monthIndex + 1, 0);
    if(mode === '1') {
        startDate = new Date(year, 0, 1)
        let d = endOfMonth(new Date(year, 11, 1)).getDate()
        endDate = new Date(year, 11, d)
    }
    const config = {
        attributes: [
            [sequelize.fn('SUM', sequelize.col('total_amt')), 'sum'],
        ],
        group: [sequelize.literal('DATE("updatedAt")')],
        where: {
            user_id,
            status_id: status.dataValues.id,
            updatedAt: {
                [Op.between]: [startDate, endDate]
            }
        },
        order: [[sequelize.fn('DATE', sequelize.col('updatedAt')), 'ASC']]
    }
    if(mode == '1') {
        config.attributes = [
            [sequelize.fn('TO_CHAR', sequelize.col('updatedAt'), 'YYYY-MM'), 'date'],
            [sequelize.fn('SUM', sequelize.col('total_amt')), 'sum']
        ];
        config.group = [sequelize.literal('TO_CHAR("updatedAt", \'YYYY-MM\')')];
        config.order = [sequelize.literal('TO_CHAR("updatedAt", \'YYYY-MM\') ASC')];
    } else {
        config.attributes = [...config.attributes, [sequelize.fn('DATE', sequelize.col('updatedAt')), 'date'],];
    }
    const d = await Batch.findAll(config)
    console.log({d})
    return d
}


module.exports = {
    getTax,
    getSales,
    getRevenue,
    getDataPoints,
}
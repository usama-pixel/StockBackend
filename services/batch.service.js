const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize')
const { ApiError } = require("../utils/ApiError");
const Batch = require("../models/Batch");
const Status = require("../models/Status");

async function getBatches(user_id, page, limit, search) {
    const status_ids = await getStatuses(['returned', 'recieved'])
    let where = {
        user_id,
        [Op.and]: [
            {[Op.or]: status_ids,}
        ]
    }
    if(search) {
        where = {
            ...where,
            [Op.and]: [
                {
                    [Op.or]: [
                        {
                            product_name: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        {
                            packing: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                    ],
                },
                {
                    [Op.or]: status_ids,
                }
            ],
        }
    }
    let config = {
        where,
        include: Status,
        order: [['updatedAt', 'DESC']],
    }
    if(limit && page) {
        config = {
            ...config,
            limit,
            offset: (page*limit)
        }
    }
    const result = await Batch.findAll(config)
    const count = await Batch.count({
        where,
    })
    console.log({result})
    console.log({count})
    // result
    return {rows: result, totalRows:count}
}

async function createBatch(data) {
    // data = { id: uuidv4(), ...data }
    const status = await Status.findOne({where: {name: 'recieved'}})
    if(!status) throw new ApiError({message: 'No status with this name exists', status: 404})

    const {status: s, ...revised_data } = data
    if(revised_data.quantity && revised_data.rate) {
        revised_data.total_amt = (+revised_data.quantity) * (+revised_data.rate)
    }
    revised_data.status_id = status.dataValues.id
    const batch = new Batch({ ...revised_data })
    await batch.save()
    batch.dataValues.Status = status
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

async function updateBatch(data, user_id, status) {
    const {id, ...revised_data} = data;
    if(status) {
        const statusObj = await Status.findOne({where: {name: status?.toLowerCase()}})
        revised_data.status_id = statusObj.id
    }
    if(revised_data.quantity && revised_data.rate) {
        revised_data.total_amt = (+revised_data.quantity) * (+revised_data.rate)
    }
    const batch = await Batch.findOne({
        where: {id, user_id},
        include: [Status]
    })
    batch.update({
        ...revised_data
    })
    await batch.save()
    return batch;
}

async function sendBatch(to, batch_id, user_id) {
    console.log({to, batch_id, user_id})
    const status = await getStatuses(['sent'])
    const batch = await Batch.findOne({where: {id: batch_id}})
    batch.update({
        ...status[0],
        to
    })
    console.log(batch)
    return batch
}

async function batchSent(user_id, page, limit, search) {
    const status = await getStatuses(['sent'])
    let where = {
        ...status[0],
        user_id
    }
    if(search) {
        where = {
            ...where,
            [Op.or]: [
                // {
                //     id: {
                //         [Op.like]: `%${search}%`
                //     }
                // },
                {
                    product_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    packing: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    to: {
                        [Op.iLike]: `%${search}%`
                    }
                },
            ],
        }
    }
    let config = {
        where,
        include: Status,
        order: [['updatedAt', 'DESC']],
    }

    if(limit && page) {
        config = {
            ...config,
            limit,
            offset: (page*limit)
        }
    }
    
    const batches = await Batch.findAll(config)
    const count = await Batch.count({
        where,
    })
    // console.log({result})
    console.log({count})
    // result
    return {rows: batches, totalRows:count}
    // return batches
}

async function getStats(user_id) {
    const status_ids = await getStatuses(['returned', 'recieved'])
    const sales = await Batch.findAll({
        where: {
            user_id,
            [Op.or]: status_ids,
        },
    })
    const revenue = await Batch.findAll({
        where: {
            user_id,
            [Op.or]: status_ids,
        },
    })
    const data = {sales, revenue}
    return data
}

async function getBatchCount(user_id) {
    const status_ids = await getStatuses(['returned', 'recieved'])
    const data = await Batch.count({
        where: {
            user_id,
            [Op.or]: status_ids,
        },
    })
    return data
}

const getStatuses = async (names) => {
    const orOpts = []
    names.map(name => (
        orOpts.push({name})
    ))
    const statuses = await Status.findAll({where: {
        [Op.or]: orOpts
    }})
    if(!statuses || statuses.length === 0) {
        throw new ApiError({message: 'No Recieved or Returned status in database', status: 404})
    }
    const status_ids = []
    statuses.map(status => {
        status_ids.push({status_id: status.dataValues.id})
        // {status_id: statuses[0].dataValues.id}, {status_id: statuses[1].dataValues.id}
    })
    return status_ids
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
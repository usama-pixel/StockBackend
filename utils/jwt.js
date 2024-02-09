const jwt = require('jsonwebtoken')
const { jwtSecret } = require('./env')
const { ApiError } = require('./ApiError')
const User = require('../models/User')

async function getUser(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token) throw new ApiError({message: 'please provide a token', status: 400})
        const data = jwt.verify(token, jwtSecret)
        const user = await User.findOne({where: {id: data.user_id}})
        req.user = user.dataValues
        next()
    } catch(err) {
        next(err)
    }
}

module.exports = { getUser }
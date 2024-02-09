const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid')
const { ApiError } = require('../utils/ApiError')
const { saltRounds, jwtSecret } = require("../utils/env")

exports.signup = async ({firstname, lastname, email, password}) => {
    const user = await User.findOne({
        where: {
            email
        }
    })
    if(user) {
        throw new ApiError({message: 'Email already exists', status: 409})
    }
    const salt = await bcrypt.genSalt(+saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const result = await User.create({
        id: uuidv4(),
        firstname,
        lastname,
        email,
        password: hash
    })
    return result
}

exports.login = async ({email, password}) => {
    const user = await User.findOne({
        where: {
            email,
        }
    })
    if (!user) {
        throw new ApiError({message: 'Invalid email or password', status: 401})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new ApiError({message: 'Invalid email or password', status: 401})
    }
    const token = jwt.sign({user_id: user?.dataValues?.id}, jwtSecret)
    const { password: pass, ...revised_data } = user.dataValues
    user.dataValues = { token, ...revised_data }
    return { message: 'Login successful', user };
}
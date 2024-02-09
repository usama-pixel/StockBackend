const authService = require('../services/auth.service')
const { ApiError } = require('../utils/ApiError')

async function login(req, res, next) {
    try {
        const {email, password} = req.body
        if(!email || !password) throw new ApiError('Empty fields', 'All fields must be filled', 400)
        const result = await authService.login({email, password})
        res.json(result)
    } catch(err) {
        console.log(err)
        next(err)
    }
}

async function signup(req, res, next) {
    try {
        const {firstname, lastname, email, password} = req.body
        const result = await authService.signup({firstname, lastname, email, password})
        res.json(result)
    } catch(err) {
        console.log(err)
        next(err)
    }
}

module.exports = {
    login,
    signup
}
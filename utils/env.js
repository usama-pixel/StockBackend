const port = process.env.PORT
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USERNAME
const dbPass = process.env.DB_PASSWORD
const dbHost = process.env.DB_Host
const dbName = process.env.DB_NAME
const saltRounds = process.env.SALT_ROUNDS
const jwtSecret = process.env.JWT_SECRET

module.exports = {
    port,
    dbPort,
    dbUser,
    dbPass,
    dbHost,
    dbName,
    saltRounds,
    jwtSecret
}
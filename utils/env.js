const port = process.env.PORT
const dbPort = process.env.PGPORT
const dbUser = process.env.PGUSER
const dbPass = process.env.PGPASSWORD
const dbHost = process.env.PGHOST
const dbName = process.env.POSTGRES_DB
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
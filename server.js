const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const { AuthRoutes, InvoiceRoutes, BatchRoutes, HistoryRoutes, DashboardRoutes } = require('./routes')
const { port } = require('./utils/env')
const { sequelize: sequezlie } = require('./utils/db')
const { errorHandler } = require('./utils/errorHandler')

const Invoice = require('./models/Invoice')
const User = require('./models/User')
const Batch = require('./models/Batch')
const History = require('./models/History')
const { getUser } = require('./utils/jwt')
const Status = require('./models/Status')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/api', AuthRoutes)
app.use(getUser)
app.use('/api', InvoiceRoutes)
app.use('/api', BatchRoutes)
app.use('/api', HistoryRoutes)
app.use('/api', DashboardRoutes)
app.use(errorHandler)

Invoice.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Invoice, { foreignKey: 'user_id' })
Batch.belongsTo(User, { foreignKey: 'user_id' })
// History.belongsTo(Batch, { foreignKey: 'batch_id' })
Status.hasMany(Batch, { foreignKey: 'status_id' })
Batch.belongsTo(Status, { foreignKey: 'status_id' })
Batch.belongsToMany(Invoice, { through: 'InvoiceBatch' })
Invoice.belongsToMany(Batch, { through: 'InvoiceBatch' })
// User.hasMany(Batch)

app.listen(port, () => {
    sequezlie.sync({force: false})
    .then(res => {
        console.log('DB connected')
    }).catch(err => {
        console.log('error occured while connecting to database', err)
    })
    console.log("listening on Port: "+port)
})

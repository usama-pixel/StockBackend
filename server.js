const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const { AuthRoutes, InvoiceRoutes, BatchRoutes } = require('./routes')
const { port } = require('./utils/env')
const { sequezlie } = require('./utils/db')
const { errorHandler } = require('./utils/errorHandler')

const Invoice = require('./models/Invoice')
const User = require('./models/User')
const Batch = require('./models/Batch')
const { getUser } = require('./utils/jwt')


const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', AuthRoutes)
app.use(getUser)
app.use('/api', InvoiceRoutes)
app.use('/api', BatchRoutes)
app.use(errorHandler)

Invoice.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Invoice, { foreignKey: 'user_id' })
Batch.belongsTo(User, { foreignKey: 'user_id' })
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


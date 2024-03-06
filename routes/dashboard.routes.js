const express = require('express')
const { getTax, getRevenue, getSales, getDataPoints } = require('../controllers/dashboard.controller')
const router = express.Router()

router.get('/tax', getTax)
router.get('/revenue', getRevenue)
router.get('/sales', getSales)
router.get('/datapoints', getDataPoints)
// router.put('/invoice', updateInvoice)
// router.get('/getpdf', getPdf)

module.exports = router
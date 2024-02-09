const express = require('express')
const { getInvoices, createInvoice, deleteInvoice, updateInvoice } = require('../controllers/invoice.controller')
const router = express.Router()

router.get('/invoice', getInvoices)
router.post('/invoice', createInvoice)
router.delete('/invoice', deleteInvoice)
router.put('/invoice', updateInvoice)

module.exports = router
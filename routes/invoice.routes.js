const express = require('express')
const { getInvoices, createInvoice, deleteInvoice, updateInvoice, getPdf } = require('../controllers/invoice.controller')
const router = express.Router()

router.get('/invoice', getInvoices)
router.post('/invoice', createInvoice)
router.delete('/invoice', deleteInvoice)
router.put('/invoice', updateInvoice)
router.get('/getpdf', getPdf)

module.exports = router
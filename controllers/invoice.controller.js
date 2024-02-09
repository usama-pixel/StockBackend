const invoiceService = require('../services/invoice.service')

async function getInvoices(req, res, next) {
    try {
        const token = req.user
        const invoices = await invoiceService.getInvoices(req.user.id)
        res.json(invoices)
    } catch(err) {
        next(err)
    }
}

async function createInvoice(req, res, next) {
    try {
        const data = {user_id: req.user.id,...req.body}
        const result = await invoiceService.createInvoice(data)
        console.log({result})
        res.json(result)
    } catch(err) {
        next(err)
    }
}

async function deleteInvoice(req, res, next) {
    try {
        const { id } = req.body
        const result = await invoiceService.deleteInvoice(id, req.user.id)
        console.log(result)
        res.json({message: 'Invoice deleted successfully'})
    } catch(err) {
        next(err)
    }
}

async function updateInvoice(req, res, next) {
    try {
        const data = req.body
        const result = await invoiceService.updateInvoice(data, req.user.id)
        res.json(result)
    } catch(err) {
        next(err)
    }
}

module.exports = {
    getInvoices,
    createInvoice,
    deleteInvoice,
    updateInvoice
}
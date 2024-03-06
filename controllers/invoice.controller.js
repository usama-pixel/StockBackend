const pdfDocument = require('pdfkit')
const invoiceService = require('../services/invoice.service')
const fs = require('fs')
async function getInvoices(req, res, next) {
    try {
        const {page, limit, search} = req.query
        const invoices = await invoiceService.getInvoices(req.user.id, page, limit, search)
        res.json(invoices)
    } catch(err) {
        next(err)
    }
}

async function createInvoice(req, res, next) {
    try {
        const data = {user_id: req.user.id,...req.body?.data}
        const result = await invoiceService.createInvoice(data, req.body?.batch_ids)
        console.log({result})
        res.json(result)
    } catch(err) {
        next(err)
    }
}

async function getPdf(req, res, next) {
    try {
        const doc = new pdfDocument();
        const { invoice_id } = req.query
        // Create a buffer to store the PDF data
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        res.setHeader('Content-Type', 'application/pdf');
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            // Set content type to PDF
            res.setHeader('Content-Type', 'application/pdf');
            // Send the PDF data as response
            res.send(pdfData);
        });
        await invoiceService.getPdf(doc, invoice_id, req.user.id)
        doc.end();
    } catch(err) {
        next(err)
    }
}

// 


async function deleteInvoice(req, res, next) {
    try {
        const { id } = req.query
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
    updateInvoice,
    getPdf,
}
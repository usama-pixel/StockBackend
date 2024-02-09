const Invoice = require("../models/Invoice")
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");

async function getInvoices(user_id) {
    const invoices = await Invoice.findAll({where: {user_id}})
    return invoices;
}

async function createInvoice(data) {
    data = {id: uuidv4(), ...data}
    const invoice = new Invoice({...data})
    await invoice.save()
    return invoice
}

async function deleteInvoice(id, user_id) {
    const invoice = await Invoice.findOne({where: {id, user_id}})
    if(!invoice) throw new ApiError({message: 'Invoice not found', status: 404})
    const result = await invoice.destroy()
    return result;
}

async function updateInvoice(data, user_id) {
    const {id, ...revised_data} = data;
    const invoice = await Invoice.findOne({where: {id, user_id}})
    invoice.update({
        ...revised_data
    })
    await invoice.save()
    return invoice
}

module.exports = {
    getInvoices,
    createInvoice,
    deleteInvoice,
    updateInvoice,
}
// party_acc_no, party_name, address, proreitor, phone, licence_no, salesman, town, cnic_no,

// "batch_no": "",
// "product_name": "",
// "packing": "",
// "quantity": "",
// "rate": "",
// "expiry_date": "",
// "discount": "",
// "tax": "",
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");
const Invoice = require("../models/Invoice")
const Batch = require("../models/Batch");
const { format } = require('date-fns')
const { Op } = require('sequelize')
const numberToText = require('number-to-text')
require('number-to-text/converters/en-us');

async function getInvoices(user_id, page, limit, search) {
    let config = {
        where: {
            user_id
        },
        order: [['updatedAt', 'DESC']],
        include: [Batch]
    }
    if(page && limit) {
        config = {
            ...config,
            limit,
            offset: (page*limit)
        }
    }
    if(search) {
        config.where = {
            ...config.where,
            [Op.or]: [
                {
                    party_acc_no: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    party_name: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    proreitor: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    cnic_no: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    town: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    salesman: {
                        [Op.iLike]: `%${search}%`
                    }
                },
            ],
        }
    }
    const count = await Invoice.count({...config.where})
    const invoices = await Invoice.findAll(config)
    // invoices.dataValues = {...invoices.dataValues, count}
    const data = {invoices, totalRows: count}
    return data;
}

async function createInvoice(data, batch_ids=[]) {
    try {
        if(batch_ids.length === 0) {
            throw new ApiError({message: 'Please select a least one batch', status: 400})
        }
            const invoice = new Invoice({...data})
            invoice.save()
        
        const batches = await Batch.findAll({where: {
            id: batch_ids
        }})
        await invoice.addBatch(batches)
        return invoice
    } catch(err) {
        console.log('error', err)
        return err
    }
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

async function getPdf(doc, invoice_id, user_id) {
    const invoice = await Invoice.findOne({
        where: {
            id: invoice_id,
            user_id
        },
        include: [Batch]
    })
    console.log({invoice: invoice.dataValues.Batches})
    drawTable(doc, invoice.dataValues, invoice.dataValues.Batches)
};

const drawTable = (doc, invoice, batches) => {
    if(batches?.length === 0) {
        throw new ApiError({message: 'No batches associated with this invioce', status: 404})
    }
    if(!invoice) {
        throw new ApiError({message: 'No Invoice found', status: 404})
    }
    const colWidth = 292; // Width of each column
    const rowHeight = 100; // Height of each row
    let startX = 15; // Starting X position of the table
    const startXCol2 = 310
    const startY = 50; // Starting Y position of the table
    
    doc.rect(startX + ((colWidth) * 0), startY, colWidth, rowHeight).stroke();
    doc.text(`Party Acc. No :- ${invoice.party_acc_no}`, startX+5)
    doc.text(`Party Name    :- ${invoice.party_name}`)
    doc.text(`Prorietor         :- ${invoice.proreitor}`)
    doc.text(`Phone No       :- ${invoice.phone}`)
    doc.text(`Licence No     :- ${invoice.licence_no}`)
    doc.rect(startX + ((colWidth) * 1), startY, colWidth, rowHeight).stroke();
    doc.text(`Invoice Id  :- ${invoice.id}`, startXCol2, 70)
    doc.text(`Date           :- ${format(invoice.updatedAt, 'yyyy-MM-dd')}`, startXCol2, 85)
    doc.text(`Salesman   :- ${invoice.salesman}`, startXCol2, 100)
    doc.text(`Town           :- ${invoice.town}`, startXCol2, 115)
    doc.text(`CNIC          :- ${invoice.cnic_no}`, startXCol2, 130)

    // batches heading
    doc.fontSize(8)
    let boxX = startX
    doc.rect(boxX, startY+120, colWidth/8, rowHeight/4).stroke();

    let textX = boxX + 5
    doc.text('S.NO', textX, 180)

    boxX = boxX + colWidth/8
    doc.rect(boxX, startY+120, colWidth/2.5, rowHeight/4).stroke();

    textX = boxX + 10
    doc.text('NAME OF PRODUCT', textX, 180)

    boxX = boxX + colWidth/2.5
    doc.rect(boxX, startY+120, colWidth/6.5, rowHeight/4).stroke();

    textX = (boxX) + 5
    doc.text('PACKING', textX, 180)

    boxX = boxX + colWidth/6.5
    doc.rect(boxX, startY+120, colWidth/5.5, rowHeight/4).stroke();

    textX = (boxX) + 5
    doc.text('BATCH ID', textX, 180)

    boxX = boxX + colWidth/5.5
    doc.rect(boxX, startY+120, colWidth/6, rowHeight/4).stroke();

    textX = (boxX) + 5
    doc.text('EXP-DT', textX, 180)
    
    boxX = boxX + colWidth/6
    doc.rect(boxX, startY+120, colWidth/8, rowHeight/4).stroke();

    textX = (boxX) + 6
    doc.text('QTY', textX, 180)

    boxX = boxX + colWidth/8
    doc.rect(boxX, startY+120, colWidth/6.5, rowHeight/4).stroke();

    textX = (boxX) + 10
    doc.text('RATE', textX, 180)

    boxX = boxX + colWidth/6.5
    doc.rect(boxX, startY+120, colWidth/4.5, rowHeight/4).stroke();

    textX = (boxX) + 5
    doc.text('GROSS AMT', textX, 180)

    boxX = boxX + colWidth/4.5
    doc.rect(boxX, startY+120, colWidth/7.8, rowHeight/4).stroke();

    textX = (boxX) + 5
    doc.text('DISC', textX, 180)

    boxX = boxX + colWidth/7.8
    doc.rect(boxX, startY+120, colWidth/8.5, rowHeight/4).stroke();

    textX = (boxX) + 8
    doc.text('TAX', textX, 180)

    boxX = boxX + colWidth/8.5
    doc.rect(boxX, startY+120, colWidth/4.5, rowHeight/4).stroke();

    textX = (boxX) + 8
    doc.text('NET AMOUNT', textX, 180)
    let y = 210
    let totalQty = 0
    let totalGrossAmt = 0
    let totalDiscount = 0
    let totalTax = 0
    batches.map((batch, i) => {
        boxX = startX
        textX = boxX + 5
        y = y + 15
        doc.text(((i+1)+''), textX, y)
        boxX = boxX + colWidth/8
        textX = boxX + 10
        doc.text(batch.product_name, textX, y)
        boxX = boxX + colWidth/2.5
        textX = (boxX) + 5
        doc.text(batch.packing, textX, y)
        boxX = boxX + colWidth/6.5
        textX = (boxX) + 5
        doc.text(batch.id, textX, y) // batch no
        boxX = boxX + colWidth/5.5
        textX = (boxX) + 5
        doc.text(formatDate(batch.expiry_date), textX, y) // exp dt
        boxX = boxX + colWidth/6
        textX = (boxX) + 6
        doc.text(batch.quantity, textX, y) // qty
        boxX = boxX + colWidth/8
        textX = (boxX) + 10
        doc.text(batch.rate?.toFixed(2), textX, y) // rate
        boxX = boxX + colWidth/6.5
        textX = (boxX) + 5
        const grossAmt = (+batch.quantity)*(+batch.rate)
        doc.text(grossAmt.toFixed(2), textX, y) // gross amt
        boxX = boxX + colWidth/4.5
        textX = (boxX) + 5
        doc.text(batch.discount?.toFixed(2), textX, y) // discount
        boxX = boxX + colWidth/7.8
        textX = (boxX) + 8
        doc.text(batch.tax?.toFixed(2), textX, y) // tax
        boxX = boxX + colWidth/8.5
        textX = (boxX) + 8
        doc.text((grossAmt-batch.discount+batch.tax)?.toFixed(2), textX, y) // net amount
        totalQty += batch.quantity
        totalGrossAmt += grossAmt
        totalDiscount += +batch.discount
        totalTax += +batch.tax
    })
    startX = 15
    doc.fontSize(14)
    const mt = y + 50
    console.log({startX: totalTax})
    // co
    doc.rect(startX + ((colWidth) * 0), mt, colWidth, rowHeight).stroke();
    doc.text(`Total  :- ${batches.length}     ${totalQty}`, startX+5, mt+10)
    doc.text(`Gross Amount :- ${totalGrossAmt.toFixed(2)}`, startX+5, mt+30)
    doc.text(`Discount   :- ${totalDiscount.toFixed(2)}`, startX+5, mt+48)
    
    doc.rect(startX + ((colWidth) * 1), mt, colWidth, rowHeight).stroke();
    doc.text(`Before Tax Amount  :- ${(totalGrossAmt-totalDiscount).toFixed(2)}`, startXCol2, mt+10, {continued: true})
    doc.fontSize(7).text(' (discount incl.)')
    doc.fontSize(14).text(`W.H Tax  :- ${((totalTax/totalGrossAmt)*100).toFixed(2)}%   ${totalTax.toFixed(2)}`, startXCol2, mt+30)
    doc.text(`With Tax Amount   :- ${(totalGrossAmt+totalTax-totalDiscount).toFixed(2)}`, startXCol2, mt+48, {continued: true})
    doc.fontSize(7).text(' (discount incl.)')
    const text = numberToText.convertToText(totalGrossAmt+totalTax-totalDiscount)
    doc.fontSize(10).text(`TOTAL RUPEES :- ${text.toUpperCase()} RUPEES ONLY`, startX+5, mt+120)
}

const formatDate = (date) => {
    // const date = new Date(dateStr);
    const formattedDate =  format(date, 'yyyy-MM');
    // console.log(formattedDate);
    return formattedDate;
}

module.exports = {
    getInvoices,
    createInvoice,
    deleteInvoice,
    updateInvoice,
    getPdf
}

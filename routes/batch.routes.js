const router = require('express').Router()
const batchController = require('../controllers/batch.controller')

router.get('/batch', batchController.getBatches)
router.post('/batch', batchController.createBatch)
router.delete('/batch/:id', batchController.deleteBatch)
router.put('/batch', batchController.updateBatch)
router.post('/send-batch', batchController.sendBatch)
router.get('/batch-sent', batchController.batchSent)
router.get('/batch/count', batchController.getBatchCount)

module.exports = router

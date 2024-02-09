const router = require('express').Router()
const batchController = require('../controllers/batch.controller')

router.get('/batch', batchController.getBatches)
router.post('/batch', batchController.createBatch)
router.delete('/batch', batchController.deleteBatch)
router.put('/batch', batchController.updateBatch)

module.exports = router

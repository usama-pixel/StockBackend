const router = require('express').Router()
const historyController = require('../controllers/history.controller')

router.get('/history/:batch_id', historyController.getHistory)
router.post('/history', historyController.createHistory)

module.exports = router
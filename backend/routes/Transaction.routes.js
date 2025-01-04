const express = require('express')
const router = express.Router();
const transactionController = require('../controller/transaction.controller')
const wallet = require('../controller/wallet')


router.post('/transaction',transactionController.makeTransaction)
router.get('/transaction/:upi_id', transactionController.getTransactionsByUpi);
router.post('/wallet',wallet.addMoney);
router.post('/otp',transactionController.requestOtp)


module.exports = router;
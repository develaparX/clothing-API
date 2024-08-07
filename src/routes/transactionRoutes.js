const express = require('express');
const { createTransaction, getCustomerTransactions } = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:type', verifyToken, createTransaction);

router.get('/', verifyToken, getCustomerTransactions);


module.exports = router;

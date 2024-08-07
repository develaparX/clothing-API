const express = require('express');
const { createTransaction, getCustomerTransactions,getCustomerProductTransactions,getCustomerRewardTransactions } = require('../controllers/transactionController');
const { verifyToken,isMerchant } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:type', verifyToken, createTransaction);

router.get('/', verifyToken, getCustomerTransactions);

router.get('/products', verifyToken, isMerchant, getCustomerProductTransactions);
router.get('/rewards', verifyToken, isMerchant, getCustomerRewardTransactions);


module.exports = router;

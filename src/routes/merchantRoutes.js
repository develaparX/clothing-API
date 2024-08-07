const express = require('express');
const { getCustomerProductTransactions, getCustomerRewardTransactions } = require('../controllers/merchantController');
const { verifyToken, isMerchant } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/transactions/products', verifyToken, isMerchant, getCustomerProductTransactions);
router.get('/transactions/rewards', verifyToken, isMerchant, getCustomerRewardTransactions);

module.exports = router;

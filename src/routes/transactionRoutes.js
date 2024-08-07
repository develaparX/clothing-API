const express = require('express');
const { createTransaction } = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, createTransaction);

module.exports = router;

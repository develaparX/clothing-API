const express = require('express');
const { getUserDetails, updateUserWallet } = require('../controllers/userController');
const { verifyToken, isMerchant } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', verifyToken, getUserDetails);
router.put('/:id/wallet', verifyToken, isMerchant, updateUserWallet);

module.exports = router;

const express = require('express');
const { getUserDetails, updateUserWallet,getAllUsers} = require('../controllers/userController');
const { verifyToken, isMerchant } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/me', verifyToken, getUserDetails);
router.put('/:id/wallet', verifyToken, isMerchant, updateUserWallet);
router.get('/all', verifyToken, isMerchant, getAllUsers);

module.exports = router;

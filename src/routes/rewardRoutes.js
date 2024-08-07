const express = require('express');
const { createReward, updateReward, deleteReward, getAllRewards } = require('../controllers/rewardController');
const { verifyToken, isMerchant } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, isMerchant, createReward);
router.put('/:id', verifyToken, isMerchant, updateReward);
router.delete('/:id', verifyToken, isMerchant, deleteReward);
router.get('/', getAllRewards);

module.exports = router;

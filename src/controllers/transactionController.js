const { Sequelize } = require('sequelize');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const Reward = require('../models/Reward');

exports.createTransaction = async (req, res) => {
  const { userId, productId, rewardId, amount, transactionType } = req.body;
  try {
    const user = await User.findByPk(userId);

    if (transactionType === 'product') {
      const product = await Product.findByPk(productId);
      if (user.wallet < product.price) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      user.wallet -= product.price;
      user.points += product.reward_type === 'A' ? 20 : 40;
      await user.save();
      await Transaction.create({ user_id: userId, product_id: productId, amount: product.price, transaction_type: 'product' });
    } else if (transactionType === 'reward') {
      const reward = await Reward.findByPk(rewardId);
      if (user.points < reward.points) {
        return res.status(400).json({ error: 'Insufficient points' });
      }
      user.points -= reward.points;
      await user.save();
      await Transaction.create({ user_id: userId, reward_id: rewardId, transaction_type: 'reward' });
    } else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    res.status(201).json({ message: 'Transaction successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const Reward = require('../models/Reward');

exports.getCustomerProductTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { transaction_type: 'product' },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Product, attributes: ['id', 'name', 'price'] }
      ]
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerRewardTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { transaction_type: 'reward' },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Reward, attributes: ['id', 'name', 'points'] }
      ]
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

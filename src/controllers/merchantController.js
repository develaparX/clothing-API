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

    const formattedTransactions = transactions.map(transaction => {
      const total = parseFloat(transaction.amount) * parseFloat(transaction.Product.price);
      return {
        id: transaction.id,
        user: transaction.User,
        product: transaction.Product,
        amount: transaction.amount,
        createdAt: transaction.created_at,
        total: total.toFixed(2)
      };
    });

    return res.status(200).json({ transactions: formattedTransactions });
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

    const formattedTransactions = transactions.map(transaction => {
      return {
        id: transaction.id,
        user: transaction.User,
        reward: transaction.Reward,
        createdAt: transaction.created_at,
        // Untuk transaksi reward, tidak ada total harga, jadi kita tidak menambahkan field total
      };
    });

    return res.status(200).json({ transactions: formattedTransactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const { Sequelize } = require('sequelize');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const Reward = require('../models/Reward');

exports.createTransaction = async (req, res) => {
  const { productId, rewardId, amount } = req.body;
  const userId = req.user.id; // Mengambil userId dari token yang sudah di-decode
  const transactionType = req.params.type; // Mengambil transactionType dari parameter rute

  try {
    const user = await User.findByPk(userId);
    
    let createdTransaction;
    let total = null;
    let details = {};

    if (transactionType === 'product') {
      const product = await Product.findByPk(productId);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const userWallet = parseFloat(user.wallet);
      const productPrice = parseFloat(product.price);
      
      if (userWallet < productPrice) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      user.wallet = (userWallet - productPrice).toString(); // Convert back to string
      user.points += product.reward_type === 'A' ? 20 : 40;
      
      await user.save();
      createdTransaction = await Transaction.create({
        user_id: userId,
        product_id: productId,
        amount: amount,
        transaction_type: 'product'
      });

      total = productPrice * parseFloat(amount);
      details = {
        productName: product.name,
        price: product.price
      };

    } else if (transactionType === 'reward') {
      const reward = await Reward.findByPk(rewardId);
      if (!reward) {
        return res.status(404).json({ error: 'Reward not found' });
      }
      if (user.points < reward.points) {
        return res.status(400).json({ error: 'Insufficient points' });
      }
      user.points -= reward.points;
      await user.save();
      createdTransaction = await Transaction.create({
        user_id: userId,
        reward_id: rewardId,
        transaction_type: 'reward'
      });

      details = {
        rewardName: reward.name,
        points: reward.points
      };
    } else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    res.status(201).json({ 
      message: 'Transaction successful',
      transaction: {
        id: createdTransaction.id,
        type: createdTransaction.transaction_type,
        amount: createdTransaction.amount,
        createdAt: createdTransaction.created_at,
        details: details,
        total: total !== null ? total.toFixed(2) : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerTransactions = async (req, res) => {
  const userId = req.user.id; // Mengambil userId dari token yang sudah di-decode

  try {
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      include: [
        { model: Product, attributes: ['name', 'price'] },
        { model: Reward, attributes: ['name', 'points'] }
      ],
      order: [['created_at', 'DESC']]
    });

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    const formattedTransactions = transactions.map(transaction => {
      let details;
      let total = null;

      if (transaction.transaction_type === 'product') {
        details = {
          productName: transaction.Product.name,
          price: transaction.Product.price
        };
        // Hitung total harga
        total = parseFloat(transaction.Product.price) * parseFloat(transaction.amount);
      } else {
        details = {
          rewardName: transaction.Reward.name,
          points: transaction.Reward.points
        };
      }

      return {
        id: transaction.id,
        type: transaction.transaction_type,
        amount: transaction.amount,
        createdAt: transaction.created_at,
        details: details,
        total: total !== null ? total.toFixed(2) : null // Format total ke 2 desimal
      };
    });

    res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
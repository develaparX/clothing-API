// services/transactionService.js

const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');
const Reward = require('../models/Reward');
const { TransactionResponseDto, ProductTransactionResponseDto, RewardTransactionResponseDto } = require('../dtos/transactionDto');

class TransactionService {
  async createProductTransaction(createTransactionDto) {
    const { userId, productId, amount } = createTransactionDto;
    
    const user = await User.findByPk(userId);
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const userWallet = parseFloat(user.wallet);
    const productPrice = parseFloat(product.price);

    if (userWallet < productPrice) {
      throw new Error('Insufficient balance');
    }

    user.wallet = (userWallet - productPrice).toString();
    user.points += product.reward_type === 'A' ? 20 : 40;

    await user.save();
    const transaction = await Transaction.create({
      user_id: userId,
      product_id: productId,
      amount: amount,
      transaction_type: 'product'
    });

    const total = productPrice * parseFloat(amount);

    return new TransactionResponseDto(
      transaction.id,
      transaction.transaction_type,
      transaction.amount,
      transaction.created_at,
      { productName: product.name, price: product.price },
      total.toFixed(2)
    );
  }

  async createRewardTransaction(createTransactionDto) {
    const { userId, rewardId } = createTransactionDto;
    
    const user = await User.findByPk(userId);
    const reward = await Reward.findByPk(rewardId);

    if (!reward) {
      throw new Error('Reward not found');
    }

    if (user.points < reward.points) {
      throw new Error('Insufficient points');
    }

    user.points -= reward.points;
    await user.save();

    const transaction = await Transaction.create({
      user_id: userId,
      reward_id: rewardId,
      transaction_type: 'reward'
    });

    return new TransactionResponseDto(
      transaction.id,
      transaction.transaction_type,
      null,
      transaction.created_at,
      { rewardName: reward.name, points: reward.points },
      null
    );
  }

  async getCustomerTransactions(userId) {
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      include: [
        { model: Product, attributes: ['name', 'price'] },
        { model: Reward, attributes: ['name', 'points'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return transactions.map(transaction => {
      let details;
      let total = null;

      if (transaction.transaction_type === 'product') {
        details = {
          productName: transaction.Product.name,
          price: transaction.Product.price
        };
        total = parseFloat(transaction.Product.price) * parseFloat(transaction.amount);
      } else {
        details = {
          rewardName: transaction.Reward.name,
          points: transaction.Reward.points
        };
      }

      return new TransactionResponseDto(
        transaction.id,
        transaction.transaction_type,
        transaction.amount,
        transaction.created_at,
        details,
        total !== null ? total.toFixed(2) : null
      );
    });
  }

  async getCustomerProductTransactions() {
    const transactions = await Transaction.findAll({
      where: { transaction_type: 'product' },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Product, attributes: ['id', 'name', 'price'] }
      ]
    });

    return transactions.map(transaction => {
      const total = parseFloat(transaction.amount) * parseFloat(transaction.Product.price);
      return new ProductTransactionResponseDto(
        transaction.id,
        transaction.User,
        transaction.Product,
        transaction.amount,
        transaction.created_at,
        total.toFixed(2)
      );
    });
  }

  async getCustomerRewardTransactions() {
    const transactions = await Transaction.findAll({
      where: { transaction_type: 'reward' },
      include: [
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Reward, attributes: ['id', 'name', 'points'] }
      ]
    });

    return transactions.map(transaction => 
      new RewardTransactionResponseDto(
        transaction.id,
        transaction.User,
        transaction.Reward,
        transaction.created_at
      )
    );
  }
}

module.exports = new TransactionService();
// controllers/transactionController.js

const transactionService = require('../services/transactionService');
const { CreateTransactionDto } = require('../dtos/transactionDto');

exports.createTransaction = async (req, res) => {
  const { productId, rewardId, amount } = req.body;
  const userId = req.user.id;
  const transactionType = req.params.type;

  try {
    const createTransactionDto = new CreateTransactionDto(userId, productId, rewardId, amount, transactionType);
    let result;
    if (transactionType === 'product') {
      result = await transactionService.createProductTransaction(createTransactionDto);
    } else if (transactionType === 'reward') {
      result = await transactionService.createRewardTransaction(createTransactionDto);
    } else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    res.status(201).json({
      message: 'Transaction successful',
      transaction: result
    });
  } catch (error) {
    res.status(error.message.includes('not found') ? 404 : 400).json({ error: error.message });
  }
};

exports.getCustomerTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await transactionService.getCustomerTransactions(userId);
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerProductTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getCustomerProductTransactions();
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerRewardTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getCustomerRewardTransactions();
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
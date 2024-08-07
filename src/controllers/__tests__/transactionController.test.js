const transactionService = require('../../services/transactionService');
const { CreateTransactionDto } = require('../../dtos/transactionDto');
const transactionController = require('../transactionController');

// Mock dependencies
jest.mock('../../services/transactionService');
jest.mock('../../dtos/transactionDto');

describe('Transaction Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1 },
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createTransaction', () => {
    it('should create a product transaction and return 201 status', async () => {
      req.body = { productId: 1, rewardId: null, amount: 100 };
      req.params.type = 'product';

      const transactionData = new CreateTransactionDto(1, 1, null, 100, 'product');
      const result = { id: 1, ...transactionData };

      CreateTransactionDto.mockImplementation(() => transactionData);
      transactionService.createProductTransaction.mockResolvedValue(result);

      await transactionController.createTransaction(req, res);

      expect(CreateTransactionDto).toHaveBeenCalledWith(1, 1, null, 100, 'product');
      expect(transactionService.createProductTransaction).toHaveBeenCalledWith(transactionData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Transaction successful',
        transaction: result
      });
    });

    it('should return 400 for invalid transaction type', async () => {
      req.body = { productId: 1, rewardId: null, amount: 100 };
      req.params.type = 'invalid';

      await transactionController.createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid transaction type' });
    });

    it('should handle errors and return appropriate status', async () => {
      req.body = { productId: 1, rewardId: null, amount: 100 };
      req.params.type = 'product';

      const error = new Error('Some error');
      transactionService.createProductTransaction.mockRejectedValue(error);

      await transactionController.createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Some error' });
    });
  });

  describe('getCustomerTransactions', () => {
    it('should return customer transactions with 200 status', async () => {
      const transactions = [{ id: 1, userId: 1, amount: 100 }];
      transactionService.getCustomerTransactions.mockResolvedValue(transactions);

      await transactionController.getCustomerTransactions(req, res);

      expect(transactionService.getCustomerTransactions).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(transactions);
    });

    it('should return 404 if no transactions found', async () => {
      transactionService.getCustomerTransactions.mockResolvedValue([]);

      await transactionController.getCustomerTransactions(req, res);

      expect(transactionService.getCustomerTransactions).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No transactions found' });
    });

    it('should handle errors and return 500 status', async () => {
      const error = new Error('Some error');
      transactionService.getCustomerTransactions.mockRejectedValue(error);

      await transactionController.getCustomerTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCustomerProductTransactions', () => {
    it('should return customer product transactions with 200 status', async () => {
      const transactions = [{ id: 1, userId: 1, amount: 100 }];
      transactionService.getCustomerProductTransactions.mockResolvedValue(transactions);

      await transactionController.getCustomerProductTransactions(req, res);

      expect(transactionService.getCustomerProductTransactions).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ transactions });
    });

    it('should handle errors and return 500 status', async () => {
      const error = new Error('Some error');
      transactionService.getCustomerProductTransactions.mockRejectedValue(error);

      await transactionController.getCustomerProductTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getCustomerRewardTransactions', () => {
    it('should return customer reward transactions with 200 status', async () => {
      const transactions = [{ id: 1, userId: 1, amount: 50 }];
      transactionService.getCustomerRewardTransactions.mockResolvedValue(transactions);

      await transactionController.getCustomerRewardTransactions(req, res);

      expect(transactionService.getCustomerRewardTransactions).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ transactions });
    });

    it('should handle errors and return 500 status', async () => {
      const error = new Error('Some error');
      transactionService.getCustomerRewardTransactions.mockRejectedValue(error);

      await transactionController.getCustomerRewardTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});

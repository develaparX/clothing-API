const User = require('../../models/User');
const userController = require('../userController');

// Mock dependencies
jest.mock('../../models/User');

describe('User Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getUserDetails', () => {
    it('should return user details with 200 status', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      User.findByPk.mockResolvedValue(user);

      await userController.getUserDetails(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it('should handle errors and return 500 status', async () => {
      const error = new Error('Some error');
      User.findByPk.mockRejectedValue(error);

      await userController.getUserDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateUserWallet', () => {
    it('should update user wallet and return 200 status', async () => {
      req.params.id = 1;
      req.body.wallet = 500;

      const user = { id: 1, wallet: 0, save: jest.fn().mockResolvedValue(true) };
      User.findByPk.mockResolvedValue(user);

      await userController.updateUserWallet(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(user.wallet).toBe(500);
      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 1;
      req.body.wallet = 500;

      User.findByPk.mockResolvedValue(null);

      await userController.updateUserWallet(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors and return 500 status', async () => {
      req.params.id = 1;
      req.body.wallet = 500;

      const error = new Error('Some error');
      User.findByPk.mockRejectedValue(error);

      await userController.updateUserWallet(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users with 200 status', async () => {
      const users = [
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' }
      ];
      User.findAll.mockResolvedValue(users);

      await userController.getAllUsers(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'username', 'email', 'role', 'wallet', 'points', 'created_at', 'updated_at']
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users });
    });

    it('should handle errors and return 500 status', async () => {
      const error = new Error('Some error');
      User.findAll.mockRejectedValue(error);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});

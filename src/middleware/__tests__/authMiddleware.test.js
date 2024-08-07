const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authMiddleware = require('../authMiddleware');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('verifyToken', () => {
    it('should return 401 if no authorization header is present', () => {
      authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 if token is not provided', () => {
      req.headers.authorization = 'Bearer ';
      authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should set req.user and call next if token is valid', () => {
      const token = 'validtoken';
      req.headers.authorization = `Bearer ${token}`;
      const decoded = { id: 1, role: 'customer' };

      jwt.verify.mockReturnValue(decoded);

      authMiddleware.verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      const token = 'invalidtoken';
      req.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid Token');
      });

      authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Token' });
    });
  });

  describe('isMerchant', () => {
    beforeEach(() => {
      req.user = { id: 1 };
    });

    it('should call next if user is a merchant', async () => {
      const user = { id: 1, role: 'merchant' };
      User.findByPk.mockResolvedValue(user);

      await authMiddleware.isMerchant(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not a merchant', async () => {
      const user = { id: 1, role: 'customer' };
      User.findByPk.mockResolvedValue(user);

      await authMiddleware.isMerchant(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User is not Merchant' });
    });

    it('should handle errors and return 500 status', async () => {
      const error = new Error('Some error');
      User.findByPk.mockRejectedValue(error);

      await authMiddleware.isMerchant(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});

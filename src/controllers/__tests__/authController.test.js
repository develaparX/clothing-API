const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authController = require('../authController');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models/User.js');

describe('Auth Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('should create a new user and return 201 status', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      };
      req.body = userData;

      const hashedPassword = 'hashedpassword123';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const createdUser = { ...userData, password: hashedPassword };
      User.create.mockResolvedValue(createdUser);

      await authController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: createdUser });
    });

    it('should return 500 status on error', async () => {
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      };

      const error = new Error('Database error');
      User.create.mockRejectedValue(error);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };
      req.body = loginData;

      const user = { id: 1, ...loginData, role: 'customer' };
      User.findOne.mockResolvedValue(user);

      bcrypt.compare.mockResolvedValue(true);

      const token = 'faketoken123';
      jwt.sign.mockReturnValue(token);

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, user.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token });
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return 500 status on error', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
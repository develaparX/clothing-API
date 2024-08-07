const Reward = require('../../models/Reward');
const rewardController = require('../rewardController');

jest.mock('../../models/Reward');

describe('Reward Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  describe('createReward', () => {
    it('should create a reward and return 201 status', async () => {
      const rewardData = { name: 'Test Reward', points: 100 };
      req.body = rewardData;
      Reward.create.mockResolvedValue(rewardData);

      await rewardController.createReward(req, res);

      expect(Reward.create).toHaveBeenCalledWith(rewardData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ reward: rewardData });
    });

    it('should return 500 status on error', async () => {
      Reward.create.mockRejectedValue(new Error('Database error'));

      await rewardController.createReward(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('updateReward', () => {
    it('should update a reward and return 200 status', async () => {
      const rewardId = 1;
      const updatedData = { name: 'Updated Reward', points: 150 };
      req.params.id = rewardId;
      req.body = updatedData;
      const mockReward = { id: rewardId, ...updatedData, save: jest.fn() };
      Reward.findByPk.mockResolvedValue(mockReward);

      await rewardController.updateReward(req, res);

      expect(Reward.findByPk).toHaveBeenCalledWith(rewardId);
      expect(mockReward.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ reward: mockReward });
    });

    it('should return 404 status when reward is not found', async () => {
      Reward.findByPk.mockResolvedValue(null);

      await rewardController.updateReward(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Reward not found' });
    });

    it('should return 500 status on error', async () => {
      Reward.findByPk.mockRejectedValue(new Error('Database error'));

      await rewardController.updateReward(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('deleteReward', () => {
    it('should delete a reward and return 204 status', async () => {
      const rewardId = 1;
      req.params.id = rewardId;
      const mockReward = { id: rewardId, destroy: jest.fn() };
      Reward.findByPk.mockResolvedValue(mockReward);

      await rewardController.deleteReward(req, res);

      expect(Reward.findByPk).toHaveBeenCalledWith(rewardId);
      expect(mockReward.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 status when reward is not found', async () => {
      Reward.findByPk.mockResolvedValue(null);

      await rewardController.deleteReward(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Reward not found' });
    });

    it('should return 500 status on error', async () => {
      Reward.findByPk.mockRejectedValue(new Error('Database error'));

      await rewardController.deleteReward(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getAllRewards', () => {
    it('should return all rewards and 200 status', async () => {
      const mockRewards = [
        { id: 1, name: 'Reward 1', points: 100 },
        { id: 2, name: 'Reward 2', points: 200 }
      ];
      Reward.findAll.mockResolvedValue(mockRewards);

      await rewardController.getAllRewards(req, res);

      expect(Reward.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ rewards: mockRewards });
    });

    it('should return 500 status on error', async () => {
      Reward.findAll.mockRejectedValue(new Error('Database error'));

      await rewardController.getAllRewards(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
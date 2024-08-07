const Reward = require('../models/Reward');

exports.createReward = async (req, res) => {
  const { name, points } = req.body;
  try {
    const reward = await Reward.create({ name, points });
    res.status(201).json({ reward });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateReward = async (req, res) => {
  const { id } = req.params;
  const { name, points } = req.body;
  try {
    const reward = await Reward.findByPk(id);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    reward.name = name;
    reward.points = points;
    await reward.save();
    res.status(200).json({ reward });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteReward = async (req, res) => {
  const { id } = req.params;
  try {
    const reward = await Reward.findByPk(id);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    await reward.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.findAll();
    res.status(200).json({ rewards });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

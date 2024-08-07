const User = require('../models/User');

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUserWallet = async (req, res) => {
  const { id } = req.params;
  const { wallet } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.wallet = wallet;
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'wallet', 'points', 'created_at', 'updated_at']
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
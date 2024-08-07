const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid Token' });
  }
};

exports.isMerchant = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'merchant') {
      return res.status(403).json({ error: 'User is not Merchant' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

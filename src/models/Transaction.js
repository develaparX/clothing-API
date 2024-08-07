const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Reward = require('./Reward');

class Transaction extends Model {}

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Product,
      key: 'id'
    }
  },
  reward_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Reward,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  transaction_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions',
  underscored: true,
  timestamps: false
});

Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Product, { foreignKey: 'product_id' });
Transaction.belongsTo(Reward, { foreignKey: 'reward_id' });

module.exports = Transaction;

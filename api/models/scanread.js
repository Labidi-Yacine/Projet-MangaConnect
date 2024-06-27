const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user');

class ScansRead extends Model {}

ScansRead.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mangaName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scanName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'ScansRead',
  tableName: 'scans_read',
  timestamps: false
});

ScansRead.belongsTo(User, { foreignKey: 'userId' });

module.exports = ScansRead;

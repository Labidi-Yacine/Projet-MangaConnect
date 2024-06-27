const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user');

class LikeManga extends Model {}

LikeManga.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mangaName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'LikeManga',
  tableName: 'likes_manga',
  timestamps: false
});

User.hasMany(LikeManga, { foreignKey: 'userId', onDelete: 'CASCADE' });
LikeManga.belongsTo(User, { foreignKey: 'userId' });

module.exports = LikeManga;

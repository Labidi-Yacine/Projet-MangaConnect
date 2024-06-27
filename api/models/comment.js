const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user');
const LikeComment = require('./likecomment');
const Commentreplies = require('./commentreplies')


class Comment extends Model {}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mangaName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scan: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Comment',
  tableName: 'comments',
  timestamps: false
});

Comment.belongsTo(User, { foreignKey: 'userId' });

Comment.hasMany(LikeComment, { foreignKey: 'comment_id' });
Comment.hasMany(Commentreplies, { foreignKey: 'comment_id' });

module.exports = Comment;

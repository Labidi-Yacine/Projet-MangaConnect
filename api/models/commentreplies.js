const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const Comment = require('./comment');
const User = require('./user');

class CommentReply extends Model {}

CommentReply.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comment,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'CommentReply',
  tableName: 'comment_replies',
  timestamps: false
});

// Comment.hasMany(CommentReply, { foreignKey: 'comment_id', onDelete: 'CASCADE' });
// User.hasMany(CommentReply, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// CommentReply.belongsTo(Comment, { foreignKey: 'comment_id' });
// CommentReply.belongsTo(User, { foreignKey: 'user_id' });

module.exports = CommentReply;

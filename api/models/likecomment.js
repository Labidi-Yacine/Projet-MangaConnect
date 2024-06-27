const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user');
const Comment = require('./comment')

const LikeComment = sequelize.define('LikeComment', {
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
    },
    onDelete: 'CASCADE'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'likes_comments',
  timestamps: false
});

// LikeComment.belongsTo(Comment, { foreignKey: 'comment_id' });
// LikeComment.belongsTo(User, { foreignKey: 'user_id' });

// Comment.hasMany(LikeComment, { foreignKey: 'comment_id', onDelete: 'CASCADE' });
// User.hasMany(LikeComment, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = LikeComment;

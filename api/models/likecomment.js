module.exports = (sequelize, DataTypes) => {

const LikeComment = sequelize.define('LikeComment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'comment_id',
    references: {
      model: 'Comments',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'User',
      key: 'id',
    },
  },
}, {
  timestamps: false,
  tableName: 'likes_comments',
});

LikeComment.associate = (models) => {
  LikeComment.belongsTo(models.Comment, { foreignKey: 'comment_id', as: 'Comment' });
  LikeComment.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
};

return LikeComment}

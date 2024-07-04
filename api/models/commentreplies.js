module.exports = (sequelize, DataTypes) => {

const CommentReply = sequelize.define('CommentReply', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'comment_id',
    references: {
      model: 'Comment',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'User',
      key: 'id',
    },
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
  timestamps: false,
  tableName: 'comment_replies',
});

CommentReply.associate = (models) => {
  CommentReply.belongsTo(models.Comment, { foreignKey: 'comment_id', as: 'Comment' });
  CommentReply.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
};


return CommentReply}

module.exports = (sequelize, DataTypes) => {

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mangaName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'manga_name',
  },
  scan: {
    type: DataTypes.STRING,
    allowNull: true,
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
  comment: {
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
  tableName: 'comments',
});

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });  // Assurez-vous que 'User' correspond à votre modèle User
  Comment.hasMany(models.CommentReply, { foreignKey: 'comment_id', as: 'CommentReplies' });
        Comment.hasMany(models.LikeComment, { foreignKey: 'comment_id', as: 'LikeComments' });
  // Définissez d'autres associations si nécessaire
};

return Comment }

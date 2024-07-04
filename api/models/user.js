module.exports = (sequelize, DataTypes) => {

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_admin',
  },
}, {
  timestamps: false,
  tableName: 'users',
});

User.associate = (models) => {
  // Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });  // Assurez-vous que 'User' correspond à votre modèle User
  // Comment.hasMany(models.CommentReply, { foreignKey: 'comment_id', as: 'CommentReplies' });
  //       Comment.hasMany(models.LikeComment, { foreignKey: 'comment_id', as: 'Likes' });
  // Définissez d'autres associations si nécessaire

  User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'User' });
  User.hasMany(models.CommentReply, { foreignKey: 'user_id', as: 'CommentReplies' });
  User.hasMany(models.LikeComment, { foreignKey: 'user_id', as: 'Likes' });
};

return User }
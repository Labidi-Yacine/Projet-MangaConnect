module.exports = (sequelize, DataTypes) => {

const ScanRead = sequelize.define('ScanRead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mangaName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'mangaName',
  },
  scanName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'scanName',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'userId',
    references: {
      model: 'User',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
  timestamps: false,
  tableName: 'scans_read',
});

// Comment.associate = (models) => {
//   Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });  // Assurez-vous que 'User' correspond à votre modèle User
//   Comment.hasMany(models.CommentReply, { foreignKey: 'comment_id', as: 'CommentReplies' });
//         Comment.hasMany(models.LikeComment, { foreignKey: 'comment_id', as: 'Likes' });
// }

return ScanRead }

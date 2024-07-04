module.exports = (sequelize, DataTypes) => {

const LikeManga = sequelize.define('LikeManga', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mangaName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'mangaName',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'userId',
    references: {
      model: 'User',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'createdAt',
  },
}, {
  timestamps: false,
  tableName: 'likes_manga',
});

LikeManga.associate = (models) => {
  LikeManga.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });

}

return LikeManga }

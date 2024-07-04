module.exports = (sequelize, DataTypes) => {

const Manga = sequelize.define('Manga', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
    // field: 'cover_image',
  },
}, {
  timestamps: false,
  tableName: 'mangas',
});

return Manga }
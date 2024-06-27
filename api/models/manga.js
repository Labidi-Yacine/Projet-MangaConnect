const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Manga = sequelize.define('Manga', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'mangas',
  timestamps: false
});

module.exports = Manga;

const { Sequelize } = require('sequelize');
const db = require('../config/database');

// Configure Sequelize
const sequelize = new Sequelize('manga_db', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,  // Activer les logs SQL
});

// Importer les modèles et les associations
const models = require('../models');

// Synchronisation avec la base de données
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(error => {
    console.error('Error synchronizing database:', error);
  });

module.exports = sequelize;

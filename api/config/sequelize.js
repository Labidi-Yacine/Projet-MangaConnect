const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('manga_db', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,  // Activer les logs SQL

});

module.exports = sequelize;

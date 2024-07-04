const mysql = require('mysql2');

module.exports = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'manga_db',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
}};



// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the MySQL  MANGA_database');
// });

// module.exports = db;

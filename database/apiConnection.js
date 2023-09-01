const mysql = require('mysql');
const apiConnection = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'FactoryManagement',
    multipleStatements: true
});


module.exports = apiConnection;
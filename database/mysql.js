const mysql = require('mysql');
const connection = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'iitp',
    multipleStatements: true
});


module.exports = connection;
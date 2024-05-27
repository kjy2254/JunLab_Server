const mysql = require("mysql2");
const connection = mysql.createPool({
  host: "127.0.0.1",
  port: "32306",
  user: "root",
  password: "junlabFT7zDgh64",
  database: "factorymanagement",
  multipleStatements: true,
});

module.exports = connection;

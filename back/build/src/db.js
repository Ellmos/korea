require("dotenv").config(); 

// here we import the mariadb
const mariadb = require("mariadb");

// here we create a new connection pool
const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// here we are exposing the ability to creating new connections
module.exports = {
  getConnection: function () {
    return new Promise(function (resolve, reject) {
      pool
        .getConnection()
        .then(function (connection) {
          resolve(connection);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
};

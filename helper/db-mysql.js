var mysql = require('mysql');

Connection = function () {
  this.connection = null;
}

Connection.prototype.create = function () {
  if (this.connection == null) {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
    });

    this.connection.connect();
  }
}

Connection.prototype.close = function () {
  this.connection.end( function(err) {
    console.log(err);
  } )
}

Connection.prototype.getUserByEmail = function (email) {
  var sql = "SELECT * FROM users WHERE email = ?";

  this.connection.query(sql, [email], function (err, rows) {
    if (err) {
      throw err;
    } else {
      console.log(rows);
    }
  });
}

Connection.prototype.registerUser = function (user) {
  this.connection.query("INSERT INTO users (user_name, email, pw, auth_key) VALUES (?, ?, ?, ?)", user, function(err, results) {
    if (err) {
      console.log("Error: " + err.message);
      return;
    }

    console.log("Inserted " + results.affectedRows + " row.");
    console.log("Id inserted: " + results.insertId);
  });
}

Connection.prototype.init = function () {
  // create database if not exists
  //this.connection.query("CREATE DATABASE IF NOT EXISTS itmbin");

  // use database
  this.connection.query("USE itmbin");

  // user table
  this.connection.query("DROP TABLE IF EXISTS users");

  this.connection.query("CREATE TABLE users ( id BIGINT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, pw VARCHAR(255) NOT NULL, auth INT(1) UNSIGNED DEFAULT '0', auth_key VARCHAR(255) )");
  this.connection.query("ALTER TABLE users ADD UNIQUE unique_email (email)")

  this.connection.query("INSERT INTO users (user_name, email, pw, auth, auth_key) VALUES ('test', 'michael@fh.at', 'test123', '1', 'abcdefghi')");
}

module.exports.Connection = Connection

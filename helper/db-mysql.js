var mysql = require('mysql');

var Connection = function () {
  console.log("opening MySql connection");
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

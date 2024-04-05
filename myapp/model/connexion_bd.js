var mysql = require("mysql");
var pool = mysql.createPool({
  host: "tuxa.sme.utc", //ou localhost
  user: "sr10p037",
  password: "bML8Tyc7t5Je",
  database: "sr10p037",
});
module.exports = pool;

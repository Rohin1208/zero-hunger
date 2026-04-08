const { Pool } = require("pg");

const pool = new Pool({
  user: "rohinvashishth",
  host: "localhost",
  database: "mydb",
  password: "",
  port: 5432,
});

module.exports = pool;
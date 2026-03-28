const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "rohinvashishth",
  host: "localhost",
  database: "mydb",
  password: "",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Zero Hunger API running 🚀");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
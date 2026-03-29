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

// Get all food listings
app.get("/food", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM food_listings");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching food");
  }
});

// ➕ Add food (POST)
app.post("/food", async (req, res) => {
  const { food_name, quantity, expiry, restaurant_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO food_listings (food_name, quantity, expiry, restaurant_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [food_name, quantity, expiry, restaurant_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding food");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
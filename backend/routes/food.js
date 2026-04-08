const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticate = require("../middleware/auth");

// Get all food listings (public)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM food_listings");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching food");
  }
});

// Add food — restaurants only
router.post("/", authenticate, async (req, res) => {
  if (req.user.role !== "restaurant")
    return res.status(403).send("Only restaurants can post food");

  const { food_name, quantity, expiry } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO food_listings (food_name, quantity, expiry, restaurant_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [food_name, quantity, expiry, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding food");
  }
});

module.exports = router;

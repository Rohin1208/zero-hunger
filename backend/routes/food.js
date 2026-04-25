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

router.get("/nearby/:ngo_id", async (req, res) => {
  const { ngo_id } = req.params;
  const radius_km = req.query.radius || 5; // default 5km

  try {
    const result = await pool.query(
      `SELECT 
        f.id,
        f.food_name,
        f.quantity,
        f.expiry,
        u.name AS restaurant,
        ROUND(
          ST_Distance(
            ngo.location,
            u.location
          )::numeric / 1000, 2
        ) AS distance_km
       FROM food_listings f
       JOIN users u ON f.restaurant_id = u.id
       JOIN users ngo ON ngo.id = $1
       WHERE f.quantity > 0
         AND f.expiry > NOW()
         AND ST_DWithin(
           ngo.location,
           u.location,
           $2 * 1000
         )
       ORDER BY distance_km ASC`,
      [ngo_id, radius_km]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching nearby food");
  }
});
module.exports = router;

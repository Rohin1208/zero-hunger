const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticate = require("../middleware/auth");

// NGO requests food — NGOs only
router.post("/", authenticate, async (req, res) => {
  if (req.user.role !== "ngo")
    return res.status(403).send("Only NGOs can request food");

  const { food_id } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const food = await client.query(
      "SELECT * FROM food_listings WHERE id = $1 AND quantity > 0 FOR UPDATE",
      [food_id]
    );

    if (food.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(409).send("Food unavailable or already claimed");
    }

    await client.query(
      "UPDATE food_listings SET quantity = quantity - 1 WHERE id = $1",
      [food_id]
    );

    const result = await client.query(
      "INSERT INTO requests (food_id, ngo_id) VALUES ($1,$2) RETURNING *",
      [food_id, req.user.id]
    );

    await client.query("COMMIT");
    res.json(result.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).send("Error creating request");
  } finally {
    client.release();
  }
});

// Accept request — restaurants only
router.put("/:id/accept", authenticate, async (req, res) => {
  if (req.user.role !== "restaurant")
    return res.status(403).send("Only restaurants can accept requests");

  try {
    const result = await pool.query(
      "UPDATE requests SET status = 'accepted' WHERE id = $1 AND status = 'pending' RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(400).send("Request already accepted/rejected or not found");

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating request");
  }
});

// View pending requests (public)
router.get("/pending", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM requests WHERE status = 'pending'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching requests");
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const SECRET = "your_secret_key";

router.post("/login", async (req, res) => {
  const { name, role } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND role = $2",
      [name, role]
    );
    if (result.rows.length === 0)
      return res.status(401).send("Invalid credentials");

    const token = jwt.sign(
      { id: result.rows[0].id, role: result.rows[0].role },
      SECRET
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});

module.exports = router;
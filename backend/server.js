const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "your_secret_key";

const pool = new Pool({
  user: "rohinvashishth",
  host: "localhost",
  database: "mydb",
  password: "",
  port: 5432,
});

// ── Middleware ──────────────────────────────────────────
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// ── Routes ──────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send("Zero Hunger API running 🚀");
});

// Login
app.post("/login", async (req, res) => {
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

// Get all food listings (public)
app.get("/food", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM food_listings");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching food");
  }
});

// Add food — restaurants only
app.post("/food", authenticate, async (req, res) => {
  if (req.user.role !== "restaurant")
    return res.status(403).send("Only restaurants can post food");

  const { food_name, quantity, expiry } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO food_listings (food_name, quantity, expiry, restaurant_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [food_name, quantity, expiry, req.user.id] // ← uses token, not body
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding food");
  }
});

// NGO requests food — NGOs only
app.post("/request", authenticate, async (req, res) => {
  if (req.user.role !== "ngo")
    return res.status(403).send("Only NGOs can request food");

  const { food_id } = req.body;
  const client = await pool.connect(); // ← grab a dedicated connection

  try {
    await client.query("BEGIN"); // ← start transaction

    // Lock this food row so no one else can touch it
    const food = await client.query(
      "SELECT * FROM food_listings WHERE id = $1 AND quantity > 0 FOR UPDATE",
      [food_id]
    );

    if (food.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(409).send("Food unavailable or already claimed");
    }

    // Decrement quantity
    await client.query(
      "UPDATE food_listings SET quantity = quantity - 1 WHERE id = $1",
      [food_id]
    );

    // Create the request
    const result = await client.query(
      "INSERT INTO requests (food_id, ngo_id) VALUES ($1,$2) RETURNING *",
      [food_id, req.user.id]
    );

    await client.query("COMMIT"); // ← everything worked, save it
    res.json(result.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK"); // ← something failed, undo everything
    console.error(err);
    res.status(500).send("Error creating request");
  } finally {
    client.release(); // ← always release the connection back to pool
  }
});
// Accept request — restaurants only
app.put("/request/:id/accept", authenticate, async (req, res) => {
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
app.get("/requests/pending", async (req, res) => {
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
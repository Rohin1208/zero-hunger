const jwt = require("jsonwebtoken");
const SECRET = "your_secret_key";

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

module.exports = authenticate;
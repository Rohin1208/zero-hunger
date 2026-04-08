const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const foodRoutes = require("./routes/food");
const requestRoutes = require("./routes/requests");
const authRoutes = require("./routes/auth");

app.use("/food", foodRoutes);
app.use("/request", requestRoutes);
app.use("/", authRoutes);

// Cron
const startExpiryJob = require("./cron/expiry");
startExpiryJob();

app.get("/", (req, res) => {
  res.send("Zero Hunger API running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const cron = require("node-cron");
const pool = require("../db");

const startExpiryJob = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const result = await pool.query(
        `UPDATE food_listings 
         SET quantity = 0 
         WHERE expiry < NOW() AND quantity > 0
         RETURNING *`
      );
      if (result.rows.length > 0) {
        console.log(`Expired ${result.rows.length} food listing(s)`);
      }
    } catch (err) {
      console.error("Cron error:", err);
    }
  });
};

module.exports = startExpiryJob;
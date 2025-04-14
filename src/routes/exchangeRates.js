const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM exchange_rates ORDER BY updated_at DESC LIMIT 50"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database query failed." });
  }
});

module.exports = router;

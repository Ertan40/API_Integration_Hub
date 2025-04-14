require("dotenv").config();
const axios = require("axios");
const pool = require("../config/db");

const WebSocket = require("ws"); //

async function fetchExchangeRates(wss) {
  try {
    // const response = await axios.get(process.env.EXTERNAL_API_URL);
    const url = "https://api.exchangerate-api.com/v4/latest/USD";
    const response = await axios.get(url);
    const { base, rates } = response.data;
    if (!base || !rates) {
      throw new Error("Invalid API response: missing base or rates");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const [currency, rate] of Object.entries(rates)) {
        await client.query(
          `
                INSERT INTO exchange_rates(base_currency, target_currency, rate, updated_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (base_currency, target_currency)
                DO UPDATE SET rate = EXCLUDED.rate, updated_at = NOW();
                `,
          [base, currency, rate]
        );
      }
      await client.query("COMMIT");
      console.log("Exchange rates updated successfully.");

      // Broadcast the updated rates to all connected WebSocket clients
      const updatedRates = await client.query("SELECT * FROM exchange_rates");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(updatedRates.rows));
        }
      });
    } catch (error) {
      console.error("Error saving exchange rates:", error);
      if (client) {
        await client.query("ROLLBACK");
      }
    } finally {
      if (client) {
        client.release();
      }
    }
  } catch (error) {
    console.error("API request failed:", error);
  }
}

module.exports = { fetchExchangeRates };

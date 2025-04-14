const cron = require("node-cron");

const { fetchExchangeRates } = require("../services/exchangeRateService");

// console.log("Starting scheduled API tasks...");

function startScheduler(wss) {
  console.log("Starting scheduled API tasks...");

  // Run every 2 hours
  cron.schedule("0 */1 * * *", async () => {
    console.log("Fetching latest exchange rates...");
    await fetchExchangeRates(wss);
  });
}

module.exports = { startScheduler };

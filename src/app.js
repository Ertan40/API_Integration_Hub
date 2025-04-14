const express = require("express");
const exchangeRateRoutes = require("./routes/exchangeRates");
const { fetchExchangeRates } = require("./services/exchangeRateService");

const http = require("http"); //
const WebSocket = require("ws"); //
const { startScheduler } = require("./jobs/scheduler");

const app = express();
app.use(express.json()); // This parses JSON bodies
app.use("/api/exchange-rates", exchangeRateRoutes);

// Create an HTTP server by passing the Express app
const server = http.createServer(app);

// Create a WebSocket server by passing the HTTP server
const wss = new WebSocket.Server({ server }); // new WebSocket.Server({server: server})

// Event listener for WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send a welcome message to the connected client
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server" }));

  // Handle messages received from the client
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

//Start the server
const PORT = 3001;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await fetchExchangeRates(wss); // Initial API call on startup
});

// Start the scheduler
startScheduler(wss);

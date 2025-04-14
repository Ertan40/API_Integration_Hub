# API_Integration_Hub
 API Integration Hub is a Node.js application designed to fetch real-time exchange rates from an external API, store them in a PostgreSQL database, and provide both RESTful and WebSocket interfaces for accessing this data.

## Features

- Fetches exchange rates from ExchangeRate-API every hour.​
- Stores exchange rates in a PostgreSQL database with unique constraints.​
- Provides a RESTful API to retrieve the latest exchange rates.​
- Implements WebSocket support for real-time updates to connected clients.​

## Technologies Used

- Node.js​
- Express.js​
- node-cron​
- axios​
- ws (WebSocket)

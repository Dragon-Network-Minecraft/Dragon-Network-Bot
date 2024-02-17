const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./utilities/logger');

// Load environment variables from .env file
dotenv.config();

// Set up Express app
const app = express();
const PORT = process.env.WEBSITE_PORT || 3000;

// Serve the contents of the 'public' folder without specifying .html
app.use((req, res, next) => {
  if (req.url.endsWith('/') || !path.extname(req.url)) {
    req.url += '.html';
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Error handling for server setup
app.listen(PORT, (error) => {
  if (error) {
    logger.error(`Error starting the server: ${error.message}`);
  } else {
    logger.log(`Server is running on port ${PORT}`);
  }
});

// Route with error handling
app.get('/example', (req, res) => {
  try {
    // Your route logic here
    res.send('Example route response');
  } catch (error) {
    // Log the error and send an error response
    logger.error(`Error processing /example route: ${error.message}`);
    res.status(500).send('Internal Server Error');
  }
});

// 404 Error handling for unknown routes
app.use((req, res, next) => {
  logger.warn(`404 - Not Found: ${req.url}`);
  res.status(404).send('Not Found');
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error(`Unhandled Error: ${error.message}`);
  res.status(500).send('Internal Server Error');
});

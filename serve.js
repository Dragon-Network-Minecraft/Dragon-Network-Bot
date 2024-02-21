const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./utilities/logger');

// Load environment variables from .env file
dotenv.config();

// Set up Express app
const app = express();
const PORT = process.env.WEBSITE_PORT || 3000;

// Middleware to handle URL extensions and "/" route
app.use((req, res, next) => {
  // If the requested URL is "/", serve "index.html"
  if (req.url === '/') {
    req.url = '/index.html';
  } else if (req.url.endsWith('/') || !path.extname(req.url)) {
    // If the URL ends with '/' or has no file extension, append ".html"
    req.url += '.html';
  }
  next();
});

// Static file serving using express.static to serve files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Error handling for server setup
app.listen(PORT, (error) => {
  if (error) {
    logger.error(`Error starting the server: ${error.message}`);
  } else {
    logger.log(`Server is running on port ${PORT}`);
  }
});

// 404 Error handling for unknown routes
app.use((req, res, next) => {
  logger.warn(`404 - Not Found: ${req.url}`);
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error(`Unhandled Error: ${error.message}`);
  res.status(500).send('Internal Server Error');
});

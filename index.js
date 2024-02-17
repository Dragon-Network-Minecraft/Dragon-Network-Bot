const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('./utilities/logger');

logger.log('Checking the code...');

// Check if serve.js and bot.js files exist
const filesToCheck = ['serve.js', 'bot.js', 'utilities/logger.js'];

for (const file of filesToCheck) {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    logger.error(`Error: ${file} is missing. Please make sure the file exists.`);
    process.exit(1);
  }
}

logger.log('Basic code structure is present.');

// Check for typos or buggy code
const codeFilesToCheck = ['serve.js', 'bot.js', 'utilities/logger.js'];

for (const file of codeFilesToCheck) {
  const filePath = path.join(__dirname, file);

  try {
    // Attempt to read the file to catch syntax errors or typos
    require(filePath);
    logger.log(`Code check passed for ${file}`);
  } catch (error) {
    logger.error(`Code check failed for ${file}: ${error.message}`);
    process.exit(1);
  }
}

logger.log('Code check passed. Starting the website and bot after a delay...');

// Delay before starting the website
setTimeout(() => {
  // Run serve.js as a child process
  const serveProcess = exec(`WEBSITE_PORT=${process.env.WEBSITE_PORT} node serve.js`);
  serveProcess.stdout.on('data', (data) => logger.log(`[serve.js] ${data}`));
  serveProcess.stderr.on('data', (data) => logger.error(`[serve.js] ${data}`));
}, 10000); // Wait for 10 seconds

// Delay before starting the bot
setTimeout(() => {
  // Run bot.js as a child process
  const botProcess = exec(`WEBSITE_PORT=${process.env.WEBSITE_PORT} node bot.js`);
  botProcess.stdout.on('data', (data) => logger.log(`[bot.js] ${data}`));
  botProcess.stderr.on('data', (data) => logger.error(`[bot.js] ${data}`));
}, 15000); // Wait for 15 seconds

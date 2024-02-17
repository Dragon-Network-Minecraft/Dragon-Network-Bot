const fs = require('fs');
const { DateTime } = require('luxon');
const { WebhookClient } = require('discord.js');
require('dotenv').config();

// Log levels
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

// Log queue to prevent rate limiting
const logQueue = [];

// Create logs folder if not exists
const logsFolder = './logs';
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

// Discord webhook
const webhookUrl = process.env.LOG_WEBHOOK;
const webhookClient = new WebhookClient({ url: webhookUrl });

// Function to write logs to console and file
const writeLog = (level, message) => {
  const timestamp = DateTime.local().toLocaleString(DateTime.DATETIME_MED);
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  // Log to console
  console.log(logMessage);

  // Log to file
  const logFileName = `${logsFolder}/${DateTime.local().toFormat('ddMMyyyy')}.log`;
  fs.appendFileSync(logFileName, logMessage + '\n', 'utf8');

  // Queue log for webhook
  logQueue.push(logMessage);

  // Process the log queue every 5 seconds
  setTimeout(processLogQueue, 5000);
};

// Function to process the log queue and send logs to webhook
const processLogQueue = async () => {
  if (logQueue.length === 0) {
    return;
  }

  const message = logQueue.join('\n');
  logQueue.length = 0; // Clear the log queue

  // Send logs to Discord webhook
  try {
    await webhookClient.send({
      content: 'Log Messages',
      embeds: [{
        title: 'Log Messages',
        description: '```\n' + message + '\n```',
        color: 0xff0000,
      }],
    });
  } catch (error) {
    console.error('Error sending logs to webhook:', error);
  }
};

// Export logger functions
module.exports = {
  log: (message) => writeLog(LOG_LEVELS.INFO, message),
  warn: (message) => writeLog(LOG_LEVELS.WARN, message),
  error: (message) => writeLog(LOG_LEVELS.ERROR, message),
};

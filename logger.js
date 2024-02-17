const fs = require('fs');
const { DateTime } = require('luxon');
const { WebhookClient } = require('discord.js');
require('dotenv').config();

// Log levels
const LOG_LEVELS = {
  INFO: { name: 'INFO', color: 0x34c6eb },
  WARN: { name: 'WARN', color: 0xffe000 },
  ERROR: { name: 'ERROR', color: 0xff0000 },
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
  const logMessage = `[${timestamp}] [${level.name}] ${message}`;

  // Log to console
  console.log(logMessage);

  // Log to file
  const logFileName = `${logsFolder}/${DateTime.local().toFormat('ddMMyyyy')}.log`;
  fs.appendFileSync(logFileName, logMessage + '\n', 'utf8');

  // Queue log for webhook
  logQueue.push({ level, message });

  // Process the log queue every 5 seconds
  setTimeout(processLogQueue, 5000);
};

// Function to process the log queue and send logs to webhook
const processLogQueue = async () => {
  if (logQueue.length === 0) {
    return;
  }

  const logs = logQueue.slice(); // Copy the log queue
  logQueue.length = 0; // Clear the log queue

  // Send logs to Discord webhook
  try {
    const embeds = logs.map(({ level, message }) => ({
      title: `${level.name} Log Messages`,
      description: '```\n' + message + '\n```',
      color: level.color,
    }));

    await webhookClient.send({ embeds });
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

// tickets/panel.js
const logger = require('./logger');

module.exports = {
  sendPanel: async (client) => {
    const TICKET_CHANNEL_ID = process.env.TICKET_CHANNEL_ID;

    // Check if the TICKET_CHANNEL_ID is defined
    if (!TICKET_CHANNEL_ID) {
      logger.error('TICKET_CHANNEL_ID is not defined in the environment variables.');
      return;
    }

    const channel = await client.channels.fetch(TICKET_CHANNEL_ID);

    if (!channel) {
      logger.error(`Could not find the channel with ID: ${TICKET_CHANNEL_ID}`);
      return;
    }

    const messageContent = 'Welcome! You can create a ticket by sending a message here.';

    try {
      const message = await channel.send(messageContent);
      logger.log(`Ticket panel message sent in channel ${channel.name} (${channel.id}).`);
    } catch (error) {
      logger.error(`Error sending ticket panel message: ${error}`);
    }
  },
};

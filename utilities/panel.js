const { MessageActionRow, MessageButton } = require('discord.js');
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

    // Create a button using raw JSON
    const createTicketButton = {
      type: 1, // Button
      components: [
        {
          type: 2, // Button
          style: 1, // ButtonStyle.Primary
          label: 'Create Ticket',
          custom_id: 'createTicket',
        },
      ],
    };

    try {
      // Send the welcome message with the button
      const message = await channel.send({
        content: messageContent,
        components: [createTicketButton],
      });

      logger.log(`Ticket panel message with button sent in channel ${channel.name} (${channel.id}).`);
    } catch (error) {
      logger.error(`Error sending ticket panel message: ${error}`);
    }
  },
};

// interaction-handlers/ticketcreate.js
const logger = require('../utilities/logger');

async function handleTicketCreation(interaction) {
  try {
    const userId = interaction.user.id;

    // Check if the user ID is available
    if (!userId) {
      logger.error('User ID is missing.');
      throw new Error('User ID is missing.');
    }

    // Set the content for the direct message
    const dmContent = `Ticket channel created for user ${userId}.`;

    // Check if the interaction is in a guild
    if (interaction.guild) {
      // Send a reply in the guild
      await interaction.reply({
        content: 'Ticket creation action initiated. Check your direct messages for details.',
        ephemeral: true,
      });
    }

    // Send a direct message to the user
    await interaction.user.send(dmContent);

    logger.log(`Direct message sent: ${dmContent}`);
  } catch (error) {
    logger.error(`Error handling ticket creation: ${error.message}`);
    // Check if the interaction is still valid before replying
    if (interaction.replied) return;
    await interaction.reply({
      content: 'An error occurred while handling the interaction.',
      ephemeral: true,
    });
  }
}

module.exports = {
  handleTicketCreation,
};

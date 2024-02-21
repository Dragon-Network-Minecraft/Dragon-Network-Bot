const logger = require('../utilities/logger');
const { createChannel } = require('../bot'); // Import the createChannel function

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
      // Use the createChannel function to create the channel
      await createChannel(interaction);
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

// interaction-handlers/ticketcreate.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton } = require('discord.js');
const logger = require('../utilities/logger');

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

async function createChannel(interaction, username) {
  const GUILD_ID = process.env.GUILD_ID;

  try {
    // Use the username to dynamically create the channel name
    const channelOptions = {
      name: `ticket-${username}`, // Dynamically named channel
      type: 0, // Type 0 represents a Text channel, you can change it based on your needs
      // Add other necessary parameters as needed based on your requirements
    };

    // Make the API request to create the channel
    await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Send a success message
    await interaction.reply(`Channel ${channelOptions.name} created successfully!`);
  } catch (error) {
    // Handle errors and send an error message
    console.error(`Error creating channel: ${error}`);
    await interaction.reply('An error occurred while creating the channel.');
  }
}

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
      // Retrieve the username of the user who pressed the button
      const username = interaction.user.username;

      // Use the createChannel function to create the channel
      await createChannel(interaction, username);
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

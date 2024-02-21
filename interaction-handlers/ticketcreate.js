// interaction-handlers/ticketcreate.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton } = require('discord.js');
const logger = require('../utilities/logger');

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

const createdTicketChannels = new Set();

async function createChannel(interaction, username, categoryId) {
  const GUILD_ID = process.env.GUILD_ID;

  try {
    // Check if the user has already created a ticket channel
    if (createdTicketChannels.has(interaction.user.id)) {
      await interaction.reply({ content: 'You have already created a ticket channel.', ephemeral: true });
      return;
    }

    // Use the username to dynamically create the channel name
    const channelOptions = {
      name: `ticket-${username}`, // Dynamically named channel
      type: 0, // Type 0 represents a Text channel, you can change it based on your needs
      parent_id: categoryId, // Specify the category ID for ticket channels
      // Add other necessary parameters as needed based on your requirements
    };

    // Make the API request to create the channel
    const createdChannel = await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Add user ID to the set to mark that they've created a ticket channel
    createdTicketChannels.add(interaction.user.id);

    // Send a success message with ephemeral set to true
    await interaction.reply({ content: `Channel ${createdChannel.name} created successfully!`, ephemeral: true });
  } catch (error) {
    // Handle errors and send an error message with ephemeral set to true
    console.error(`Error creating channel: ${error}`);
    await interaction.reply({ content: 'An error occurred while creating the channel.', ephemeral: true });
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

    // Check if the interaction is in a guild
    if (interaction.guild) {
      // Retrieve the username of the user who pressed the button
      const username = interaction.user.username;

      // Specify the category ID for ticket channels from .env
      const categoryId = process.env.TICKET_CATEGORY_ID;

      // Use the createChannel function to create the channel
      await createChannel(interaction, username, categoryId);
    }
    
  } catch (error) {
    logger.error(`Error handling ticket creation: ${error.message}`);
    // Check if the interaction is still valid before replying
    if (interaction.replied) return;
    // Send an error message with ephemeral set to true
    await interaction.reply({ content: 'An error occurred while handling the interaction.', ephemeral: true });
  }
}

module.exports = {
  handleTicketCreation,
};

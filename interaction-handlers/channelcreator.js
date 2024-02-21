const { REST } = require('discord-api-types/v9');
const { Routes } = require('discord-api-types/v9');
const logger = require('../utilities/logger');

async function createChannel(interaction) {
  const GUILD_ID = process.env.GUILD_ID;

  // Use the documentation to set up the channel creation parameters
  const channelOptions = {
    name: 'new-channel', // You can customize this
    type: 0, // Type 0 represents a Text channel, you can change it based on your needs
    // Add other necessary parameters as needed based on your requirements
  };

  try {
    // Make the API request to create the channel
    await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Send a success message
    await interaction.reply('Channel created successfully!');
  } catch (error) {
    // Handle errors and send an error message
    console.error(`Error creating channel: ${error}`);
    await interaction.reply('An error occurred while creating the channel.');
  }
}

module.exports = {
  createChannel,
};

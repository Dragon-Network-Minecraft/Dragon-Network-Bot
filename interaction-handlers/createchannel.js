// interaction-handlers/createchannel.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const logger = require('../utilities/logger');

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

async function handleCreateChannelButton(interaction, username) {
  const GUILD_ID = process.env.GUILD_ID;

  // Ensure that the interaction is a button interaction and has the expected custom ID
  if (interaction.isButton() && interaction.customId === `createChannelButton:${username}`) {
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
}

module.exports = {
  handleCreateChannelButton,
};

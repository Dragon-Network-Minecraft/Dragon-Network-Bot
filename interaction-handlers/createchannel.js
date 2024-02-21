// interaction-handlers/createchannel.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN); // Define 'rest' here

async function handleCreateChannelButton(interaction) {
  const GUILD_ID = process.env.GUILD_ID;

  // Ensure that the interaction is a button interaction and has the expected custom ID
  if (interaction.isButton() && interaction.customId === 'createChannelButton') {
    try {
      // Make the API request to create the channel
      await rest.post(
        Routes.guildChannels(GUILD_ID),
        { body: { name: 'new-channel', type: 0 } } // Customize the channel creation parameters as needed
      );

      // Send a success message
      await interaction.reply('Channel created successfully!');
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

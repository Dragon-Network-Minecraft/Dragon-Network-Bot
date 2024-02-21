// commands/createchannel.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('discord-api-types/v9');
const { Routes } = require('discord-api-types/v9');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('Create a new channel in the server'),

  async execute(interaction) {
    const GUILD_ID = process.env.GUILD_ID;

    // Check if the user has the MANAGE_CHANNELS permission
    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply({ content: 'You do not have the required permissions to create a channel.', ephemeral: true });
    }

    // Build the row and button for user interaction using the direct object syntax
    const row = {
      type: 1, // ActionRow type
      components: [
        {
          type: 2, // Button type
          style: 1, // Primary style
          label: 'Create Channel',
          custom_id: 'createChannelButton',
        },
      ],
    };

    await interaction.reply({
      content: 'Click the button to create a new channel.',
      components: [row],
      ephemeral: true,
    });
  },
};

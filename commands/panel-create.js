// commands/panel-create.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel-create')
    .setDescription('Create a panel message in the channel'),

  async execute(interaction) {
    try {
      // Send a message in the channel where the command was executed
      await interaction.reply('Your message content here');
    } catch (error) {
      console.error(`Error in panel-create command: ${error}`);
      await interaction.reply({
        content: 'An error occurred while creating the panel message.',
        ephemeral: true,
      });
    }
  },
};

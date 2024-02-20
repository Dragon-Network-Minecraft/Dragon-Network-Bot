// commands/panel-create.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel-create')
    .setDescription('Create a panel message in the channel'),

  async execute(interaction) {
    try {
      // Construct an embed object
      const embed = {
        title: 'Panel Message',
        description: 'Your message content here',
        color: 0x3498db, // You can customize the color (optional)
      };

      // Send the embed in the channel where the command was executed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error in panel-create command: ${error}`);
      await interaction.reply({
        content: 'An error occurred while creating the panel message.',
        ephemeral: true,
      });
    }
  },
};

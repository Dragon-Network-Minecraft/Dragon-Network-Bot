// commands/panel-create.js
const { SlashCommandBuilder } = require('discord.js');
const logger = require('../utilities/logger');

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

      // Create a button to initiate the ticket creation
      const button = {
        type: 2, // BUTTON
        style: 1, // PRIMARY
        label: 'Create Ticket',
        custom_id: 'createTicketButton',
      };

      // Create an action row with the button
      const actionRow = {
        type: 1, // ACTION_ROW
        components: [button],
      };

      // Send the embed and button in the channel where the command was executed
      await interaction.reply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      console.error(`Error in panel-create command: ${error}`);
      await interaction.reply({
        content: 'An error occurred while creating the panel message.',
        ephemeral: true,
      });
    }
  },
};

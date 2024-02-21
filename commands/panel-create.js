// commands/panel-create.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { createChannel } = require('../interaction-handlers/channelcreator'); // Import the createChannel function

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

      // Retrieve the username of the user who pressed the button
      const username = interaction.user.username;

      // Create a button to initiate the channel creation
      const buttonData = {
        type: 1, // ACTION_ROW
        components: [
          {
            type: 2, // BUTTON
            style: 1, // PRIMARY
            label: 'Create Channel',
            custom_id: 'createChannelButton',
            // Pass the username to the interaction data
            custom_id: `createChannelButton:${username}`,
          },
        ],
      };

      // Send the embed and button in the channel where the command was executed
      await interaction.reply({ embeds: [embed], components: [buttonData] });
    } catch (error) {
      console.error(`Error in panel-create command: ${error}`);
      await interaction.reply({
        content: 'An error occurred while creating the panel message.',
        ephemeral: true,
      });
    }
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tagcreate')
    .setDescription('Create a new tag'),

  async execute(interaction) {
    try {
      // Create and show the modal for tag creation
      const modal = new ModalBuilder()
        .setCustomId('createTagModal')
        .setTitle('Create a New Tag');

      // Create the text input components for tag name and content
      const tagNameInput = new TextInputBuilder()
        .setCustomId('tagNameInput')
        .setLabel('Enter Tag Name:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const tagContentInput = new TextInputBuilder()
        .setCustomId('tagContentInput')
        .setLabel('Enter Tag Content:')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      // Add inputs to the modal
      const actionRow = new ActionRowBuilder()
        .addComponents(tagNameInput);

      const secondActionRow = new ActionRowBuilder()
        .addComponents(tagContentInput);

      modal.addComponents(actionRow, secondActionRow);

      // Show the modal to the user
      await interaction.showModal(modal);
    } catch (error) {
      console.error(`Error executing 'tagcreate' command: ${error}`);
      await interaction.reply({ content: 'An error occurred while creating the tag.', ephemeral: true });
    }
  },
};

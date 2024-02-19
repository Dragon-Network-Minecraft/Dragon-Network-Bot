const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const logger = require('../utilities/logger'); 

const { STAFF_ROLE_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tagcreate')
    .setDescription('Create a new tag'),

  async execute(interaction) {
    try {
      // Check if the executor has the required role
      if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
        // Log the warning using the logger
        logger.warn(`Unauthorized attempt to use 'tagcreate' command by user ID ${interaction.user.id}`);
        
        return await interaction.reply({
          content: 'You are not a staff member! Hence you may not use this command!',
          ephemeral: true,
        });
      }

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

      // Log the tag creation at INFO level
      logger.log(`Tag creation initiated by user ID ${interaction.user.id}`);
    } catch (error) {
      // Log the error using the logger at ERROR level
      logger.error(`Error executing 'tagcreate' command: ${error}`);
      await interaction.reply({ content: 'An error occurred while creating the tag.', ephemeral: true });
    }
  },
};

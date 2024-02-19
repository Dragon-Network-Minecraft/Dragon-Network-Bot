const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utilities/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tags')
    .setDescription('Get a list of available tags'),

  async execute(interaction) {
    try {
      // Fetch the list of tag names from the 'tags' directory
      const tagsDirectory = path.join(__dirname, '..', 'data', 'tags');
      const tagFiles = fs.readdirSync(tagsDirectory).filter(file => file.endsWith('.json'));
      const tagNames = tagFiles.map(file => path.parse(file).name);

      if (tagNames.length === 0) {
        await interaction.reply({ content: 'No tags available.', ephemeral: true });

        // Log the warning to the logger
        logger.warn('No tags available.');

        return;
      }

      // Build a select menu with options for each tag
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('tagSelection')
        .setPlaceholder('Select a tag');

      tagNames.forEach(tagName => {
        selectMenu.addOptions({
          label: tagName,
          value: tagName.toLowerCase(),
        });
      });

      const actionRow = new ActionRowBuilder().addComponents(selectMenu);

      // Reply to the command executor with the select menu
      await interaction.reply({
        content: 'Choose a tag:',
        components: [actionRow],
        ephemeral: true,
      });

      // Log the successful execution to the logger
      logger.log(`'tags' command executed successfully. Available tags: ${tagNames.join(', ')}`);
    } catch (error) {
      // Log the error to the logger with warning level
      logger.warn(`Error executing 'tags' command: ${error}`);

      console.error(`Error executing 'tags' command: ${error}`);
      await interaction.reply({ content: 'An error occurred while fetching tags.', ephemeral: true });
    }
  },
};

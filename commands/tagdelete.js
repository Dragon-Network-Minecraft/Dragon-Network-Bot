const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tagdelete')
    .setDescription('Delete a tag'),

  async execute(interaction) {
    try {
      // Fetch the list of tag names from the 'tags' directory
      const tagsDirectory = path.join(__dirname, '..', 'data', 'tags');
      const tagFiles = fs.readdirSync(tagsDirectory).filter(file => file.endsWith('.json'));
      const tagNames = tagFiles.map(file => path.parse(file).name);

      if (tagNames.length === 0) {
        return interaction.reply({ content: 'No tags available to delete.', ephemeral: true });
      }

      // Build a select menu with options for each tag
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('tagDeletion')
        .setPlaceholder('Select a tag to delete');

      tagNames.forEach(tagName => {
        selectMenu.addOptions({
          label: tagName,
          value: tagName.toLowerCase(),
        });
      });

      const actionRow = new ActionRowBuilder().addComponents(selectMenu);

      // Reply to the command executor with the select menu (ephemeral set to true)
      await interaction.reply({
        content: 'Choose a tag to delete:',
        components: [actionRow],
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error executing 'tagdelete' command: ${error}`);
      await interaction.reply({ content: 'An error occurred while fetching tags for deletion.', ephemeral: true });
    }
  },
};

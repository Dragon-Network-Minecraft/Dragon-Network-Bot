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
      // Check if the command executor has the required role
      const requiredRoleID = process.env.STAFF_ROLE_ID;
      const member = interaction.guild.members.cache.get(interaction.user.id);
      
      if (!member.roles.cache.has(requiredRoleID)) {
        return interaction.reply({ content: 'You are not a staff member! Hence you may not use this command!', ephemeral: true });
      }

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

      // Reply to the command executor with the select menu
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

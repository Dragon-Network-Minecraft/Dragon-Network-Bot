const { StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports.handleTagDeletion = async (interaction) => {
  try {
    // Handle the tag deletion
    const selectedTag = interaction.values[0];

    // Construct the file path for the selected tag's JSON file
    const tagPath = path.join(__dirname, '..', 'data', 'tags', `${selectedTag}.json`);

    // Check if the tag file exists
    if (!fs.existsSync(tagPath)) {
      return interaction.reply({ content: `Tag "${selectedTag}" not found.`, ephemeral: true });
    }

    // Delete the tag file
    fs.unlinkSync(tagPath);

    // Send ephemeral acknowledgment message
    await interaction.reply({ content: `Tag "${selectedTag}" has been deleted.`, ephemeral: true });
  } catch (error) {
    console.error(`Error handling tag deletion: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling the tag deletion.', ephemeral: true });
  }
};

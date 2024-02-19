
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports.handleTagCreation = async (interaction) => {
  try {
    // Extract data from modal submission
    const tagName = interaction.fields.getTextInputValue('tagNameInput');
    const tagContent = interaction.fields.getTextInputValue('tagContentInput');

    // Validate if tag name is provided
    if (!tagName) {
      return await interaction.reply({ content: 'Tag name is required.', ephemeral: true });
    }

    // Save tag data to a JSON file
    const tagPath = path.join(__dirname, '..', 'data', 'tags', `${tagName.toLowerCase()}.json`);
    const tagData = { content: tagContent || '' };
    fs.writeFileSync(tagPath, JSON.stringify(tagData, null, 2));

    // Acknowledge successful tag creation
    await interaction.reply({ content: `Tag '${tagName}' created successfully!`, ephemeral: true });
  } catch (error) {
    console.error(`Error handling tag creation: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling tag creation.', ephemeral: true });
  }
};

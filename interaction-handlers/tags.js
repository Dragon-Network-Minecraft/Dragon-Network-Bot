// interaction-handlers/tags.js
const { StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports.handleTagSelection = async (interaction) => {
  try {
    // Handle the tag selection
    const selectedTag = interaction.values[0]; // Assuming it's a single-selection dropdown

    // Send ephemeral acknowledgment message
    await interaction.reply({
      content: 'Fetching tag information...',
      ephemeral: true,
    });

    // Read the content of the selected tag
    const tagPath = path.join(__dirname, '..', 'data', 'tags', `${selectedTag}.json`);
    const tagData = JSON.parse(fs.readFileSync(tagPath, 'utf-8'));

    // Create an embed with the tag data
    const embed = {
      title: selectedTag,
      description: tagData.content,
      footer: {
        text: `Executed by ${interaction.user.tag}`,
      },
    };

    // Send the embed to the channel
    await interaction.followUp({ embeds: [embed] });
  } catch (error) {
    console.error(`Error handling tag selection: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling the tag selection.', ephemeral: true });
  }
};

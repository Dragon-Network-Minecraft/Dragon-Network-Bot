const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');
const logger = require('../utilities/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tagcreate')
    .setDescription('Create a new tag')
    .addStringOption(option => 
      option.setName('tagname')
        .setDescription('Name of the tag')
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName('tagcontent')
        .setDescription('Content of the tag')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const tagName = interaction.options.getString('tagname');
      const tagContent = interaction.options.getString('tagcontent');
      const tagPath = path.join(__dirname, '..', 'data', 'tags', `${tagName.toLowerCase()}.json`);

      // Check if the tag already exists
      if (fs.existsSync(tagPath)) {
        return interaction.reply({ content: 'Tag with that name already exists!', ephemeral: true });
      }

      // Create the tag file
      fs.writeFileSync(tagPath, JSON.stringify({ content: tagContent }));

      logger.log(`Tag created: ${tagName} by ${interaction.user.tag}`);

      // Construct a direct object for the reply
      const replyObject = {
        content: `Tag created successfully: ${tagName}`,
        embeds: [{
          title: 'Tag Details',
          fields: [
            { name: 'Tag Name', value: tagName, inline: false },
            { name: 'Tag Content', value: tagContent, inline: false },
          ],
        }],
      };

      await interaction.reply(replyObject);
    } catch (error) {
      logger.error(`Error creating tag for ${interaction.user.tag}: ${error}`);
      await interaction.reply({ content: 'There was an error while creating the tag!', ephemeral: true });
    }
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user')
    .addUserOption(option => 
      option.setName('target')
        .setDescription('Select a user')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target') || interaction.user;
    const avatarURL = targetUser.displayAvatarURL({ dynamic: true, size: 256 });

    await interaction.reply(`Avatar of ${targetUser.tag}:\n${avatarURL}`);
  },
};

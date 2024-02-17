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

    const embed = {
      title: `Avatar of ${targetUser.tag}`,
      image: {
        url: avatarURL,
      },
      color: 0x3498db, // You can customize the color as needed
    };

    await interaction.reply({ embeds: [embed] });
  },
};

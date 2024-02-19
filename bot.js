const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const logger = require('./utilities/logger');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    logger.log('Started refreshing global (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    logger.log('Successfully reloaded global (/) commands.');
  } catch (error) {
    logger.error(`Error refreshing global (/) commands: ${error}`);
  }
})();

client.commands = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('ready', () => {
  logger.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

  try {
    if (interaction.isSelectMenu()) {
      // Handle select menu interactions
      const customId = interaction.customId;

      if (customId === 'tagSelection') {
        // Handle the tag selection
        const selectedTag = interaction.values[0]; // Assuming it's a single-selection dropdown

        // Send ephemeral acknowledgment message
        await interaction.reply({
          content: 'Fetching tag information...',
          ephemeral: true,
        });

        // Read the content of the selected tag
        const tagPath = path.join(__dirname, 'data', 'tags', `${selectedTag}.json`);
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
      }
    } else if (interaction.isCommand()) {
      // Handle other command interactions
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      // Execute the command
      await command.execute(interaction);
    }
  } catch (error) {
    console.error(`Error handling interaction: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling the interaction.', ephemeral: true });
  }
});

client.login(process.env.BOT_TOKEN);

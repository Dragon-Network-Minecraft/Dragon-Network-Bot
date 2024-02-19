const { Client, GatewayIntentBits, ModalBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const logger = require('./utilities/logger');
const tagsHandler = require('./interaction-handlers/tags');
const tagcreateHandler = require('./interaction-handlers/tagcreate');

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
  if (!interaction.isCommand() && !interaction.isSelectMenu() && !interaction.isModalSubmit()) return;

  try {
    if (interaction.isSelectMenu()) {
      // Handle select menu interactions using the tags handler
      await tagsHandler.handleTagSelection(interaction);
    } else if (interaction.isCommand()) {
      // Handle other command interactions
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      // Execute the command
      await command.execute(interaction);
    } else if (interaction.isModalSubmit() && interaction.customId === 'createTagModal') {
      // Handle tag creation modal submission
      await tagcreateHandler.handleTagCreation(interaction);
    }
  } catch (error) {
    console.error(`Error handling interaction: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling the interaction.', ephemeral: true });
  }
});

client.login(process.env.BOT_TOKEN);
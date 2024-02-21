// bot.js
const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const logger = require('./utilities/logger');
const { handleTicketCreation } = require('./interaction-handlers/ticketcreate');
const tagsHandler = require('./interaction-handlers/tags');
const tagcreateHandler = require('./interaction-handlers/tagcreate');
const tagdeleteHandler = require('./interaction-handlers/tagdelete');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

// Register commands on bot startup
(async () => {
  try {
    logger.log('Started refreshing global (/) commands.');

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    logger.log('Successfully reloaded global (/) commands.');
  } catch (error) {
    logger.error(`Error refreshing global (/) commands: ${error}`);
  }
})();

// Set up the command map
client.commands = new Map();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('ready', () => {
  logger.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isSelectMenu() && !interaction.isModalSubmit() && !interaction.isButton()) return;

  try {
    if (interaction.isCommand()) {
      // Handle command interactions
      const command = client.commands.get(interaction.commandName);

      if (command) {
        // Execute the command
        await command.execute(interaction, client);
      }
    } else if (interaction.isButton()) {
      // Handle button interactions
      if (interaction.customId === 'createTicketButton') {
        // Handle ticket creation button interactions using the ticketcreate handler
        await handleTicketCreation(client, interaction);
      } else {
        // Handle other button interactions as needed
      }
    } else if (interaction.isSelectMenu()) {
      if (interaction.customId === 'tagDeletion') {
        // Handle tag deletion select menu interactions
        await tagdeleteHandler.handleTagDeletion(interaction);
      } else {
        // Handle other select menu interactions using the tags handler
        await tagsHandler.handleTagSelection(interaction);
      }
    } else if (interaction.isModalSubmit() && interaction.customId === 'createTagModal') {
      // Handle tag creation modal submission
      await tagcreateHandler.handleTagCreation(interaction);
    }
  } catch (error) {
    // Log and reply with an error message if an exception occurs
    console.error(`Error handling interaction: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling the interaction.', ephemeral: true });
  }
});


client.login(process.env.BOT_TOKEN);

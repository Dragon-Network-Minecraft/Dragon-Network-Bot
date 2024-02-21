// bot.js
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
  try {
    if (interaction.isCommand()) {
      // Handle command interactions
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      // Execute the command
      await command.execute(interaction, client);
    } else if (interaction.isButton()) {
      // Handle button interactions
      if (interaction.customId === 'createChannelButton') {
        // Call the function to create the channel
        await createChannel(interaction, client);
      }
    }
  } catch (error) {
    // Log and reply with an error message if an exception occurs
    console.error(`Error handling interaction: ${error}`);
    await interaction.reply({ content: 'An error occurred while handling the interaction.', ephemeral: true });
  }
});

async function createChannel(interaction, client) {
  const GUILD_ID = process.env.GUILD_ID;

  // Use the documentation to set up the channel creation parameters
  const channelOptions = {
    name: 'new-channel', // You can customize this
    type: 0, // Type 0 represents a Text channel, you can change it based on your needs
    // Add other necessary parameters as needed based on your requirements
  };

  try {
    // Make the API request to create the channel
    await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Send a success message
    await interaction.reply('Channel created successfully!');
  } catch (error) {
    // Handle errors and send an error message
    console.error(`Error creating channel: ${error}`);
    await interaction.reply('An error occurred while creating the channel.');
  }
}

client.login(process.env.BOT_TOKEN);

// interaction-handlers/ticketcreate.js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utilities/logger');

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

const createdTicketChannels = new Set();

async function createChannel(client, interaction, categoryId) {
  const GUILD_ID = process.env.GUILD_ID;

  try {
    const userId = interaction.user.id;
    const userTicketDir = path.join('data/tickets', userId);

    // Check if the user has already created a ticket channel
    if (createdTicketChannels.has(userId)) {
      await interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
      return;
    }

    // Check if the user has a ticket directory, create one if not
    await fs.mkdir(userTicketDir, { recursive: true });

    // Construct the channel creation timestamp
    const timestamp = new Date().toISOString();

    // Fetch the username from the interaction object
    const fetchedUser = await client.users.fetch(interaction.user.id);
    const fetchedUsername = fetchedUser.username;

    // Use the fetched username to dynamically create the channel name
    const channelName = `ticket-${fetchedUsername}`;

    // Create the channel options
    const channelOptions = {
      name: channelName,
      type: 0,
      parent_id: categoryId,
      // Add other necessary parameters as needed based on your requirements
    };

    // Make the API request to create the channel
    const createdChannel = await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Add user ID to the set to mark that they've created a ticket channel
    createdTicketChannels.add(userId);

    // Update ticket data in JSON file
    const ticketData = {
      timestamp,
      channelName,
      channelId: createdChannel.id,
      userDetails: {
        username: fetchedUsername,
        discriminator: interaction.user.discriminator,
        userId,
      },
      status: 'open',
    };

    const userTicketListPath = path.join(userTicketDir, 'list.json');

    // Read existing ticket list or create an empty array
    const existingTicketList = await fs.readFile(userTicketListPath, 'utf-8')
      .then(data => JSON.parse(data))
      .catch(() => []);

    // Add the new ticket data to the list
    existingTicketList.push(ticketData);

    // Write the updated ticket list back to the file
    await fs.writeFile(userTicketListPath, JSON.stringify(existingTicketList, null, 2));

    // Send a success message with ephemeral set to true
    await interaction.reply({ content: `Channel ${createdChannel.name} created successfully!`, ephemeral: true });
  } catch (error) {
    // Handle errors and send an error message with ephemeral set to true
    console.error(`Error creating channel: ${error}`);
    await interaction.reply({ content: 'An error occurred while creating the channel.', ephemeral: true });
  }
}

module.exports = {
  handleTicketCreation: createChannel,
};

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utilities/logger');

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

async function createChannel(client, interaction) {
  const GUILD_ID = process.env.GUILD_ID;
  const TICKET_CATEGORY_ID = process.env.TICKET_CATEGORY_ID;

  try {
    const userId = interaction.user.id;
    const userTicketDir = path.join('data/tickets', userId);

    // Read existing ticket list or create an empty array
    const userTicketListPath = path.join(userTicketDir, 'list.json');
    const existingTicketList = await fs.readFile(userTicketListPath, 'utf-8')
      .then(data => JSON.parse(data))
      .catch(() => []);

    // Check if the user has already created a ticket channel
    if (existingTicketList.some(ticket => ticket.status === 'open')) {
      await interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
      return;
    }

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
      parent_id: TICKET_CATEGORY_ID, // Specify the category ID here
      // Add other necessary parameters as needed based on your requirements
    };

    // Make the API request to create the channel
    const createdChannelData = await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Mention the user in the channel and add them to the channel
    await interaction.guild.channels.cache
      .get(createdChannelData.id)
      .send({ content: `Welcome <@${interaction.user.id}> to your ticket channel!` });
    await interaction.guild.channels.cache
      .get(createdChannelData.id)
      .permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: 0x00000400 }); // 0x00000400 is the numeric value for VIEW_CHANNEL

    // Update ticket data in JSON file
    const ticketData = {
      timestamp,
      channelName,
      channelId: createdChannelData.id,
      userDetails: {
        username: fetchedUsername,
        discriminator: interaction.user.discriminator,
        userId,
      },
      status: 'open',
    };

    // Add the new ticket data to the list
    existingTicketList.push(ticketData);

    // Write the updated ticket list back to the file
    await fs.writeFile(userTicketListPath, JSON.stringify(existingTicketList, null, 2));

    // Send a success message with ephemeral set to true
    await interaction.reply({ content: `Channel ${createdChannelData.name} created successfully!`, ephemeral: true });
  } catch (error) {
    // Handle errors and send an error message with ephemeral set to true
    console.error(`Error creating channel: ${error}`);
    await interaction.reply({ content: 'An error occurred while creating the channel.', ephemeral: true });
  }
}

module.exports = {
  handleTicketCreation: createChannel,
};

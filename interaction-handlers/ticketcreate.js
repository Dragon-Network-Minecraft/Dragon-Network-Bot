const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton, Permissions } = require('discord.js');
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
    let existingTicketList = [];

    try {
      const data = await fs.readFile(userTicketListPath, 'utf-8');
      existingTicketList = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If the file does not exist, create the user directory
        await fs.mkdir(userTicketDir, { recursive: true });
      } else {
        console.error(`Error reading existing ticket list: ${error}`);
        console.error(`Error reading existing ticket list: ${error.message}`);
        // Handle other errors if needed
      }
    }

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
      parent_id: TICKET_CATEGORY_ID,
    };

    // Make the API request to create the channel
    const createdChannelData = await rest.post(
      Routes.guildChannels(GUILD_ID),
      { body: channelOptions },
    );

    // Mention the user in the channel
    const ticketChannel = interaction.guild.channels.cache.get(createdChannelData.id);
    await ticketChannel.send(`Welcome <@${interaction.user.id}> to your ticket channel!`);

    // Log the channel creation and mention
    console.log(`Ticket channel created: ${createdChannelData.name} (${createdChannelData.id})`);
    console.log(`User mentioned in the channel: ${interaction.user.username}#${interaction.user.discriminator}`);

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

    // Wait for 3 seconds and then grant user view permissions
    setTimeout(async () => {
      try {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const permissions = ['VIEW_CHANNEL'];

        await ticketChannel.permissionOverwrites.edit(member, {
          permissions: permissions,
        });

        // Log permission update
        console.log(`User permissions updated in ${ticketChannel.name}: ${interaction.user.username}#${interaction.user.discriminator}`);
      } catch (permissionsError) {
        console.error(`Error updating user permissions: ${permissionsError}`);
        console.error(`Error updating user permissions: ${permissionsError.message}`);
      }
    }, 3000);

    // Send a success message with ephemeral set to true
    await interaction.reply({ content: `Channel ${createdChannelData.name} created successfully!`, ephemeral: true });
  } catch (error) {
    // Handle errors and send an error message with ephemeral set to true
    console.error(`Error creating channel: ${error}`);
    console.error(`Error creating channel: ${error.message}`);
    await interaction.reply({ content: 'An error occurred while creating the channel.', ephemeral: true });
  }
}

module.exports = {
  handleTicketCreation: createChannel,
};

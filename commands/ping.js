const { EmbedBuilder } = require("discord.js");
const { AdvancedEmbed, EmbedStyle } = require("utilscord");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention } = require('discord.js')
const utils = require('../utils/help')
module.exports = {
  name: "ping",
  description: "Bot'un ping değerlerini gösterir.",
  options: [],
  /**
* @param {import('discord.js').Client} client
* @param {import('discord.js').ChatInputCommandInteraction} interaction
*/
  run: async (client, interaction, db, webhook) => {

    const embed = utils.createEmbed(interaction, EmbedStyle.Default, `Discord API Gecikmesi: ${client.ws.ping}`)

    interaction.reply({ embeds: [embed] })
  }
}
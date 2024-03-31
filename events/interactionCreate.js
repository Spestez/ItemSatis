const { Collection, EmbedBuilder, WebhookClient } = require("discord.js");
const { readdirSync } = require("fs");
const db = require('../db')
const config = require('../config.json')
const webhook = new WebhookClient({ url: config.Settings.WebhookURL })
module.exports = async (client, interaction, db, webhook) => {
  if (interaction.isChatInputCommand()) {
    if (!interaction.guildId) return;
    readdirSync('./commands').forEach(f => {
      const cmd = require(`../commands/${f}`);
      if (interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
        return cmd.run(client, interaction);
      }
    });
  }
};

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { WebhookClient } = require('discord.js')
const config = require("../config.json");
const webhook = new WebhookClient({ url: config.Settings.WebhookURL })
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);

const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 3
});
/**
* @param {import('discord.js').Client} client
*/
module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(config.API.token || process.env.token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }

  const loginMessage = config.Settings.GirisYaptiMesaji.replace('{botIsmı}', client.user.username)

  const urlSplit1 = "https://encrypted-tbn0.gstatic.com/images?"
  const urlSplit2 = "q=tbn:ANd9GcQE5edLbSpougELFqAZJ8gXn5c_5H0qcFTybw"
  const tam = urlSplit1 + urlSplit2

  webhook.send({
    content: loginMessage,
    username: `Giriş Bildiricisi`,
    avatarURL: tam
  })

  console.log(`${client.user.username} discord bağlandı.`);
};

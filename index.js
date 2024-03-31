const { Client, PartialsChannelType, Partials, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const {AdvancedEmbed, EmbedStyle} = require('utilscord')
const Discord = require("discord.js")
const config = require("./config.json");
const webhook = new Discord.WebhookClient({url:config.Settings.WebhookURL})
const { readdirSync } = require("fs")

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    allowedMentions: {
        parse: ["users"]
    },
    partials: Object.values(Partials),
    retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);
readdirSync('./commands').forEach(f => {
  if(!f.endsWith(".js")) return;

 const props = require(`./commands/${f}`);

 client.commands.push({
       name: props.name.toLowerCase(),
       description: props.description,
       options: props.options,
       dm_permission: props.dm_permission,
       type: 1
 });

});
readdirSync('./events').forEach(e => {

  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
            eve(client, ...args)
        });
});


client.login(config.API.token || process.env.token)

  /**
* @param {import('discord.js').Client} client
*/

function sendLog(error, hande) {
    const embed = new AdvancedEmbed()
    .setAuthor({ name: client.user.username + ' bir problem ile karşıştı', iconURL: client.user.displayAvatarURL() })
    .setDescription(`Bot şuanda ${hande.toString()} hatası ile karşılaştı. Botun kapanması engellendi.`)
    .addFields([
        {name:'Hata:', value:error, inline:true}
    ])
    .setFooter({ text: '2024 © Raven Team - Speste | Tüm Hakları Saklıdır.', iconURL: client.user.displayAvatarURL() })

    webhook.send({embeds:[embed], username:`${client.user.username} | Hata Log`, iconURL:'https://cdn.discordapp.com/emojis/1183410798484271224.png'})
}

process.on("unhandledRejection", (error) => {
    sendLog(error.toString(), '**İşlenmemiş Reddilme**')
    console.log(error);
});
process.on("uncaughtException", (err) => {
    sendLog(err.toString(), '**Yakalanmamış İstisna**')
    console.log(err);
});
process.on("uncaughtExceptionMonitor", (err) => {
    sendLog(err.toString(), '**Yakalanmamış İstisna İzleyicisi**')
    console.log(err);
});



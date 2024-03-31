const { EmbedBuilder } = require("discord.js");
const { AdvancedEmbed, EmbedStyle } = require("utilscord");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention } = require('discord.js')
const { getAdvertisement, getUser } = require('itemsatis');
const utils = require('../utils/help')
module.exports = {
    name: "kullanıcı-bilgi",
    description: "Bot item satıştaki bir kullanıcı ile ilgili bilgi verir.",
    options: [{
        name: 'kullanıcı-adı',
        description: 'Kullanıcı adı giriniz',
        type: 3,
        required: true
    },
    {
        name: 'kullanıcı-mağazamı',
        description: 'Kullanıcı bir mağazamı [evet/hayır]',
        type: 3,
        required: true
    }
    ],
    /**
  * @param {import('discord.js').Client} client
  * @param {import('discord.js').ChatInputCommandInteraction} interaction
  */
    run: async (client, interaction) => {
        const optionUserName = interaction.options.getString('kullanıcı-adı')
        const isStore = interaction.options.getString('kullanıcı-mağazamı')

        if (isStore != 'evet' && isStore != 'hayır') {
            const embed = utils.createEmbed(interaction, EmbedStyle.Error,
                `Lütfen sadece evet/hayır ile cevap verin.`
            )
            return interaction.reply({ embeds: [embed] })
        }

        let letUser;
        if (isStore == 'evet') {
            const user = await getUser(optionUserName, true);
            letUser = user
        }
        if (isStore == 'hayır') {
            const user = await getUser(optionUserName, false);
            letUser = user
        }

        const bekleniyor = utils.createEmbed(interaction, EmbedStyle.Loading, `Kullanıcı aranıyor, lütfen bekleyin.`)
        interaction.reply({ embeds: [bekleniyor] }).then(msg => {
            if (!letUser) {
                setTimeout(function () {
                    const embed = utils.createEmbed(interaction, EmbedStyle.Warn, 'Aradığınız kullanıcı bulunamadı. Lütfen mağaza olup olmadığından emin olun.')
                    msg.edit({ embeds: [embed] })
                }, 2000)
                return;
            }

            const par1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:"
            const par2 = "ANd9GcRCJ7C6ybMJ1RSFYcL7xSlG_Fh9lFzH_kiJZg"
            const per = par1 + par2
            const embed = new EmbedBuilder()
                .setDescription(`
            **Kullanıcı bulundu**

            **Kullanıcı adı:** ${letUser.username}
            **Son görülme:** ${letUser.lastSeen.replace('Şuanda çevrimiçi', 'Çevrimiçi')}

            **Takipçiler:** ${letUser.followers.toString()}
            **Hesap Oluşturulma:** ${letUser.createdAt}

           **Değerlendirmeler:** ${letUser.storeRating}
            (${letUser.ratingOutOf10}/10.0)

           ${letUser.successfulTransaction}
            `)
                .setAuthor({ name: `${letUser.username} sorgulanıyor.`, iconURL: letUser.getAvatar() })
                .setFooter({ text: 'Raven Team - Speste © Tüm hakları saklıdır.', iconURL: 'https://cdn.discordapp.com/icons/1096085223881576549/659a570c79e73521fbebe5fb56dda08f.webp?size=80' })
            setTimeout(function () {
                msg.edit({ embeds: [embed], })
            }, 2100)
        })
    }
}
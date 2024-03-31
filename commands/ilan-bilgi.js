const { EmbedBuilder } = require("discord.js");
const { AdvancedEmbed, EmbedStyle } = require("utilscord");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention } = require('discord.js')
const { getAdvertisement } = require('itemsatis');
const utils = require('../utils/help')
module.exports = {
    name: "ilan-bilgi",
    description: "Bot item satışta ilanla ilgili bilgi verir.",
    options: [{
        name: 'ilan-linki',
        description: 'İlan linki giriniz.',
        type: 3,
        required: true
    }],
    /**
  * @param {import('discord.js').Client} client
  * @param {import('discord.js').ChatInputCommandInteraction} interaction
  */
    run: async (client, interaction) => {
        const link = interaction.options.getString('ilan-linki')
        const ilan = await getAdvertisement(link);



        const bekleniyor = utils.createEmbed(interaction, EmbedStyle.Loading, `İlan aranıyor, lütfen bekleyin.`)
        interaction.reply({ embeds: [bekleniyor] }).then(msg => {
            if (!ilan) {
                setTimeout(function () {
                    const embed = utils.createEmbed(interaction, EmbedStyle.Warn, 'Aradığınız ilan bulunamadı.')
                    msg.edit({ embeds: [embed] })
                }, 2000)
                return;
            }

            const longDesc = new ButtonBuilder()
                .setCustomId('longDescription')
                .setLabel('Uzun Açıklama')
                .setStyle(ButtonStyle.Primary)

            const goToAd = new ButtonBuilder()
                .setURL(link)
                .setLabel('İlana Git')
                .setStyle(ButtonStyle.Link)

            const row = new ActionRowBuilder().addComponents(longDesc, goToAd);
            const par1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:"
            const par2 = "ANd9GcRCJ7C6ybMJ1RSFYcL7xSlG_Fh9lFzH_kiJZg"
            const per = par1 + par2
            const embed = new EmbedBuilder()
                .setDescription(`
            **İlan bulundu**

                **Başlık**: ${ilan.title}

                **Kısa Açıklama**: ${ilan.shortDescription.slice(0, 100)}

                **Satıcı**: ${ilan.author}
                **Başarılı işlem:** ${ilan.successfulTransaction || "Bilinmiyor."}

                **Ücret**: ${ilan.price}
                **Stok**: ${ilan.stockCount || "Bilinmiyor."}

                **Rozetler:** ${ilan.badges.join(', ') || "Yok."}
            `)
                .setAuthor({ name: interaction.user.username.toString(), iconURL: interaction.user.displayAvatarURL() })
                .setFooter({ text: 'Raven Team - Speste © Tüm hakları saklıdır.', iconURL: 'https://cdn.discordapp.com/icons/1096085223881576549/659a570c79e73521fbebe5fb56dda08f.webp?size=80' })
                .setImage(ilan.avatarURL || per)
                .setThumbnail(ilan.bannerURL) 

            setTimeout(function () {
                msg.edit({ embeds: [embed], components: [row] })
            }, 2100)


            const collector = interaction.channel.createMessageComponentCollector({
                time: 20000
            })

            collector.on('collect', async (tinteraction) => {
                if (tinteraction.customId == 'longDescription') {
                    if (tinteraction.user.id !== interaction.user.id) {
                        const embed = utils.createEmbed(tinteraction, EmbedStyle.Warn, `Bunu sadece komutu kullanan kullanabilir`); 
                        interaction.reply({ embeds: [embed] })
                        return;
                    }

                    const embed = utils.createEmbed(tinteraction, EmbedStyle.Default, `**Uzun __olarak belirtilen__ açıklama:**
                ${ilan.longDescription || "Yok"}
                `)
                    tinteraction.reply({ embeds: [embed], ephemeral: true })
                    return;
                }
            })
            collector.on('end', async (tinteraction) => {
                longDesc.setDisabled(true)
                goToAd.setDisabled(true)
                msg.edit({ embeds: [embed], components: [row], content: 'Buton kullanım süresi aşıldı.' })
            })
        })

    }
}
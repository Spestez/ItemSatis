const {EmbedStyle, AdvancedEmbed} = require('utilscord')
const chalk = require('chalk')
function mentionByID(id) {
    return `<@${id}>`;
}

function createEmbed(interaction, style, message) {
    const embed = new AdvancedEmbed()
    .setInteraction(interaction)
    .setDescription(message)
    .setStyle(style)

    return embed;
}
module.exports = {
    mentionByID,
    createEmbed,
};
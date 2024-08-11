const { Message, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    description: "Displays a list of available commands.",
    category: "Utility",
    cooldown: 5,
    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args,prefix) => {
        const embed = new EmbedBuilder()
            .setTitle("Help Menu")
            .setDescription("Here are the available commands:")
            .addFields(
                { name: "/get", value: "Fetch Instagram Posts/Reels using a URL." },
                { name: "/help", value: "Displays this help menu." }
            )
            .setColor("BLUE")
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        message.channel.send({ embeds: [embed] });
    },
};

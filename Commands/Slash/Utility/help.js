const {
    CommandInteraction,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionFlagsBits,
    Client,
} = require("discord.js");

module.exports = {
    name: "help",
    description: "Displays a list of available commands.",
    type: ApplicationCommandType.ChatInput,
    userPermissions: PermissionFlagsBits.SendMessages,
    botPermissions: PermissionFlagsBits.SendMessages,
    category: "Utility",

    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("Help Menu")
            .setDescription("Here are the available commands:")
            .addFields(
                { name: "/get", value: "Fetch Instagram Posts/Reels using a URL." },
                { name: "/help", value: "Displays this help menu." }
            )
            .setColor("BLUE")
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

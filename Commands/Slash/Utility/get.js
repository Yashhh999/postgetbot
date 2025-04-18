const { CommandInteraction, ApplicationCommandType, PermissionFlagsBits, Client, AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");
const axios = require('axios');
const { ApifyClient } = require('apify-client');

module.exports = {
    name: "get",
    description: "Get Instagram Posts/Reels",
    userPermissions: PermissionFlagsBits.SendMessages,
    botPermissions: PermissionFlagsBits.SendMessages,
    category: "Utility",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'url',
            description: 'The URL of the Instagram post/reel',
            type: ApplicationCommandOptionType.String, 
            required: true,
        },
        {
            name: 'sendcaption',
            description: 'Whether to send the caption along with the media',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const instagramURL = interaction.options.getString('url');
        const sendCaption = interaction.options.getBoolean('sendcaption') || false;
        const apifyToken = "apify_api_B0fuZn57Fi0PA7EbLs6O8cCTGC5S82009LO3";
        await interaction.deferReply();

        let formattedURL = instagramURL.split('?')[0];
        
        // Enhanced URL parsing to handle multiple Instagram URL formats
        let shortcode;
        
        // Handle /reel/ format
        if (formattedURL.includes('/reel/')) {
            shortcode = formattedURL.split('/reel/')[1]?.split('/')[0];
        }
        // Handle /reels/ format
        else if (formattedURL.includes('/reels/')) {
            shortcode = formattedURL.split('/reels/')[1]?.split('/')[0];
        }
        // Handle /p/ format (posts)
        else if (formattedURL.includes('/p/')) {
            shortcode = formattedURL.split('/p/')[1]?.split('/')[0];
        }

        if (!shortcode) {
            return interaction.editReply("Invalid Instagram URL! Please provide a valid Instagram post or reel URL.");
        }

        const apifyClient = new ApifyClient({
            token: apifyToken,
        });

        try {
            const { defaultDatasetId } = await apifyClient.actor("apify/instagram-scraper").call({
                directUrls: [`https://www.instagram.com/reel/${shortcode}/`],
            });

            const { items } = await apifyClient.dataset(defaultDatasetId).listItems();
            const postData = items[0];

            if (!postData) {
                return interaction.editReply("Failed to fetch the Instagram post data!");
            }

            const { caption, videoUrl } = postData;

            if (sendCaption && caption) {
                await interaction.editReply(`Caption: \n \`\`\`${caption}\`\`\``);
            }

            if (videoUrl) {
                const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
                const attachment = new AttachmentBuilder(Buffer.from(response.data), { name: 'video.mp4' });
                await interaction.followUp({ files: [attachment] });
            } else {
                await interaction.editReply("No media found in this post.");
            }
        } catch (error) {
            console.error("Error fetching Instagram post:", error);
            await interaction.editReply("Failed to fetch the Instagram post. Please try again later.");
        }
    },
};

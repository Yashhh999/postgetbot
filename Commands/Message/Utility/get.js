const { Message, PermissionFlagsBits, Client, AttachmentBuilder } = require("discord.js");
const axios = require('axios');
const { ApifyClient } = require('apify-client');

module.exports = {
    name: "get",
    description: "Get Instagram Posts",
    userPermissions: PermissionFlagsBits.SendMessages,
    botPermissions: PermissionFlagsBits.SendMessages,
    category: "Utility",
    cooldown: 5,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {String} prefix
     */
    run: async (client, message, args, prefix) => {
        if (!args[0]) return message.reply("Please provide an Instagram post URL!");
        const apifyToken = "apify_api_B0fuZn57Fi0PA7EbLs6O8cCTGC5S82009LO3";
        let instagramURL = args[0];
        message.delete();

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

        if (!shortcode) return message.reply("Invalid Instagram URL! Please provide a valid Instagram post or reel URL.");

        const apifyClient = new ApifyClient({
            token: apifyToken,
        });

        message.channel.send("Fetching Instagram post data...");

        try {
            const { defaultDatasetId } = await apifyClient.actor("apify/instagram-scraper").call({
                directUrls: [`https://www.instagram.com/reel/${shortcode}/`],
            });

            const { items } = await apifyClient.dataset(defaultDatasetId).listItems();
            const postData = items[0];

            if (!postData) return message.reply("Failed to fetch the Instagram post data!");

            const { caption, videoUrl } = postData;

            if (caption) {
                message.channel.send(`Caption: \n \`\`\`${caption}\`\`\``);
            }

            if (videoUrl) {
                const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
                const attachment = new AttachmentBuilder(Buffer.from(response.data), { name: 'video.mp4' });
                await message.channel.send({ files: [attachment] });
            } else {
                message.channel.send("No media found in this post.");
            }
        } catch (error) {
            console.error("Error fetching Instagram post:", error);
            message.reply("Failed to fetch the Instagram post. Please try again later.");
        }
    },
};

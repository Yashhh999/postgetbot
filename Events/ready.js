const { ActivityType } = require("discord.js");
const client = require("../index");

client.on("ready", (c) => {
        console.log(`> ${c.user.tag} is online!`);

        client.user.setActivity({
                name: `Your Requests | /help`,
                type: ActivityType.Watching,
        });
});

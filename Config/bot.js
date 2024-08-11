require("dotenv").config();

module.exports = {
  TOKEN:
    process.env.TOKEN || "", 
  PREFIX: process.env.PREFIX || ",",
  Slash: {
    Global: true, // set false for loading slash command in your testing guild make sure you add your server id
    GuildID: process.env.GuildID || "ID", // Your testing Server ID
  },
};

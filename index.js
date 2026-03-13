require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const quiz = require('./quiz-manager');
const commands = require('./commands');
const { handleInteraction } = require('./handlers');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.once('clientReady', async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log("Bot ready");
    } catch (error) {
        console.error("Failed to register commands:", error);
    }
});

client.on('interactionCreate', (interaction) => {
    handleInteraction(interaction, client, quiz);
});

client.login(process.env.DISCORD_TOKEN);
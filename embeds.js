const { EmbedBuilder } = require('discord.js');

const buildLeaderboard = (board) => {
    let description = "";
    board.forEach((player, i) => {
        description += `${i + 1}. ${player.name} - ${player.score} pts\n`;
    });

    if (!description) {
        description = "No scores yet.";
    }

    const embed = new EmbedBuilder();
    embed.setTitle("🏆 Quiz Night Leaderboard");
    embed.setDescription(description);
    embed.setColor(0xf1c40f);
    embed.setTimestamp();

    return embed;
};

const buildRoutes = (routes) => {
    let description = "";
    routes.forEach((r) => {
        description += `**${r.from}** ➜ ${r.to}\n`;
    });

    if (!description) {
        description = "No routes generated yet.";
    }

    const embed = new EmbedBuilder();
    embed.setTitle("📨 Answer Routing");
    embed.setDescription(description);
    embed.setColor(0x3498db);
    embed.setTimestamp();

    return embed;
};

const buildFinalResults = (board) => {
    if (!board.length) {
        const emptyEmbed = new EmbedBuilder();
        emptyEmbed.setTitle("🏁 Quiz Finished!");
        emptyEmbed.setDescription("No scores were recorded.");
        emptyEmbed.setColor(0x2ecc71);
        emptyEmbed.setTimestamp();
        return emptyEmbed;
    }

    const winner = board[0];
    let description = `👑 **Fucking nerd: ${winner.name}**\n\n`;

    board.forEach((player, i) => {
        let prefix;
        if (i === 0) {
            prefix = "🥇";
        } else if (i === 1) {
            prefix = "🥈";
        } else if (i === 2) {
            prefix = "🥉";
        } else {
            prefix = `${i + 1}.`;
        }
        description += `${prefix} ${player.name} — ${player.score} pts\n`;
    });

    const embed = new EmbedBuilder();
    embed.setTitle("🏁 Quiz Night Results");
    embed.setDescription(description);
    embed.setColor(0x2ecc71);
    embed.setTimestamp();

    return embed;
};

module.exports = { buildLeaderboard, buildRoutes, buildFinalResults };
const { EmbedBuilder } = require('discord.js');

function buildLeaderboard(board) {

    let description = "";

    board.forEach((player, i) => {
        description += `${i + 1}. ${player.name} - ${player.score}pts\n`;
    });

    if (!description) description = "No scores yet.";

    return new EmbedBuilder()
        .setTitle("🏆 Quiz Night Leaderboard")
        .setDescription(description)
        .setColor(0xf1c40f)
        .setTimestamp();
}

function buildRoutes(routes) {

    let description = "";

    routes.forEach(r => {
        description += `**${r.from}** ➜ ${r.to}\n`;
    });

    if (!description) {
        description = "No routes generated yet.";
    }

    return new EmbedBuilder()
        .setTitle("📨 Answer Routing")
        .setDescription(description)
        .setColor(0x3498db)
        .setTimestamp();
}

function buildFinalResults(board) {

    if (!board.length) {

        return new EmbedBuilder()
            .setTitle("🏁 Quiz Finished!")
            .setDescription("No scores were recorded.")
            .setColor(0x2ecc71)
            .setTimestamp();
    }

    const winner = board[0];

    let description = `👑 **Fucking nerd: ${winner.name}**\n\n`;

    board.forEach((player, i) => {

        let prefix;

        if (i === 0) {
            prefix = "🥇";
        } else if (i === 1) {
            prefix = "🥈";
        }
        else if (i === 2) {
            prefix = "🥉";
        } else {
            prefix = `${i + 1}.`;
        }

        description += `${prefix} ${player.name} — ${player.score} pts\n`;

    });

    return new EmbedBuilder()
        .setTitle("🏁 Quiz Night Results")
        .setDescription(description)
        .setColor(0x2ecc71)
        .setTimestamp();
}

module.exports = { buildLeaderboard, buildRoutes, buildFinalResults };
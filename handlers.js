const { buildLeaderboard, buildRoutes, buildFinalResults } = require('./embeds');

async function handleInteraction(interaction, client, quiz) {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (interaction.commandName === 'add-user') {

        const names = interaction.options.getString('names');
        const list = names.split(',').map(n => n.trim());

        quiz.setPendingUsers(list);

        await interaction.reply({
            content: `Got it! ${list.join(', ')} added. Use /quiz-start when you're ready.`,
            ephemeral: true
        });

        return;
    }

    if (interaction.commandName === 'quiz-start') {

        quiz.startQuiz(interaction.channelId);

        const routes = quiz.addUsers(quiz.pendingUsers);
        const channel = await client.channels.fetch(quiz.channelId);

        await interaction.reply({
            content: "Starting quiz...",
            ephemeral: true
        });

        const routingMsg = await channel.send({
            content: "Answer routing for this quiz",
            embeds: [buildRoutes(routes)]
        });

        quiz.routingMessageId = routingMsg.id;

        const leaderboardMsg = await channel.send({
            content: "Quiz started!",
            embeds: [buildLeaderboard([])]
        });

        quiz.leaderboardMessageId = leaderboardMsg.id;

        return;
    }

    if (interaction.commandName === 'quiz-score') {

        if (!quiz.active) {

            await interaction.reply({
                content: "The quiz has already ended.",
                ephemeral: true
            });

            return;
        }

        const name = interaction.options.getString('name');
        const score = interaction.options.getInteger('score');

        quiz.addScore(name, score);

        const board = quiz.getLeaderboard();
        const embed = buildLeaderboard(board);

        const channel = await client.channels.fetch(quiz.channelId);
        const message = await channel.messages.fetch(quiz.leaderboardMessageId);
        await message.edit({ embeds: [embed] });

        await interaction.reply({
            content: `${name} received ${score} points.`,
            ephemeral: true
        });

        return;
    }

    if (interaction.commandName === 'end-quiz') {

        if (!quiz.active) {

            await interaction.reply({
                content: "No quiz is currently running.",
                ephemeral: true
            });

            return;
        }

        const board = quiz.getLeaderboard();
        const embed = buildFinalResults(board);

        quiz.endQuiz();

        await interaction.reply({
            content: "🏁 The quiz has ended! Final results:",
            embeds: [embed]
        });
    }
}

module.exports = { handleInteraction };
const { buildLeaderboard, buildRoutes, buildFinalResults } = require('./embeds');

const handleInteraction = async (interaction, client, quiz) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    if (interaction.commandName === 'add-user') {
        const names = interaction.options.getString('names');
        const list = names.split(',').map((n) => n.trim());
        quiz.addUsers(guildId, list);

        await interaction.reply({
            content: `Got it! ${list.join(', ')} added. Use /quiz-start when you're ready.`,
            ephemeral: true
        });
    } else if (interaction.commandName === 'quiz-start') {
        quiz.startQuiz(guildId, channelId);

        const quizData = quiz.getQuiz(guildId);

        if (!quizData.players.length) {
            await interaction.reply({
                content: "No players have been added yet. Use /add-user first.",
                ephemeral: true
            });
            return;
        }

        const routes = quizData.routes;
        const channel = await client.channels.fetch(channelId);

        await interaction.reply({
            content: "Starting quiz...",
            ephemeral: true
        });

        const routingMsg = await channel.send({
            content: "Answer routing for this quiz",
            embeds: [buildRoutes(routes)]
        });

        quizData.routingMessageId = routingMsg.id;

        const leaderboardMsg = await channel.send({
            content: "Quiz started!",
            embeds: [buildLeaderboard([])]
        });

        quizData.leaderboardMessageId = leaderboardMsg.id;
    } else if (interaction.commandName === 'quiz-score') {
        const quizData = quiz.getQuiz(guildId);

        if (!quizData.active) {
            await interaction.reply({
                content: "The quiz has already ended.",
                ephemeral: true
            });
            return;
        }

        const name = interaction.options.getString('name');
        const score = interaction.options.getInteger('score');

        quiz.addScore(guildId, name, score);

        console.log(`[Quiz] ${interaction.user.tag} added ${score} points to ${quizData.nameMap[name.toLowerCase()] || name}`);

        const board = quiz.getLeaderboard(guildId);
        const embed = buildLeaderboard(board);

        const channel = await client.channels.fetch(quizData.channelId);
        const message = await channel.messages.fetch(quizData.leaderboardMessageId);
        await message.edit({ embeds: [embed] });

        await interaction.reply({
            content: `${quizData.nameMap[name.toLowerCase()] || name} received ${score} points.`,
            ephemeral: true
        });
    } else if (interaction.commandName === 'end-quiz') {
        const quizData = quiz.getQuiz(guildId);

        if (!quizData.active) {
            await interaction.reply({
                content: "No quiz is currently running.",
                ephemeral: true
            });
            return;
        }

        const board = quiz.getLeaderboard(guildId);
        const embed = buildFinalResults(board);

        quiz.endQuiz(guildId);

        await interaction.reply({
            content: "The quiz has ended! Final results:",
            embeds: [embed]
        });
    }
};

module.exports = { handleInteraction };
const { SlashCommandBuilder } = require('discord.js');

const commands = [

    new SlashCommandBuilder()
        .setName('quiz-start')
        .setDescription('Start the quiz and post the leaderboard'),

    new SlashCommandBuilder()
        .setName('add-user')
        .setDescription('Add quiz participants before starting')
        .addStringOption(option =>
            option
                .setName('names')
                .setDescription('Comma separated names')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('quiz-score')
        .setDescription('Add score to a player')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Player name')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('score')
                .setDescription('Score this round')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('end-quiz')
        .setDescription('End the quiz and show final results')

].map(cmd => cmd.toJSON());

module.exports = commands;
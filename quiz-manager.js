const fs = require('fs');

const DATA_FILE = './quizData.json';

let quizzes = new Map();

const loadData = () => {
    if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE);
        const parsed = JSON.parse(raw);
        quizzes = new Map(Object.entries(parsed));
    }
};

const saveData = () => {
    const obj = Object.fromEntries(quizzes);
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
};

loadData();

const capitalizeName = (name) => {
    if (!name) {
        return '';
    } else {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }
};

const getQuiz = (guildId) => {
    if (!quizzes.has(guildId)) {
        quizzes.set(guildId, {
            active: false,
            players: [],
            scores: {},
            routes: [],
            nameMap: {},
            leaderboardMessageId: null,
            routingMessageId: null,
            channelId: null
        });
        saveData();
    }
    return quizzes.get(guildId);
};

const startQuiz = (guildId, channelId) => {
    const quiz = getQuiz(guildId);
    quiz.active = true;
    quiz.channelId = channelId;
    if (!quiz.players) {
        quiz.players = [];
    }
    if (!quiz.scores) {
        quiz.scores = {};
    }
    if (!quiz.routes) {
        quiz.routes = [];
    }
    if (!quiz.nameMap) {
        quiz.nameMap = {};
    }
    saveData();
};

const addUsers = (guildId, names) => {
    const quiz = getQuiz(guildId);
    if (!quiz.nameMap) {
        quiz.nameMap = {};
    }

    const normalizedNames = names.map((name) => capitalizeName(name));

    normalizedNames.forEach((name) => {
        const key = name.toLowerCase();
        if (!quiz.nameMap[key]) {
            quiz.nameMap[key] = name;
        }
        if (!quiz.scores[key]) {
            quiz.scores[key] = 0;
        }
    });

    quiz.players = [...new Set([...quiz.players, ...normalizedNames])];

    const shuffled = [...quiz.players].sort(() => Math.random() - 0.5);
    quiz.routes = shuffled.map((name, i) => {
        return { from: name, to: shuffled[(i + 1) % shuffled.length] };
    });

    saveData();
    return quiz.routes;
};

const addScore = (guildId, name, score) => {
    const quiz = getQuiz(guildId);
    const key = name.toLowerCase();
    if (!quiz.scores[key]) {
        quiz.scores[key] = 0;
    }
    quiz.scores[key] += score;
    saveData();
};

const getLeaderboard = (guildId) => {
    const quiz = getQuiz(guildId);
    const board = Object.entries(quiz.scores)
        .map(([key, score]) => {
            return { name: quiz.nameMap[key] || key, score };
        })
        .sort((a, b) => b.score - a.score);
    return board;
};

const endQuiz = (guildId) => {
    const quiz = getQuiz(guildId);
    quiz.active = false;
    saveData();
};

module.exports = {
    getQuiz,
    startQuiz,
    addUsers,
    addScore,
    getLeaderboard,
    endQuiz
};
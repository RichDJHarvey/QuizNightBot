class QuizManager {

    constructor() {

        this.players = [];
        this.scores = {};
        this.routes = [];
        this.pendingUsers = [];

        this.channelId = null;

        this.leaderboardMessageId = null;
        this.routingMessageId = null;

        this.active = false;
    }

    setPendingUsers(names) {

        this.pendingUsers = names;
    }

    startQuiz(channelId) {

        this.players = [];
        this.scores = {};
        this.routes = [];

        this.channelId = channelId;

        this.leaderboardMessageId = null;
        this.routingMessageId = null;

        this.active = true;
    }

    endQuiz() {
        this.active = false;
    }

    addUsers(names) {

        this.players = names;

        for (const name of names) {

            if (!this.scores[name]) {
                this.scores[name] = 0;
            }
        }

        const shuffled = [...names].sort(() => Math.random() - 0.5);

        const routes = [];

        for (let i = 0; i < shuffled.length; i++) {

            const from = shuffled[i];
            const to = shuffled[(i + 1) % shuffled.length];

            routes.push({ from, to });
        }

        this.routes = routes;

        return routes;
    }

    addScore(name, score) {

        if (!this.scores[name]) {
            this.scores[name] = 0;
        }

        this.scores[name] += score;

        return this.scores[name];
    }

    getLeaderboard() {

        return Object.entries(this.scores)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score);
    }
}

module.exports = QuizManager;
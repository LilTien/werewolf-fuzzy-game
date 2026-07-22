// logic/checkWinner.js

export function checkWinner(players, isVote = true) {
    const alive = players.filter(player => player.alive);

    const werewolf = alive.find(p => p.role === "werewolf");
    const jester = alive.find(p => p.role === "jester");

    // Werewolf dies -> Villagers win
    if(alive.length < 3 && werewolf){
        return {
            gameOver: true,
            winner: "werewolf",
            reason: "werewolf won"
        };
    }

    if (!werewolf) {
        return {
            gameOver: true,
            winner: "villager",
            reason: "The Werewolf has been eliminated."
        };
    }

    // Jester dies -> Jester wins
    if (!jester && isVote) {
        return {
            gameOver: true,
            winner: "jester",
            reason: "The Jester achieved their goal."
        };
    }

    return {
        gameOver: false,
        winner: null,
        reason: null
    };
}
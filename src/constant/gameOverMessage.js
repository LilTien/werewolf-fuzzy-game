export const ROLE_TEAMS = {
    werewolf: "werewolf",
    shaman: "werewolf",

    villager: "villager",
    doctor: "villager",
    seer: "villager",
    knight: "villager",

    jester: "jester",
};

export const TEAM_NAMES = {
    werewolf: "Werewolf Team",
    villager: "Village Team",
    jester: "Jester Team",
};

export const GAME_OVER_MESSAGES = {
    werewolf: {
        win:
            "The village trusted the wrong people. By sunrise, nobody remains strong enough to stop you.",
        lose:
            "Your mask has fallen. Every villager now knows the monster hiding among them was you.",
    },

    shaman: {
        win:
            "Your dark visions guided the Werewolf toward the village's strongest defenders. The village belongs to your team.",
        lose:
            "Your only partner is dead. Without the Werewolf, the village will find you before the next sunrise.",
    },

    villager: {
        win:
            "The truth has finally been uncovered. The village is safe from the darkness.",
        lose:
            "You trusted the wrong people. The village has fallen into the hands of darkness.",
    },

    doctor: {
        win:
            "Your protection kept hope alive long enough for the village to defeat the darkness.",
        lose:
            "You tried to save everyone, but the darkness reached the village before you could stop it.",
    },

    seer: {
        win:
            "Your visions revealed the truth. The village believed you before it was too late.",
        lose:
            "You saw the truth, but the village failed to understand your warnings.",
    },

    knight: {
        win:
            "Your courage broke the darkness. The village will remember the strength of your blade.",
        lose:
            "You fought until the end, but your final strike was not enough to save the village.",
    },

    jester: {
        win:
            "They believed they were punishing you. Instead, the village gave you exactly the ending you wanted.",
        lose:
            "Chaos was within reach, but the village refused to give you the death you desired.",
    },
};

export function normalizeWinnerTeam(team) {
    if (["villager", "village", "good"].includes(team)) {
        return "villager";
    }

    if (["werewolf", "evil"].includes(team)) {
        return "werewolf";
    }

    if (team === "jester") {
        return "jester";
    }

    return team;
}

export function getGameOverMessage(role, didWin) {
    const roleMessages =
        GAME_OVER_MESSAGES[role] ??
        GAME_OVER_MESSAGES.villager;

    return didWin
        ? roleMessages.win
        : roleMessages.lose;
}
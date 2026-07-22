

export const npcVote = (npc) => { 
    let highest = -1; 
    let targetId = null; 
    for (const player of Object.values(npc.relations)) { 
        if (player.suspicion > highest) { 
            highest = player.suspicion; 
            targetId = player.playerId; } 
        } 
    return targetId; 
};


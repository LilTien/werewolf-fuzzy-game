export const getMostSuspicious = (npc, players) => {
    let target = null;
    let highest = -1;

    for (const [id, relation] of Object.entries(npc.relations)) {
        const player = players.find(p => p.id === Number(id));

        if (!player) continue;
        if (!player.alive) continue;
        if (player.id === npc.id) continue;

        if (relation.suspicion > highest) {
            highest = relation.suspicion;
            target = player;
        }
    }

    return target;
};

export const getMostTrusted = (npc, players) => {
    let target = null;
    let lowest = Infinity;

    for (const [id, relation] of Object.entries(npc.relations)) {
        const player = players.find(p => p.id === Number(id));

        if (!player) continue;
        if (!player.alive) continue;

        if (relation.suspicion < lowest) {
            lowest = relation.suspicion;
            target = player;
        }
    }

    return target;
};
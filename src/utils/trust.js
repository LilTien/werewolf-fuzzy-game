import {
    calculateFuzzyTrust,
} from "@/logic/fuzzyLogic";

function clamp(
    value,
    minimum = 0,
    maximum = 100
) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return minimum;
    }

    return Math.max(
        minimum,
        Math.min(maximum, number)
    );
}

function getFuzzyInputs(relation = {}) {
    return {
        suspicion: clamp(
            relation.suspicion ?? 0
        ),

        voteErraticness: clamp(
            relation.voteErraticness ??
            relation.voteErratic ??
            0
        ),

        previousLies: clamp(
            relation.previousLies ??
            relation.lies ??
            0
        ),

        aggression: clamp(
            relation.aggression ??
            relation.aggressionBehaviour ??
            relation.aggressionBehavior ??
            0
        ),
    };
}

/**
 * Returns the unrounded trust value when
 * trustZ is available.
 *
 * Your fuzzy system calculates:
 *
 * finalTrust = 100 - trustZ
 */
function calculateRelationTrust(
    relation
) {
    const result =
        calculateFuzzyTrust(
            getFuzzyInputs(relation)
        );

    const trustZ =
        Number(result.trustZ);

    if (Number.isFinite(trustZ)) {
        return clamp(
            100 - trustZ
        );
    }

    return clamp(
        result.finalTrust
    );
}

/**
 * Find the living player that this NPC
 * trusts the least.
 *
 * Lower trust = more suspicious.
 */
export const getMostSuspicious = (
    npc,
    players
) => {
    let target = null;
    let lowestTrust = Infinity;

    const relations =
        npc?.relations ?? {};

    for (const [id, relation] of Object.entries(
        relations
    )) {
        const targetId =
            Number(id);

        const player =
            players.find(
                (candidate) =>
                    Number(candidate.id) ===
                    targetId
            );

        if (!player) continue;
        if (!player.alive) continue;

        if (
            Number(player.id) ===
            Number(npc.id)
        ) {
            continue;
        }

        const trust =
            calculateRelationTrust(
                relation
            );

        if (trust < lowestTrust) {
            lowestTrust = trust;
            target = player;
        }
    }

    return target;
};

/**
 * Find the living player that this NPC
 * trusts the most.
 *
 * Higher trust = more trusted.
 */
export const getMostTrusted = (
    npc,
    players
) => {
    let target = null;
    let highestTrust = -Infinity;

    const relations =
        npc?.relations ?? {};

    for (const [id, relation] of Object.entries(
        relations
    )) {
        const targetId =
            Number(id);

        const player =
            players.find(
                (candidate) =>
                    Number(candidate.id) ===
                    targetId
            );

        if (!player) continue;
        if (!player.alive) continue;

        if (
            Number(player.id) ===
            Number(npc.id)
        ) {
            continue;
        }

        const trust =
            calculateRelationTrust(
                relation
            );

        if (trust > highestTrust) {
            highestTrust = trust;
            target = player;
        }
    }

    return target;
};
// logic/npcVoting.js

import {
    calculateFuzzyTrust,
} from "@/logic/fuzzyLogic";

function clamp(value) {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(100, numberValue)
    );
}

/**
 * Get how the NPC currently sees a target.
 *
 * relations should look similar to:
 *
 * relations: {
 *   2: {
 *      suspicion: 70,
 *      voteErraticness: 40,
 *      previousLies: 55,
 *      aggression: 30
 *   }
 * }
 */
function getTargetInputs(
    npc,
    targetId
) {
    const relation =
        npc.relations?.[targetId] ??
        npc.relations?.[String(targetId)];

    if (!relation) {
        return null;
    }

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

function selectRandomTarget(
    candidates
) {
    if (candidates.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(
        Math.random() *
        candidates.length
    );

    return candidates[randomIndex].id;
}

export function npcVote(
    npc,
    players
) {
    const candidates = players.filter(
        (player) =>
            player.alive &&
            player.id !== npc.id
    );

    if (candidates.length === 0) {
        return null;
    }

    const evaluatedCandidates =
        candidates
            .map((candidate) => {
                const inputs =
                    getTargetInputs(
                        npc,
                        candidate.id
                    );

                /*
                 * No relationship data means the NPC cannot
                 * make a fuzzy decision about this player yet.
                 */
                if (!inputs) {
                    return null;
                }

                const fuzzyResult =
                    calculateFuzzyTrust(
                        inputs
                    );

                return {
                    player: candidate,
                    inputs,
                    trust:
                        fuzzyResult.finalTrust,
                    directive:
                        fuzzyResult.directive,
                    firedRules:
                        fuzzyResult.firedRules,
                };
            })
            .filter(Boolean);

    /*
     * If the NPC has no relationship data for anyone,
     * select a random living target.
     */
    if (
        evaluatedCandidates.length === 0
    ) {
        return selectRandomTarget(
            candidates
        );
    }

    const lowestTrust = Math.min(
        ...evaluatedCandidates.map(
            (candidate) =>
                candidate.trust
        )
    );

    /*
     * Multiple candidates can have the same trust.
     */
    const lowestTrustCandidates =
        evaluatedCandidates.filter(
            (candidate) =>
                candidate.trust ===
                lowestTrust
        );

    /*
     * Tie breaker:
     * choose the player with the highest raw suspicion.
     */
    const highestSuspicion =
        Math.max(
            ...lowestTrustCandidates.map(
                (candidate) =>
                    candidate.inputs.suspicion
            )
        );

    const finalCandidates =
        lowestTrustCandidates.filter(
            (candidate) =>
                candidate.inputs.suspicion ===
                highestSuspicion
        );

    /*
     * If trust and suspicion are still tied,
     * choose randomly so NPC voting does not
     * always prefer the first array entry.
     */
    const selected =
        finalCandidates[
            Math.floor(
                Math.random() *
                finalCandidates.length
            )
        ];

    console.log(
        `${npc.name} fuzzy voting decision:`,
        {
            target:
                selected.player.name,
            targetId:
                selected.player.id,
            trust:
                selected.trust,
            directive:
                selected.directive,
            inputs:
                selected.inputs,
        }
    );

    return selected.player.id;
}
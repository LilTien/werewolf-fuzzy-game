import {
    calculateFuzzyTrust,
} from "@/logic/fuzzyLogic";

function clamp(
    value,
    minimum = 0,
    maximum = 100
) {
    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return minimum;
    }

    return Math.max(
        minimum,
        Math.min(maximum, number)
    );
}

function getRelation(
    npc,
    targetId
) {
    return (
        npc.relations?.[targetId] ??
        npc.relations?.[
            String(targetId)
        ] ??
        null
    );
}

/**
 * Return how this specific NPC sees
 * the selected target.
 *
 * Missing relationship data uses neutral
 * starting values instead of removing the
 * candidate from voting.
 */
function getTargetInputs(
    npc,
    targetId
) {
    const relation =
        getRelation(
            npc,
            targetId
        );

    return {
        suspicion: clamp(
            relation?.suspicion ?? 0
        ),

        voteErraticness: clamp(
            relation?.voteErraticness ??
            relation?.voteErratic ??
            0
        ),

        previousLies: clamp(
            relation?.previousLies ??
            relation?.lies ??
            0
        ),

        aggression: clamp(
            relation?.aggression ??
            relation?.aggressionBehaviour ??
            relation?.aggressionBehavior ??
            0
        ),

        hasRelation:
            Boolean(relation),
    };
}

/**
 * A secondary comparison value.
 *
 * The fuzzy trust result remains the main
 * decision. This is only used when two
 * candidates have approximately equal trust.
 */
function calculateBehaviourRisk(
    inputs
) {
    return (
        inputs.suspicion +
        inputs.voteErraticness +
        inputs.previousLies +
        inputs.aggression
    ) / 4;
}

/**
 * finalTrust may be rounded by the fuzzy
 * function. If trustZ is available, rebuild
 * the unrounded trust value:
 *
 * final trust = 100 - trustZ
 */
function getComparableTrust(
    fuzzyResult
) {
    const trustZ =
        Number(
            fuzzyResult.trustZ
        );

    if (
        Number.isFinite(trustZ)
    ) {
        return clamp(
            100 - trustZ
        );
    }

    return clamp(
        fuzzyResult.finalTrust
    );
}

function chooseRandom(
    candidates
) {
    if (!candidates.length) {
        return null;
    }

    const index =
        Math.floor(
            Math.random() *
            candidates.length
        );

    return candidates[index];
}

export function npcVote(
    npc,
    players
) {
    if (!npc?.alive) {
        return null;
    }

    const candidates =
        players.filter(
            (player) =>
                player.alive &&
                Number(player.id) !==
                    Number(npc.id)
        );

    if (!candidates.length) {
        return null;
    }

    const evaluatedCandidates =
        candidates.map(
            (candidate) => {
                const inputs =
                    getTargetInputs(
                        npc,
                        candidate.id
                    );

                const fuzzyResult =
                    calculateFuzzyTrust({
                        suspicion:
                            inputs.suspicion,

                        voteErraticness:
                            inputs.voteErraticness,

                        previousLies:
                            inputs.previousLies,

                        aggression:
                            inputs.aggression,
                    });

                const finalTrust =
                    clamp(
                        fuzzyResult.finalTrust
                    );

                const comparableTrust =
                    getComparableTrust(
                        fuzzyResult
                    );

                const behaviourRisk =
                    calculateBehaviourRisk(
                        inputs
                    );

                return {
                    player:
                        candidate,

                    inputs,

                    finalTrust,

                    comparableTrust,

                    behaviourRisk,

                    directive:
                        fuzzyResult.directive,

                    trustZ:
                        fuzzyResult.trustZ,

                    firedRules:
                        fuzzyResult.firedRules,
                };
            }
        );

    /*
     * Show exactly what this NPC sees.
     *
     * This is useful because every NPC has
     * different relationship values.
     */
    console.table(
        evaluatedCandidates.map(
            (candidate) => ({
                npc:
                    npc.name,

                target:
                    candidate.player.name,

                suspicion:
                    candidate.inputs
                        .suspicion,

                voteErraticness:
                    candidate.inputs
                        .voteErraticness,

                previousLies:
                    candidate.inputs
                        .previousLies,

                aggression:
                    candidate.inputs
                        .aggression,

                behaviourRisk:
                    candidate.behaviourRisk
                        .toFixed(2),

                finalTrust:
                    candidate.finalTrust,

                rawTrust:
                    candidate.comparableTrust
                        .toFixed(2),

                directive:
                    candidate.directive,

                hasRelation:
                    candidate.inputs
                        .hasRelation,
            })
        )
    );

    /*
     * Main rule:
     *
     * Lower trust means a more likely
     * voting target.
     */
    const lowestTrust =
        Math.min(
            ...evaluatedCandidates.map(
                (candidate) =>
                    candidate.comparableTrust
            )
        );

    /*
     * A small tolerance avoids floating-point
     * comparison problems.
     */
    const trustTolerance =
        0.001;

    const lowestTrustCandidates =
        evaluatedCandidates.filter(
            (candidate) =>
                Math.abs(
                    candidate.comparableTrust -
                    lowestTrust
                ) <= trustTolerance
        );

    /*
     * Tie-break using all four behaviours,
     * rather than suspicion alone.
     */
    const highestBehaviourRisk =
        Math.max(
            ...lowestTrustCandidates.map(
                (candidate) =>
                    candidate.behaviourRisk
            )
        );

    const riskTolerance =
        0.001;

    const finalCandidates =
        lowestTrustCandidates.filter(
            (candidate) =>
                Math.abs(
                    candidate.behaviourRisk -
                    highestBehaviourRisk
                ) <= riskTolerance
        );

    /*
     * Random only when trust and combined
     * behaviour risk are both tied.
     */
    const selected =
        chooseRandom(
            finalCandidates
        );

    if (!selected) {
        return null;
    }

    console.log(
        `${npc.name} fuzzy voting decision:`,
        {
            target:
                selected.player.name,

            targetId:
                selected.player.id,

            finalTrust:
                selected.finalTrust,

            comparableTrust:
                selected.comparableTrust,

            directive:
                selected.directive,

            behaviourRisk:
                selected.behaviourRisk,

            inputs:
                selected.inputs,
        }
    );

    return selected.player.id;
}
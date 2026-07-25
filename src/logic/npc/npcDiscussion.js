import {
    calculateFuzzyTrust,
} from "@/logic/fuzzyLogic";

const DANGER_PRIORITY = {
    EXECUTE: 2,
    OBSERVE: 1,
};

function getRelation(npc, targetId) {
    return (
        npc.relations?.[targetId] ??
        npc.relations?.[String(targetId)] ??
        {}
    );
}

function randomItem(items) {
    return items[
        Math.floor(Math.random() * items.length)
    ];
}

export function pickRandomNpcSpeakers(
    players,
    count = 3
) {
    const availableNpcs = players.filter(
        (player) =>
            player.alive &&
            !player.isHuman
    );

    const shuffled = [...availableNpcs];

    /*
     * Fisher-Yates shuffle.
     */
    for (
        let index = shuffled.length - 1;
        index > 0;
        index--
    ) {
        const randomIndex = Math.floor(
            Math.random() * (index + 1)
        );

        [
            shuffled[index],
            shuffled[randomIndex],
        ] = [
            shuffled[randomIndex],
            shuffled[index],
        ];
    }

    return shuffled.slice(
        0,
        Math.min(count, shuffled.length)
    );
}

export function chooseNpcDiscussionAction(
    npc,
    players
) {
    const possibleTargets = players.filter(
        (player) =>
            player.alive &&
            player.id !== npc.id
    );

    if (possibleTargets.length === 0) {
        return null;
    }

    const evaluations =
        possibleTargets.map((target) => {
            const relation = getRelation(
                npc,
                target.id
            );

            const fuzzy =
                calculateFuzzyTrust({
                    suspicion:
                        relation.suspicion ?? 0,

                    voteErraticness:
                        relation.voteErraticness ??
                        0,

                    previousLies:
                        relation.previousLies ?? 0,

                    aggression:
                        relation.aggression ?? 0,
                });

            return {
                target,
                relation,
                trust:
                    fuzzy.finalTrust,
                directive:
                    fuzzy.directive,
            };
        });

    /*
     * EXECUTE and OBSERVE targets take priority
     * over trusted players.
     */
    const dangerousTargets =
        evaluations.filter(
            (evaluation) =>
                evaluation.directive ===
                    "EXECUTE" ||
                evaluation.directive ===
                    "OBSERVE"
        );

    if (dangerousTargets.length > 0) {
        dangerousTargets.sort(
            (first, second) => {
                const priorityDifference =
                    DANGER_PRIORITY[
                        second.directive
                    ] -
                    DANGER_PRIORITY[
                        first.directive
                    ];

                if (
                    priorityDifference !== 0
                ) {
                    return priorityDifference;
                }

                /*
                 * Lower trust means a more dangerous
                 * accusation target.
                 */
                if (
                    first.trust !==
                    second.trust
                ) {
                    return (
                        first.trust -
                        second.trust
                    );
                }

                return (
                    Number(
                        second.relation
                            .suspicion
                    ) -
                    Number(
                        first.relation
                            .suspicion
                    )
                );
            }
        );

        const chosen =
            dangerousTargets[0];

        return {
            type: "accuse",
            target: chosen.target,
            trust: chosen.trust,
            directive:
                chosen.directive,
        };
    }

    /*
     * No dangerous target exists, so defend
     * the most trusted player.
     */
    evaluations.sort(
        (first, second) => {
            if (
                first.trust !== second.trust
            ) {
                return (
                    second.trust -
                    first.trust
                );
            }

            return (
                Number(
                    first.relation.suspicion
                ) -
                Number(
                    second.relation.suspicion
                )
            );
        }
    );

    const chosen = evaluations[0];

    return {
        type: "defend",
        target: chosen.target,
        trust: chosen.trust,
        directive:
            chosen.directive,
    };
}

export function buildNpcStatement({
    speaker,
    target,
    type,
    directive,
}) {
    if (type === "accuse") {
        const executeMessages = [
            `I don't trust ${target.name}. We should vote them out.`,
            `${target.name}'s behaviour is too suspicious to ignore.`,
            `Something is wrong with ${target.name}. I think they are hiding something.`,
        ];

        const observeMessages = [
            `${target.name}'s story does not add up.`,
            `We should keep an eye on ${target.name}.`,
            `I am not convinced by ${target.name}.`,
        ];

        return directive === "EXECUTE"
            ? randomItem(executeMessages)
            : randomItem(observeMessages);
    }

    const defendMessages = [
        `${target.name} has been consistent. I trust them.`,
        `I don't think ${target.name} is our enemy.`,
        `${target.name} has given me no reason to suspect them.`,
    ];

    return randomItem(defendMessages);
}

export function buildSelfDefenceStatement({
    accused,
    accuser,
}) {
    const messages = [
        `That is not true, ${accuser.name}. You have no proof.`,
        `Why are you accusing me, ${accuser.name}? I have done nothing wrong.`,
        `You are making a mistake. I am not your enemy.`,
        `This accusation makes no sense. Look at someone else.`,
    ];

    return randomItem(messages);
}
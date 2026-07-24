// logic/fuzzyLogic.js

function triMF(x, a, b, c) {
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x < b) return (x - a) / (b - a);

    return (c - x) / (c - b);
}

function fuzzify(value) {
    const low =
        value <= 30
            ? 1
            : value >= 60
            ? 0
            : (60 - value) / 30;

    const med = triMF(value, 30, 50, 70);

    const high =
        value <= 40
            ? 0
            : value >= 70
            ? 1
            : (value - 40) / 30;

    return {
        low,
        med,
        high,
    };
}

const LEVELS = [
    "low",
    "med",
    "high",
];

const LEVEL_SCORE = {
    low: 0,
    med: 1,
    high: 2,
};

function decideOutput(
    suspicionLevel,
    voteLevel,
    liesLevel,
    aggressionLevel
) {
    const total =
        LEVEL_SCORE[suspicionLevel] * 1.2 +
        LEVEL_SCORE[voteLevel] * 1.0 +
        LEVEL_SCORE[liesLevel] * 1.1 +
        LEVEL_SCORE[aggressionLevel] * 0.9;

    const maxTotal =
        2 * (1.2 + 1.0 + 1.1 + 0.9);

    const ratio = total / maxTotal;

    if (ratio >= 0.62) {
        return "execute";
    }

    if (ratio >= 0.34) {
        return "observe";
    }

    return "alliance";
}

function buildRuleMatrix() {
    const rules = [];

    for (const suspicionLevel of LEVELS) {
        for (const voteLevel of LEVELS) {
            for (const liesLevel of LEVELS) {
                for (const aggressionLevel of LEVELS) {
                    const output = decideOutput(
                        suspicionLevel,
                        voteLevel,
                        liesLevel,
                        aggressionLevel
                    );

                    rules.push({
                        label:
                            `IF Sus is ${suspicionLevel.toUpperCase()} ` +
                            `AND Vote is ${voteLevel.toUpperCase()} ` +
                            `AND Lies is ${liesLevel.toUpperCase()} ` +
                            `AND Beh is ${aggressionLevel.toUpperCase()}`,

                        sLevel: suspicionLevel,
                        vLevel: voteLevel,
                        lLevel: liesLevel,
                        bLevel: aggressionLevel,
                        output,
                    });
                }
            }
        }
    }

    return rules;
}

export const RULE_MATRIX =
    buildRuleMatrix();

function clampInput(value) {
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
 * Normal JavaScript function.
 *
 * This can be called from React components,
 * NPC logic, voting logic and night logic.
 */
export function calculateFuzzyTrust({
    suspicion = 0,
    voteErraticness = 0,
    previousLies = 0,
    aggression = 0,
}) {
    const S = fuzzify(
        clampInput(suspicion)
    );

    const V = fuzzify(
        clampInput(voteErraticness)
    );

    const L = fuzzify(
        clampInput(previousLies)
    );

    const B = fuzzify(
        clampInput(aggression)
    );

    const membershipMap = {
        S,
        V,
        L,
        B,
    };

    const evaluatedRules =
        RULE_MATRIX.map((rule) => {
            const weight = Math.min(
                membershipMap.S[rule.sLevel],
                membershipMap.V[rule.vLevel],
                membershipMap.L[rule.lLevel],
                membershipMap.B[rule.bLevel]
            );

            return {
                ...rule,
                weight,
            };
        });

    const executeClipped = Math.max(
        0,
        ...evaluatedRules
            .filter(
                (rule) =>
                    rule.output === "execute"
            )
            .map((rule) => rule.weight)
    );

    const observeClipped = Math.max(
        0,
        ...evaluatedRules
            .filter(
                (rule) =>
                    rule.output === "observe"
            )
            .map((rule) => rule.weight)
    );

    const allianceClipped = Math.max(
        0,
        ...evaluatedRules
            .filter(
                (rule) =>
                    rule.output === "alliance"
            )
            .map((rule) => rule.weight)
    );

    const EXECUTE_CENTER = 85;
    const OBSERVE_CENTER = 55;
    const ALLIANCE_CENTER = 20;

    const numerator =
        executeClipped * EXECUTE_CENTER +
        observeClipped * OBSERVE_CENTER +
        allianceClipped * ALLIANCE_CENTER;

    const denominator =
        executeClipped +
        observeClipped +
        allianceClipped;

    const trustZ =
        denominator > 0
            ? numerator / denominator
            : 0;

    // Lower value means less trustworthy.
    const finalTrust = Math.max(
        0,
        Math.min(
            100,
            Math.round(100 - trustZ)
        )
    );

    let directive = "OBSERVE";

    if (
        executeClipped >= observeClipped &&
        executeClipped >= allianceClipped
    ) {
        directive = "EXECUTE";
    } else if (
        allianceClipped > observeClipped &&
        allianceClipped > executeClipped
    ) {
        directive = "ALLIANCE";
    }

    const firedRules = evaluatedRules
        .filter((rule) => rule.weight > 0)
        .sort(
            (first, second) =>
                second.weight - first.weight
        );

    return {
        memberships: {
            S,
            V,
            L,
            B,
        },

        allRules: evaluatedRules,
        firedRules,

        clipped: {
            executeClipped,
            observeClipped,
            allianceClipped,
        },

        trustZ,
        finalTrust,
        directive,
    };
}
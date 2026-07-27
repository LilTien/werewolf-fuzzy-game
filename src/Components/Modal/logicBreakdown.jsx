import React, {
    useEffect,
    useMemo,
} from "react";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const INPUTS = [
    {
        label: "Suspicion",
        valueKey: "suspicion",
        membershipKey: "S",
    },
    {
        label: "Vote Erraticness",
        valueKey: "voteErraticness",
        membershipKey: "V",
    },
    {
        label: "Previous Lies",
        valueKey: "previousLies",
        membershipKey: "L",
    },
    {
        label: "Aggression",
        valueKey: "aggression",
        membershipKey: "B",
    },
];

const LEVELS = [
    {
        key: "low",
        label: "Low",
    },
    {
        key: "medium",
        label: "Medium",
    },
    {
        key: "high",
        label: "High",
    },
];

const OUTPUTS = [
    {
        key: "low",
        label: "Alliance",
        color: "#91b563",
    },
    {
        key: "medium",
        label: "Observe",
        color: "#d5a35c",
    },
    {
        key: "high",
        label: "Execute",
        color: "#c85c50",
    },
];

const STRENGTH_KEYS = [
    "firingStrength",
    "fireStrength",
    "strength",
    "alpha",
    "activation",
    "degree",
    "weight",
    "mu",
    "minValue",
];

/* -------------------------------------------------------------------------- */
/* General helpers                                                            */
/* -------------------------------------------------------------------------- */

function clamp(
    value,
    minimum = 0,
    maximum = 1
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

function format(
    value,
    digits = 2
) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return Number(0).toFixed(digits);
    }

    return number.toFixed(digits);
}

function normalizeDegree(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return null;
    }

    return number > 1
        ? clamp(number / 100)
        : clamp(number);
}

/* -------------------------------------------------------------------------- */
/* Membership helpers                                                         */
/* -------------------------------------------------------------------------- */

function getMembership(
    membership,
    level
) {
    if (!membership) {
        return 0;
    }

    const aliases = {
        low: [
            "low",
            "LOW",
            "Low",
        ],

        medium: [
            "medium",
            "med",
            "MEDIUM",
            "MED",
            "Medium",
            "Med",
        ],

        high: [
            "high",
            "HIGH",
            "High",
        ],
    };

    const matchingKey =
        aliases[level].find(
            (key) =>
                membership[key] !==
                undefined
        );

    if (!matchingKey) {
        return 0;
    }

    return (
        normalizeDegree(
            membership[matchingKey]
        ) ?? 0
    );
}

/* -------------------------------------------------------------------------- */
/* Rule helpers                                                               */
/* -------------------------------------------------------------------------- */

function extractStrength(
    value,
    depth = 0
) {
    if (
        !value ||
        typeof value !== "object" ||
        depth > 3
    ) {
        return null;
    }

    for (const key of STRENGTH_KEYS) {
        const strength =
            normalizeDegree(
                value[key]
            );

        if (strength !== null) {
            return strength;
        }
    }

    const nestedValues = [
        value.rule,
        value.result,
        value.evaluation,
        value.activationResult,
    ];

    for (const nested of nestedValues) {
        const strength =
            extractStrength(
                nested,
                depth + 1
            );

        if (strength !== null) {
            return strength;
        }
    }

    return null;
}

function extractOutput(rule) {
    const output =
        rule?.output ??
        rule?.consequent ??
        rule?.result?.output ??
        rule?.result ??
        rule?.directive ??
        rule?.rule?.output ??
        rule?.rule?.consequent ??
        "Unknown";

    if (
        output &&
        typeof output === "object"
    ) {
        return String(
            output.label ??
            output.name ??
            output.value ??
            output.term ??
            "Unknown"
        );
    }

    return String(output);
}

function getRuleValue(
    source,
    keys
) {
    for (const key of keys) {
        if (
            source[key] !== undefined &&
            source[key] !== null
        ) {
            return source[key];
        }
    }

    return null;
}

function buildRuleText(
    rule,
    output
) {
    const existingText =
        rule.text ??
        rule.description ??
        rule.ruleText ??
        rule.statement;

    if (existingText) {
        return existingText;
    }

    if (
        typeof rule.rule === "string"
    ) {
        return rule.rule;
    }

    const source =
        rule.rule &&
        typeof rule.rule === "object"
            ? {
                  ...rule.rule,
                  ...rule,
              }
            : rule;

    const conditions = [
        [
            "Suspicion",
            getRuleValue(
                source,
                [
                    "suspicion",
                    "S",
                ]
            ),
        ],
        [
            "Vote Erraticness",
            getRuleValue(
                source,
                [
                    "voteErraticness",
                    "vote",
                    "V",
                ]
            ),
        ],
        [
            "Previous Lies",
            getRuleValue(
                source,
                [
                    "previousLies",
                    "lies",
                    "L",
                ]
            ),
        ],
        [
            "Aggression",
            getRuleValue(
                source,
                [
                    "aggression",
                    "behaviour",
                    "B",
                ]
            ),
        ],
    ].filter(
        ([, value]) =>
            value !== null
    );

    if (!conditions.length) {
        return `Rule produces ${output}`;
    }

    return (
        `IF ${conditions
            .map(
                ([name, value]) =>
                    `${name} is ${String(
                        value
                    ).toUpperCase()}`
            )
            .join(" AND ")} ` +
        `THEN ${output.toUpperCase()}`
    );
}

function normalizeRule(
    rawRule,
    index
) {
    const source =
        rawRule &&
        typeof rawRule === "object"
            ? rawRule
            : {};

    const output =
        extractOutput(source);

    return {
        id:
            source.id ??
            source.ruleId ??
            source.code ??
            source.rule?.id ??
            `R${index + 1}`,

        output,

        strength:
            extractStrength(source),

        text:
            buildRuleText(
                source,
                output
            ),
    };
}

function getOutputBucket(output) {
    const value = String(
        output ?? ""
    ).toLowerCase();

    if (
        value.includes("alliance") ||
        value.includes("high trust") ||
        value.includes("low risk") ||
        value === "low"
    ) {
        return "low";
    }

    if (
        value.includes("observe") ||
        value.includes("medium") ||
        value.includes("moderate") ||
        value === "med"
    ) {
        return "medium";
    }

    if (
        value.includes("execute") ||
        value.includes("low trust") ||
        value.includes("high risk") ||
        value.includes("danger") ||
        value === "high"
    ) {
        return "high";
    }

    return null;
}

/* -------------------------------------------------------------------------- */
/* Clip helpers                                                               */
/* -------------------------------------------------------------------------- */

function extractScalar(value) {
    const direct =
        normalizeDegree(value);

    if (direct !== null) {
        return direct;
    }

    if (Array.isArray(value)) {
        const numbers = value
            .map(extractScalar)
            .filter(
                (item) =>
                    item !== null
            );

        return numbers.length
            ? Math.max(...numbers)
            : null;
    }

    if (
        value &&
        typeof value === "object"
    ) {
        const keys = [
            "clip",
            "height",
            "value",
            "strength",
            "alpha",
            "maximum",
            "max",
        ];

        for (const key of keys) {
            const number =
                extractScalar(
                    value[key]
                );

            if (number !== null) {
                return number;
            }
        }
    }

    return null;
}

function findClip(
    clipped,
    aliases
) {
    const containers = [
        clipped,
        clipped?.output,
        clipped?.outputs,
        clipped?.clips,
        clipped?.clipped,
    ].filter(Boolean);

    for (const container of containers) {
        for (const alias of aliases) {
            if (
                container[alias] ===
                undefined
            ) {
                continue;
            }

            const value =
                extractScalar(
                    container[alias]
                );

            if (value !== null) {
                return value;
            }
        }
    }

    return 0;
}

function getClipValues(
    clipped,
    rules
) {
    const clips = {
        low: findClip(
            clipped,
            [
                "low",
                "LOW",
                "alliance",
                "ALLIANCE",
            ]
        ),

        medium: findClip(
            clipped,
            [
                "medium",
                "med",
                "MEDIUM",
                "MED",
                "observe",
                "OBSERVE",
            ]
        ),

        high: findClip(
            clipped,
            [
                "high",
                "HIGH",
                "execute",
                "EXECUTE",
            ]
        ),
    };

    const hasClips =
        Object.values(clips).some(
            (value) => value > 0
        );

    if (hasClips) {
        return clips;
    }

    rules.forEach((rule) => {
        if (
            rule.strength === null
        ) {
            return;
        }

        const bucket =
            getOutputBucket(
                rule.output
            );

        if (!bucket) {
            return;
        }

        clips[bucket] =
            Math.max(
                clips[bucket],
                rule.strength
            );
    });

    return clips;
}

/* -------------------------------------------------------------------------- */
/* Output membership functions                                                */
/* -------------------------------------------------------------------------- */

function trapezoidMF(
    x,
    a,
    b,
    c,
    d
) {
    if (x < a || x > d) {
        return 0;
    }

    if (x >= b && x <= c) {
        return 1;
    }

    if (x >= a && x < b) {
        return a === b
            ? 1
            : (x - a) /
              (b - a);
    }

    if (x > c && x <= d) {
        return c === d
            ? 1
            : (d - x) /
              (d - c);
    }

    return 0;
}

function triangleMF(
    x,
    a,
    b,
    c
) {
    if (x <= a || x >= c) {
        return 0;
    }

    if (x === b) {
        return 1;
    }

    return x < b
        ? (x - a) / (b - a)
        : (c - x) / (c - b);
}

function getOutputMemberships(x) {
    return {
        low: trapezoidMF(
            x,
            0,
            0,
            30,
            60
        ),

        medium: triangleMF(
            x,
            30,
            50,
            70
        ),

        high: trapezoidMF(
            x,
            40,
            70,
            100,
            100
        ),
    };
}

/* -------------------------------------------------------------------------- */
/* Aggregation and centroid                                                   */
/* -------------------------------------------------------------------------- */

function buildLocalSurface(clips) {
    const samples = [];

    let numerator = 0;
    let denominator = 0;

    for (
        let z = 0;
        z <= 100;
        z += 1
    ) {
        const base =
            getOutputMemberships(z);

        const low =
            Math.min(
                base.low,
                clips.low
            );

        const medium =
            Math.min(
                base.medium,
                clips.medium
            );

        const high =
            Math.min(
                base.high,
                clips.high
            );

        const aggregated =
            Math.max(
                low,
                medium,
                high
            );

        samples.push({
            z,

            baseLow:
                base.low,

            baseMedium:
                base.medium,

            baseHigh:
                base.high,

            low,
            medium,
            high,
            aggregated,
        });

        numerator +=
            z * aggregated;

        denominator +=
            aggregated;
    }

    return {
        samples,
        numerator,
        denominator,

        centroid:
            denominator > 0
                ? numerator /
                  denominator
                : 0,
    };
}

function buildExactSurface(
    localSurface,
    defuzzification
) {
    const exactSamples =
        defuzzification?.samples;

    if (
        !Array.isArray(exactSamples) ||
        !exactSamples.length
    ) {
        return localSurface;
    }

    const samples =
        exactSamples.map(
            (sample, index) => {
                const z =
                    Number(
                        sample.z ??
                        sample.x ??
                        index
                    );

                const aggregated =
                    normalizeDegree(
                        sample.mu ??
                        sample.membership ??
                        sample.aggregated ??
                        sample.value
                    ) ?? 0;

                const local =
                    localSurface.samples.find(
                        (item) =>
                            item.z === z
                    );

                return {
                    ...(local ?? {
                        z,
                        baseLow: 0,
                        baseMedium: 0,
                        baseHigh: 0,
                        low: 0,
                        medium: 0,
                        high: 0,
                    }),

                    z,
                    aggregated,
                };
            }
        );

    const calculatedNumerator =
        samples.reduce(
            (total, sample) =>
                total +
                sample.z *
                    sample.aggregated,
            0
        );

    const calculatedDenominator =
        samples.reduce(
            (total, sample) =>
                total +
                sample.aggregated,
            0
        );

    const numerator =
        Number.isFinite(
            Number(
                defuzzification?.numerator
            )
        )
            ? Number(
                  defuzzification.numerator
              )
            : calculatedNumerator;

    const denominator =
        Number.isFinite(
            Number(
                defuzzification?.denominator
            )
        )
            ? Number(
                  defuzzification.denominator
              )
            : calculatedDenominator;

    return {
        samples,
        numerator,
        denominator,

        centroid:
            denominator > 0
                ? numerator /
                  denominator
                : 0,
    };
}

/* -------------------------------------------------------------------------- */
/* UI components                                                              */
/* -------------------------------------------------------------------------- */

function SectionTitle({
    number,
    children,
}) {
    return (
        <div
            className="
                mb-3
                flex
                items-center
                gap-2
                border-b
                border-[#714333]
                pb-2
            "
        >
            <span
                className="
                    flex
                    h-7
                    w-8
                    items-center
                    justify-center
                    bg-[#914f29]
                    font-mono
                    text-[8px]
                    font-bold
                    text-[#ffe0aa]
                "
            >
                {number}
            </span>

            <h2
                className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-[#f2d19c]
                "
            >
                {children}
            </h2>
        </div>
    );
}

function MembershipCard({
    input,
    values,
    memberships,
}) {
    const value =
        values[input.valueKey] ?? 0;

    const membership =
        memberships[
            input.membershipKey
        ];

    return (
        <div
            className="
                border
                border-[#633b2f]
                bg-black/15
                p-3
            "
        >
            <div
                className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    gap-2
                "
            >
                <span
                    className="
                        truncate
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-[#b89572]
                    "
                >
                    {input.label}
                </span>

                <strong
                    className="
                        font-mono
                        text-[10px]
                        text-white
                    "
                >
                    {value}
                </strong>
            </div>

            <div className="space-y-1.5">
                {LEVELS.map((level) => {
                    const degree =
                        getMembership(
                            membership,
                            level.key
                        );

                    return (
                        <div
                            key={level.key}
                            className="
                                flex
                                justify-between
                                gap-3
                            "
                        >
                            <span
                                className="
                                    text-[8px]
                                    text-stone-400
                                "
                            >
                                {level.label}
                            </span>

                            <span
                                className={`
                                    font-mono
                                    text-[8px]

                                    ${
                                        degree > 0
                                            ? "font-bold text-[#ffad58]"
                                            : "text-stone-600"
                                    }
                                `}
                            >
                                {format(
                                    degree
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Aggregation graph                                                          */
/* -------------------------------------------------------------------------- */

function AggregationGraph({
    surface,
    centroid,
}) {
    const width = 760;
    const height = 235;

    const padding = {
        left: 42,
        right: 18,
        top: 24,
        bottom: 34,
    };

    const graphWidth =
        width -
        padding.left -
        padding.right;

    const graphHeight =
        height -
        padding.top -
        padding.bottom;

    const xPosition = (value) =>
        padding.left +
        (value / 100) *
            graphWidth;

    const yPosition = (value) =>
        padding.top +
        graphHeight -
        clamp(value) *
            graphHeight;

    const baseline =
        yPosition(0);

    const makeLinePath = (key) =>
        surface.samples
            .map(
                (sample, index) =>
                    `${index ? "L" : "M"} ` +
                    `${xPosition(sample.z)} ` +
                    `${yPosition(sample[key] ?? 0)}`
            )
            .join(" ");

    const makeAreaPath = (key) => {
        if (!surface.samples.length) {
            return "";
        }

        const first =
            surface.samples[0];

        const last =
            surface.samples[
                surface.samples.length - 1
            ];

        const points =
            surface.samples
                .map(
                    (sample) =>
                        `L ${xPosition(
                            sample.z
                        )} ${yPosition(
                            sample[key] ?? 0
                        )}`
                )
                .join(" ");

        return (
            `M ${xPosition(
                first.z
            )} ${baseline} ` +
            `${points} ` +
            `L ${xPosition(
                last.z
            )} ${baseline} Z`
        );
    };

    return (
        <div
            className="
                overflow-hidden
                border
                border-[#633b2f]
                bg-black/15
                p-3
            "
        >
            <div
                className="
                    mb-2
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-2
                "
            >
                <p
                    className="
                        text-[8px]
                        uppercase
                        tracking-wider
                        text-stone-500
                    "
                >
                    Clipped output sets combined using MAX
                </p>

                <div
                    className="
                        flex
                        flex-wrap
                        gap-3
                        text-[7px]
                    "
                >
                    {OUTPUTS.map(
                        (output) => (
                            <span
                                key={
                                    output.key
                                }
                                style={{
                                    color:
                                        output.color,
                                }}
                            >
                                ● {output.label}
                            </span>
                        )
                    )}

                    <span className="text-[#f7ca7b]">
                        — Aggregated
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="
                        min-w-[560px]
                        w-full
                    "
                >
                    {[0, 0.5, 1].map(
                        (value) => (
                            <g key={value}>
                                <line
                                    x1={
                                        padding.left
                                    }
                                    x2={
                                        width -
                                        padding.right
                                    }
                                    y1={yPosition(
                                        value
                                    )}
                                    y2={yPosition(
                                        value
                                    )}
                                    stroke="#5e3a30"
                                    opacity="0.55"
                                />

                                <text
                                    x="8"
                                    y={
                                        yPosition(
                                            value
                                        ) + 4
                                    }
                                    fill="#987465"
                                    fontSize="9"
                                    fontFamily="monospace"
                                >
                                    {value.toFixed(
                                        1
                                    )}
                                </text>
                            </g>
                        )
                    )}

                    {[
                        0,
                        25,
                        50,
                        75,
                        100,
                    ].map((value) => (
                        <g key={value}>
                            <line
                                x1={xPosition(
                                    value
                                )}
                                x2={xPosition(
                                    value
                                )}
                                y1={
                                    padding.top
                                }
                                y2={baseline}
                                stroke="#452b25"
                                opacity="0.65"
                            />

                            <text
                                x={xPosition(
                                    value
                                )}
                                y={
                                    height - 10
                                }
                                textAnchor="middle"
                                fill="#987465"
                                fontSize="9"
                                fontFamily="monospace"
                            >
                                {value}
                            </text>
                        </g>
                    ))}

                    <path
                        d={makeLinePath(
                            "baseLow"
                        )}
                        fill="none"
                        stroke="#91b563"
                        opacity="0.22"
                    />

                    <path
                        d={makeLinePath(
                            "baseMedium"
                        )}
                        fill="none"
                        stroke="#d5a35c"
                        opacity="0.22"
                    />

                    <path
                        d={makeLinePath(
                            "baseHigh"
                        )}
                        fill="none"
                        stroke="#c85c50"
                        opacity="0.22"
                    />

                    <path
                        d={makeAreaPath(
                            "low"
                        )}
                        fill="#91b563"
                        fillOpacity="0.17"
                        stroke="#91b563"
                        strokeWidth="1.4"
                    />

                    <path
                        d={makeAreaPath(
                            "medium"
                        )}
                        fill="#d5a35c"
                        fillOpacity="0.17"
                        stroke="#d5a35c"
                        strokeWidth="1.4"
                    />

                    <path
                        d={makeAreaPath(
                            "high"
                        )}
                        fill="#c85c50"
                        fillOpacity="0.17"
                        stroke="#c85c50"
                        strokeWidth="1.4"
                    />

                    <path
                        d={makeAreaPath(
                            "aggregated"
                        )}
                        fill="#e58a42"
                        fillOpacity="0.18"
                    />

                    <path
                        d={makeLinePath(
                            "aggregated"
                        )}
                        fill="none"
                        stroke="#f7ca7b"
                        strokeWidth="3"
                    />

                    <line
                        x1={xPosition(
                            centroid
                        )}
                        x2={xPosition(
                            centroid
                        )}
                        y1={padding.top}
                        y2={baseline}
                        stroke="#fff0b3"
                        strokeWidth="2"
                        strokeDasharray="6 5"
                    />

                    <text
                        x={xPosition(
                            centroid
                        )}
                        y="14"
                        textAnchor="middle"
                        fill="#fff0b3"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                    >
                        Z* {format(centroid, 1)}
                    </text>

                    <text
                        x={xPosition(15)}
                        y={baseline - 7}
                        textAnchor="middle"
                        fill="#91b563"
                        fontSize="8"
                    >
                        ALLIANCE
                    </text>

                    <text
                        x={xPosition(50)}
                        y={baseline - 7}
                        textAnchor="middle"
                        fill="#d5a35c"
                        fontSize="8"
                    >
                        OBSERVE
                    </text>

                    <text
                        x={xPosition(85)}
                        y={baseline - 7}
                        textAnchor="middle"
                        fill="#c85c50"
                        fontSize="8"
                    >
                        EXECUTE
                    </text>
                </svg>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Calculation process                                                        */
/* -------------------------------------------------------------------------- */

function selectFormulaSamples(
    samples,
    amount = 7
) {
    const activeSamples =
        samples.filter(
            (sample) =>
                sample.aggregated >
                0.001
        );

    if (
        activeSamples.length <= amount
    ) {
        return activeSamples;
    }

    const selected = [];

    for (
        let index = 0;
        index < amount;
        index += 1
    ) {
        const position =
            Math.round(
                (index /
                    (amount - 1)) *
                    (activeSamples.length -
                        1)
            );

        const sample =
            activeSamples[position];

        if (
            !selected.some(
                (item) =>
                    item.z === sample.z
            )
        ) {
            selected.push(sample);
        }
    }

    return selected;
}

function CalculationProcess({
    surface,
    centroid,
    trust,
    directive,
}) {
    const displayedSamples =
        selectFormulaSamples(
            surface.samples
        );

    const decisionColor = {
        ALLIANCE:
            "text-[#9fc578]",
        OBSERVE:
            "text-[#e8b36e]",
        EXECUTE:
            "text-[#db6861]",
    };

    return (
        <div
            className="
                border
                border-[#633b2f]
                bg-black/15
            "
        >
            <div
                className="
                    px-4
                    pt-4
                    text-center
                "
            >
                <p
                    className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        text-[#a98570]
                    "
                >
                    Calculation Process
                </p>
            </div>

            <div
                className="
                    overflow-x-auto
                    px-4
                    py-6

                    sm:px-6
                    sm:py-8
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        min-w-[720px]
                        items-center
                        justify-center
                        gap-4
                        text-[#f2d19c]
                    "
                >
                    <span
                        className="
                            font-serif
                            text-2xl
                            italic
                        "
                    >
                        Z*
                    </span>

                    <span className="text-xl">
                        =
                    </span>

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            font-mono
                            text-[10px]
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                whitespace-nowrap
                                border-b
                                border-[#b18467]
                                px-3
                                pb-2
                            "
                        >
                            {displayedSamples.map(
                                (
                                    sample,
                                    index
                                ) => (
                                    <React.Fragment
                                        key={
                                            sample.z
                                        }
                                    >
                                        {index >
                                            0 && (
                                            <span>
                                                +
                                            </span>
                                        )}

                                        <span className="text-[#ffd28f]">
                                            (
                                            {sample.z.toFixed(
                                                1
                                            )}{" "}
                                            ×{" "}
                                            {format(
                                                sample.aggregated
                                            )}
                                            )
                                        </span>
                                    </React.Fragment>
                                )
                            )}

                            {surface.samples.filter(
                                (sample) =>
                                    sample.aggregated >
                                    0.001
                            ).length >
                                displayedSamples.length && (
                                <span className="text-stone-500">
                                    + …
                                </span>
                            )}
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                whitespace-nowrap
                                px-3
                                pt-2
                                text-[#c9b4a4]
                            "
                        >
                            {displayedSamples.map(
                                (
                                    sample,
                                    index
                                ) => (
                                    <React.Fragment
                                        key={
                                            sample.z
                                        }
                                    >
                                        {index >
                                            0 && (
                                            <span>
                                                +
                                            </span>
                                        )}

                                        <span>
                                            {format(
                                                sample.aggregated
                                            )}
                                        </span>
                                    </React.Fragment>
                                )
                            )}

                            {surface.samples.filter(
                                (sample) =>
                                    sample.aggregated >
                                    0.001
                            ).length >
                                displayedSamples.length && (
                                <span className="text-stone-500">
                                    + …
                                </span>
                            )}
                        </div>
                    </div>

                    <span className="text-xl">
                        =
                    </span>

                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            font-mono
                        "
                    >
                        <strong
                            className="
                                border-b
                                border-[#b18467]
                                px-4
                                pb-1
                                text-sm
                                text-white
                            "
                        >
                            {format(
                                surface.numerator
                            )}
                        </strong>

                        <strong
                            className="
                                px-4
                                pt-1
                                text-sm
                                text-white
                            "
                        >
                            {format(
                                surface.denominator
                            )}
                        </strong>
                    </div>

                    <span className="text-xl">
                        =
                    </span>

                    <div className="text-center">
                        <strong
                            className="
                                block
                                font-mono
                                text-4xl
                                text-white
                            "
                        >
                            {format(
                                centroid,
                                2
                            )}
                        </strong>

                        <span
                            className="
                                text-[8px]
                                uppercase
                                tracking-wider
                                text-stone-500
                            "
                        >
                            Centroid
                        </span>
                    </div>
                </div>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    border-t
                    border-[#633b2f]

                    sm:grid-cols-3
                "
            >
                <div
                    className="
                        border-b
                        border-[#633b2f]
                        p-4
                        text-center

                        sm:border-b-0
                        sm:border-r
                    "
                >
                    <span
                        className="
                            text-[7px]
                            uppercase
                            tracking-wider
                            text-stone-500
                        "
                    >
                        Risk centroid
                    </span>

                    <strong
                        className="
                            mt-1
                            block
                            font-mono
                            text-xl
                            text-[#ffad58]
                        "
                    >
                        {format(
                            centroid,
                            1
                        )}
                    </strong>
                </div>

                <div
                    className="
                        border-b
                        border-[#633b2f]
                        p-4
                        text-center

                        sm:border-b-0
                        sm:border-r
                    "
                >
                    <span
                        className="
                            text-[7px]
                            uppercase
                            tracking-wider
                            text-stone-500
                        "
                    >
                        Final trust
                    </span>

                    <strong
                        className="
                            mt-1
                            block
                            font-mono
                            text-xl
                            text-white
                        "
                    >
                        {Math.round(trust)}
                        /100
                    </strong>

                    <span
                        className="
                            mt-1
                            block
                            font-mono
                            text-[7px]
                            text-stone-500
                        "
                    >
                        100 −{" "}
                        {format(
                            centroid,
                            1
                        )}
                    </span>
                </div>

                <div
                    className="
                        p-4
                        text-center
                    "
                >
                    <span
                        className="
                            text-[7px]
                            uppercase
                            tracking-wider
                            text-stone-500
                        "
                    >
                        Decision
                    </span>

                    <strong
                        className={`
                            mt-2
                            block
                            text-sm

                            ${
                                decisionColor[
                                    directive
                                ] ??
                                "text-white"
                            }
                        `}
                    >
                        {directive}
                    </strong>
                </div>
            </div>

            <p
                className="
                    border-t
                    border-[#633b2f]
                    px-4
                    py-2
                    text-center
                    text-[7px]
                    text-stone-600
                "
            >
                Selected terms are shown. The totals include every
                aggregated membership point from z = 0 to 100.
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function LogicBreakdownModal({
    isOpen,
    onClose,

    values = {},
    memberships = {},

    firedRules = [],
    allRules = [],

    clipped = {},

    /*
     * Optional exact values from the fuzzy engine:
     *
     * {
     *   numerator,
     *   denominator,
     *   samples: [{ z, mu }]
     * }
     */
    defuzzification = null,

    trustZ,
    finalTrust,
    directive = "OBSERVE",
}) {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleEscape = (
            event
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
                onClose?.();
            }
        };

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [
        isOpen,
        onClose,
    ]);

    const rules = useMemo(() => {
        return (
            Array.isArray(firedRules)
                ? firedRules
                : []
        )
            .map(normalizeRule)
            .filter(
                (rule) =>
                    rule.strength ===
                        null ||
                    rule.strength >
                        0.0001
            )
            .sort(
                (first, second) =>
                    (second.strength ??
                        0) -
                    (first.strength ??
                        0)
            );
    }, [firedRules]);

    const clips = useMemo(
        () =>
            getClipValues(
                clipped,
                rules
            ),
        [
            clipped,
            rules,
        ]
    );

    const localSurface = useMemo(
        () =>
            buildLocalSurface(
                clips
            ),
        [clips]
    );

    const surface = useMemo(
        () =>
            buildExactSurface(
                localSurface,
                defuzzification
            ),
        [
            localSurface,
            defuzzification,
        ]
    );

    useEffect(() => {
        const engineValue =
            Number(trustZ);

        if (
            !defuzzification &&
            Number.isFinite(
                engineValue
            ) &&
            Math.abs(
                engineValue -
                    surface.centroid
            ) > 0.75
        ) {
            console.warn(
                "Logic breakdown centroid differs from the fuzzy engine.",
                {
                    modalCentroid:
                        surface.centroid,

                    engineCentroid:
                        engineValue,

                    suggestion:
                        "Pass the exact defuzzification numerator, denominator and samples from calculateFuzzyTrust().",
                }
            );
        }
    }, [
        defuzzification,
        surface.centroid,
        trustZ,
    ]);

    if (!isOpen) {
        return null;
    }

    /*
     * Use the exact calculated centroid represented
     * by the displayed numerator and denominator.
     */
    const centroid =
        surface.denominator > 0
            ? surface.numerator /
              surface.denominator
            : Number.isFinite(
                  Number(trustZ)
              )
            ? Number(trustZ)
            : 0;

    /*
     * Keep the displayed equation internally
     * consistent with the displayed trust.
     */
    const calculatedTrust =
        clamp(
            100 - centroid,
            0,
            100
        );

    const engineTrust =
        Number(finalTrust);

    const trust =
        Number.isFinite(engineTrust) &&
        Math.abs(
            engineTrust -
                calculatedTrust
        ) <= 1
            ? engineTrust
            : calculatedTrust;

    const totalRuleCount =
        Array.isArray(allRules) &&
        allRules.length
            ? allRules.length
            : 81;

    const hasClipData =
        clips.low > 0 ||
        clips.medium > 0 ||
        clips.high > 0;

    return (
        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/55
                p-3
                backdrop-blur-sm
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose?.();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Fuzzy logic breakdown"
                className="
                    flex
                    max-h-[90vh]
                    w-[min(96vw,1000px)]
                    flex-col
                    overflow-hidden
                    border-2
                    border-[#754735]
                    bg-[#291713]
                    shadow-[7px_7px_0_rgba(0,0,0,0.4)]

                    [@media(max-height:520px)]:max-h-[95vh]
                "
            >
                {/* Header */}
                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-[#754735]
                        bg-[#351d17]
                        px-4
                        py-3
                    "
                >
                    <div>
                        <p
                            className="
                                text-[7px]
                                uppercase
                                tracking-[0.24em]
                                text-[#ad896b]
                            "
                        >
                            Fuzzy trust system
                        </p>

                        <h1
                            className="
                                mt-1
                                text-lg
                                font-bold
                                text-[#f1d4aa]
                            "
                        >
                            Logic Breakdown
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            border
                            border-[#754735]
                            bg-black/20
                            text-lg
                            text-[#d2ae8a]

                            hover:bg-[#6d3025]
                            hover:text-white
                        "
                    >
                        ×
                    </button>
                </header>

                <div
                    className="
                        overflow-y-auto
                        p-4

                        [@media(max-height:520px)]:p-3
                    "
                >
                    {/* Fuzzification */}
                    <section>
                        <SectionTitle number="01">
                            Fuzzification
                        </SectionTitle>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-2

                                sm:grid-cols-4
                            "
                        >
                            {INPUTS.map(
                                (input) => (
                                    <MembershipCard
                                        key={
                                            input.valueKey
                                        }
                                        input={input}
                                        values={values}
                                        memberships={
                                            memberships
                                        }
                                    />
                                )
                            )}
                        </div>
                    </section>

                    {/* Rule evaluation */}
                    <section className="mt-5">
                        <SectionTitle number="02">
                            Rule Evaluation — MIN
                        </SectionTitle>

                        <div
                            className="
                                max-h-[185px]
                                overflow-y-auto
                                border
                                border-[#633b2f]
                            "
                        >
                            <div
                                className="
                                    sticky
                                    top-0
                                    z-10
                                    grid
                                    grid-cols-[45px_1fr_65px]
                                    gap-2
                                    border-b
                                    border-[#633b2f]
                                    bg-[#351d17]
                                    px-3
                                    py-2
                                    text-[7px]
                                    uppercase
                                    tracking-wider
                                    text-[#c69268]

                                    sm:grid-cols-[55px_1fr_80px_95px]
                                "
                            >
                                <span>ID</span>
                                <span>Rule</span>
                                <span>Strength</span>

                                <span className="hidden sm:block">
                                    Output
                                </span>
                            </div>

                            {!rules.length ? (
                                <p
                                    className="
                                        px-4
                                        py-6
                                        text-center
                                        text-[9px]
                                        text-stone-500
                                    "
                                >
                                    No rules are currently firing.
                                </p>
                            ) : (
                                rules.map(
                                    (rule) => (
                                        <div
                                            key={
                                                rule.id
                                            }
                                            className="
                                                grid
                                                grid-cols-[45px_1fr_65px]
                                                gap-2
                                                border-b
                                                border-[#633b2f]/70
                                                px-3
                                                py-2.5
                                                last:border-b-0

                                                sm:grid-cols-[55px_1fr_80px_95px]
                                            "
                                        >
                                            <span
                                                className="
                                                    font-mono
                                                    text-[8px]
                                                    font-bold
                                                    text-[#ff9950]
                                                "
                                            >
                                                {
                                                    rule.id
                                                }
                                            </span>

                                            <p
                                                className="
                                                    text-[8px]
                                                    leading-4
                                                    text-stone-300
                                                "
                                            >
                                                {
                                                    rule.text
                                                }
                                            </p>

                                            <span
                                                className="
                                                    font-mono
                                                    text-[8px]
                                                    text-[#edbd78]
                                                "
                                            >
                                                {rule.strength ===
                                                null
                                                    ? "—"
                                                    : format(
                                                          rule.strength
                                                      )}
                                            </span>

                                            <span
                                                className="
                                                    hidden
                                                    truncate
                                                    text-[7px]
                                                    uppercase
                                                    text-stone-400

                                                    sm:block
                                                "
                                            >
                                                {
                                                    rule.output
                                                }
                                            </span>
                                        </div>
                                    )
                                )
                            )}
                        </div>

                        <p
                            className="
                                mt-1.5
                                text-right
                                text-[7px]
                                text-stone-500
                            "
                        >
                            {rules.length} active rules from{" "}
                            {totalRuleCount}
                        </p>
                    </section>

                    {/* Aggregation */}
                    <section className="mt-5">
                        <SectionTitle number="03">
                            Aggregation — MAX
                        </SectionTitle>

                        {!hasClipData && (
                            <div
                                className="
                                    mb-2
                                    border
                                    border-amber-700/50
                                    bg-amber-950/20
                                    px-3
                                    py-2
                                    text-[8px]
                                    text-amber-300
                                "
                            >
                                No clipped output values were received.
                                Check the clipped result returned by the
                                fuzzy engine.
                            </div>
                        )}

                        <AggregationGraph
                            surface={surface}
                            centroid={centroid}
                        />

                        <div
                            className="
                                mt-2
                                grid
                                grid-cols-3
                                gap-2
                            "
                        >
                            {OUTPUTS.map(
                                (output) => (
                                    <div
                                        key={
                                            output.key
                                        }
                                        className="
                                            border
                                            border-[#633b2f]
                                            bg-black/15
                                            px-3
                                            py-2
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                justify-between
                                                gap-2
                                            "
                                        >
                                            <span
                                                className="
                                                    text-[7px]
                                                    uppercase
                                                    text-stone-500
                                                "
                                            >
                                                {
                                                    output.label
                                                }
                                            </span>

                                            <span
                                                className="
                                                    font-mono
                                                    text-[8px]
                                                    text-white
                                                "
                                            >
                                                {format(
                                                    clips[
                                                        output.key
                                                    ]
                                                )}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                mt-1.5
                                                h-1.5
                                                border
                                                border-[#633b2f]
                                                bg-black/30
                                            "
                                        >
                                            <div
                                                className="h-full"
                                                style={{
                                                    width:
                                                        `${
                                                            clips[
                                                                output.key
                                                            ] *
                                                            100
                                                        }%`,

                                                    backgroundColor:
                                                        output.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* New calculation-style defuzzification */}
                    <section className="mt-5">
                        <SectionTitle number="04">
                            Defuzzification — Center of Gravity
                        </SectionTitle>

                        <CalculationProcess
                            surface={surface}
                            centroid={centroid}
                            trust={trust}
                            directive={directive}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
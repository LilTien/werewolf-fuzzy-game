
export const fuzzyProcess = [
    {
        name: "Fuzzification",
        desc: (<span>Convert player statistics into fuzzy membership values.
                Example:

                Aggression = 70 → 0.7 High, 0.3 Medium
                Lies = 40 → 0.6 Medium, 0.4 Low</span>)
    },
    {
        name: "Inference (Mamdani)",
        desc: (<span>Apply fuzzy rules to determine suspicion.

                Example:
                IF Aggression is High
                AND Lies is High
                AND Vote Behavior is Erratic
                THEN Suspicion is Very High
                The MIN operator is used to calculate rule strength.</span>)
    },
    {
        name: "Aggregation",
        desc: (<span>Combine all activated rule outputs into a single fuzzy suspicion set using the MAX operator.
                    Multiple rules may contribute simultaneously.</span>)
    },
    {
        name: "Defuzzification",
        desc: (<span>Calculate the Centroid (Center of Gravity) of the aggregated output to produce a final Suspicion Score.
                Example:
                Suspicion = 78/100
                → NPC is highly likely to vote against that player</span>)
    },
]
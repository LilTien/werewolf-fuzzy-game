export const fuzzyProcess = [
    {
        name: "1. Fuzzification",
        desc: (
            <span>
                Convert the four numerical behaviour inputs into fuzzy
                membership values:
                <br />
                <br />
                • Suspicion
                <br />
                • Vote Erraticness
                <br />
                • Previous Lies
                <br />
                • Aggression Behaviour
                <br />
                <br />
                Each input is classified into the linguistic values
                <strong> Low</strong>, <strong>Medium</strong>, and{" "}
                <strong>High</strong>.
                <br />
                <br />
                A value may belong to more than one fuzzy set at the same
                time. For example, a suspicion value may be partly Medium
                and partly High.
            </span>
        ),
    },
    {
        name: "2. Rule Evaluation",
        desc: (
            <span>
                Evaluate the player using the Mamdani fuzzy rule base.
                The system contains <strong>81 rules</strong>, representing
                every possible combination of the four inputs:
                <br />
                <br />
                3 × 3 × 3 × 3 = 81 rules
                <br />
                <br />
                Example:
                <br />
                <br />
                IF Suspicion is High
                <br />
                AND Vote Erraticness is High
                <br />
                AND Previous Lies is High
                <br />
                AND Aggression is High
                <br />
                THEN the player has Low Trust and should be marked for
                EXECUTE.
                <br />
                <br />
                The <strong>MIN operator</strong> determines the firing
                strength of each rule.
            </span>
        ),
    },
    {
        name: "3. Aggregation",
        desc: (
            <span>
                Combine the output of every activated rule into one final
                fuzzy output set.
                <br />
                <br />
                Each rule clips the output membership function according
                to its firing strength. The system then uses the{" "}
                <strong>MAX operator</strong> to combine overlapping rule
                outputs.
                <br />
                <br />
                This allows multiple rules to influence the NPC&apos;s
                trust evaluation at the same time.
            </span>
        ),
    },
    {
        name: "4. Defuzzification",
        desc: (
            <span>
                Apply the <strong>Centroid method</strong>, also known as
                the Center of Gravity method, to convert the aggregated
                fuzzy output into one numerical value.
                <br />
                <br />
                The resulting score is converted into a final trust value
                between <strong>0 and 100</strong>.
                <br />
                <br />
                Lower trust means the NPC considers the player more
                dangerous, while higher trust means the NPC considers the
                player more reliable.
            </span>
        ),
    },
    {
        name: "5. Decision",
        desc: (
            <span>
                Convert the final trust value into an NPC decision:
                <br />
                <br />
                • <strong>ALLIANCE</strong> — the NPC trusts the player and
                may defend them.
                <br />
                • <strong>OBSERVE</strong> — the NPC remains uncertain and
                continues monitoring the player.
                <br />
                • <strong>EXECUTE</strong> — the NPC strongly distrusts the
                player and may accuse or vote against them.
                <br />
                <br />
                The same trust result is used during NPC discussion,
                accusation, defence, and voting decisions.
            </span>
        ),
    },
];
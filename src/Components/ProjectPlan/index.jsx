import React from "react";

const swot = [
    {
        title: "Strengths",
        text: "Transparent NPC logic and 81 fuzzy rules.",
        className:
            "border-emerald-700 text-emerald-400",
    },
    {
        title: "Weaknesses",
        text: "Rules and NPC dialogue still need balancing.",
        className:
            "border-red-800 text-red-400",
    },
    {
        title: "Opportunities",
        text: "Multiplayer, education mode and new roles.",
        className:
            "border-blue-700 text-blue-400",
    },
    {
        title: "Threats",
        text: "Competition from larger AI-based games.",
        className:
            "border-amber-700 text-amber-400",
    },
];

const roadmap = [
    {
        number: "01",
        title: "MVP",
        subtitle: "Current project",
        text: "Single-player game, fuzzy NPCs and logic simulator.",
    },
    {
        number: "02",
        title: "Beta",
        subtitle: "User testing",
        text: "Balance rules, improve dialogue and add content.",
    },
    {
        number: "03",
        title: "Product",
        subtitle: "Public release",
        text: "Multiplayer, accounts, maps and premium content.",
    },
];

function SmallHeading({
    number,
    title,
}) {
    return (
        <div className="flex items-center gap-3">
            <span
                className="
                    flex h-7 w-7 items-center justify-center
                    border border-[#c48259]
                    bg-[#4b2017]
                    font-mono text-[8px] font-bold
                    text-[#ffd09d]
                "
            >
                {number}
            </span>

            <h3
                className="
                    text-[11px] font-bold uppercase
                    tracking-[0.14em] text-[#f1d4aa]
                "
            >
                {title}
            </h3>
        </div>
    );
}

const ProjectPlan = () => {
    return (
        <section
            className="
                w-full overflow-hidden
                bg-[#22090d]
                px-4 py-16
                sm:px-6
                md:px-10 md:py-20
            "
        >
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="max-w-2xl">
                    <p
                        className="
                            text-[8px] font-bold uppercase
                            tracking-[0.3em] text-[#b77b56]
                        "
                    >
                        Project and market plan
                    </p>

                    <h2
                        className="
                            mt-2 text-3xl font-black
                            text-white md:text-4xl
                        "
                    >
                        Beyond the Village
                    </h2>

                    <p
                        className="
                            mt-3 max-w-xl text-[10px]
                            leading-5 text-stone-400
                        "
                    >
                        A social-deduction game where NPCs use fuzzy
                        trust instead of fixed decisions.
                    </p>
                </div>

                {/* Project information */}
                <div
                    className="
                        mt-10 grid grid-cols-1
                        border border-[#704032]
                        bg-[#2b1612]
                        md:grid-cols-3
                    "
                >
                    <article
                        className="
                            border-b border-[#704032]
                            p-5 md:border-b-0 md:border-r
                        "
                    >
                        <SmallHeading
                            number="01"
                            title="Description"
                        />

                        <p
                            className="
                                mt-4 text-[10px]
                                leading-5 text-stone-300
                            "
                        >
                            Players survive a Werewolf game while NPCs
                            evaluate suspicion, lies, voting and aggression.
                        </p>
                    </article>

                    <article
                        className="
                            border-b border-[#704032]
                            p-5 md:border-b-0 md:border-r
                        "
                    >
                        <SmallHeading
                            number="02"
                            title="Problem"
                        />

                        <p
                            className="
                                mt-4 text-[10px]
                                leading-5 text-stone-300
                            "
                        >
                            Fixed NPC logic is predictable and cannot
                            represent uncertain social behaviour.
                        </p>
                    </article>

                    <article className="p-5">
                        <SmallHeading
                            number="03"
                            title="Objective"
                        />

                        <p
                            className="
                                mt-4 text-[10px]
                                leading-5 text-stone-300
                            "
                        >
                            Create explainable NPC decisions using
                            Mamdani fuzzy inference and a trust score.
                        </p>
                    </article>
                </div>

                {/* Target audience and model */}
                <div
                    className="
                        mt-6 grid grid-cols-1
                        gap-4 lg:grid-cols-2
                    "
                >
                    <article
                        className="
                            border border-[#704032]
                            bg-[#2b1612] p-6
                        "
                    >
                        <SmallHeading
                            number="04"
                            title="Target Audience"
                        />

                        <div
                            className="
                                mt-5 grid grid-cols-2
                                gap-2
                            "
                        >
                            {[
                                "Social deduction players",
                                "Solo casual players",
                                "AI and fuzzy students",
                                "Lecturers and educators",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="
                                        border-l-2 border-[#b45517]
                                        bg-black/15 px-3 py-3
                                        text-[9px] leading-4
                                        text-stone-300
                                    "
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </article>

                    <article
                        className="
                            border border-[#704032]
                            bg-[#2b1612] p-6
                        "
                    >
                        <SmallHeading
                            number="05"
                            title="Usage Model"
                        />

                        <p
                            className="
                                mt-5 text-[10px]
                                leading-5 text-stone-300
                            "
                        >
                            Start as a free educational game and expand
                            through optional content.
                        </p>

                        <div
                            className="
                                mt-4 grid grid-cols-3
                                gap-2
                            "
                        >
                            {[
                                {
                                    title: "Free",
                                    text: "Core game",
                                },
                                {
                                    title: "Premium",
                                    text: "Roles & maps",
                                },
                                {
                                    title: "Education",
                                    text: "Classroom mode",
                                },
                            ].map((model) => (
                                <div
                                    key={model.title}
                                    className="
                                        border border-[#704032]
                                        bg-black/20 p-3
                                        text-center
                                    "
                                >
                                    <strong
                                        className="
                                            block text-[10px]
                                            text-[#f1d4aa]
                                        "
                                    >
                                        {model.title}
                                    </strong>

                                    <span
                                        className="
                                            mt-1 block text-[7px]
                                            text-stone-500
                                        "
                                    >
                                        {model.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>

                {/* SWOT */}
                <div className="mt-10">
                    <SmallHeading
                        number="06"
                        title="SWOT Analysis"
                    />

                    <div
                        className="
                            mt-4 grid grid-cols-1
                            gap-2 sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        {swot.map((item) => (
                            <article
                                key={item.title}
                                className={`
                                    border bg-black/15 p-4
                                    ${item.className}
                                `}
                            >
                                <h4
                                    className="
                                        text-[11px] font-bold
                                    "
                                >
                                    {item.title}
                                </h4>

                                <p
                                    className="
                                        mt-2 text-[8px]
                                        leading-4 text-stone-400
                                    "
                                >
                                    {item.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Roadmap */}
                <div className="mt-10">
                    <SmallHeading
                        number="07"
                        title="Growth Roadmap"
                    />

                    <div
                        className="
                            relative mt-5 grid
                            grid-cols-1 gap-3
                            md:grid-cols-3
                        "
                    >
                        <div
                            className="
                                absolute left-[16%] right-[16%]
                                top-6 hidden border-t
                                border-dashed border-[#704032]
                                md:block
                            "
                        />

                        {roadmap.map((stage) => (
                            <article
                                key={stage.number}
                                className="
                                    relative z-10
                                    border border-[#704032]
                                    bg-[#2b1612] p-5
                                "
                            >
                                <span
                                    className="
                                        flex h-12 w-12
                                        items-center justify-center
                                        border border-[#9b6952]
                                        bg-[#3a211b]
                                        font-mono text-sm
                                        font-bold text-white
                                    "
                                >
                                    {stage.number}
                                </span>

                                <h4
                                    className="
                                        mt-5 text-sm
                                        font-black text-[#f1d4aa]
                                    "
                                >
                                    {stage.title}
                                </h4>

                                <p
                                    className="
                                        mt-1 text-[7px]
                                        uppercase tracking-[0.15em]
                                        text-[#c77d50]
                                    "
                                >
                                    {stage.subtitle}
                                </p>

                                <p
                                    className="
                                        mt-3 text-[9px]
                                        leading-5 text-stone-400
                                    "
                                >
                                    {stage.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectPlan;
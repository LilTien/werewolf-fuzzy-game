import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PixelSnow from "../Components/Background/pixelsnow";

import DarkVillageBg from "../assets/background/ripped_background.png";
import FourCharacter from "../assets/image/allchar.png";
import CampFire from "../assets/image/campfirehut.png";
import GirlCharacter from "../assets/character/girl-character.png";
import MouseCharacter from "../assets/character/traveller-mouse.png";

/* -------------------------------------------------------------------------- */
/* Page content                                                               */
/* -------------------------------------------------------------------------- */

const projectStats = [
    {
        value: "4",
        label: "Behavioural inputs",
    },
    {
        value: "81",
        label: "Fuzzy rules",
    },
    {
        value: "3",
        label: "NPC directives",
    },
    {
        value: "0–100",
        label: "Trust range",
    },
];

const fuzzyInputs = [
    {
        name: "Suspicion",
        description:
            "Measures how strongly an NPC suspects that a player may be dangerous or dishonest.",
    },
    {
        name: "Vote Erraticness",
        description:
            "Measures how inconsistent the player's voting behaviour has been across previous rounds.",
    },
    {
        name: "Previous Lies",
        description:
            "Records statements or role claims that were later shown to be false.",
    },
    {
        name: "Aggression",
        description:
            "Measures how hostile, forceful or confrontational the player's behaviour appears.",
    },
];

const fuzzySteps = [
    {
        number: "01",
        title: "Fuzzification",
        description:
            "Convert each crisp behavioural value into Low, Medium and High membership degrees.",
    },
    {
        number: "02",
        title: "Rule Evaluation",
        description:
            "Evaluate all relevant Mamdani rules and use MIN to calculate each firing strength.",
    },
    {
        number: "03",
        title: "Aggregation",
        description:
            "Clip the output membership sets and combine them using the MAX operator.",
    },
    {
        number: "04",
        title: "Defuzzification",
        description:
            "Use the centroid method to calculate a crisp trust result between 0 and 100.",
    },
    {
        number: "05",
        title: "NPC Decision",
        description:
            "Translate trust into ALLIANCE, OBSERVE or EXECUTE behaviour.",
    },
];

const targetUsers = [
    {
        title: "Social-deduction players",
        description:
            "Players who enjoy Werewolf, Mafia and games based on deception, discussion and voting.",
    },
    {
        title: "Solo casual players",
        description:
            "Players who want to experience a social-deduction game without organising a full human group.",
    },
    {
        title: "AI and fuzzy-logic students",
        description:
            "Students who need a playable example of fuzzification, Mamdani inference and defuzzification.",
    },
    {
        title: "Lecturers and educators",
        description:
            "Educators who want an interactive teaching aid rather than a purely theoretical fuzzy-logic example.",
    },
];

const usageModels = [
    {
        title: "Free educational demo",
        description:
            "Keep the core simulator and single-player game freely accessible for learning and project demonstration.",
    },
    {
        title: "Freemium game",
        description:
            "Offer the basic game for free, with additional roles, maps, character packs and game modes as optional content.",
    },
    {
        title: "Education licence",
        description:
            "Provide institutions with configurable rules, classroom exercises and detailed fuzzy-logic dashboards.",
    },
];

const swot = {
    strengths: [
        "Transparent and explainable NPC decisions.",
        "Complete 81-rule fuzzy knowledge base.",
        "Fuzzy logic is integrated into real gameplay.",
        "Distinctive pixel-art social-deduction theme.",
    ],

    weaknesses: [
        "Fuzzy rules require manual balancing.",
        "Current prototype focuses mainly on single-player.",
        "NPC dialogue can become repetitive.",
        "The game is designed primarily for landscape screens.",
    ],

    opportunities: [
        "Real-time multiplayer rooms.",
        "Use as an educational fuzzy-logic application.",
        "Additional roles, maps and NPC personalities.",
        "Public web, mobile or progressive-web-app release.",
    ],

    threats: [
        "Competition from existing social-deduction games.",
        "Generative-AI NPC systems may appear more flexible.",
        "Poor rule balancing could produce unfair decisions.",
        "New users may need guidance to understand fuzzy output.",
    ],
};

const roadmap = [
    {
        number: "01",
        stage: "Current MVP",
        subtitle: "University project",
        items: [
            "Single-player Werewolf game",
            "Discussion, voting and night phases",
            "Four fuzzy behavioural inputs",
            "81-rule knowledge base",
            "Interactive logic simulator",
        ],
    },
    {
        number: "02",
        stage: "Beta",
        subtitle: "Testing and improvement",
        items: [
            "Rule balancing through user testing",
            "More NPC dialogue variations",
            "Additional characters and environments",
            "Improved accessibility and mobile support",
            "Gameplay analytics",
        ],
    },
    {
        number: "03",
        stage: "Product",
        subtitle: "Public release",
        items: [
            "Real-time online multiplayer",
            "Custom rooms and game settings",
            "User accounts and progression",
            "Premium character and map packs",
            "Educational classroom mode",
        ],
    },
];

/* -------------------------------------------------------------------------- */
/* Reusable UI                                                                */
/* -------------------------------------------------------------------------- */

function SectionHeading({
    eyebrow,
    title,
    description,
    light = false,
    align = "left",
}) {
    const centered = align === "center";

    return (
        <div
            className={`
                ${centered ? "mx-auto text-center" : ""}
                max-w-2xl
            `}
        >
            {eyebrow && (
                <p
                    className={`
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.3em]

                        ${
                            light
                                ? "text-white/50"
                                : "text-[#9b5e34]"
                        }
                    `}
                >
                    {eyebrow}
                </p>
            )}

            <h2
                className={`
                    mt-2
                    text-3xl
                    font-black
                    leading-tight

                    md:text-4xl

                    ${
                        light
                            ? "text-white"
                            : "text-[#36231b]"
                    }
                `}
            >
                {title}
            </h2>

            {description && (
                <p
                    className={`
                        mt-4
                        text-[12px]
                        leading-6

                        ${
                            light
                                ? "text-white/65"
                                : "text-stone-600"
                        }
                    `}
                >
                    {description}
                </p>
            )}
        </div>
    );
}

function NumberBadge({ children }) {
    return (
        <span
            className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                border
                border-[#d69455]
                bg-[#52271b]
                font-mono
                text-[10px]
                font-bold
                text-[#ffd29b]
                shadow-[3px_3px_0_#28120d]
            "
        >
            {children}
        </span>
    );
}

function SwotColumn({
    title,
    items,
    className,
}) {
    return (
        <article
            className={`
                border
                bg-black/15
                p-5

                ${className}
            `}
        >
            <h3
                className="
                    text-lg
                    font-black
                "
            >
                {title}
            </h3>

            <ul
                className="
                    mt-4
                    space-y-3
                "
            >
                {items.map((item) => (
                    <li
                        key={item}
                        className="
                            flex
                            gap-2
                            text-[10px]
                            leading-5
                            text-stone-300
                        "
                    >
                        <span className="mt-[7px] h-1 w-1 shrink-0 bg-current" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </article>
    );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

function Documentation() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main
            className="
                w-full
                overflow-x-hidden
                bg-[#22090d]
            "
        >
            {/* ============================================================= */}
            {/* Hero                                                          */}
            {/* ============================================================= */}

            <section
                className="
                    relative
                    flex
                    min-h-[82vh]
                    w-full
                    items-center
                    overflow-hidden
                    bg-cover
                    bg-center
                    bg-no-repeat
                "
                style={{
                    backgroundImage: `url(${DarkVillageBg})`,
                }}
            >
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-b
                        from-black/35
                        via-black/30
                        to-[#22090d]
                    "
                />

                <nav
                    className="
                        absolute
                        left-0
                        right-0
                        top-0
                        z-20
                        mx-auto
                        flex
                        w-full
                        max-w-6xl
                        items-center
                        justify-between
                        px-5
                        py-5

                        md:px-10
                    "
                >
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-white/70
                            transition

                            hover:text-white
                        "
                    >
                        ← Home
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/game")}
                        className="
                            border
                            border-[#d8b27d]
                            bg-black/25
                            px-4
                            py-2
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-[#f1d4aa]
                            transition

                            hover:bg-[#f1d4aa]
                            hover:text-[#291713]
                        "
                    >
                        Play Game
                    </button>
                </nav>

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        grid
                        w-full
                        max-w-6xl
                        grid-cols-1
                        items-center
                        gap-8
                        px-5
                        py-24

                        md:grid-cols-[1.05fr_0.95fr]
                        md:px-10
                    "
                >
                    <div>
                        <p
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.35em]
                                text-[#ff9c64]
                            "
                        >
                            Official project documentation
                        </p>

                        <h1
                            className="
                                mt-4
                                max-w-3xl
                                text-4xl
                                font-black
                                leading-[1.05]
                                text-white
                                drop-shadow-[0_5px_0_rgba(0,0,0,0.45)]

                                sm:text-5xl
                                lg:text-7xl
                            "
                        >
                            Werewolf
                            <br />
                            Fuzzy Trust System
                        </h1>

                        <p
                            className="
                                mt-6
                                max-w-xl
                                text-[12px]
                                leading-6
                                text-white/70
                            "
                        >
                            A social-deduction game where NPCs evaluate
                            uncertain player behaviour using Mamdani fuzzy
                            inference instead of fixed scripted decisions.
                        </p>

                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                gap-3
                            "
                        >
                            <a
                                href="#technical"
                                className="
                                    bg-[#c95828]
                                    px-5
                                    py-3
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]
                                    text-white
                                    shadow-[4px_4px_0_#491c11]
                                    transition

                                    hover:bg-[#e16b35]
                                    active:translate-x-[2px]
                                    active:translate-y-[2px]
                                    active:shadow-none
                                "
                            >
                                View Technical Logic
                            </a>

                            <a
                                href="#market"
                                className="
                                    border
                                    border-white/35
                                    bg-black/25
                                    px-5
                                    py-3
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]
                                    text-white
                                    transition

                                    hover:bg-white
                                    hover:text-[#291713]
                                "
                            >
                                Market Strategy
                            </a>
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <img
                            src={FourCharacter}
                            alt="Werewolf game characters"
                            className="
                                w-full
                                max-w-[460px]
                                object-contain
                                drop-shadow-[0_20px_20px_rgba(0,0,0,0.65)]
                            "
                        />
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* Overview                                                      */}
            {/* ============================================================= */}

            <section
                id="overview"
                className="
                    w-full
                    bg-[#f1ede1]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        eyebrow="Project overview"
                        title="A Game of Trust, Lies and Uncertain Decisions"
                        description="The project combines a playable Werewolf game with a transparent fuzzy-logic reasoning system. Every NPC maintains a different opinion of every other player and updates that opinion as the game progresses."
                    />

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-2
                            border
                            border-stone-300

                            lg:grid-cols-4
                        "
                    >
                        {projectStats.map((stat) => (
                            <div
                                key={stat.label}
                                className="
                                    border-b
                                    border-r
                                    border-stone-300
                                    p-6

                                    even:border-r-0
                                    lg:border-b-0
                                    lg:even:border-r
                                    lg:last:border-r-0
                                "
                            >
                                <strong
                                    className="
                                        text-3xl
                                        font-black
                                        text-[#b45517]
                                    "
                                >
                                    {stat.value}
                                </strong>

                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-wider
                                        text-stone-500
                                    "
                                >
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div
                        className="
                            mt-16
                            grid
                            grid-cols-1
                            items-center
                            gap-12

                            md:grid-cols-2
                        "
                    >
                        <div>
                            <h3
                                className="
                                    text-2xl
                                    font-black
                                    text-[#636a27]
                                "
                            >
                                The problem
                            </h3>

                            <p
                                className="
                                    mt-4
                                    text-[12px]
                                    leading-7
                                    text-stone-700
                                "
                            >
                                Traditional game NPCs commonly rely on fixed
                                conditions. This can make their reactions
                                predictable because a behaviour is treated as
                                either suspicious or not suspicious.
                            </p>

                            <p
                                className="
                                    mt-4
                                    text-[12px]
                                    leading-7
                                    text-stone-700
                                "
                            >
                                Social behaviour is uncertain. A player can be
                                slightly aggressive, moderately inconsistent
                                and highly suspicious at the same time. The
                                system therefore needs a method that can reason
                                with overlapping and incomplete evidence.
                            </p>
                        </div>

                        <div>
                            <h3
                                className="
                                    text-2xl
                                    font-black
                                    text-[#c09b53]
                                "
                            >
                                The solution
                            </h3>

                            <p
                                className="
                                    mt-4
                                    text-[12px]
                                    leading-7
                                    text-stone-700
                                "
                            >
                                Mamdani fuzzy inference converts player
                                behaviour into degrees of Low, Medium and High.
                                Multiple rules can activate simultaneously,
                                allowing NPC decisions to reflect several pieces
                                of social evidence instead of one rigid
                                condition.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* Technical system                                              */}
            {/* ============================================================= */}

            <section
                id="technical"
                className="
                    relative
                    w-full
                    overflow-hidden
                    bg-[#22090d]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-20
                    "
                >
                    <PixelSnow
                        color="#ffffff"
                        flakeSize={0.01}
                        minFlakeSize={1.25}
                        pixelResolution={200}
                        speed={0.8}
                        density={0.22}
                        direction={125}
                        brightness={1}
                        depthFade={8}
                        farPlane={20}
                        gamma={0.4545}
                        variant="square"
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-6xl">
                    <SectionHeading
                        eyebrow="Technical implementation"
                        title="The Fuzzy Trust Engine"
                        description="Each NPC evaluates every living target independently. This means two NPCs can observe the same player and reach different conclusions."
                        light
                    />

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            gap-3

                            sm:grid-cols-2
                            lg:grid-cols-4
                        "
                    >
                        {fuzzyInputs.map((input, index) => (
                            <article
                                key={input.name}
                                className="
                                    border
                                    border-[#704032]
                                    bg-[#2d1713]/90
                                    p-5
                                    shadow-[5px_5px_0_rgba(0,0,0,0.25)]
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <span
                                        className="
                                            font-mono
                                            text-[9px]
                                            text-[#ff9f59]
                                        "
                                    >
                                        0{index + 1}
                                    </span>

                                    <span
                                        className="
                                            text-[8px]
                                            uppercase
                                            tracking-wider
                                            text-stone-600
                                        "
                                    >
                                        0–100
                                    </span>
                                </div>

                                <h3
                                    className="
                                        mt-5
                                        text-base
                                        font-black
                                        text-[#f1d4aa]
                                    "
                                >
                                    {input.name}
                                </h3>

                                <p
                                    className="
                                        mt-3
                                        text-[10px]
                                        leading-5
                                        text-stone-400
                                    "
                                >
                                    {input.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div
                        className="
                            mt-14
                            grid
                            grid-cols-1
                            gap-8

                            lg:grid-cols-[0.8fr_1.2fr]
                        "
                    >
                        <div
                            className="
                                border
                                border-[#704032]
                                bg-black/15
                                p-6
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#ff9f59]
                                "
                            >
                                Membership functions
                            </p>

                            <div
                                className="
                                    mt-6
                                    space-y-5
                                "
                            >
                                <div>
                                    <strong className="text-sm text-white">
                                        Low
                                    </strong>

                                    <p className="mt-1 font-mono text-[10px] text-stone-400">
                                        Trapezoid: 0, 0, 30, 60
                                    </p>
                                </div>

                                <div>
                                    <strong className="text-sm text-white">
                                        Medium
                                    </strong>

                                    <p className="mt-1 font-mono text-[10px] text-stone-400">
                                        Triangle: 30, 50, 70
                                    </p>
                                </div>

                                <div>
                                    <strong className="text-sm text-white">
                                        High
                                    </strong>

                                    <p className="mt-1 font-mono text-[10px] text-stone-400">
                                        Trapezoid: 40, 70, 100, 100
                                    </p>
                                </div>
                            </div>

                            <p
                                className="
                                    mt-6
                                    border-t
                                    border-[#704032]
                                    pt-5
                                    text-[10px]
                                    leading-5
                                    text-stone-400
                                "
                            >
                                Overlapping functions allow one input to be
                                partly Medium and partly High at the same time.
                            </p>
                        </div>

                        <div
                            className="
                                border
                                border-[#704032]
                                bg-black/15
                                p-6
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#ff9f59]
                                "
                            >
                                Rule methodology
                            </p>

                            <div
                                className="
                                    mt-5
                                    border-l-4
                                    border-[#c95828]
                                    bg-black/20
                                    px-5
                                    py-5
                                "
                            >
                                <p
                                    className="
                                        font-mono
                                        text-[10px]
                                        leading-6
                                        text-[#f1d4aa]
                                    "
                                >
                                    IF Suspicion is HIGH
                                    <br />
                                    AND Vote Erraticness is HIGH
                                    <br />
                                    AND Previous Lies is HIGH
                                    <br />
                                    AND Aggression is HIGH
                                    <br />
                                    THEN Trust is LOW / EXECUTE
                                </p>
                            </div>

                            <p
                                className="
                                    mt-5
                                    text-[10px]
                                    leading-5
                                    text-stone-400
                                "
                            >
                                Four inputs with three linguistic values produce
                                3 × 3 × 3 × 3 possible combinations.
                            </p>

                            <p
                                className="
                                    mt-4
                                    text-3xl
                                    font-black
                                    text-white
                                "
                            >
                                81 rules
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* Fuzzy process                                                 */}
            {/* ============================================================= */}

            <section
                className="
                    w-full
                    bg-[#b45517]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        eyebrow="Logic transparency"
                        title="From Player Behaviour to NPC Action"
                        description="The complete reasoning process remains visible so the result can be inspected rather than treated as a hidden AI decision."
                        light
                    />

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            gap-3

                            md:grid-cols-5
                        "
                    >
                        {fuzzySteps.map((step) => (
                            <article
                                key={step.number}
                                className="
                                    border
                                    border-white/25
                                    bg-black/10
                                    p-5
                                "
                            >
                                <NumberBadge>
                                    {step.number}
                                </NumberBadge>

                                <h3
                                    className="
                                        mt-5
                                        text-sm
                                        font-black
                                        text-white
                                    "
                                >
                                    {step.title}
                                </h3>

                                <p
                                    className="
                                        mt-3
                                        text-[9px]
                                        leading-5
                                        text-white/65
                                    "
                                >
                                    {step.description}
                                </p>
                            </article>
                        ))}
                    </div>

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            items-center
                            gap-10

                            md:grid-cols-[0.8fr_1.2fr]
                        "
                    >
                        <div className="flex justify-center">
                            <img
                                src={GirlCharacter}
                                alt="Game character"
                                className="
                                    w-full
                                    max-w-[330px]
                                    object-contain
                                "
                            />
                        </div>

                        <div
                            className="
                                border
                                border-white/25
                                bg-black/15
                                p-6
                            "
                        >
                            <h3
                                className="
                                    text-xl
                                    font-black
                                    text-white
                                "
                            >
                                Centroid calculation
                            </h3>

                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-center
                                    gap-4
                                    font-serif
                                    text-xl
                                    text-white

                                    sm:text-2xl
                                "
                            >
                                <span>Z*</span>
                                <span>=</span>

                                <span
                                    className="
                                        flex
                                        flex-col
                                        text-center
                                    "
                                >
                                    <span className="border-b border-white/60 px-4 pb-1">
                                        Σ(z × μagg(z))
                                    </span>

                                    <span className="px-4 pt-1">
                                        Σ μagg(z)
                                    </span>
                                </span>
                            </div>

                            <div
                                className="
                                    mt-8
                                    grid
                                    grid-cols-1
                                    gap-3

                                    sm:grid-cols-3
                                "
                            >
                                <div className="border border-white/20 p-4 text-center">
                                    <strong className="text-sm text-[#d3fd8d]">
                                        ALLIANCE
                                    </strong>

                                    <p className="mt-2 text-[9px] text-white/60">
                                        Trust and defend the player.
                                    </p>
                                </div>

                                <div className="border border-white/20 p-4 text-center">
                                    <strong className="text-sm text-[#ffd08a]">
                                        OBSERVE
                                    </strong>

                                    <p className="mt-2 text-[9px] text-white/60">
                                        Continue monitoring the player.
                                    </p>
                                </div>

                                <div className="border border-white/20 p-4 text-center">
                                    <strong className="text-sm text-[#ff9494]">
                                        EXECUTE
                                    </strong>

                                    <p className="mt-2 text-[9px] text-white/60">
                                        Accuse or vote against the player.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* Game integration                                              */}
            {/* ============================================================= */}

            <section
                className="
                    w-full
                    bg-[#f1ede1]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div className="mx-auto max-w-6xl">
                    <div
                        className="
                            grid
                            grid-cols-1
                            items-center
                            gap-12

                            md:grid-cols-2
                        "
                    >
                        <div>
                            <SectionHeading
                                eyebrow="Application behaviour"
                                title="How Fuzzy Trust Changes the Game"
                                description="Trust is not calculated only for display. The result directly controls how NPCs discuss, defend, accuse and vote."
                            />

                            <div className="mt-8 space-y-5">
                                {[
                                    [
                                        "Discussion",
                                        "NPCs accuse dangerous targets and defend players with higher trust.",
                                    ],
                                    [
                                        "Relationship updates",
                                        "Accusations, defences, lies and aggressive behaviour update private NPC relationships.",
                                    ],
                                    [
                                        "Voting",
                                        "Each NPC evaluates all living candidates and votes for the player with the lowest fuzzy trust.",
                                    ],
                                    [
                                        "Night phase",
                                        "Special roles perform night actions before the next discussion begins.",
                                    ],
                                ].map(([title, text]) => (
                                    <div
                                        key={title}
                                        className="
                                            border-l-4
                                            border-[#b45517]
                                            pl-4
                                        "
                                    >
                                        <h3 className="text-sm font-black text-[#36231b]">
                                            {title}
                                        </h3>

                                        <p className="mt-1 text-[10px] leading-5 text-stone-600">
                                            {text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <img
                                src={CampFire}
                                alt="Werewolf gameplay environment"
                                className="
                                    w-full
                                    max-w-[430px]
                                    object-contain
                                    drop-shadow-[0_18px_16px_rgba(0,0,0,0.25)]
                                "
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* Market                                                        */}
            {/* ============================================================= */}

            <section
                id="market"
                className="
                    w-full
                    bg-[#541f24]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        eyebrow="Market potential and strategy"
                        title="From University Prototype to Real Product"
                        description="The current application can function as both a social-deduction game and an interactive fuzzy-logic learning tool."
                        light
                        align="center"
                    />

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            gap-5

                            lg:grid-cols-2
                        "
                    >
                        <section
                            className="
                                border
                                border-[#c78261]
                                bg-black/15
                                p-6
                            "
                        >
                            <h3
                                className="
                                    text-xl
                                    font-black
                                    text-[#f1d4aa]
                                "
                            >
                                Target audience
                            </h3>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {targetUsers.map((user) => (
                                    <article
                                        key={user.title}
                                        className="
                                            border-l-2
                                            border-[#d29362]
                                            bg-black/15
                                            p-4
                                        "
                                    >
                                        <h4 className="text-[11px] font-bold text-white">
                                            {user.title}
                                        </h4>

                                        <p className="mt-2 text-[9px] leading-5 text-stone-400">
                                            {user.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section
                            className="
                                border
                                border-[#c78261]
                                bg-black/15
                                p-6
                            "
                        >
                            <h3
                                className="
                                    text-xl
                                    font-black
                                    text-[#f1d4aa]
                                "
                            >
                                Value proposition
                            </h3>

                            <p
                                className="
                                    mt-5
                                    text-[10px]
                                    leading-6
                                    text-stone-300
                                "
                            >
                                The application provides a playable
                                social-deduction experience while showing
                                exactly how uncertain behavioural evidence is
                                converted into an NPC decision.
                            </p>

                            <div className="mt-6 space-y-3">
                                {[
                                    "More believable NPC behaviour than fixed decision trees.",
                                    "A solo alternative to party-based Werewolf games.",
                                    "Transparent and inspectable AI decisions.",
                                    "A practical fuzzy-logic teaching example.",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="
                                            flex
                                            gap-3
                                            border-b
                                            border-white/10
                                            pb-3
                                            text-[10px]
                                            text-stone-300
                                        "
                                    >
                                        <span className="text-[#ff9f59]">
                                            +
                                        </span>

                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section
                        className="
                            mt-6
                            border
                            border-[#c78261]
                            bg-black/15
                            p-6
                        "
                    >
                        <h3
                            className="
                                text-center
                                text-xl
                                font-black
                                text-[#f1d4aa]
                            "
                        >
                            Potential usage and revenue models
                        </h3>

                        <div
                            className="
                                mt-7
                                grid
                                grid-cols-1
                                gap-3

                                md:grid-cols-3
                            "
                        >
                            {usageModels.map((model, index) => (
                                <article
                                    key={model.title}
                                    className="
                                        border
                                        border-white/15
                                        bg-black/15
                                        p-5
                                    "
                                >
                                    <span
                                        className="
                                            font-mono
                                            text-[9px]
                                            text-[#ff9f59]
                                        "
                                    >
                                        0{index + 1}
                                    </span>

                                    <h4 className="mt-4 text-sm font-black text-white">
                                        {model.title}
                                    </h4>

                                    <p className="mt-3 text-[9px] leading-5 text-stone-400">
                                        {model.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </section>

            {/* ============================================================= */}
            {/* SWOT                                                           */}
            {/* ============================================================= */}

            <section
                className="
                    w-full
                    bg-[#291713]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        eyebrow="Business assessment"
                        title="SWOT Analysis"
                        description="An honest assessment of the current project and its potential development."
                        light
                        align="center"
                    />

                    <div
                        className="
                            mt-12
                            grid
                            grid-cols-1
                            gap-3

                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        <SwotColumn
                            title="Strengths"
                            items={swot.strengths}
                            className="
                                border-emerald-700/60
                                text-emerald-400
                            "
                        />

                        <SwotColumn
                            title="Weaknesses"
                            items={swot.weaknesses}
                            className="
                                border-red-800/60
                                text-red-400
                            "
                        />

                        <SwotColumn
                            title="Opportunities"
                            items={swot.opportunities}
                            className="
                                border-blue-700/60
                                text-blue-400
                            "
                        />

                        <SwotColumn
                            title="Threats"
                            items={swot.threats}
                            className="
                                border-amber-700/60
                                text-amber-400
                            "
                        />
                    </div>
                </div>
            </section>

            {/* ============================================================= */}
            {/* Roadmap                                                        */}
            {/* ============================================================= */}

            <section
                className="
                    w-full
                    bg-[#22090d]
                    px-5
                    py-20

                    md:px-10
                "
            >
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        eyebrow="Future development"
                        title="Growth Roadmap"
                        description="A realistic path from the current university prototype to a more complete public product."
                        light
                        align="center"
                    />

                    <div
                        className="
                            relative
                            mt-14
                            grid
                            grid-cols-1
                            gap-4

                            lg:grid-cols-3
                        "
                    >
                        <div
                            className="
                                absolute
                                left-[16%]
                                right-[16%]
                                top-8
                                hidden
                                border-t
                                border-dashed
                                border-[#85503e]

                                lg:block
                            "
                        />

                        {roadmap.map((stage) => (
                            <article
                                key={stage.number}
                                className="
                                    relative
                                    z-10
                                    border
                                    border-[#704032]
                                    bg-[#2d1713]
                                    p-6
                                "
                            >
                                <NumberBadge>
                                    {stage.number}
                                </NumberBadge>

                                <h3
                                    className="
                                        mt-6
                                        text-xl
                                        font-black
                                        text-[#f1d4aa]
                                    "
                                >
                                    {stage.stage}
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        uppercase
                                        tracking-[0.18em]
                                        text-[#ff9f59]
                                    "
                                >
                                    {stage.subtitle}
                                </p>

                                <ul
                                    className="
                                        mt-5
                                        space-y-3
                                    "
                                >
                                    {stage.items.map((item) => (
                                        <li
                                            key={item}
                                            className="
                                                flex
                                                gap-2
                                                text-[9px]
                                                leading-5
                                                text-stone-400
                                            "
                                        >
                                            <span className="text-[#c95828]">
                                                →
                                            </span>

                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>

                    <div
                        className="
                            mt-16
                            flex
                            flex-col
                            items-center
                            border-t
                            border-[#704032]
                            pt-12
                            text-center
                        "
                    >
                        <img
                            src={MouseCharacter}
                            alt="Werewolf game character"
                            className="
                                h-36
                                w-36
                                object-contain
                                [image-rendering:pixelated]
                            "
                        />

                        <h2
                            className="
                                mt-5
                                text-2xl
                                font-black
                                text-white
                            "
                        >
                            Ready to enter the village?
                        </h2>

                        <button
                            type="button"
                            onClick={() => navigate("/game")}
                            className="
                                mt-6
                                bg-[#c95828]
                                px-7
                                py-3
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-white
                                shadow-[5px_5px_0_#491c11]

                                hover:bg-[#e16b35]
                                active:translate-x-[2px]
                                active:translate-y-[2px]
                                active:shadow-none
                            "
                        >
                            Play the Game
                        </button>
                    </div>
                </div>
            </section>

            <footer
                className="
                    border-t
                    border-[#704032]
                    bg-[#160806]
                    px-5
                    py-6
                    text-center
                "
            >
                <p
                    className="
                        text-[8px]
                        uppercase
                        tracking-[0.2em]
                        text-stone-600
                    "
                >
                    Werewolf Fuzzy Trust System · ISP568 Group Project
                </p>
            </footer>
        </main>
    );
}

export default Documentation;
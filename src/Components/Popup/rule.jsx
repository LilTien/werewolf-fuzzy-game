import React, { useEffect } from "react";
import Button from "../Button";

const GAME_RULES = [
    {
        icon: "🌙",
        title: "The Night Falls",
        description:
            "Special roles secretly perform their actions. The Werewolf hunts, the Doctor protects, and information roles search for the truth.",
    },
    {
        icon: "💬",
        title: "Trust No One",
        description:
            "During discussion, players accuse, defend, deceive, or remain silent. Every statement can change how others see them.",
    },
    {
        icon: "🗳️",
        title: "The Village Decides",
        description:
            "Every living player votes. The player with the most votes is eliminated and their true role is revealed.",
    },
    {
        icon: "🐺",
        title: "Werewolf Victory",
        description:
            "The Werewolf wins when only three players remain while the Werewolf is still alive.",
    },
    {
        icon: "🏘️",
        title: "Village Victory",
        description:
            "The Village team wins when the Werewolf is eliminated.",
    },
    {
        icon: "🃏",
        title: "Jester Victory",
        description:
            "The Jester wins by convincing the village to eliminate them during the voting phase.",
    },
];

const ROLE_RULES = [
    {
        role: "Werewolf",
        team: "Darkness",
        rule:
            "Attack one player every night and survive until only three players remain.",
    },
    {
        role: "Shaman",
        team: "Darkness",
        rule:
            "Reveal roles and secretly help the Werewolf select dangerous targets.",
    },
    {
        role: "Doctor",
        team: "Village",
        rule:
            "Protect one player each night from the Werewolf's attack.",
    },
    {
        role: "Seer",
        team: "Village",
        rule:
            "Reveal one player's true role every night.",
    },
    {
        role: "Knight",
        team: "Village",
        rule:
            "Strike one player. Killing an innocent causes the Knight to die too.",
    },
    {
        role: "Villager",
        team: "Village",
        rule:
            "Use discussion, observation, and voting to uncover the Werewolf.",
    },
    {
        role: "Jester",
        team: "Alone",
        rule:
            "Appear suspicious enough to be eliminated by the village.",
    },
];

const RulePopup = ({
    isOpen,
    onClose,
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        window.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getTeamStyle = (team) => {
        if (team === "Darkness") {
            return `
                border-red-500/25
                bg-red-500/10
                text-red-300
            `;
        }

        if (team === "Village") {
            return `
                border-emerald-500/25
                bg-emerald-500/10
                text-emerald-300
            `;
        }

        return `
            border-purple-500/25
            bg-purple-500/10
            text-purple-300
        `;
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[999]
                flex
                items-center
                justify-center
                overflow-hidden
                bg-black/75
                p-4
                backdrop-blur-md

                [@media(max-height:520px)]:p-2
            "
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="game-rules-title"
                onClick={(event) =>
                    event.stopPropagation()
                }
                className="
                    relative
                    flex
                    h-[88vh]
                    w-full
                    max-w-[920px]
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-amber-300/20
                    bg-[#11100f]/95
                    shadow-2xl
                    shadow-black

                    [@media(max-height:600px)]:h-[94vh]
                    [@media(max-height:600px)]:max-w-[980px]
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.1),_transparent_42%)]
                    "
                />

                {/* Compact header */}
                <header
                    className="
                        relative
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-white/10
                        bg-black/30
                        px-5
                        py-3

                        [@media(max-height:520px)]:px-4
                        [@media(max-height:520px)]:py-2
                    "
                >
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.35em]
                                text-amber-400
                            "
                        >
                            Before the moon rises
                        </p>

                        <h1
                            id="game-rules-title"
                            className="
                                mt-1
                                text-xl
                                font-black
                                uppercase
                                tracking-wide
                                text-white

                                sm:text-2xl

                                [@media(max-height:520px)]:text-lg
                            "
                        >
                            Rules of the Village
                        </h1>

                        <p
                            className="
                                mt-1
                                max-w-xl
                                text-[10px]
                                leading-4
                                text-stone-400

                                sm:text-xs
                            "
                        >
                            Survive the night, question
                            every story, and never trust
                            too easily.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close game rules"
                        className="
                            ml-4
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-white/10
                            bg-white/5
                            text-lg
                            font-bold
                            text-stone-400
                            transition
                            hover:bg-white/10
                            hover:text-white
                        "
                    >
                        ×
                    </button>
                </header>

                {/* Compact two-column content */}
                <div
                    className="
                        relative
                        grid
                        min-h-0
                        flex-1
                        grid-cols-1
                        gap-5
                        overflow-y-auto
                        px-5
                        py-4

                        md:grid-cols-[1fr_1.05fr]

                        [@media(orientation:landscape)]:grid-cols-[1fr_1.05fr]

                        [@media(max-height:520px)]:gap-3
                        [@media(max-height:520px)]:px-4
                        [@media(max-height:520px)]:py-3
                    "
                >
                    {/* General rules */}
                    <section className="min-w-0">
                        <div className="mb-3">
                            <p
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.25em]
                                    text-red-400
                                "
                            >
                                How it works
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-base
                                    font-black
                                    text-white

                                    [@media(max-height:520px)]:text-sm
                                "
                            >
                                Survive. Deceive. Decide.
                            </h2>
                        </div>

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-2

                                sm:grid-cols-2
                                md:grid-cols-1
                                lg:grid-cols-2

                                [@media(orientation:landscape)]:grid-cols-2
                            "
                        >
                            {GAME_RULES.map((rule) => (
                                <article
                                    key={rule.title}
                                    className="
                                        rounded-xl
                                        border
                                        border-white/10
                                        bg-white/[0.035]
                                        p-3
                                        transition
                                        hover:border-amber-300/20
                                        hover:bg-white/[0.06]

                                        [@media(max-height:520px)]:p-2
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-2
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-white/10
                                                bg-black/30
                                                text-base

                                                [@media(max-height:520px)]:h-7
                                                [@media(max-height:520px)]:w-7
                                                [@media(max-height:520px)]:text-sm
                                            "
                                        >
                                            {rule.icon}
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                className="
                                                    text-[11px]
                                                    font-black
                                                    leading-4
                                                    text-white
                                                "
                                            >
                                                {rule.title}
                                            </h3>

                                            <p
                                                className="
                                                    mt-1
                                                    text-[9px]
                                                    leading-4
                                                    text-stone-400

                                                    [@media(max-height:520px)]:text-[8px]
                                                    [@media(max-height:520px)]:leading-3
                                                "
                                            >
                                                {rule.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Role rules */}
                    <section className="min-w-0">
                        <div className="mb-3">
                            <p
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.25em]
                                    text-amber-400
                                "
                            >
                                Know your role
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-base
                                    font-black
                                    text-white

                                    [@media(max-height:520px)]:text-sm
                                "
                            >
                                Every soul has a purpose
                            </h2>
                        </div>

                        <div
                            className="
                                overflow-hidden
                                rounded-xl
                                border
                                border-white/10
                                bg-black/20
                            "
                        >
                            {ROLE_RULES.map(
                                (role, index) => (
                                    <div
                                        key={role.role}
                                        className={`
                                            grid
                                            grid-cols-[72px_70px_1fr]
                                            items-center
                                            gap-2
                                            px-3
                                            py-2
                                            transition
                                            hover:bg-white/[0.04]

                                            [@media(max-height:520px)]:grid-cols-[62px_62px_1fr]
                                            [@media(max-height:520px)]:px-2
                                            [@media(max-height:520px)]:py-1.5

                                            ${
                                                index !==
                                                ROLE_RULES.length - 1
                                                    ? "border-b border-white/10"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <h3
                                            className="
                                                truncate
                                                text-[10px]
                                                font-black
                                                text-white

                                                [@media(max-height:520px)]:text-[9px]
                                            "
                                        >
                                            {role.role}
                                        </h3>

                                        <span
                                            className={`
                                                w-fit
                                                rounded-full
                                                border
                                                px-2
                                                py-1
                                                text-[7px]
                                                font-bold
                                                uppercase
                                                tracking-wide

                                                ${getTeamStyle(
                                                    role.team
                                                )}
                                            `}
                                        >
                                            {role.team}
                                        </span>

                                        <p
                                            className="
                                                text-[9px]
                                                leading-4
                                                text-stone-400

                                                [@media(max-height:520px)]:text-[8px]
                                                [@media(max-height:520px)]:leading-3
                                            "
                                        >
                                            {role.rule}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>

                        <div
                            className="
                                mt-3
                                rounded-xl
                                border
                                border-amber-400/15
                                bg-amber-400/[0.05]
                                px-3
                                py-2
                            "
                        >
                            <p
                                className="
                                    text-center
                                    text-[9px]
                                    font-bold
                                    leading-4
                                    text-amber-200/80
                                "
                            >
                                The loudest player may be
                                innocent, and the quietest
                                player may be watching.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Compact footer */}
                <footer
                    className="
                        relative
                        flex
                        shrink-0
                        justify-center
                        border-t
                        border-white/10
                        bg-black/30
                        px-5
                        py-3

                        [@media(max-height:520px)]:py-2
                    "
                >
                    <Button
                        onClick={onClose}
                        variant="primary"
                        size="sm"
                        className="
                            w-full
                            max-w-[210px]
                            py-2
                            text-[10px]
                            uppercase
                            tracking-wider
                        "
                    >
                        Enter the Village
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default RulePopup;
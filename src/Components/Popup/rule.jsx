import React, { useEffect } from "react";
import Button from "../Button";

const GAME_RULES = [
    {
        icon: "🌙",
        title: "The Night Falls",
        description:
            "When darkness covers the village, every surviving character with a special ability secretly chooses an action. The Werewolf hunts, the Doctor protects, the Seer searches for truth, and the Shaman whispers information to the darkness.",
    },
    {
        icon: "💬",
        title: "Trust No One",
        description:
            "When morning arrives, the survivors discuss what happened. Players may accuse, defend, lie, manipulate, or remain suspiciously quiet. Every word can change how the village sees you.",
    },
    {
        icon: "🗳️",
        title: "The Village Decides",
        description:
            "After the discussion, every living player votes for someone to eliminate. The player with the most votes is executed and their true role is revealed.",
    },
    {
        icon: "🐺",
        title: "Werewolf Victory",
        description:
            "The Werewolf wins when only three players remain while the Werewolf is still alive. At that point, fear has conquered the village and nobody has enough power left to stop the final hunt.",
    },
    {
        icon: "🏘️",
        title: "Village Victory",
        description:
            "The Village team wins when the Werewolf is killed. Doctor, Seer, Knight, and ordinary Villagers all share this victory—even those who did not survive long enough to see the sunrise.",
    },
    {
        icon: "🃏",
        title: "Jester Victory",
        description:
            "The Jester does not care who controls the village. The Jester wins only by convincing everyone to eliminate them during the voting phase. Death is not their defeat—it is their final performance.",
    },
];

const ROLE_RULES = [
    {
        role: "Werewolf",
        team: "Darkness",
        rule:
            "Choose one player to attack every night. Survive the village vote and reduce the village to three remaining players.",
    },
    {
        role: "Shaman",
        team: "Darkness",
        rule:
            "Reveal one player's role each night and secretly guide the Werewolf toward the most dangerous targets. If the Werewolf falls, your protection disappears with them.",
    },
    {
        role: "Doctor",
        team: "Village",
        rule:
            "Protect one player every night. If you protect the Werewolf's target, that player survives until morning.",
    },
    {
        role: "Seer",
        team: "Village",
        rule:
            "Reveal one player's true role every night. Knowledge is powerful, but revealing too much may expose you to the Werewolf.",
    },
    {
        role: "Knight",
        team: "Village",
        rule:
            "You may strike one player with your blade. Kill an evil role and you become a hero. Kill an innocent player and the village will punish you with death.",
    },
    {
        role: "Villager",
        team: "Village",
        rule:
            "You have no supernatural ability. Your greatest weapons are observation, discussion, suspicion, and your vote.",
    },
    {
        role: "Jester",
        team: "Alone",
        rule:
            "Act suspicious without making your plan too obvious. Your goal is to be eliminated by the village vote.",
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

    return (
        <div
            className="
                fixed
                inset-0
                z-[999]
                flex
                items-center
                justify-center
                bg-black/80
                p-3
                backdrop-blur-md
                sm:p-6
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
                    max-h-[94vh]
                    w-full
                    max-w-5xl
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border-2
                    border-amber-300/20
                    bg-[#11100f]/95
                    shadow-2xl
                    shadow-black
                "
            >
                {/* Decorative background */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_42%)]
                    "
                />

                {/* Header */}
                <div
                    className="
                        relative
                        flex
                        items-start
                        justify-between
                        border-b
                        border-white/10
                        bg-black/30
                        px-5
                        py-5
                        sm:px-8
                        sm:py-6
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.45em]
                                text-amber-400
                                sm:text-xs
                            "
                        >
                            Before the moon rises
                        </p>

                        <h1
                            id="game-rules-title"
                            className="
                                mt-2
                                text-3xl
                                font-black
                                uppercase
                                tracking-wider
                                text-white
                                sm:text-5xl
                            "
                        >
                            Rules of the Village
                        </h1>

                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-6
                                text-stone-400
                                sm:text-base
                            "
                        >
                            By day, everyone is a
                            neighbour. By night,
                            somebody becomes the
                            hunter. Watch carefully,
                            speak wisely, and never
                            trust a friendly face too
                            quickly.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close game rules"
                        className="
                            ml-4
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            text-2xl
                            font-bold
                            text-stone-400
                            transition
                            hover:scale-105
                            hover:bg-white/10
                            hover:text-white
                        "
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable content */}
                <div
                    className="
                        relative
                        overflow-y-auto
                        px-5
                        py-6
                        sm:px-8
                        sm:py-8
                    "
                >
                    <section>
                        <div className="mb-5">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-red-400
                                "
                            >
                                How the game works
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-white
                                "
                            >
                                Survive. Deceive.
                                Decide.
                            </h2>
                        </div>

                        <div
                            className="
                                grid
                                gap-4
                                md:grid-cols-2
                            "
                        >
                            {GAME_RULES.map(
                                (rule) => (
                                    <article
                                        key={rule.title}
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            p-5
                                            transition
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-amber-300/25
                                            hover:bg-white/[0.07]
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-4
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    h-12
                                                    w-12
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    border
                                                    border-white/10
                                                    bg-black/30
                                                    text-2xl
                                                "
                                            >
                                                {
                                                    rule.icon
                                                }
                                            </div>

                                            <div>
                                                <h3
                                                    className="
                                                        text-lg
                                                        font-black
                                                        text-white
                                                    "
                                                >
                                                    {
                                                        rule.title
                                                    }
                                                </h3>

                                                <p
                                                    className="
                                                        mt-2
                                                        text-sm
                                                        leading-6
                                                        text-stone-400
                                                    "
                                                >
                                                    {
                                                        rule.description
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    </section>

                    <section className="mt-10">
                        <div className="mb-5">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-amber-400
                                "
                            >
                                Know your role
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-2xl
                                    font-black
                                    text-white
                                "
                            >
                                Every soul has a
                                purpose
                            </h2>
                        </div>

                        <div
                            className="
                                overflow-hidden
                                rounded-2xl
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
                                            gap-2
                                            px-5
                                            py-5
                                            transition
                                            hover:bg-white/[0.04]
                                            sm:grid-cols-[150px_110px_1fr]
                                            sm:items-start
                                            ${
                                                index !==
                                                ROLE_RULES.length -
                                                    1
                                                    ? "border-b border-white/10"
                                                    : ""
                                            }
                                        `}
                                    >
                                        <h3
                                            className="
                                                font-black
                                                text-white
                                            "
                                        >
                                            {role.role}
                                        </h3>

                                        <span
                                            className={`
                                                w-fit
                                                rounded-full
                                                border
                                                px-3
                                                py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                ${
                                                    role.team ===
                                                    "Darkness"
                                                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                                                        : role.team ===
                                                          "Village"
                                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                                        : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                                                }
                                            `}
                                        >
                                            {role.team}
                                        </span>

                                        <p
                                            className="
                                                text-sm
                                                leading-6
                                                text-stone-400
                                            "
                                        >
                                            {role.rule}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    <div
                        className="
                            mt-8
                            rounded-2xl
                            border
                            border-amber-400/20
                            bg-amber-400/[0.06]
                            p-5
                            text-center
                        "
                    >
                        <p
                            className="
                                text-sm
                                font-bold
                                leading-6
                                text-amber-200
                            "
                        >
                            Remember: the loudest
                            player may be innocent,
                            the quietest player may be
                            watching, and the person
                            saving your life tonight
                            may vote against you
                            tomorrow.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="
                        relative
                        flex
                        justify-center
                        border-t
                        border-white/10
                        bg-black/30
                        px-5
                        py-4
                        sm:px-8
                    "
                >
                    <Button
                        onClick={onClose}
                        variant="primary"
                        size="md"
                        className="
                            w-full
                            max-w-[280px]
                            text-sm
                            uppercase
                            tracking-wider
                        "
                    >
                        Enter the Village
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RulePopup;
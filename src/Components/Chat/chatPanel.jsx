import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import Button from "../Button";

/* -------------------------------------------------------------------------- */
/* Action configuration                                                       */
/* -------------------------------------------------------------------------- */

const MENUS = {
    accuse: {
        label: "ACCUSE",

        activeClass:
            "border-red-500/60 bg-red-500/15 text-red-300",

        idleClass:
            "border-red-500/20 text-red-300/70 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300",

        options: [
            {
                value: "werewolf",
                label: "WEREWOLF",
            },
            {
                value: "shaman",
                label: "SHAMAN",
            },
        ],
    },

    defend: {
        label: "DEFEND",

        activeClass:
            "border-emerald-500/60 bg-emerald-500/15 text-emerald-300",

        idleClass:
            "border-emerald-500/20 text-emerald-300/70 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300",

        options: [
            {
                value: "innocent",
                label: "INNOCENT",
            },
            {
                value: "villager",
                label: "VILLAGER",
            },
            {
                value: "doctor",
                label: "DOCTOR",
            },
            {
                value: "knight",
                label: "KNIGHT",
            },
            {
                value: "seer",
                label: "SEER",
            },
        ],
    },
};

const MESSAGE_STYLES = {
    accuse: {
        background: "bg-red-950/35",
        border: "border-red-800/35",
        sender: "text-red-400",
        icon: "⚔",
    },

    defend: {
        background: "bg-emerald-950/35",
        border: "border-emerald-800/35",
        sender: "text-emerald-400",
        icon: "🛡",
    },

    system: {
        background: "bg-amber-950/25",
        border: "border-amber-700/25",
        sender: "text-amber-400",
        icon: "◆",
    },

    default: {
        background: "bg-black/25",
        border: "border-white/10",
        sender: "text-stone-300",
        icon: "●",
    },
};

/* -------------------------------------------------------------------------- */
/* Message builder                                                            */
/* -------------------------------------------------------------------------- */

function buildMessage({
    type,
    option,
    target,
    senderName,
    senderId,
}) {
    let text = "";

    if (type === "accuse") {
        text =
            `I suspect ${target.name} is the ` +
            `${option.toUpperCase()}!`;
    }

    if (type === "defend") {
        if (option === "innocent") {
            text =
                `${target.name} is innocent. ` +
                "We should trust them.";
        } else {
            text =
                `${target.name} is the ` +
                `${option.toUpperCase()}, I swear it.`;
        }
    }

    return {
        id:
            `human-${Date.now()}-` +
            `${Math.random()}`,

        senderId,
        senderName,
        sender: senderName,

        targetId: target.id,
        targetName: target.name,

        text,
        type,

        timestamp: Date.now(),
    };
}

/* -------------------------------------------------------------------------- */
/* Option button                                                              */
/* -------------------------------------------------------------------------- */

function OptionPill({
    label,
    onClick,
    disabled = false,
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="
                rounded-md
                border
                border-white/10
                bg-black/30
                px-2
                py-1.5
                text-[7px]
                font-bold
                tracking-wide
                text-stone-300
                transition

                hover:border-white/25
                hover:bg-white/[0.06]
                hover:text-white

                active:scale-95

                disabled:cursor-not-allowed
                disabled:opacity-40

                [@media(max-height:480px)]:px-1.5
                [@media(max-height:480px)]:py-1
                [@media(max-height:480px)]:text-[6px]
            "
        >
            {label}
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Chat message                                                               */
/* -------------------------------------------------------------------------- */

function MessageRow({
    message,
    myId,
}) {
    const style =
        MESSAGE_STYLES[message.type] ??
        MESSAGE_STYLES.default;

    const senderName =
        message.senderName ??
        message.sender ??
        "Unknown";

    const isSystem =
        message.type === "system" ||
        message.senderId == null;

    const isMine =
        !isSystem &&
        Number(message.senderId) ===
            Number(myId);

    return (
        <div
            className={`
                flex
                gap-2
                rounded-md
                border
                px-2
                py-2

                ${style.background}
                ${style.border}

                [@media(max-height:480px)]:gap-1.5
                [@media(max-height:480px)]:px-1.5
                [@media(max-height:480px)]:py-1.5
            `}
            style={{
                animation:
                    "chatMessageIn 0.2s ease-out both",
            }}
        >
            <span
                className="
                    mt-[1px]
                    shrink-0
                    text-[8px]

                    [@media(max-height:480px)]:text-[7px]
                "
            >
                {style.icon}
            </span>

            <div className="min-w-0 flex-1">
                <div
                    className="
                        flex
                        items-center
                        gap-1.5
                    "
                >
                    <span
                        className={`
                            truncate
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-wider

                            ${style.sender}
                        `}
                    >
                        {senderName}
                    </span>

                    {isMine && (
                        <span
                            className="
                                text-[6px]
                                uppercase
                                tracking-wider
                                text-stone-600
                            "
                        >
                            You
                        </span>
                    )}
                </div>

                <p
                    className="
                        mt-0.5
                        break-words
                        text-[8px]
                        leading-4
                        text-stone-300

                        [@media(max-height:480px)]:text-[7px]
                        [@media(max-height:480px)]:leading-3
                    "
                >
                    {message.text}
                </p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ChatPanel({
    selectedPlayer = null,

    myName = "You",
    myId = 0,
    myRole = "villager",

    /*
     * Use messages with the new Discussion component.
     * npcMessages remains supported for compatibility.
     */
    messages = [],
    npcMessages = [],

    npcDiscussionRunning = false,

    onAction,
    onEndDiscussion,
}) {
    const [
        activeMenu,
        setActiveMenu,
    ] = useState(null);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const [
        humanHasSpoken,
        setHumanHasSpoken,
    ] = useState(false);

    const historyRef = useRef(null);

    /*
     * Merge both message props without duplicates.
     */
    const chatHistory = useMemo(() => {
        const combined = [
            ...messages,
            ...npcMessages,
        ];

        const uniqueMessages =
            new Map();

        combined.forEach(
            (message, index) => {
                const id =
                    message.id ??
                    `message-${index}`;

                if (
                    !uniqueMessages.has(id)
                ) {
                    uniqueMessages.set(
                        id,
                        {
                            ...message,
                            id,
                        }
                    );
                }
            }
        );

        return Array.from(
            uniqueMessages.values()
        ).sort(
            (first, second) =>
                Number(
                    first.createdAt ??
                        first.timestamp ??
                        0
                ) -
                Number(
                    second.createdAt ??
                        second.timestamp ??
                        0
                )
        );
    }, [
        messages,
        npcMessages,
    ]);

    /*
     * Scroll to the latest message.
     */
    useEffect(() => {
        const element =
            historyRef.current;

        if (!element) return;

        element.scrollTo({
            top: element.scrollHeight,
            behavior: "smooth",
        });
    }, [chatHistory]);

    /*
     * Close option menu when selecting
     * another player.
     */
    useEffect(() => {
        setActiveMenu(null);
    }, [selectedPlayer?.id]);

    /*
     * Close action menus while NPCs speak.
     */
    useEffect(() => {
        if (npcDiscussionRunning) {
            setActiveMenu(null);
        }
    }, [npcDiscussionRunning]);

    /*
     * The parent clears chatMessages when
     * a new day begins.
     */
    useEffect(() => {
        if (chatHistory.length === 0) {
            setHumanHasSpoken(false);
            setSubmitting(false);
            setActiveMenu(null);
        }
    }, [chatHistory.length]);

    const playerCanAct =
        Boolean(selectedPlayer) &&
        selectedPlayer?.alive !== false &&
        !npcDiscussionRunning &&
        !submitting &&
        !humanHasSpoken;

    const handleMainButton = (
        menuKey
    ) => {
        if (!playerCanAct) return;

        setActiveMenu(
            (currentMenu) =>
                currentMenu === menuKey
                    ? null
                    : menuKey
        );
    };

    const handleOption = async (
        menuKey,
        optionValue
    ) => {
        if (
            !selectedPlayer ||
            !playerCanAct
        ) {
            return;
        }

        const message =
            buildMessage({
                type: menuKey,
                option: optionValue,
                target:
                    selectedPlayer,
                senderName:
                    myName,
                senderId:
                    myId,
                myRole,
            });

        const action = {
            type: menuKey,

            target:
                selectedPlayer,

            subOption:
                optionValue,

            message,
        };

        setSubmitting(true);
        setActiveMenu(null);

        try {
            const accepted =
                await onAction?.(
                    action
                );

            /*
             * Undefined counts as accepted for
             * callbacks that do not return a value.
             */
            if (accepted !== false) {
                setHumanHasSpoken(
                    true
                );
            }
        } catch (error) {
            console.error(
                "Unable to submit discussion action:",
                error
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleEndDiscussion =
        () => {
            if (
                npcDiscussionRunning ||
                submitting
            ) {
                return;
            }

            onEndDiscussion?.();
        };

    const actionDisabled =
        !playerCanAct;

    const statusMessage = (() => {
        if (npcDiscussionRunning) {
            return "NPCs are speaking...";
        }

        if (submitting) {
            return "Sending message...";
        }

        if (humanHasSpoken) {
            return "You have already spoken.";
        }

        if (!selectedPlayer) {
            return "Click a player to choose a target.";
        }

        return `Target: ${selectedPlayer.name}`;
    })();

    return (
        <>
            <style>{`
                @keyframes chatMessageIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes discussionPulse {
                    0%, 100% {
                        opacity: 0.45;
                    }

                    50% {
                        opacity: 1;
                    }
                }
            `}</style>

            <aside
                className="
                    absolute
                    right-0
                    top-0
                    z-40
                    flex
                    h-full
                    w-[clamp(225px,27vw,300px)]
                    flex-col
                    overflow-hidden
                    border-l
                    border-white/10
                    bg-[#151210]/80
                    shadow-2xl
                    backdrop-blur-md

                    [@media(max-height:480px)]:w-[clamp(210px,31vw,260px)]
                "
            >
                {/* Header */}
                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-2
                        border-b
                        border-white/10
                        bg-black/20
                        px-3
                        py-2.5

                        [@media(max-height:480px)]:px-2
                        [@media(max-height:480px)]:py-1.5
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                truncate
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.22em]
                                text-white
                            "
                        >
                            Discussion
                        </p>

                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[7px]
                                text-stone-500

                                [@media(max-height:480px)]:hidden
                            "
                        >
                            Accuse or defend a
                            player
                        </p>
                    </div>

                    <Button
                        type="button"
                        size="sm"
                        disabled={
                            npcDiscussionRunning ||
                            submitting
                        }
                        onClick={
                            handleEndDiscussion
                        }
                        className="
                            shrink-0
                            border-none
                            bg-rose-700
                            px-3
                            py-1.5
                            text-[7px]
                            text-white

                            hover:bg-rose-600

                            disabled:cursor-not-allowed
                            disabled:bg-stone-700
                            disabled:text-stone-400

                            [@media(max-height:480px)]:px-2
                            [@media(max-height:480px)]:py-1
                            [@media(max-height:480px)]:text-[6px]
                        "
                    >
                        End
                    </Button>
                </header>

                {/* NPC speaking indicator */}
                {npcDiscussionRunning && (
                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                            border-b
                            border-amber-500/15
                            bg-amber-500/[0.05]
                            px-3
                            py-1.5

                            [@media(max-height:480px)]:px-2
                            [@media(max-height:480px)]:py-1
                        "
                    >
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-amber-400
                            "
                            style={{
                                animation:
                                    "discussionPulse 0.9s infinite",
                            }}
                        />

                        <span
                            className="
                                text-[7px]
                                uppercase
                                tracking-wider
                                text-amber-300
                            "
                        >
                            NPC discussion in
                            progress
                        </span>
                    </div>
                )}

                {/* Chat history */}
                <div
                    ref={historyRef}
                    aria-live="polite"
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                        gap-2
                        overflow-y-auto
                        px-2
                        py-2

                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-white/10

                        [@media(max-height:480px)]:gap-1.5
                        [@media(max-height:480px)]:px-1.5
                        [@media(max-height:480px)]:py-1.5
                    "
                >
                    {chatHistory.length ===
                    0 ? (
                        <div
                            className="
                                flex
                                flex-1
                                items-center
                                justify-center
                                px-4
                            "
                        >
                            <p
                                className="
                                    text-center
                                    text-[7px]
                                    uppercase
                                    leading-5
                                    tracking-wider
                                    text-stone-500
                                "
                            >
                                The village is
                                silent.
                                <br />
                                Wait for someone
                                to speak.
                            </p>
                        </div>
                    ) : (
                        chatHistory.map(
                            (message) => (
                                <MessageRow
                                    key={
                                        message.id
                                    }
                                    message={
                                        message
                                    }
                                    myId={myId}
                                />
                            )
                        )
                    )}
                </div>

                {/* Actions */}
                <footer
                    className="
                        shrink-0
                        border-t
                        border-white/10
                        bg-black/25
                    "
                >
                    {/* Current status/target */}
                    <div
                        className="
                            border-b
                            border-white/[0.07]
                            px-2
                            py-2

                            [@media(max-height:480px)]:py-1.5
                        "
                    >
                        <div
                            className={`
                                flex
                                min-h-8
                                items-center
                                gap-2
                                rounded-md
                                border
                                px-2

                                ${
                                    selectedPlayer &&
                                    !humanHasSpoken
                                        ? "border-amber-400/25 bg-amber-400/[0.05]"
                                        : "border-white/10 bg-black/20"
                                }

                                [@media(max-height:480px)]:min-h-7
                            `}
                        >
                            <span
                                className={`
                                    text-[8px]

                                    ${
                                        selectedPlayer
                                            ? "text-amber-300"
                                            : "text-stone-600"
                                    }
                                `}
                            >
                                ◎
                            </span>

                            <span
                                className={`
                                    min-w-0
                                    flex-1
                                    truncate
                                    text-[7px]
                                    uppercase
                                    tracking-wider

                                    ${
                                        npcDiscussionRunning
                                            ? "text-amber-300"
                                            : humanHasSpoken
                                            ? "text-stone-500"
                                            : selectedPlayer
                                            ? "text-stone-200"
                                            : "text-stone-600"
                                    }
                                `}
                            >
                                {statusMessage}
                            </span>
                        </div>
                    </div>

                    {/* Sub-options */}
                    <div
                        className="
                            min-h-[42px]
                            px-2
                            py-2

                            [@media(max-height:480px)]:min-h-[32px]
                            [@media(max-height:480px)]:py-1.5
                        "
                    >
                        {activeMenu && (
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-1.5

                                    [@media(max-height:480px)]:gap-1
                                "
                                style={{
                                    animation:
                                        "chatMessageIn 0.15s ease-out both",
                                }}
                            >
                                {MENUS[
                                    activeMenu
                                ].options.map(
                                    (option) => (
                                        <OptionPill
                                            key={
                                                option.value
                                            }
                                            label={
                                                option.label
                                            }
                                            disabled={
                                                actionDisabled
                                            }
                                            onClick={() =>
                                                handleOption(
                                                    activeMenu,
                                                    option.value
                                                )
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main buttons */}
                    <div
                        className="
                            flex
                            gap-1.5
                            px-2
                            pb-2

                            [@media(max-height:480px)]:gap-1
                            [@media(max-height:480px)]:pb-1.5
                        "
                    >
                        {Object.entries(
                            MENUS
                        ).map(
                            ([
                                menuKey,
                                menu,
                            ]) => {
                                const isActive =
                                    activeMenu ===
                                    menuKey;

                                return (
                                    <button
                                        key={
                                            menuKey
                                        }
                                        type="button"
                                        disabled={
                                            actionDisabled
                                        }
                                        onClick={() =>
                                            handleMainButton(
                                                menuKey
                                            )
                                        }
                                        className={`
                                            flex-1
                                            rounded-md
                                            border
                                            py-2
                                            text-[7px]
                                            font-bold
                                            tracking-wide
                                            transition

                                            active:scale-[0.97]

                                            [@media(max-height:480px)]:py-1.5
                                            [@media(max-height:480px)]:text-[6px]

                                            ${
                                                actionDisabled
                                                    ? "cursor-not-allowed border-white/5 bg-transparent text-stone-700"
                                                    : isActive
                                                    ? menu.activeClass
                                                    : menu.idleClass
                                            }
                                        `}
                                    >
                                        {
                                            menu.label
                                        }
                                    </button>
                                );
                            }
                        )}
                    </div>
                </footer>
            </aside>
        </>
    );
}
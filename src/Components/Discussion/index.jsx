import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import useStore from "@/Store/useStore";

import SquareDayBackground from "../../assets/background/squarediscussion.png";
import ForestBackground from "../../assets/background/dark-forest.png";
import SunPixelIcon from "../../assets/icon/sun.png";

import roles from "@/constant/roles";
import { PHASE } from "@/constant/phase";

import CardRevealAnimation from "../Animation/CardReveal";
import Avatar from "../Avatar";
import ChatPanel from "../Chat/chatPanel";
import CutScene from "../CutScene";
import RulePopup from "../Popup/rule";

import {
    pickRandomNpcSpeakers,
    chooseNpcDiscussionAction,
    buildNpcStatement,
    buildSelfDefenceStatement,
} from "@/logic/npc/npcDiscussion";

import {
    delay,
} from "@/utils/async";

const UNIQUE_ROLES = [
    "doctor",
    "seer",
    "knight",
    "werewolf",
    "shaman",
    "jester",
];

function getMessageText(
    action,
    sender,
    target
) {
    const suppliedMessage =
        action?.message?.text ??
        action?.message?.content ??
        action?.message?.message;

    if (
        typeof suppliedMessage ===
            "string" &&
        suppliedMessage.trim()
    ) {
        return suppliedMessage.trim();
    }

    if (
        action.type === "accuse"
    ) {
        return `${sender.name} accuses ${target.name}.`;
    }

    if (
        action.type === "defend"
    ) {
        if (
            Number(sender.id) ===
            Number(target.id)
        ) {
            return `${sender.name} defends themselves.`;
        }

        return `${sender.name} defends ${target.name}.`;
    }

    return `${sender.name} speaks.`;
}

/**
 * Small permanent discussion log.
 *
 * This guarantees that NPC messages are visible
 * even before ChatPanel is updated to render the
 * messages prop.
 */
function DiscussionFeed({
    messages,
}) {
    const visibleMessages =
        messages.slice(-6);

    return (
        <div
            className="
                pointer-events-none
                absolute
                bottom-3
                left-3
                z-40
                flex
                max-h-44
                w-[290px]
                flex-col
                overflow-hidden
                rounded-lg
                border
                border-white/10
                bg-black/65
                shadow-xl
                backdrop-blur-sm

                [@media(max-height:520px)]:bottom-2
                [@media(max-height:520px)]:left-2
                [@media(max-height:520px)]:max-h-32
                [@media(max-height:520px)]:w-[230px]
            "
        >
            <div
                className="
                    shrink-0
                    border-b
                    border-white/10
                    px-3
                    py-2
                "
            >
                <p
                    className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-stone-400
                    "
                >
                    Village Discussion
                </p>
            </div>

            <div
                className="
                    flex
                    flex-col
                    gap-2
                    overflow-hidden
                    px-3
                    py-2
                "
            >
                {visibleMessages.length ===
                0 ? (
                    <p
                        className="
                            text-[9px]
                            text-stone-500
                        "
                    >
                        Nobody has spoken yet.
                    </p>
                ) : (
                    visibleMessages.map(
                        (message) => (
                            <div
                                key={
                                    message.id
                                }
                                className="
                                    border-b
                                    border-white/[0.07]
                                    pb-1.5
                                    last:border-none
                                    last:pb-0
                                "
                            >
                                <p
                                    className={`
                                        text-[8px]
                                        font-bold

                                        ${
                                            message.type ===
                                            "accuse"
                                                ? "text-red-400"
                                                : message.type ===
                                                  "defend"
                                                ? "text-emerald-400"
                                                : "text-amber-300"
                                        }
                                    `}
                                >
                                    {
                                        message.senderName
                                    }
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        line-clamp-2
                                        text-[9px]
                                        leading-4
                                        text-stone-200

                                        [@media(max-height:520px)]:text-[8px]
                                        [@media(max-height:520px)]:leading-3
                                    "
                                >
                                    {
                                        message.text
                                    }
                                </p>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}

function AvatarSpeechBubble({
    message,
    position,
}) {
    if (!message || !position) {
        return null;
    }

    return (
        <div
            className="
                pointer-events-none
                absolute
                z-50
                w-max
                max-w-[180px]
                -translate-x-1/2
                -translate-y-[125%]
                rounded-lg
                border
                border-white/15
                bg-black/90
                px-3
                py-2
                text-center
                text-[9px]
                leading-4
                text-white
                shadow-xl
                backdrop-blur-sm

                [@media(max-height:520px)]:max-w-[135px]
                [@media(max-height:520px)]:px-2
                [@media(max-height:520px)]:py-1.5
                [@media(max-height:520px)]:text-[8px]
                [@media(max-height:520px)]:leading-3
            "
            style={{
                top: position.top,
                left: position.left,
            }}
        >
            {message}

            <span
                className="
                    absolute
                    left-1/2
                    top-full
                    -translate-x-1/2
                    border-x-[6px]
                    border-t-[6px]
                    border-x-transparent
                    border-t-black/90
                "
            />
        </div>
    );
}

const Discussion = ({
    data,
    onNextSession,
}) => {
    const gameState = useStore(
        (state) => state.game
    );

    const updateRelation = useStore(
        (state) =>
            state.updateRelation
    );

    const updateSpoken = useStore(
        (state) =>
            state.updateSpoken
    );

    const recordDiscussion = useStore(
        (state) =>
            state.recordDiscussion
    );

    const addPreviousLies = useStore(
        (state) =>
            state.addPreviousLies
    );

    const players =
        gameState.players ??
        data.players ??
        [];

    const day =
        gameState.day ??
        data.day ??
        1;

    const currentPlayer =
        players.find(
            (player) =>
                player.isHuman
        ) ?? players[0];

    const [
        isCardAnimationOpen,
        setIsCardAnimationOpen,
    ] = useState(day < 2);

    const [
        selectedPlayer,
        setSelectedPlayer,
    ] = useState(null);

    const [
        showCutScene,
        setShowCutScene,
    ] = useState(day > 1);

    const [
        isShowRule,
        setIsShowRule,
    ] = useState(false);

    const [
        chatMessages,
        setChatMessages,
    ] = useState([]);

    const [
        activeBubble,
        setActiveBubble,
    ] = useState(null);

    const [
        npcDiscussionRunning,
        setNpcDiscussionRunning,
    ] = useState(false);

    const npcDiscussionStartedRef =
        useRef(false);

    const npcDiscussionRunRef =
        useRef(0);

    const clamp = (value) => {
        return Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );
    };

    const handleCloseCardAnimation =
        () => {
            setIsCardAnimationOpen(
                false
            );

            setShowCutScene(true);
        };

    const handleCutSceneFinish =
        () => {
            setShowCutScene(false);

            if (day === 1) {
                setIsShowRule(true);
            }
        };

    const handleAvatarOnClick = (
        player
    ) => {
        if (!player.alive) return;

        if (
            Number(player.id) ===
            Number(currentPlayer?.id)
        ) {
            return;
        }

        setSelectedPlayer(player);
    };

    /**
     * Apply one accusation or defence to
     * the relationship system.
     *
     * Returns true when accepted.
     */
    const handlePlayerAction = (
        action
    ) => {
        const {
            type,
            target,
            message = {},
            subOption,
            isReaction = false,
        } = action ?? {};

        if (
            !type ||
            !target ||
            message.senderId == null
        ) {
            return false;
        }

        const latestPlayers =
            useStore.getState()
                .game.players;

        const senderId =
            message.senderId;

        const claimedRole =
            subOption ?? null;

        const sender =
            latestPlayers.find(
                (player) =>
                    Number(player.id) ===
                    Number(senderId)
            );

        const latestTarget =
            latestPlayers.find(
                (player) =>
                    Number(player.id) ===
                    Number(target.id)
            );

        if (
            !sender ||
            !latestTarget ||
            !sender.alive ||
            !latestTarget.alive
        ) {
            return false;
        }

        /*
         * Normal speakers may only speak once.
         * Reactive self-defence does not consume
         * their normal discussion turn.
         */
        if (
            sender.hasSpoken &&
            !isReaction
        ) {
            console.log(
                "Player has already spoken"
            );

            return false;
        }

        if (!isReaction) {
            updateSpoken(
                senderId,
                true
            );
        }

        for (
            const observer of
            latestPlayers
        ) {
            if (!observer.alive) {
                continue;
            }

            /*
             * The speaker does not change their
             * own opinion because of their speech.
             */
            if (
                Number(observer.id) ===
                Number(senderId)
            ) {
                continue;
            }

            const relationToTarget =
                observer.relations?.[
                    latestTarget.id
                ] ??
                observer.relations?.[
                    String(
                        latestTarget.id
                    )
                ] ??
                {};

            const relationToSender =
                observer.relations?.[
                    senderId
                ] ??
                observer.relations?.[
                    String(senderId)
                ] ??
                {};

            const isSelfDefence =
                type === "defend" &&
                Number(senderId) ===
                    Number(
                        latestTarget.id
                    );

            /*
             * An accused NPC defending themselves
             * lowers other players' suspicion
             * toward them slightly.
             */
            if (isSelfDefence) {
                updateRelation(
                    observer.id,
                    latestTarget.id,
                    {
                        suspicion:
                            clamp(
                                (
                                    relationToTarget
                                        .suspicion ??
                                    0
                                ) - 12
                            ),
                    }
                );

                continue;
            }

            if (
                type === "accuse"
            ) {
                /*
                 * The accused player dislikes and
                 * distrusts the accuser.
                 */
                if (
                    Number(
                        observer.id
                    ) ===
                    Number(
                        latestTarget.id
                    )
                ) {
                    updateRelation(
                        observer.id,
                        senderId,
                        {
                            suspicion:
                                clamp(
                                    (
                                        relationToSender
                                            .suspicion ??
                                        0
                                    ) + 30
                                ),

                            aggression:
                                clamp(
                                    (
                                        relationToSender
                                            .aggression ??
                                        0
                                    ) + 40
                                ),
                        }
                    );
                } else {
                    /*
                     * Everyone else becomes more
                     * suspicious of the accused.
                     */
                    updateRelation(
                        observer.id,
                        latestTarget.id,
                        {
                            suspicion:
                                clamp(
                                    (
                                        relationToTarget
                                            .suspicion ??
                                        0
                                    ) + 20
                                ),
                        }
                    );

                    /*
                     * The accusation also makes the
                     * speaker look more aggressive.
                     */
                    updateRelation(
                        observer.id,
                        senderId,
                        {
                            aggression:
                                clamp(
                                    (
                                        relationToSender
                                            .aggression ??
                                        0
                                    ) + 20
                                ),
                        }
                    );
                }
            }

            if (
                type === "defend"
            ) {
                /*
                 * The defended player trusts their
                 * defender slightly more.
                 */
                if (
                    Number(
                        observer.id
                    ) ===
                    Number(
                        latestTarget.id
                    )
                ) {
                    updateRelation(
                        observer.id,
                        senderId,
                        {
                            suspicion:
                                clamp(
                                    (
                                        relationToSender
                                            .suspicion ??
                                        0
                                    ) - 15
                                ),

                            aggression:
                                clamp(
                                    (
                                        relationToSender
                                            .aggression ??
                                        0
                                    ) + 5
                                ),
                        }
                    );
                } else {
                    /*
                     * Everyone else becomes slightly
                     * less suspicious of the target.
                     */
                    updateRelation(
                        observer.id,
                        latestTarget.id,
                        {
                            suspicion:
                                clamp(
                                    (
                                        relationToTarget
                                            .suspicion ??
                                        0
                                    ) - 10
                                ),
                        }
                    );

                    updateRelation(
                        observer.id,
                        senderId,
                        {
                            aggression:
                                clamp(
                                    (
                                        relationToSender
                                            .aggression ??
                                        0
                                    ) + 5
                                ),
                        }
                    );
                }
            }
        }

        recordDiscussion(
            senderId,
            type,
            latestTarget.id,
            claimedRole
        );

        /*
         * False unique-role defence.
         *
         * Example:
         * Sarah says Abu is the Knight,
         * but Abu is not the Knight.
         */
        if (
            type === "defend" &&
            claimedRole &&
            UNIQUE_ROLES.includes(
                claimedRole
            ) &&
            latestTarget.role !==
                claimedRole
        ) {
            const realRoleHolder =
                latestPlayers.find(
                    (player) =>
                        player.alive &&
                        player.role ===
                            claimedRole
                );

            if (
                realRoleHolder &&
                Number(
                    realRoleHolder.id
                ) !==
                    Number(senderId)
            ) {
                addPreviousLies(
                    senderId,
                    50,
                    [
                        realRoleHolder.id,
                    ]
                );
            }
        }

        return true;
    };

    /**
     * Apply the action, add it to chat,
     * and temporarily show a bubble.
     */
    const playDialogue = async (
        action,
        bubbleDuration = 1900
    ) => {
        const latestPlayers =
            useStore.getState()
                .game.players;

        const senderId =
            action?.message
                ?.senderId;

        const sender =
            latestPlayers.find(
                (player) =>
                    Number(player.id) ===
                    Number(senderId)
            );

        const target =
            latestPlayers.find(
                (player) =>
                    Number(player.id) ===
                    Number(
                        action?.target?.id
                    )
            );

        if (!sender || !target) {
            return false;
        }

        const accepted =
            handlePlayerAction({
                ...action,
                target,
            });

        if (!accepted) {
            return false;
        }

        const text =
            getMessageText(
                action,
                sender,
                target
            );

        const chatEntry = {
            id:
                `${Date.now()}-` +
                `${Math.random()}`,

            senderId:
                sender.id,

            senderName:
                sender.name,

            targetId:
                target.id,

            targetName:
                target.name,

            type:
                action.type,

            text,

            createdAt:
                Date.now(),
        };

        setChatMessages(
            (messages) => [
                ...messages,
                chatEntry,
            ]
        );

        setActiveBubble(
            chatEntry
        );

        await delay(
            bubbleDuration
        );

        setActiveBubble(
            (currentBubble) =>
                currentBubble?.id ===
                chatEntry.id
                    ? null
                    : currentBubble
        );

        return true;
    };

    const addSystemMessage = (
        text
    ) => {
        setChatMessages(
            (messages) => [
                ...messages,
                {
                    id:
                        `${Date.now()}-system-` +
                        `${Math.random()}`,

                    senderId: null,
                    senderName:
                        "System",

                    targetId: null,
                    targetName: null,

                    type: "system",
                    text,

                    createdAt:
                        Date.now(),
                },
            ]
        );
    };

    /**
     * Three random NPCs speak.
     *
     * Self-defence reactions do not count
     * as part of the three selected speakers.
     */
    const runNpcDiscussion = async (
        runId
    ) => {
        setNpcDiscussionRunning(
            true
        );

        const initialPlayers =
            useStore.getState()
                .game.players;

        const speakerIds =
            pickRandomNpcSpeakers(
                initialPlayers,
                3
            ).map(
                (player) =>
                    player.id
            );

        for (
            const speakerId of
            speakerIds
        ) {
            if (
                runId !==
                npcDiscussionRunRef.current
            ) {
                return;
            }

            await delay(550);

            const latestPlayers =
                useStore.getState()
                    .game.players;

            const speaker =
                latestPlayers.find(
                    (player) =>
                        Number(
                            player.id
                        ) ===
                        Number(
                            speakerId
                        )
                );

            if (
                !speaker ||
                !speaker.alive
            ) {
                continue;
            }

            const decision =
                chooseNpcDiscussionAction(
                    speaker,
                    latestPlayers
                );

            if (!decision) {
                continue;
            }

            const statement =
                buildNpcStatement({
                    speaker,

                    target:
                        decision.target,

                    type:
                        decision.type,

                    directive:
                        decision.directive,
                });

            const spoke =
                await playDialogue({
                    type:
                        decision.type,

                    target:
                        decision.target,

                    message: {
                        senderId:
                            speaker.id,

                        text:
                            statement,
                    },

                    /*
                     * An NPC accusation claims the
                     * target may be the Werewolf.
                     */
                    subOption:
                        decision.type ===
                        "accuse"
                            ? "werewolf"
                            : null,
                });

            if (!spoke) {
                continue;
            }

            /*
             * Accused players respond immediately.
             */
            if (
                decision.type ===
                "accuse"
            ) {
                await delay(350);

                if (
                    runId !==
                    npcDiscussionRunRef.current
                ) {
                    return;
                }

                const updatedPlayers =
                    useStore.getState()
                        .game.players;

                const accused =
                    updatedPlayers.find(
                        (player) =>
                            Number(
                                player.id
                            ) ===
                            Number(
                                decision
                                    .target
                                    .id
                            )
                    );

                const accuser =
                    updatedPlayers.find(
                        (player) =>
                            Number(
                                player.id
                            ) ===
                            Number(
                                speaker.id
                            )
                    );

                if (
                    !accused?.alive ||
                    !accuser
                ) {
                    continue;
                }

                /*
                 * Do not automatically speak for
                 * the human player.
                 */
                if (
                    accused.isHuman
                ) {
                    setSelectedPlayer(
                        accuser
                    );

                    addSystemMessage(
                        `${accused.name}, ${accuser.name} accused you. You may respond using the discussion panel.`
                    );

                    continue;
                }

                const defenceText =
                    buildSelfDefenceStatement({
                        accused,
                        accuser,
                    });

                await playDialogue(
                    {
                        type:
                            "defend",

                        /*
                         * Sender and target are the
                         * same during self-defence.
                         */
                        target:
                            accused,

                        message: {
                            senderId:
                                accused.id,

                            text:
                                defenceText,
                        },

                        subOption: null,

                        /*
                         * This reaction does not use
                         * the NPC's normal speaking turn.
                         */
                        isReaction: true,
                    },
                    1700
                );
            }
        }

        if (
            runId ===
            npcDiscussionRunRef.current
        ) {
            setNpcDiscussionRunning(
                false
            );

            addSystemMessage(
                "The NPC discussion has ended. You may now speak or continue to voting."
            );
        }
    };

    /*
     * Reset the NPC discussion whenever
     * a new day begins.
     */
    useEffect(() => {
        npcDiscussionRunRef.current +=
            1;

        npcDiscussionStartedRef.current =
            false;

        setNpcDiscussionRunning(false);
        setActiveBubble(null);
        setChatMessages([]);
        setSelectedPlayer(null);
    }, [day]);

    const canStartNpcDiscussion =
        !isCardAnimationOpen &&
        !showCutScene &&
        !isShowRule;

    /*
     * Start the NPC sequence after every intro
     * overlay has closed.
     */
    useEffect(() => {
        if (
            !canStartNpcDiscussion
        ) {
            return;
        }

        if (
            npcDiscussionStartedRef
                .current
        ) {
            return;
        }

        npcDiscussionStartedRef.current =
            true;

        const runId =
            ++npcDiscussionRunRef.current;

        void runNpcDiscussion(
            runId
        );

        return () => {
            npcDiscussionRunRef.current +=
                1;
        };
    }, [
        canStartNpcDiscussion,
        day,
    ]);

    /*
     * Cancel unfinished timers when leaving
     * the Discussion component.
     */
    useEffect(() => {
        return () => {
            npcDiscussionRunRef.current +=
                1;
        };
    }, []);

    const handleEndDiscussion =
        () => {
            if (
                npcDiscussionRunning
            ) {
                return;
            }

            npcDiscussionRunRef.current +=
                1;

            const latestPlayers =
                useStore.getState()
                    .game.players;

            /*
             * Reset everyone, not only the human.
             */
            latestPlayers.forEach(
                (player) => {
                    updateSpoken(
                        player.id,
                        false
                    );
                }
            );

            setActiveBubble(null);

            onNextSession(
                PHASE.VOTE
            );
        };

    return (
        <>
            <RulePopup
                isOpen={isShowRule}
                onClose={() =>
                    setIsShowRule(false)
                }
            />

            {showCutScene && (
                <CutScene
                    type={
                        gameState.phase
                    }
                    day={day}
                    onFinish={
                        handleCutSceneFinish
                    }
                    icon={
                        SunPixelIcon
                    }
                />
            )}

            {currentPlayer && (
                <CardRevealAnimation
                    cards={roles}
                    assignedCardId={
                        currentPlayer.role
                    }
                    isOpen={
                        isCardAnimationOpen
                    }
                    onClose={
                        handleCloseCardAnimation
                    }
                    autoCloseDuration={
                        10
                    }
                />
            )}

            <div
                className="
                    relative
                    flex
                    h-screen
                    w-screen
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#171717]
                    bg-cover
                "
                style={{
                    backgroundImage:
                        `url(${ForestBackground})`,
                }}
            >
                <div
                    className="
                        relative
                        aspect-square
                        w-full
                        max-w-[1200px]
                        bg-cover
                        bg-center
                    "
                    style={{
                        backgroundImage:
                            `url(${SquareDayBackground})`,
                    }}
                >
                    {players.map(
                        (player) => {
                            const relation =
                                selectedPlayer &&
                                Number(
                                    player.id
                                ) !==
                                    Number(
                                        selectedPlayer.id
                                    )
                                    ? player
                                          .relations?.[
                                          selectedPlayer
                                              .id
                                      ] ??
                                      player
                                          .relations?.[
                                          String(
                                              selectedPlayer.id
                                          )
                                      ] ??
                                      null
                                    : null;

                            return (
                                <React.Fragment
                                    key={
                                        player.id
                                    }
                                >
                                    <Avatar
                                        onClick={
                                            handleAvatarOnClick
                                        }
                                        relation={
                                            relation
                                        }
                                        isAlive={
                                            player.alive
                                        }
                                        data={
                                            player
                                        }
                                        top={
                                            player
                                                .position
                                                .top
                                        }
                                        left={
                                            player
                                                .position
                                                .left
                                        }
                                    />

                                    {activeBubble?.senderId ===
                                        player.id && (
                                        <AvatarSpeechBubble
                                            message={
                                                activeBubble.text
                                            }
                                            position={
                                                player.position
                                            }
                                        />
                                    )}
                                </React.Fragment>
                            );
                        }
                    )}

                </div>

                <ChatPanel
                    selectedPlayer={
                        selectedPlayer
                    }
                    myName={
                        currentPlayer?.name
                    }
                    myRole={
                        currentPlayer?.role
                    }
                    myId={
                        currentPlayer?.id
                    }
                    messages={
                        chatMessages
                    }
                    npcDiscussionRunning={
                        npcDiscussionRunning
                    }
                    onAction={(
                        action
                    ) => {
                        void playDialogue(
                            action,
                            2100
                        );
                    }}
                    onEndDiscussion={
                        handleEndDiscussion
                    }
                />
            </div>
        </>
    );
};

export default Discussion;
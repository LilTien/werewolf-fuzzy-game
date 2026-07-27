import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import CutScene from "../CutScene";
import VoteBg from "../../assets/background/vote.png";
import VotePixelIcon from "../../assets/icon/vote.png";

import Avatar from "../Avatar";
import VoteModal from "./voteModal";
import MajorityModal from "./majorityModal";

import useStore from "@/Store/useStore";
import { npcVote } from "@/logic/npcVoting";
import { delay, randomDelay } from "@/utils/async";
import { checkWinner } from "@/logic/checkWinner";


const INNOCENT_ROLES = [
    "villager",
    "doctor",
    "seer",
    "knight",
];

const Vote = ({
    data,
    onNextPhase,
}) => {
    const players = data.players;
    console.log('vote data: ', data)

    const alivePlayers = useMemo(
        () => players.filter((player) => player.alive),
        [players]
    );

    const humanPlayer =
        players.find((player) => player.isHuman) ??
        players[0];

    /*
     * Count votes from alive players only.
     *
     * Also verify that the selected target is still alive.
     */
    const votes = useMemo(() => {
        return alivePlayers.reduce((accumulator, voter) => {
            if (voter.votedFor == null) {
                return accumulator;
            }

            const validTarget = alivePlayers.some(
                (player) => player.id === voter.votedFor
            );

            if (!validTarget) {
                return accumulator;
            }

            accumulator[voter.votedFor] =
                (accumulator[voter.votedFor] ?? 0) + 1;

            return accumulator;
        }, {});
    }, [alivePlayers]);

    const everyoneVoted =
        alivePlayers.length > 0 &&
        alivePlayers.every(
            (player) =>
                player.hasVoted === true &&
                player.votedFor != null
        );

    const eliminatedPlayer = useMemo(() => {
        const voteEntries = Object.entries(votes);

        if (voteEntries.length === 0) {
            return null;
        }

        const [highestVotePlayerId] = voteEntries.reduce(
            (highest, current) => {
                const [, highestVotes] = highest;
                const [, currentVotes] = current;

                return currentVotes > highestVotes
                    ? current
                    : highest;
            }
        );

        return alivePlayers.find(
            (player) =>
                player.id === Number(highestVotePlayerId)
        ) ?? null;
    }, [votes, alivePlayers]);

    const [showCutScene, setShowCutScene] =
        useState(true);

    const [showVoteModal, setShowVoteModal] =
        useState(false);

    const [showMajorityModal, setShowMajorityModal] =
        useState(false);

    /*
     * Prevent the NPC voting process from starting twice.
     */
    const npcVotingStartedRef = useRef(false);

    /*
     * Prevent the result logic from running more than once.
     */
    const voteResolvedRef = useRef(false);

    /*
     * Used to cancel an old async NPC loop if the component
     * unmounts or a new voting run starts.
     */
    const npcVotingRunRef = useRef(0);

    const votePlayer = useStore(
        (state) => state.votePlayer
    );

    const clearVote = useStore(
        (state) => state.clearVote
    );

    const killPlayer = useStore(
        (state) => state.killPlayer
    );

    const setWinner = useStore(
        (state) => state.setWinner
    );

    const applyWrongVotePenalty = useStore(
        (state) =>
            state.applyWrongVotePenalty
    );

    const addPreviousLies = useStore(
        (state) => state.addPreviousLies
    );

    const resetDiscussion = useStore(
        (state) => state.resetDiscussion
    );

    const applyFalseWerewolfAccusationLies = () => {
        if (!eliminatedPlayer) return;

        const accusations =
            data.discussion?.accuse ?? [];

        /*
        * Check whether every living player voted
        * for the eliminated player.
        */
        const unanimousVote =
            alivePlayers.length > 0 &&
            alivePlayers.every(
                (player) =>
                    Number(player.votedFor) ===
                    Number(eliminatedPlayer.id)
            );

        if (!unanimousVote) return;

        /*
        * The accusation was correct.
        */
        if (eliminatedPlayer.role === "werewolf") {
            return;
        }

        /*
        * Find everyone who specifically claimed that
        * the eliminated player was the Werewolf.
        */
        const falseAccuserIds = [
            ...new Set(
                accusations
                    .filter(
                        (accusation) =>
                            Number(
                                accusation.targetId
                            ) ===
                                Number(
                                    eliminatedPlayer.id
                                ) &&
                            accusation.roleClaimed ===
                                "werewolf"
                    )
                    .map((accusation) =>
                        Number(
                            accusation.senderId
                        )
                    )
            ),
        ];

        /*
        * All living observers increase previousLies
        * toward each false accuser.
        */
        for (const accuserId of falseAccuserIds) {
            addPreviousLies(
                accuserId,
                40
            );
        }
    };
    const applyAccusationVoteLies = () => {
        const accusations =
            data.discussion?.accuse ?? [];

        for (const accusation of accusations) {
            const speaker = players.find(
                (player) =>
                    Number(player.id) ===
                    Number(accusation.senderId)
            );

            if (!speaker) continue;

            /*
            * The speaker did not participate in voting.
            */
            if (speaker.votedFor == null) {
                continue;
            }

            const accusedPlayerId =
                Number(accusation.targetId);

            const votedPlayerId =
                Number(speaker.votedFor);

            /*
            * They accused one player but voted for
            * somebody else.
            */
            if (
                accusedPlayerId !== votedPlayerId
            ) {
                addPreviousLies(
                    speaker.id,
                    35
                );
            }
        }
    };

    /*
     * Select a fallback target if npcVote returns null or
     * points to an invalid/dead target.
     */
    const getFallbackTarget = (
        npc,
        latestPlayers
    ) => {
        const availableTargets = latestPlayers.filter(
            (player) =>
                player.alive &&
                player.id !== npc.id
        );

        if (availableTargets.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(
            Math.random() * availableTargets.length
        );

        return availableTargets[randomIndex].id;
    };

    const npcVoting = async () => {
        /*
         * Every run receives an ID. If a new run starts or the
         * component unmounts, the old run stops.
         */
        const currentRun =
            ++npcVotingRunRef.current;

        /*
         * Get only the voter IDs initially. We read the latest
         * Zustand state again before every vote.
         */
        const npcIds = useStore
            .getState()
            .game
            .players
            .filter(
                (player) =>
                    player.alive &&
                    !player.isHuman
            )
            .map((player) => player.id);

        for (const npcId of npcIds) {
            await delay(randomDelay());

            if (
                currentRun !==
                npcVotingRunRef.current
            ) {
                return;
            }

            const latestPlayers =
                useStore.getState().game.players;

            const npc = latestPlayers.find(
                (player) => player.id === npcId
            );

            /*
             * NPC could have died, already voted, or disappeared
             * while waiting.
             */
            if (
                !npc ||
                !npc.alive ||
                npc.hasVoted
            ) {
                continue;
            }

            let targetId = npcVote(
                npc,
                latestPlayers
            );

            const selectedTarget =
                latestPlayers.find(
                    (player) =>
                        player.id === targetId
                );

            const invalidTarget =
                targetId == null ||
                !selectedTarget ||
                !selectedTarget.alive ||
                selectedTarget.id === npc.id;

            if (invalidTarget) {
                targetId = getFallbackTarget(
                    npc,
                    latestPlayers
                );
            }

            if (targetId == null) {
                console.warn(
                    `${npc.name} has no valid voting target.`
                );

                continue;
            }

            console.log(
                `${npc.name} votes for player ${targetId}`
            );

            votePlayer(npc.id, targetId);
        }
    };

    const handleCutSceneFinish = () => {
        /*
         * CutScene may finish through both a timeout and a user
         * click. This guard prevents two NPC voting loops.
         */
        if (npcVotingStartedRef.current) {
            return;
        }

        npcVotingStartedRef.current = true;

        setShowCutScene(false);
        setShowVoteModal(true);

        void npcVoting();
    };

    const handleVotePlayer = (targetId) => {
        if (!humanPlayer?.alive) return;
        if (humanPlayer.hasVoted) return;

        const target = alivePlayers.find(
            (player) => player.id === targetId
        );

        if (!target) return;

        votePlayer(
            humanPlayer.id,
            targetId
        );
    };

    /*
     * Open the result modal exactly once after every living
     * player has submitted a valid vote.
     */
    useEffect(() => {
        if (!everyoneVoted) return;
        if (!eliminatedPlayer) return;
        if (voteResolvedRef.current) return;

        voteResolvedRef.current = true;

        setShowVoteModal(false);
        setShowMajorityModal(true);
    }, [everyoneVoted, eliminatedPlayer]);

    const handleCloseMajorityModal = () => {

        if (!eliminatedPlayer) return;
        applyAccusationVoteLies();
        applyFalseWerewolfAccusationLies();

        const eliminatedWasInnocent =
            INNOCENT_ROLES.includes(
                eliminatedPlayer.role
            );

        /*
        * Save the voters before clearVote() removes
        * their votedFor values.
        */
        const wrongVoterIds = players
            .filter(
                (player) =>
                    player.alive &&
                    Number(player.votedFor) ===
                        Number(
                            eliminatedPlayer.id
                        )
            )
            .map((player) => player.id);

        /*
        * Every living observer becomes more suspicious
        * of those who voted for an innocent player.
        */
        if (
            eliminatedWasInnocent &&
            wrongVoterIds.length > 0
        ) {
            applyWrongVotePenalty({
                eliminatedPlayerId:
                    eliminatedPlayer.id,

                voterIds: wrongVoterIds,

                amount: 15,
            });
        }

        const updatedPlayers = players.map(
            (player) =>
                player.id ===
                eliminatedPlayer.id
                    ? {
                        ...player,
                        alive: false,
                        hasVoted: false,
                        votedFor: null,
                    }
                    : {
                        ...player,
                        hasVoted: false,
                        votedFor: null,
                    }
        );

        killPlayer(eliminatedPlayer.id);

        /*
        * Must happen after wrongVoterIds has
        * already been collected.
        */
        clearVote();

        setShowMajorityModal(false);

        const winner = checkWinner(
            updatedPlayers,
            true,
            eliminatedPlayer
        );

        if (winner.gameOver) {
            setWinner(winner);
            onNextPhase("GameOver");
            return;
        }

        onNextPhase("Night");
    };

    /*
     * Stop any unfinished asynchronous voting loop when Vote
     * unmounts.
     */
    useEffect(() => {
        return () => {
            npcVotingRunRef.current += 1;
        };
    }, []);

    return (
        <>
            {showCutScene && (
                <CutScene
                    type={data.phase}
                    day={data.day}
                    onFinish={handleCutSceneFinish}
                    icon={VotePixelIcon}
                />
            )}

            <VoteModal
                isOpen={showVoteModal}
                players={alivePlayers}
                votes={votes}
                myVote={
                    humanPlayer?.votedFor ?? null
                }
                onVote={handleVotePlayer}
                disabled={
                    !humanPlayer?.alive ||
                    humanPlayer?.hasVoted
                }
            />

            <MajorityModal
                isOpen={showMajorityModal}
                eliminatedPlayer={
                    eliminatedPlayer
                }
                players={players}
                onContinue={
                    handleCloseMajorityModal
                }
            />

            <div
                className="
                    flex
                    h-screen
                    w-screen
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#010306]
                    bg-cover
                "
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
                        backgroundImage: `url(${VoteBg})`,
                    }}
                >
                    {players.map((player) => (
                        <Avatar
                            key={player.id}
                            data={player}
                            top={player.position.top}
                            left={player.position.left}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Vote;
import React, {useState, useEffect, useMemo} from "react";
import CutScene from "../CutScene";
import VoteBg from '../../assets/background/vote.png'
import Avatar from "../Avatar";
import VoteModal from "./voteModal";
import useStore from "@/Store/useStore";
import MajorityModal from "./majorityModal";
import { npcVote } from "@/logic/npcVoting";
import { delay, randomDelay } from "@/utils/async";

const Vote = ({
    data,
    playerId,
    onNextPhase
}) => {
    const players = data.players;
    const everyOneVoted = players.every(player => player.hasVoted);

    const votes = useMemo(() => {
        return players.reduce((acc, player) => {

            if (player.votedFor !== null) {

                acc[player.votedFor] =
                    (acc[player.votedFor] || 0) + 1;

            }

            return acc;

        }, {});

    }, [players]);

    const eliminatedPlayer = useMemo(() => {
        if (Object.keys(votes).length === 0) return null;

        const highestVotePlayerId = Object.entries(votes).reduce(
            (winner, current) => {
                const [winnerId, winnerVotes] = winner;
                const [currentId, currentVotes] = current;

                return currentVotes > winnerVotes ? current : winner;
            }
        )[0];

        return players.find(
            player => player.id === Number(highestVotePlayerId)
        );

    }, [votes, players]);

    const [showCutScene, setShowCutScene] = useState(true);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showMajorityModal, setShowMajorityModal] = useState(false);


    const votePlayer = useStore((state) => state.votePlayer)

    const handleCutSceneFinish = () => {
        setShowCutScene(false);

        setTimeout(async () => {

            setShowVoteModal(true);
            await npcVoting(players);

        }, 500);
    };

    const handleVotePlayer = async (targetId) => {
        votePlayer(
            players[0].id,
            targetId
        );
        
    }

    const npcVoting = async () => {

        for (const npc of players) {

            if (npc.isHuman) continue;

            const targetId = npcVote(npc);

            await delay(randomDelay());

            votePlayer(
                npc.id,
                targetId
            );

        }

    };

    const handleCloseMajorityModalClose = async () => {
        setShowMajorityModal(false);
        await delay(1000);
        onNextPhase('Night');
    }


    useEffect(() => {
        if(everyOneVoted){
            setShowVoteModal(false);
            setShowMajorityModal(true);
        }

    },[players])


    return (
        <>
            {
                showCutScene && 
                <CutScene
                    type={data.phase}
                    day={data.day}
                    onFinish={handleCutSceneFinish}
                />
            }
            <VoteModal
                isOpen={showVoteModal}
                players={players}
                votes={votes}
                myVote={players[0].votedFor}
                onVote={handleVotePlayer}
                />
            <MajorityModal
                isOpen={showMajorityModal}
                eliminatedPlayer={eliminatedPlayer}
                players={players}
                onContinue={handleCloseMajorityModalClose}
            />
            <div 
                className="flex w-screen h-screen bg-[#010306] justify-center items-center overflow-hidden bg-cover">
                
                <div 
                    className="relative w-full max-w-[1200px] aspect-[1/1] bg-cover bg-center"
                    style={{ backgroundImage: `url(${VoteBg})` }}
                >

                    {players.map((player) => {
                        return (
                        <Avatar
                            key={player.id}
                            data={player}
                            top={player.position.top}
                            left={player.position.left}/>
                        )
                    })}
                    
                </div>
            </div>
        </>
    )
}

export default Vote;
import React, {useState, useEffect, useMemo} from "react";
import CutScene from "../CutScene";
import VoteBg from '../../assets/background/vote.png'
import Avatar from "../Avatar";
import VoteModal from "./voteModal";
import useStore from "@/Store/useStore";

const Vote = ({
    data,
    playerId
}) => {
    const players = data.players;
    const everyOneVoted = players.every(player => player.hasVoted);
    const randomDelay = () => Math.floor(Math.random() * 1000) + 500;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const votes = useMemo(() => {
        return players.reduce((acc, player) => {

            if (player.votedFor !== null) {

                acc[player.votedFor] =
                    (acc[player.votedFor] || 0) + 1;

            }

            return acc;

        }, {});

    }, [players]);

    console.log('vote counts: ', votes)

    const [showCutScene, setShowCutScene] = useState(true);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [showMajorityModal, setShowMajorityModal] = useState(false);


    const votePlayer = useStore((state) => state.votePlayer)

    const handleCutSceneFinish = () => {
        setShowCutScene(false);

        setTimeout(() => {

            setShowVoteModal(true);

        }, 2000);
    };

    const handleVotePlayer = async (targetId) => {
        votePlayer(
            players[0].id,
            targetId
        );
        await npcVoting();
    }

    const npcVote = (npc) => {

        let highest = -1;
        let targetId = null;

        for (const relation of Object.values(npc.relations)) {

            // Don't vote for yourself
            if (relation.playerId === npc.id) continue;

            if (relation.suspicion > highest) {
                highest = relation.suspicion;
                targetId = relation.playerId;
            }
        }

        return targetId;
    };

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
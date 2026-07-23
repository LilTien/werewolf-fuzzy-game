import React, { useState, useEffect } from "react";
import useStore from "@/Store/useStore";
import SquareDayBackground from '../../assets/background/squarediscussion.png'
import ForestBackground from '../../assets/background/dark-forest.png'
import SunPixelIcon from '../../assets/icon/sun.png'
import roles from "@/constant/roles";
import CardRevealAnimation from "../Animation/CardReveal";
import Avatar from "../Avatar";
import ChatPanel from "../Chat/chatPanel";
import CutScene from "../CutScene";


const Discussion = ({
    data,
    onNextSession
}) => {

    const day = data.day;
    const [isCardAnimationOpen, setIsCardAnimationOpen] = useState(day < 2);//set to true
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [showCutScene, setShowCutScene] = useState(day > 1);

    const updateRelation = useStore((state) => state.updateRelation);
    const updateSpoken = useStore((state) => state.updateSpoken)
    const gameState = useStore((state) => state.game);

    const players = data.players;

    const handleCloseCardAnimation = () => {
        setIsCardAnimationOpen(false);
        setShowCutScene(true)
    }

    const handleAvatarOnClick = (data) => {
        if(data.id !== 0 || !data.alive){
            setSelectedPlayer(data);
        }
    } 

    const handlePlayerAction = (action) => {
        const { type, target, message } = action;
        const senderId = message.senderId;

        const sender = players.find(p => p.id === senderId);

        if(!sender) return;

        if(sender.hasSpoken){
            console.log("player has spoken")
            return
        }

        updateSpoken(
            senderId,
            true
        )

        if (type === "accuse") {
            for (const observer of players) {
                // Skip the player who made the accusation
                if (observer.id === senderId) continue;
    
                const relation = target.relations[sender.id];
                
                if (observer.id === target.id) {
                    updateRelation(
                        target.id,
                        sender.id,
                        {
                            suspicion: relation.suspicion + 20,
                        }
                    );
                };
                // Safety check (shouldn't happen, but prevents crashes)
                if (!relation) continue;
    
                updateRelation(
                    observer.id,
                    target.id,
                    {
                        suspicion: relation.suspicion + 10,
                    }
                );
            }
        }else if (type === "defend"){
            for (const observer of players) {
                // Skip the player who made the defend
                if (observer.id === senderId) continue;
    
                const relation = target.relations[sender.id];
                
                if (observer.id === target.id) {
                    updateRelation(
                        target.id,
                        sender.id,
                        {
                            suspicion: Math.max(relation.suspicion - 15, 0) ,
                        }
                    );
                };
                // Safety check (shouldn't happen, but prevents crashes)
                if (!relation) continue;
    
                updateRelation(
                    observer.id,
                    target.id,
                    {
                        suspicion: Math.max(relation.suspicion - 10, 0),
                    }
                );
            }
        }

    };



    console.log(gameState)

    return (
        <>
            {showCutScene && (
                <CutScene
                    type={gameState.phase}
                    day={gameState.day}
                    onFinish={() => setShowCutScene(false)}
                    icon={SunPixelIcon}
                />
            )}
            <CardRevealAnimation
                cards={roles}
                assignedCardId={players[0].role}
                isOpen={isCardAnimationOpen}
                onClose={handleCloseCardAnimation}
                autoCloseDuration={10}
            />
            
            <div 
                className="flex w-screen h-screen bg-[#171717] justify-center items-center overflow-hidden bg-cover"
                style={{backgroundImage: `url(${ForestBackground})`}}>
                
                <div 
                    className="relative w-full max-w-[1200px] aspect-[1/1] bg-cover bg-center"
                    style={{ backgroundImage: `url(${SquareDayBackground})` }}
                >
                    {players.map((player) => {
                        const relations = selectedPlayer && player.id !== selectedPlayer.id ? player.relations[selectedPlayer.id] :null;
                        return (
                        <Avatar
                            onClick={handleAvatarOnClick}
                            relation = {relations}
                            isAlive = {player.alive}
                            key={player.id}
                            data={player}
                            top={player.position.top}
                            left={player.position.left}/>
                        )
                    })}
                        
                </div>
                {/* chat and rule panel */}
                <ChatPanel
                    selectedPlayer={selectedPlayer}
                    myName={data.players[0].name}
                    myRole={data.players[0].role}
                    myId={data.players[0].id}
                    onAction={handlePlayerAction}
                    onEndDiscussion={onNextSession}/>

            </div>
        </>
    );
}

export default Discussion
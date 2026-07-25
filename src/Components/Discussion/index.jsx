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
import RulePopup from "../Popup/rule";
import { PHASE } from '@/constant/phase'

const Discussion = ({
    data,
    onNextSession
}) => {

    const day = data.day;
    //local state
    const [isCardAnimationOpen, setIsCardAnimationOpen] = useState(day < 2);//set to true
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [showCutScene, setShowCutScene] = useState(day > 1);
    const [isShowRule, setIsShowRule] = useState(false);
    
    //global state
    const updateRelation = useStore((state) => state.updateRelation);
    const updateSpoken = useStore((state) => state.updateSpoken)
    const gameState = useStore((state) => state.game);
    const recordDiscussion = useStore((state) => state.recordDiscussion);

    
    const players = data.players;
    const currentPlayer = players[0];

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
        const { type, target, message, subOption } = action;
        const senderId = message.senderId;
        const claimedRole = subOption;

        console.log('action: ', action)

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
    
                if(observer.id !== target.id){
                    updateRelation(
                        observer.id,
                        target.id,
                        {
                            suspicion: relation.suspicion + 10,
                        }
                    );
                }
                updateRelation(
                    observer.id,
                    sender.id,
                    {
                        aggression: relation.aggression + 10
                    }
                )
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
    
                if(observer.id !== target.id){
                    updateRelation(
                        observer.id,
                        target.id,
                        {
                            suspicion: Math.max(relation.suspicion - 10, 0),
                        }
                    );
                }

                updateRelation(
                    observer.id,
                    sender.id,
                    {
                        aggression: relation.aggression + 5
                    }
                )
            }
        }
        recordDiscussion(senderId, type, target.id, claimedRole)

    };

    const handleCutSceneFinish = (day) => {
        setShowCutScene(false);
        if(day === 1){

            setIsShowRule(true);
        }

    }

    const handleEndDiscussion = () => {
        updateSpoken(
            currentPlayer.id,
            false
        )
        onNextSession(PHASE.VOTE);
    }


    console.log(gameState)

    return (
        <>
            <RulePopup
                isOpen={isShowRule}
                onClose={() => setIsShowRule(false)}/>
            {showCutScene && (
                <CutScene
                    type={gameState.phase}
                    day={gameState.day}
                    onFinish={handleCutSceneFinish(gameState.day)}
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
                    onEndDiscussion={handleEndDiscussion}/>

            </div>
        </>
    );
}

export default Discussion
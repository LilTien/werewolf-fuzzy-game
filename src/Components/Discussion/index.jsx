import React, { useState, useEffect } from "react";
import useStore from "@/Store/useStore";
import DayBackground from '../../assets/background/discussion.png'
import AvatarIcon from '../../assets/avatar/avatar.png'
import NewDayBackground from '../../assets/background/newdiscussion.png'
import SquareDayBackground from '../../assets/background/squarediscussion.png'
import ForestBackground from '../../assets/background/dark-forest.png'
import roles from "@/constant/roles";
import CardRevealAnimation from "../Animation/CardReveal";
import Avatar from "../Avatar";
import ChatPanel from "../Chat/chatPanel";
import CutScene from "../CutScene";


const Discussion = ({
    data,
    onNextSession
}) => {
    const [isCardAnimationOpen, setIsCardAnimationOpen] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [showCutScene, setShowCutScene] = useState(false)
    const gameState = useStore((state) => state.game);

    const players = data.players;

    const handleCloseCardAnimation = () => {
        setIsCardAnimationOpen(false);
        setShowCutScene(true)
    }

    const handleAvatarOnClick = (data) => {
        setSelectedPlayer(data)
    } 



    console.log(gameState)

    return (
        <>
            {showCutScene && (
                <CutScene
                    type={gameState.phase}
                    day={gameState.day}
                    onFinish={() => setShowCutScene(false)}
                />
            )}
            <CardRevealAnimation
                cards={roles}
                assignedCardId={'werewolf'}
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
                    myRole={data.players[0].role}/>

            </div>
        </>
    );
}

export default Discussion
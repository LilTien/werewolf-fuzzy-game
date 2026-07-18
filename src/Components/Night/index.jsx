import React, {useState, useEffect} from "react";
import NightBg from '../../assets/background/nightsquare.png'
import ForestBackground from '../../assets/background/dark-forest.png'
import CutScene from "../CutScene";
import roles from "@/constant/roles";
import NightActionModal from "./nightActionModal";
import useStore from "@/Store/useStore";
import { npcNightAction } from "@/logic/npc";

const Night = ({
    data
}) => {
    const players = data.players;
    const action = data.night.action;
    //too see if this player have power
    const currentRole = roles.find((role) => role.id === players[0].role);
    const currentPlayer = players[0];
    
    const [showCutScene, setShowCutScene] = useState(true);
    const [isOpenActionModal, setIsOpenActionModal] = useState(false)

    const nightAction = useStore((state) => state.nightAction);
    const addKnowledge = useStore((state) => state.addKnowledge);

    const handleNightAction =async (targetPlayer) => {
        if(currentRole.havePower){
            nightAction(currentRole.id, targetPlayer);
        }
        if(currentRole.id === "shaman"|| currentRole.id === "seer"){
            const targPlay = players.find((player) => player.id === targetPlayer)
            addKnowledge(
                currentRole.id,
                targetPlayer,
                targPlay.role
            )
        }
        await npcDoAction();
        console.log("current data at night : " , data)
    }

    const npcDoAction = async () => {

        const shamanReveal = data.night.knowledge.shaman;
        for (const npc of players){
            if (npc.isHuman) continue;
            if (!npc.alive) continue;
            if(npc.role === "villager") continue;

            //get the target
            const target = npcNightAction(npc, players,shamanReveal );

            if(!target) continue;

            if(npc.role === "shaman"){
                addKnowledge(
                    npc.role,
                    target.id,
                    target.role
                )
            }

            nightAction(
                npc.role,
                target.id
            )

        }
    }

    useEffect(() => {
        if (!showCutScene && currentRole?.havePower) {
            setIsOpenActionModal(true);
        }
    }, [showCutScene, currentRole]);

    useEffect(() => {
        if (!action) return;

        const isAllActionsCompleted = Object.values(action).every(value => value !== null);

        if (isAllActionsCompleted) {
          console.log("Every role has completed their action!");
      } else {
          console.log("Still waiting for some roles to act...");
      }
    }, [action])

    

    return (
        <>
            {showCutScene && (
                <CutScene
                    type={data.phase}
                    day={data.day}
                    onFinish={() => setShowCutScene(false)}
                />
            )}
            <NightActionModal
                isOpen={isOpenActionModal}
                role={currentRole}
                currentPlayer={currentPlayer}
                players={players}
                onConfirm={handleNightAction}
                onClose={() => setIsOpenActionModal(false)}
            />
            <div 
                className="flex w-screen h-screen bg-[#171717] justify-center items-center overflow-hidden bg-cover"
                style={{backgroundImage: `url(${ForestBackground})`}}>
                
                <div 
                    className="relative w-full max-w-[1200px] aspect-[1/1] bg-cover bg-center"
                    style={{ backgroundImage: `url(${NightBg})` }}
                >
                
                </div>
            </div>
        
        </>
    )
}

export default Night;
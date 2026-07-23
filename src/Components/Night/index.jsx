import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import NightBg from '../../assets/background/nightsquare.png'
import ForestBackground from '../../assets/background/dark-forest.png'
import MoonPixelIcon from '../../assets/icon/moon.png'

import CutScene from "../CutScene";
import roles from "@/constant/roles";
import NightActionModal from "./nightActionModal";
import NightResultModal from "./nightResultModal";
import useStore from "@/Store/useStore";
import { npcNightAction } from "@/logic/npc";
import { resolveNight } from "@/logic/npc/night/resolveNight";
import { checkWinner } from "@/logic/checkWinner";


const NIGHT_ROLES = [
    "shaman",
    "werewolf",
    "doctor",
    "seer",
    "knight",
];

const NIGHT_ORDER = [
    "shaman",
    "werewolf",
    "doctor",
    "seer",
    "knight",
];

const Night = ({
    data,
    onNextDay
}) => {
    const players = data.players;
    const action = data.night.action;
    const results = data.night.results;

    const npcActionsStarted = useRef(false);
    //too see if this player have power
    const currentRole = roles.find((role) => role.id === players[0].role);
    const currentPlayer = players[0];
    
    const [showCutScene, setShowCutScene] = useState(true);
    const [isOpenActionModal, setIsOpenActionModal] = useState(false);
    const [revealEvent, setRevealEvent] = useState(null);
    const [isOpenRevealModal, setIsOpenRevealModal] = useState(false);
    const [isOpenResultModal, setIsOpenResultModal] = useState(false);
    const [nightResolved, setNightResolved] = useState(false);
    const [currentResult, setCurrentResult] = useState(0);

    const activeNightRoles = useMemo(() => {
        return players
            .filter((player) => {
                return (
                    player.alive &&
                    NIGHT_ROLES.includes(player.role) &&
                    player.ability?.canUse !== false
                );
            })
            .map((player) => player.role);
    }, [players]);

    const nightAction = useStore((state) => state.nightAction);
    const addKnowledge = useStore((state) => state.addKnowledge);
    const setNightResult = useStore((state) => state.setNightResult);
    const setPlayers = useStore((state) => state.setPlayer);
    const clearNightResult = useStore((state) => state.clearNightResult);
    const setWinner = useStore((state) => state.setWinner);
    const setPhase = useStore((state) => state.setPhase);


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
            );
            setRevealEvent({
                type:
                    currentRole.id === "seer"
                        ? "seer-reveal"
                        : "shaman-reveal",

                actor: currentRole.id,
                targetId: targPlay.id,
                targetRole: targPlay.role,
            });
            setIsOpenRevealModal(true)
        }

    }

    const npcDoAction = async () => {
        for (const role of NIGHT_ORDER) {
            const latestGame = useStore.getState().game;

            const npc = latestGame.players.find(
                (player) =>
                    !player.isHuman &&
                    player.alive &&
                    player.role === role &&
                    player.ability?.canUse !== false
            );

            // This role is controlled by the human,
            // dead, or unavailable.
            if (!npc) continue;

            // Prevent acting more than once.
            const existingAction =
                latestGame.night.action[role];

            if (
                existingAction !== null &&
                existingAction !== undefined
            ) {
                continue;
            }

            const shamanReveal =
                latestGame.night.knowledge.shaman;

            const target = npcNightAction(
                npc,
                latestGame.players,
                shamanReveal
            );

            console.log('role: ', role, 'target: ', target);
            // The NPC completed its turn but chose not to act.
            if (!target) {
                nightAction(role, "skip");
                continue;
            }

            if (
                role === "shaman" ||
                role === "seer"
            ) {
                addKnowledge(
                    role,
                    target.id,
                    target.role
                );
            }

            nightAction(role, target.id);
        }
    };

    const handleRevealContinue = () => {
        console.log('is reveal open: ', isOpenRevealModal, 'reveal content: ', revealEvent)

        if(!revealEvent) return;

        setIsOpenRevealModal(false);
        setRevealEvent(null);

    }

    useEffect(() => {

        if (showCutScene) return;
        if (npcActionsStarted.current) return;

        npcActionsStarted.current = true;

        const startNight = async () => {
            await npcDoAction();

            const hasPower =
                currentRole?.havePower;

            if (
                currentPlayer.alive &&
                hasPower &&
                currentPlayer.ability?.canUse !== false
            ) {
                setIsOpenActionModal(true);
            }
        };

        startNight();
    }, [showCutScene]);

    useEffect(() => {

        if (nightResolved) return;

        const done = activeNightRoles.every((role) => {
            const roleAction = action[role];

            return (
                roleAction !== null &&
                roleAction !== undefined
            );
        });

        if (!done) return;

        const { players, results } = resolveNight(
            data.players,
            data.night.action
        );

        const gameResult = checkWinner(players, false);

        if (gameResult.gameOver) {
            setWinner(gameResult);
            setPhase("GameOver");
            return;
        }

        setPlayers(players);
        setNightResult( results);

        setNightResolved(true);
        setIsOpenResultModal(true);



    }, [action, nightResolved]);

    

    return (
        <>
            {showCutScene && (
                <CutScene
                    type={data.phase}
                    day={data.day}
                    onFinish={() => setShowCutScene(false)}
                    icon={MoonPixelIcon}
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
            <NightResultModal
                isOpen={isOpenRevealModal}
                event={revealEvent}
                players={players}
                current={0}
                total={1}
                onNext={handleRevealContinue}
            
            />
            <NightResultModal
                isOpen={results.length > 0 && !isOpenRevealModal}
                event={results[currentResult]}
                players={players}
                current={currentResult}
                total={results.length}
                onNext={() => {

                    if (currentResult + 1 < results.length) {

                        setCurrentResult(prev => prev + 1);

                    } else {
                        console.log('done')
                        // clearNightResults();
                        // nextPhase();
                        clearNightResult();
                        onNextDay()
                    }

                }}
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
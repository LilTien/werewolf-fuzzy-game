import { useEffect, useMemo, useState } from "react";
import NightPlayerCard from "./nightPlayerCard";

const NightActionModal = ({
    isOpen,
    role,
    currentPlayer,
    players,
    onConfirm,
    onClose,
}) => {

    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedPlayer(null);
        }
    }, [isOpen]);

    const availablePlayers = useMemo(() => {

        if (!role?.action?.canTarget) {
            return players.filter(player => player.alive);
        }

        return players.filter(player =>
            role.action.canTarget(player, currentPlayer)
        );

    }, [players, role, currentPlayer]);

    if (!isOpen) return null;

    return (

        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-50">

            <div className="w-[760px] aspect-square max-h-[90%] bg-[#161616] rounded-xl border-4 border-stone-600 p-6 flex flex-col">

                <h2 className="text-3xl text-center text-white font-bold">
                    {role.action.title}
                </h2>

                <p className="text-center text-gray-300 mt-2">
                    {role.action.description}
                </p>

                <div className="grid grid-cols-4 gap-5 mt-8 flex-1">

                    {availablePlayers.map(player => (

                        <NightPlayerCard
                            key={player.id}
                            player={player}
                            selected={selectedPlayer === player.id}
                            currentRole={role.id}
                            onClick={() => setSelectedPlayer(player.id)}
                        />

                    ))}

                </div>

                <div className="flex justify-between items-center mt-6">
                    {
                        role.id === 'knight' && 
                        (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white"
                            >
                                Skip
                            </button>
                        )
                    }
                    

                    <button
                        disabled={selectedPlayer === null}
                        onClick={() => onConfirm(selectedPlayer)}
                        className="
                            px-8
                            py-3
                            rounded-lg
                            bg-red-600
                            hover:bg-red-700
                            disabled:bg-neutral-600
                            disabled:cursor-not-allowed
                            text-white
                        "
                    >
                        {role.action.button}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default NightActionModal;
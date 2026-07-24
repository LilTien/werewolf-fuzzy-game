import { useState } from "react";
import VoteCard from "./voteCard";

const VoteModal = ({
    isOpen,
    players,
    votes,
    myVote,
    onVote,
    disabled
}) => {

    const [selectedPlayer, setSelectedPlayer] = useState(myVote);


    if (!isOpen) return null;

    return (

        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-50">

            <div className="w-[750px] aspect-square max-h-[90%] bg-[#161616] rounded-xl border-4 border-stone-600 p-6">

                <h2 className="text-center text-white text-2xl mb-8">
                    Lets Vote
                </h2>

                <div className="grid grid-cols-4 gap-6">

                    {players.map(player => (

                        <VoteCard
                            key={player.id}
                            player={player}
                            totalVotes={votes[player.id] ?? 0}
                            selected={selectedPlayer === player.id}
                            onClick={() => setSelectedPlayer(player.id === 0 ? null : player.id)}
                        />

                    ))}

                </div>

                <div className="flex justify-end mt-10">

                    <button
                        disabled={selectedPlayer == null || disabled}
                        onClick={() => onVote(selectedPlayer)}
                        className="px-8 py-3 rounded-lg
                        bg-red-600
                        disabled:bg-gray-600
                        text-white"
                    >
                        Vote
                    </button>

                </div>

            </div>

        </div>

    );

};

export default VoteModal;
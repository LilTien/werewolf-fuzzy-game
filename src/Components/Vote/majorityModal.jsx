import AvatarIcon from "../../assets/avatar/avatar.png";

const MajorityModal = ({
    isOpen,
    eliminatedPlayer,
    players,
    onContinue,
}) => {

    if (!isOpen) return null;

    const voteHistory = players
        .filter(player => player.votedFor !== null)
        .map(player => ({
            voter: player.name,
            target: players.find(p => p.id === player.votedFor)?.name
        }));

    const totalVotes = players.filter(
        p => p.votedFor === eliminatedPlayer.id
    ).length;

    return (
        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="w-[750px] max-h-[90vh] bg-[#1d1d1d] rounded-xl border-4 border-stone-600 p-6 overflow-y-auto">

                <h1 className="text-3xl text-center text-white font-bold">
                    Voting Result
                </h1>

                <div className="flex flex-col items-center mt-6">
                    <img src={AvatarIcon} className="w-40 h-40 object-contain" />
                    <h2 className="text-red-400 text-2xl mt-4">{eliminatedPlayer.name}</h2>
                    <p className="text-gray-300 mt-2">Received the majority vote.</p>
                    <p className="text-white text-lg font-bold mt-1">
                        Total Votes : {totalVotes}
                    </p>
                </div>

                <div className="mt-8">
                    <h3 className="text-white text-xl mb-3">Voting Breakdown</h3>

                    <div className="space-y-2">
                        {voteHistory.map((vote, index) => (
                            <div
                                key={index}
                                className="flex justify-between bg-neutral-800 rounded-lg px-4 py-3"
                            >
                                <span className="text-white">{vote.voter}</span>
                                <span className="text-red-400">➜ {vote.target}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onContinue}
                        className="px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        Continue
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MajorityModal;
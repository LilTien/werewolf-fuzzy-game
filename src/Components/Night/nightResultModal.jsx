import { nightResultConfig } from "@/constant/result";

const NightResultModal = ({
    isOpen,
    event,
    players,
    current,
    total,
    onNext,
}) => {

    if (!isOpen || !event) return null;

    const target = players.find(
        p => p.id === event.targetId
    );

    const config = nightResultConfig[event.type];

    if (!config) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">

            <div className="w-[700px] rounded-xl bg-[#171717] border-4 border-stone-600 p-8">

                <h1 className="text-3xl font-bold text-center text-white mb-6">

                    {config.title({ target, event })}

                </h1>

                <div className="flex justify-center mb-6">

                    <img
                        src={config.image}
                        className="w-64 h-64"
                    />

                </div>

                <p className="text-center text-gray-300 text-lg">

                    {config.description({ target, event })}

                </p>

                <div className="flex justify-between mt-10">

                    <span className="text-gray-400">

                        {current + 1} / {total}

                    </span>

                    <button
                        onClick={onNext}
                        className="px-6 py-3 rounded-lg bg-red-600 text-white"
                    >
                        Continue
                    </button>

                </div>

            </div>

        </div>
    );
};

export default NightResultModal;
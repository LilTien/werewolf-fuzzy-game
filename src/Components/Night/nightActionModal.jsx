import {
    useEffect,
    useMemo,
    useState,
} from "react";

import NightPlayerCard from "./nightPlayerCard";

const NightActionModal = ({
    isOpen,
    role,
    currentPlayer,
    players = [],
    onConfirm,
    onClose,
    onSkip
}) => {
    const [
        selectedPlayer,
        setSelectedPlayer,
    ] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedPlayer(null);
        }
    }, [isOpen, role?.id]);

    const availablePlayers = useMemo(() => {
        if (!role?.action?.canTarget) {
            return players.filter(
                (player) => player.alive
            );
        }

        return players.filter(
            (player) =>
                player.alive &&
                role.action.canTarget(
                    player,
                    currentPlayer
                )
        );
    }, [
        players,
        role,
        currentPlayer,
    ]);

    if (!isOpen || !role?.action) {
        return null;
    }

    const selectedPlayerData =
        availablePlayers.find(
            (player) =>
                player.id === selectedPlayer
        );

    const handleSelect = (playerId) => {
        setSelectedPlayer(
            (current) =>
                current === playerId
                    ? null
                    : playerId
        );
    };

    const handleConfirm = () => {
        if (selectedPlayer == null) {
            return;
        }

        onConfirm(selectedPlayer);
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[999]
                h-screen
                w-screen
                overflow-hidden
            "
        >
            {/* Current game scene remains visible */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/50
                    backdrop-blur-sm
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    h-full
                    w-full
                    max-w-6xl
                    flex-col
                    px-7
                    py-5

                    [@media(max-height:600px)]:px-5
                    [@media(max-height:600px)]:py-3

                    [@media(max-height:450px)]:px-4
                    [@media(max-height:450px)]:py-2
                "
            >
                {/* Header */}
                <header
                    className="
                        flex
                        shrink-0
                        items-end
                        justify-between
                        gap-6
                        border-b
                        border-white/15
                        pb-3

                        [@media(max-height:520px)]:pb-2
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.3em]
                                text-stone-400
                            "
                        >
                            Night action
                        </p>

                        <h2
                            className="
                                mt-1
                                truncate
                                text-2xl
                                font-bold
                                text-white

                                [@media(max-height:560px)]:text-xl

                                [@media(max-height:430px)]:text-lg
                            "
                        >
                            {role.action.title}
                        </h2>

                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-xs
                                leading-5
                                text-stone-300

                                [@media(max-height:500px)]:text-[10px]
                                [@media(max-height:500px)]:leading-4
                            "
                        >
                            {role.action.description}
                        </p>
                    </div>

                    <div
                        className="
                            shrink-0
                            rounded-md
                            border
                            border-white/15
                            bg-black/30
                            px-3
                            py-1.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-stone-300
                        "
                    >
                        {availablePlayers.length} targets
                    </div>
                </header>

                {/* Player selection */}
                <main
                    className="
                        flex
                        min-h-0
                        flex-1
                        items-center
                        justify-center
                        py-4

                        [@media(max-height:570px)]:py-2

                        [@media(max-height:430px)]:py-1.5
                    "
                >
                    {availablePlayers.length > 0 ? (
                        <div
                            className="
                                grid
                                h-full
                                max-h-[600px]
                                w-full
                                grid-cols-4
                                grid-rows-2
                                place-items-center
                                gap-4

                                [@media(max-height:650px)]:gap-3

                                [@media(max-height:520px)]:gap-2

                                [@media(max-height:430px)]:gap-1.5
                            "
                        >
                            {availablePlayers.map(
                                (player) => (
                                    <div
                                        key={player.id}
                                        className="
                                            flex
                                            h-full
                                            min-h-0
                                            w-full
                                            min-w-0
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <NightPlayerCard
                                            player={player}
                                            selected={
                                                selectedPlayer ===
                                                player.id
                                            }
                                            currentRole={
                                                role.id
                                            }
                                            onClick={() =>
                                                handleSelect(
                                                    player.id
                                                )
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-stone-400">
                            There are no valid targets for
                            this action.
                        </p>
                    )}
                </main>

                {/* Controls */}
                <footer
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-t
                        border-white/15
                        pt-3

                        [@media(max-height:500px)]:pt-2
                    "
                >
                    <div className="min-w-0">
                        {selectedPlayerData ? (
                            <p
                                className="
                                    truncate
                                    text-[10px]
                                    text-stone-300
                                "
                            >
                                Selected:{" "}
                                <span className="font-bold text-white">
                                    {
                                        selectedPlayerData.name
                                    }
                                </span>
                            </p>
                        ) : (
                            <p
                                className="
                                    text-[10px]
                                    text-stone-500
                                "
                            >
                                Select one player to continue.
                            </p>
                        )}
                    </div>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                        "
                    >
                        {role.id === "knight" && (
                            <button
                                type="button"
                                onClick={onSkip}
                                className="
                                    rounded-md
                                    border
                                    border-white/15
                                    bg-black/30
                                    px-4
                                    py-2
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-stone-300
                                    transition

                                    hover:bg-white/10
                                    hover:text-white

                                    active:scale-95
                                "
                            >
                                Skip
                            </button>
                        )}

                        <button
                            type="button"
                            disabled={
                                selectedPlayer == null
                            }
                            onClick={handleConfirm}
                            className="
                                min-w-[150px]
                                rounded-md
                                border
                                border-red-400/30
                                bg-red-700
                                px-5
                                py-2
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-white
                                transition

                                hover:bg-red-600

                                active:scale-95

                                disabled:cursor-not-allowed
                                disabled:border-white/10
                                disabled:bg-stone-700
                                disabled:text-stone-400

                                [@media(max-height:450px)]:min-w-[130px]
                                [@media(max-height:450px)]:px-4
                                [@media(max-height:450px)]:py-1.5
                            "
                        >
                            {role.action.button}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default NightActionModal;
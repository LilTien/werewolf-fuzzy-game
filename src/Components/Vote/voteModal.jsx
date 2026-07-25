import {
    useEffect,
    useState,
} from "react";

import VoteCard from "./voteCard";

const VoteModal = ({
    isOpen,
    players = [],
    votes = {},
    myVote,
    onVote,
    disabled,
}) => {
    const [
        selectedPlayer,
        setSelectedPlayer,
    ] = useState(myVote ?? null);

    /*
     * Synchronize local selection whenever the modal opens
     * or the player's submitted vote changes.
     */
    useEffect(() => {
        if (isOpen) {
            setSelectedPlayer(
                myVote ?? null
            );
        }
    }, [isOpen, myVote]);

    if (!isOpen) return null;

    const handleSelectPlayer = (
        playerId
    ) => {
        if (disabled) return;

        setSelectedPlayer(
            (currentSelection) =>
                currentSelection === playerId
                    ? null
                    : playerId
        );
    };

    const handleVote = () => {
        if (
            selectedPlayer == null ||
            disabled
        ) {
            return;
        }

        onVote(selectedPlayer);
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
            {/* Keep the current game scene visible */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/75
                    backdrop-blur-sm
                "
            />

            {/* Dark edges */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.75)_100%)]
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
                    px-8
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
                        border-b
                        border-white/10
                        pb-3

                        [@media(max-height:500px)]:pb-2
                    "
                >
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.4em]
                                text-red-400
                            "
                        >
                            The village decides
                        </p>

                        <h2
                            className="
                                mt-1
                                text-2xl
                                font-black
                                uppercase
                                tracking-wide
                                text-white

                                [@media(max-height:550px)]:text-xl

                                [@media(max-height:430px)]:text-lg
                            "
                        >
                            Choose Who to Eliminate
                        </h2>
                    </div>

                    <div
                        className="
                            rounded-full
                            border
                            border-white/10
                            bg-black/30
                            px-3
                            py-1.5
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-stone-400
                        "
                    >
                        {players.length} players
                    </div>
                </header>

                {/* Player cards */}
                <main
                    className="
                        flex
                        min-h-0
                        flex-1
                        items-center
                        justify-center
                        py-4

                        [@media(max-height:550px)]:py-2
                    "
                >
                    <div
                        className="
                            grid
                            h-full
                            max-h-[620px]
                            w-full
                            grid-cols-4
                            grid-rows-2
                            gap-4

                            [@media(max-height:650px)]:gap-3

                            [@media(max-height:520px)]:gap-2

                            [@media(max-height:430px)]:gap-1.5
                        "
                    >
                        {players.map((player) => {
                            const isSelected =
                                selectedPlayer ===
                                player.id;

                            return (
                                <div
                                    key={player.id}
                                    className="
                                        flex
                                        min-h-0
                                        min-w-0
                                        items-center
                                        justify-center
                                    "
                                >
                                    <VoteCard
                                        player={player}
                                        totalVotes={
                                            votes[
                                                player.id
                                            ] ?? 0
                                        }
                                        selected={
                                            isSelected
                                        }
                                        disabled={
                                            disabled || player.id === 0
                                        }
                                        onClick={() =>
                                            handleSelectPlayer(
                                                player.id
                                            )
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* Bottom controls */}
                <footer
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-5
                        border-t
                        border-white/10
                        pt-3

                        [@media(max-height:500px)]:pt-2
                    "
                >
                    <div className="min-w-0">
                        {selectedPlayer == null ? (
                            <p
                                className="
                                    text-[10px]
                                    text-stone-500
                                "
                            >
                                Select a player before
                                confirming your vote.
                            </p>
                        ) : (
                            <p
                                className="
                                    truncate
                                    text-[10px]
                                    text-stone-400
                                "
                            >
                                Selected:{" "}
                                <span
                                    className="
                                        font-bold
                                        text-red-400
                                    "
                                >
                                    {players.find(
                                        (player) =>
                                            player.id ===
                                            selectedPlayer
                                    )?.name ??
                                        "Unknown"}
                                </span>
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={
                            selectedPlayer == null ||
                            disabled
                        }
                        onClick={handleVote}
                        className="
                            min-w-[150px]
                            rounded-lg
                            border
                            border-red-400/30
                            bg-red-600
                            px-6
                            py-2.5
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.15em]
                            text-white
                            shadow-lg
                            shadow-red-950/40
                            transition

                            hover:bg-red-500

                            active:scale-95

                            disabled:cursor-not-allowed
                            disabled:border-white/10
                            disabled:bg-stone-700
                            disabled:text-stone-400
                            disabled:shadow-none

                            [@media(max-height:500px)]:min-w-[130px]
                            [@media(max-height:500px)]:px-5
                            [@media(max-height:500px)]:py-2
                        "
                    >
                        {disabled
                            ? "Vote Submitted"
                            : "Confirm Vote"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default VoteModal;
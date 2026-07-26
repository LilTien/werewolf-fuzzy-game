import AvatarIcon from "../../assets/avatar/avatar.png";

const MajorityModal = ({
    isOpen,
    eliminatedPlayer,
    players = [],
    onContinue,
}) => {
    if (!isOpen || !eliminatedPlayer) {
        return null;
    }

    const voteHistory = players
        .filter(
            (player) =>
                player.votedFor !== null &&
                player.votedFor !== undefined
        )
        .map((player) => {
            const target = players.find(
                (candidate) =>
                    Number(candidate.id) ===
                    Number(player.votedFor)
            );

            return {
                voterId: player.id,
                voter: player.name,
                target: target?.name ?? "Unknown",
                targetId: target?.id ?? null,
            };
        });

    const totalVotes = players.filter(
        (player) =>
            Number(player.votedFor) ===
            Number(eliminatedPlayer.id)
    ).length;

    const avatar =
        eliminatedPlayer.avatar ??
        eliminatedPlayer.image ??
        AvatarIcon;

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
            {/* Keep the current voting scene visible */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/50
                    backdrop-blur-sm
                "
            />

            {/* Slightly darken the edges */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.5)_100%)]
                "
            />

            <main
                className="
                    relative
                    z-10
                    mx-auto
                    grid
                    h-full
                    w-full
                    max-w-6xl
                    grid-cols-[0.8fr_1.2fr]
                    items-center
                    gap-10
                    px-8
                    py-6

                    [@media(max-height:600px)]:gap-6
                    [@media(max-height:600px)]:px-6
                    [@media(max-height:600px)]:py-4

                    [@media(max-height:460px)]:gap-4
                    [@media(max-height:460px)]:px-4
                    [@media(max-height:460px)]:py-3
                "
            >
                {/* Eliminated player */}
                <section
                    className="
                        flex
                        min-h-0
                        flex-col
                        items-center
                        justify-center
                        text-center
                    "
                >
                    <p
                        className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.4em]
                            text-stone-400

                            [@media(max-height:460px)]:text-[7px]
                        "
                    >
                        The village has decided
                    </p>

                    <h1
                        className="
                            mt-2
                            text-4xl
                            font-black
                            uppercase
                            tracking-wide
                            text-white

                            [@media(max-height:600px)]:text-3xl
                            [@media(max-height:460px)]:text-2xl
                        "
                    >
                        Voting Result
                    </h1>

                    <div
                        className="
                            relative
                            mt-5
                            flex
                            h-56
                            w-56
                            items-center
                            justify-center

                            [@media(max-height:600px)]:mt-3
                            [@media(max-height:600px)]:h-40
                            [@media(max-height:600px)]:w-40

                            [@media(max-height:460px)]:h-28
                            [@media(max-height:460px)]:w-28
                        "
                    >
                        <div
                            className="
                                absolute
                                inset-[15%]
                                rounded-full
                                bg-red-700/25
                                blur-3xl
                            "
                        />

                        <img
                            src={avatar}
                            alt={eliminatedPlayer.name}
                            draggable={false}
                            className="
                                relative
                                z-10
                                h-full
                                w-full
                                select-none
                                object-contain
                                drop-shadow-[0_18px_20px_rgba(0,0,0,0.8)]
                                [image-rendering:pixelated]
                            "
                        />
                    </div>

                    <h2
                        className="
                            mt-3
                            max-w-full
                            truncate
                            text-2xl
                            font-black
                            text-red-400

                            [@media(max-height:600px)]:mt-2
                            [@media(max-height:600px)]:text-xl

                            [@media(max-height:460px)]:text-base
                        "
                    >
                        {eliminatedPlayer.name}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-amber-300

                            [@media(max-height:460px)]:text-[8px]
                        "
                    >
                        {eliminatedPlayer.role}
                    </p>

                    <p
                        className="
                            mt-3
                            text-xs
                            text-stone-300

                            [@media(max-height:500px)]:mt-2
                            [@media(max-height:500px)]:text-[9px]
                        "
                    >
                        Received the majority vote
                    </p>

                    <div
                        className="
                            mt-3
                            border-y
                            border-white/15
                            px-6
                            py-2

                            [@media(max-height:500px)]:mt-2
                            [@media(max-height:500px)]:px-4
                            [@media(max-height:500px)]:py-1.5
                        "
                    >
                        <span
                            className="
                                text-[9px]
                                uppercase
                                tracking-wider
                                text-stone-500
                            "
                        >
                            Total votes
                        </span>

                        <span
                            className="
                                ml-3
                                text-lg
                                font-black
                                text-white

                                [@media(max-height:500px)]:text-sm
                            "
                        >
                            {totalVotes}
                        </span>
                    </div>
                </section>

                {/* Voting breakdown */}
                <section
                    className="
                        flex
                        min-h-0
                        h-full
                        flex-col
                        justify-center
                        border-l
                        border-white/15
                        pl-10

                        [@media(max-height:600px)]:pl-6
                        [@media(max-height:460px)]:pl-4
                    "
                >
                    <div
                        className="
                            flex
                            shrink-0
                            items-end
                            justify-between
                            gap-4
                            border-b
                            border-white/15
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
                                    tracking-[0.3em]
                                    text-stone-500
                                "
                            >
                                Final votes
                            </p>

                            <h3
                                className="
                                    mt-1
                                    text-xl
                                    font-black
                                    text-white

                                    [@media(max-height:500px)]:text-base
                                "
                            >
                                Voting Breakdown
                            </h3>
                        </div>

                        <span
                            className="
                                text-[9px]
                                font-bold
                                text-stone-500
                            "
                        >
                            {voteHistory.length} votes
                        </span>
                    </div>

                    <div
                        className="
                            mt-4
                            grid
                            min-h-0
                            grid-cols-2
                            gap-2

                            [@media(max-height:550px)]:mt-3
                            [@media(max-height:550px)]:gap-1.5
                        "
                    >
                        {voteHistory.map((vote) => {
                            const votedForEliminated =
                                Number(vote.targetId) ===
                                Number(eliminatedPlayer.id);

                            return (
                                <div
                                    key={vote.voterId}
                                    className={`
                                        flex
                                        min-w-0
                                        items-center
                                        justify-between
                                        gap-2
                                        border-l-2
                                        bg-black/25
                                        px-3
                                        py-2.5

                                        [@media(max-height:550px)]:px-2
                                        [@media(max-height:550px)]:py-2

                                        [@media(max-height:440px)]:py-1.5

                                        ${
                                            votedForEliminated
                                                ? "border-red-500"
                                                : "border-white/15"
                                        }
                                    `}
                                >
                                    <span
                                        className="
                                            min-w-0
                                            truncate
                                            text-[10px]
                                            font-bold
                                            text-stone-200

                                            [@media(max-height:500px)]:text-[8px]
                                        "
                                    >
                                        {vote.voter}
                                    </span>

                                    <span
                                        className={`
                                            flex
                                            min-w-0
                                            items-center
                                            gap-1
                                            text-[9px]

                                            [@media(max-height:500px)]:text-[7px]

                                            ${
                                                votedForEliminated
                                                    ? "text-red-400"
                                                    : "text-stone-500"
                                            }
                                        `}
                                    >
                                        <span>→</span>

                                        <span
                                            className="
                                                max-w-[90px]
                                                truncate

                                                [@media(max-height:500px)]:max-w-[60px]
                                            "
                                        >
                                            {vote.target}
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="
                            mt-5
                            flex
                            shrink-0
                            items-center
                            justify-between
                            gap-5
                            border-t
                            border-white/15
                            pt-4

                            [@media(max-height:520px)]:mt-3
                            [@media(max-height:520px)]:pt-3
                        "
                    >
                        <p
                            className="
                                max-w-sm
                                text-[9px]
                                leading-4
                                text-stone-500

                                [@media(max-height:460px)]:hidden
                            "
                        >
                            The eliminated player&apos;s
                            true role has now been revealed.
                        </p>

                        <button
                            type="button"
                            onClick={onContinue}
                            className="
                                ml-auto
                                min-w-[140px]
                                border
                                border-red-400/30
                                bg-red-700
                                px-5
                                py-2.5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-white
                                transition

                                hover:bg-red-600
                                active:scale-95

                                [@media(max-height:500px)]:min-w-[115px]
                                [@media(max-height:500px)]:px-4
                                [@media(max-height:500px)]:py-2
                                [@media(max-height:500px)]:text-[8px]
                            "
                        >
                            Continue
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MajorityModal;
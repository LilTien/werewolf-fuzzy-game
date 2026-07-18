import AvatarIcon from "../../assets/avatar/avatar.png";

const NightPlayerCard = ({
    player,
    selected,
    currentRole,
    onClick,
}) => {

    const revealed =
        player.knowledge?.revealedPlayers ??
        [];

    const showRole =
        currentRole === "seer" ||
        currentRole === "shaman" ||
        currentRole === "werewolf";

    return (

        <button
            onClick={onClick}
            className={`
                relative
                flex
                flex-col
                items-center
                gap-2
                p-3
                rounded-xl
                border-2
                transition-all
                ${
                    selected
                        ? "border-red-500 bg-red-900/30"
                        : "border-transparent hover:border-white"
                }
            `}
        >

            <img
                src={AvatarIcon}
                className="w-20 h-20"
            />

            <span className="text-white">
                {player.name}
            </span>

            {showRole &&
                revealed.includes(player.id) && (

                    <span className="text-xs text-yellow-300">

                        ({player.role})

                    </span>

            )}

        </button>

    );

};

export default NightPlayerCard;
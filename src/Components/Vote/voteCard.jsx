
import AvatarIcon from "../../assets/avatar/avatar.png";

const VoteCard = ({
    player,
    totalVotes,
    selected,
    onClick,
}) => {

    return (

        <button
            onClick={onClick}
            className={`
                relative
                flex
                flex-col
                items-center
                gap-2
                rounded-xl
                p-3
                transition
                border-2
                ${
                    selected
                    ? "border-red-500 bg-red-900/30"
                    : "border-transparent hover:border-white"
                }
            `}
        >

            <div
                className="
                absolute
                -top-2
                -right-2
                w-8
                h-8
                rounded-full
                bg-red-600
                text-white
                flex
                justify-center
                items-center
                font-bold
                "
            >
                {totalVotes}
            </div>

            <img src={AvatarIcon}>
            </img>

            <span className="text-white">

                {player.name}

            </span>

        </button>

    );

};

export default VoteCard;
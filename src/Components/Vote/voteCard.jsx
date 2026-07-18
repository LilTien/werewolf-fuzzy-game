import { useEffect, useState } from "react";
import AvatarIcon from "../../assets/avatar/avatar.png";

const VoteCard = ({
    player,
    totalVotes,
    selected,
    onClick,
}) => {

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (totalVotes === 0) return;

        setAnimate(true);

        const timer = setTimeout(() => {
            setAnimate(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [totalVotes]);

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
                className={`
                    absolute
                    -top-2
                    -right-2
                    w-8
                    h-8
                    text-white
                    flex
                    justify-center
                    items-center
                    font-bold
                    transition-transform
                    duration-300
                    ${animate ? "scale-150" : "scale-100"}
                `}
            >
                x{totalVotes}
            </div>

            <img src={AvatarIcon} />

            <span className="text-white">
                {player.name}
            </span>
        </button>
    );
};

export default VoteCard;
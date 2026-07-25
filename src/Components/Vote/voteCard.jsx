import {
    useEffect,
    useState,
} from "react";

import AvatarIcon from "../../assets/avatar/avatar.png";

const VoteCard = ({
    player,
    totalVotes = 0,
    selected = false,
    onClick,
    disabled = false,
}) => {
    const [animate, setAnimate] =
        useState(false);

    useEffect(() => {
        if (totalVotes <= 0) return;

        setAnimate(true);

        const timer = setTimeout(() => {
            setAnimate(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [totalVotes]);

    const avatar =
        player.avatar ??
        player.image ??
        AvatarIcon;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-pressed={selected}
            className={`
                group
                relative
                flex
                h-full
                max-h-[220px]
                w-full
                max-w-[165px]
                min-w-0
                flex-col
                items-center
                justify-between
                overflow-hidden
                rounded-xl
                border-2
                p-2.5
                transition
                duration-200

                hover:-translate-y-0.5
                active:scale-[0.97]

                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0

                [@media(max-height:600px)]:max-h-[175px]
                [@media(max-height:600px)]:max-w-[135px]
                [@media(max-height:600px)]:p-2

                [@media(max-height:480px)]:max-h-[140px]
                [@media(max-height:480px)]:max-w-[110px]
                [@media(max-height:480px)]:rounded-lg
                [@media(max-height:480px)]:p-1.5

                ${
                    selected
                        ? `
                            border-red-500
                            bg-red-950/60
                            shadow-[0_0_20px_rgba(239,68,68,0.25)]
                        `
                        : `
                            border-white/10
                            bg-black/35
                            hover:border-white/30
                            hover:bg-white/[0.06]
                        `
                }
            `}
        >
            {/* Vote counter */}
            <div
                className={`
                    absolute
                    right-1.5
                    top-1.5
                    z-20
                    flex
                    min-h-6
                    min-w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-black/75
                    px-1.5
                    text-[12px]
                    font-black
                    text-white
                    shadow-lg
                    transition-transform
                    duration-300

                    [@media(max-height:480px)]:right-1
                    [@media(max-height:480px)]:top-1
                    [@media(max-height:480px)]:min-h-5
                    [@media(max-height:480px)]:min-w-6
                    [@media(max-height:480px)]:text-[8px]

                    ${
                        animate
                            ? "scale-150"
                            : "scale-100"
                    }
                `}
            >
                ×{totalVotes}
            </div>

            {/* Selected indicator */}
            {selected && (
                <div
                    className="
                        absolute
                        left-1.5
                        top-1.5
                        z-20
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        text-[10px]
                        font-black
                        text-white

                        [@media(max-height:480px)]:left-1
                        [@media(max-height:480px)]:top-1
                        [@media(max-height:480px)]:h-4
                        [@media(max-height:480px)]:w-4
                        [@media(max-height:480px)]:text-[8px]
                    "
                >
                    ✓
                </div>
            )}

            {/* Avatar area */}
            <div
                className="
                    flex
                    min-h-0
                    w-full
                    flex-1
                    items-center
                    justify-center
                    overflow-hidden
                    pt-3

                    [@media(max-height:480px)]:pt-2
                "
            >
                <img
                    src={avatar}
                    alt={player.name}
                    draggable={false}
                    className="
                        h-auto
                        max-h-[125px]
                        w-auto
                        max-w-[92%]
                        select-none
                        object-contain
                        drop-shadow-[0_8px_8px_rgba(0,0,0,0.65)]
                        transition-transform
                        duration-200
                        [image-rendering:pixelated]

                        group-hover:scale-105

                        [@media(max-height:600px)]:max-h-[88px]
                        [@media(max-height:480px)]:max-h-[62px]
                    "
                />
            </div>

            {/* Player name */}
            <div
                className="
                    w-full
                    shrink-0
                    border-t
                    border-white/10
                    pt-2
                    text-center

                    [@media(max-height:480px)]:pt-1
                "
            >
                <span
                    className="
                        block
                        truncate
                        text-xs
                        font-bold
                        text-white

                        [@media(max-height:600px)]:text-[10px]
                        [@media(max-height:480px)]:text-[8px]
                    "
                >
                    {player.name}
                </span>

                <span
                    className={`
                        mt-0.5
                        block
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-wider

                        [@media(max-height:480px)]:hidden

                        ${
                            selected
                                ? "text-red-400"
                                : "text-stone-500"
                        }
                    `}
                >
                    {selected
                        ? "Selected"
                        : "Select"}
                </span>
            </div>
        </button>
    );
};

export default VoteCard;
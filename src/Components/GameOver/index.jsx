import React from "react";
import Button from "../Button";
import DefaultAvatar from "../../assets/avatar/avatar.png";
import {
    ROLE_TEAMS,
    TEAM_NAMES,
    getGameOverMessage,
    normalizeWinnerTeam,
} from "@/constant/gameOverMessage";

const GameOver = ({
    data,
    onBackToStart,
}) => {
    const currentPlayer = data.players.find(
        (player) => player.isHuman
    );

    const winnerData =
        typeof data.winner === "string"
            ? { winner: data.winner }
            : data.winner;

    if (!currentPlayer || !winnerData) {
        return null;
    }

    const playerTeam =
        ROLE_TEAMS[currentPlayer.role] ?? "villager";

    const winnerTeam = normalizeWinnerTeam(
        winnerData.winner
    );

    const didWin = playerTeam === winnerTeam;

    const description = getGameOverMessage(
        currentPlayer.role,
        didWin
    );

    const avatar =
        currentPlayer.avatar ??
        currentPlayer.image ??
        DefaultAvatar;

    return (
        <div
            className="
                fixed
                inset-0
                z-[999]
                flex
                items-center
                justify-center
                overflow-hidden
                bg-[#050505]
            "
        >
            {/* Background glow */}
            <div
                className={`
                    absolute
                    inset-0
                    opacity-30
                    ${
                        didWin
                            ? "bg-[radial-gradient(circle_at_center,_#047857_0%,_#020617_65%)]"
                            : "bg-[radial-gradient(circle_at_center,_#7f1d1d_0%,_#020617_65%)]"
                    }
                `}
            />

            <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

            <div
                className="
                    relative
                    w-[92%]
                    max-w-[720px]
                    max-h-[92vh]
                    overflow-y-auto
                    rounded-3xl
                    border-4
                    border-white/15
                    bg-[#171717]/95
                    px-6
                    py-8
                    text-center
                    shadow-2xl
                    md:px-12
                    md:py-10
                "
            >
                <p
                    className="
                        text-[10px]
                        tracking-[0.55em]
                        text-stone-400
                        md:text-xs
                    "
                >
                    THE FINAL VERDICT
                </p>

                <h1
                    className="
                        mt-3
                        text-5xl
                        font-black
                        tracking-wider
                        text-white
                        md:text-7xl
                    "
                >
                    GAME OVER
                </h1>

                <h2
                    className={`
                        mt-5
                        text-3xl
                        font-black
                        tracking-[0.2em]
                        md:text-5xl
                        ${
                            didWin
                                ? "text-emerald-400"
                                : "text-red-500"
                        }
                    `}
                >
                    {didWin ? "YOU WIN" : "YOU LOSE"}
                </h2>

                <p
                    className="
                        mx-auto
                        mt-5
                        max-w-xl
                        text-sm
                        leading-7
                        text-stone-300
                        md:text-base
                    "
                >
                    {description}
                </p>

                {winnerData.reason && (
                    <p
                        className="
                            mx-auto
                            mt-3
                            max-w-lg
                            text-xs
                            italic
                            text-stone-500
                        "
                    >
                        {winnerData.reason}
                    </p>
                )}

                <div
                    className="
                        mx-auto
                        mt-8
                        flex
                        max-w-[320px]
                        flex-col
                        items-center
                        rounded-3xl
                        border
                        border-white/10
                        bg-black/30
                        p-6
                    "
                >
                    <div
                        className={`
                            flex
                            h-40
                            w-40
                            items-center
                            justify-center
                            rounded-full
                            border-4
                            bg-black/40
                            ${
                                didWin
                                    ? "border-emerald-500/70"
                                    : "border-red-500/70"
                            }
                        `}
                    >
                        <img
                            src={avatar}
                            alt={currentPlayer.name}
                            className="
                                h-32
                                w-32
                                object-contain
                                [image-rendering:pixelated]
                            "
                        />
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-white">
                        {currentPlayer.name}
                    </h3>

                    <p className="mt-1 text-sm capitalize text-amber-300">
                        {currentPlayer.role}
                    </p>

                    <div
                        className="
                            mt-3
                            rounded-full
                            border
                            border-white/10
                            bg-white/5
                            px-4
                            py-2
                            text-xs
                            font-bold
                            tracking-wider
                            text-stone-300
                        "
                    >
                        {TEAM_NAMES[playerTeam]}
                    </div>
                </div>

                <p className="mt-6 text-xs text-stone-500">
                    Winner:{" "}
                    <span className="font-bold text-stone-300">
                        {TEAM_NAMES[winnerTeam] ?? winnerTeam}
                    </span>
                </p>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={onBackToStart}
                        variant={didWin ? "success" : "danger"}
                        size="lg"
                        className="w-full max-w-[320px] text-[13px]"
                    >
                        Back to Start
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GameOver;
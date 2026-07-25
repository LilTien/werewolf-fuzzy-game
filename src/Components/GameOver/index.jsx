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
    const currentPlayer =
        data.players.find(
            (player) => player.isHuman
        ) ?? data.players[0];

    const winnerData =
        typeof data.winner === "string"
            ? {
                  winner: data.winner,
              }
            : data.winner;

    if (!currentPlayer || !winnerData) {
        return null;
    }

    const playerTeam =
        ROLE_TEAMS[currentPlayer.role] ??
        "villager";

    const winnerTeam = normalizeWinnerTeam(
        winnerData.winner
    );

    const didWin =
        playerTeam === winnerTeam;

    const description =
        getGameOverMessage(
            currentPlayer.role,
            didWin
        );

    const avatar =
        currentPlayer.avatar ??
        currentPlayer.image ??
        DefaultAvatar;

    const theme = didWin
        ? {
              result: "YOU WIN",
              resultColor:
                  "text-emerald-400",
              border:
                  "border-emerald-400/30",
              glow:
                  "bg-emerald-500/20",
              badge:
                  "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
              button: "success",
          }
        : {
              result: "YOU LOSE",
              resultColor: "text-red-500",
              border: "border-red-500/30",
              glow: "bg-red-600/20",
              badge:
                  "border-red-500/30 bg-red-500/10 text-red-300",
              button: "danger",
          };

    return (
        <main
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

            {/* Subtle center glow */}
            <div
                className={`
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[70vh]
                    w-[70vh]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    blur-[100px]
                    ${theme.glow}
                `}
            />

            {/* Dark edges */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.8)_100%)]
                "
            />

            <section
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
                    gap-8
                    px-8
                    py-5

                    [@media(max-height:600px)]:gap-5
                    [@media(max-height:600px)]:px-6
                    [@media(max-height:600px)]:py-3
                "
            >
                {/* Character */}
                <div
                    className="
                        flex
                        h-full
                        items-center
                        justify-center
                    "
                >
                    <div
                        className="
                            relative
                            flex
                            flex-col
                            items-center
                            justify-center
                        "
                    >
                        <div
                            className={`
                                absolute
                                h-52
                                w-52
                                rounded-full
                                blur-3xl
                                ${theme.glow}

                                [@media(max-height:600px)]:h-36
                                [@media(max-height:600px)]:w-36
                            `}
                        />

                        <div
                            className={`
                                relative
                                flex
                                h-64
                                w-64
                                items-center
                                justify-center
                                rounded-full
                                border
                                bg-black/25
                                ${theme.border}

                                [@media(max-height:700px)]:h-52
                                [@media(max-height:700px)]:w-52

                                [@media(max-height:560px)]:h-40
                                [@media(max-height:560px)]:w-40
                            `}
                        >
                            <div
                                className="
                                    absolute
                                    inset-3
                                    rounded-full
                                    border
                                    border-dashed
                                    border-white/10
                                "
                            />

                            <img
                                src={avatar}
                                alt={currentPlayer.name}
                                className={`
                                    relative
                                    z-10
                                    h-[88%]
                                    w-[88%]
                                    object-contain
                                    drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]
                                    [image-rendering:pixelated]

                                    ${
                                        didWin
                                            ? ""
                                            : "grayscale-[35%]"
                                    }
                                `}
                            />
                        </div>

                        <div
                            className="
                                relative
                                -mt-4
                                min-w-[190px]
                                rounded-xl
                                border
                                border-white/10
                                bg-black/70
                                px-5
                                py-3
                                text-center
                                shadow-xl
                                backdrop-blur-md

                                [@media(max-height:560px)]:-mt-3
                                [@media(max-height:560px)]:min-w-[160px]
                                [@media(max-height:560px)]:px-4
                                [@media(max-height:560px)]:py-2
                            "
                        >
                            <h3
                                className="
                                    text-lg
                                    font-black
                                    text-white

                                    [@media(max-height:560px)]:text-base
                                "
                            >
                                {currentPlayer.name}
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-amber-300
                                "
                            >
                                {currentPlayer.role}
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    uppercase
                                    tracking-wider
                                    text-stone-500
                                "
                            >
                                {TEAM_NAMES[playerTeam] ??
                                    playerTeam}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div
                    className="
                        flex
                        flex-col
                        items-start
                        border-l
                        border-white/10
                        pl-10

                        [@media(max-height:600px)]:pl-7
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.5em]
                            text-stone-500
                        "
                    >
                        The final verdict
                    </p>

                    <h1
                        className="
                            mt-2
                            text-5xl
                            font-black
                            leading-none
                            tracking-tight
                            text-white

                            lg:text-6xl

                            [@media(max-height:600px)]:text-4xl
                            [@media(max-height:500px)]:text-3xl
                        "
                    >
                        GAME OVER
                    </h1>

                    <h2
                        className={`
                            mt-3
                            text-3xl
                            font-black
                            tracking-[0.15em]

                            [@media(max-height:600px)]:mt-2
                            [@media(max-height:600px)]:text-2xl

                            ${theme.resultColor}
                        `}
                    >
                        {theme.result}
                    </h2>

                    <div
                        className={`
                            mt-4
                            h-[2px]
                            w-16

                            [@media(max-height:560px)]:mt-3

                            ${
                                didWin
                                    ? "bg-emerald-400"
                                    : "bg-red-500"
                            }
                        `}
                    />

                    <p
                        className="
                            mt-4
                            max-w-xl
                            text-sm
                            leading-6
                            text-stone-300

                            [@media(max-height:600px)]:mt-3
                            [@media(max-height:600px)]:text-xs
                            [@media(max-height:600px)]:leading-5
                        "
                    >
                        {description}
                    </p>

                    {winnerData.reason && (
                        <p
                            className="
                                mt-3
                                max-w-lg
                                text-xs
                                italic
                                leading-5
                                text-stone-500

                                [@media(max-height:560px)]:hidden
                            "
                        >
                            {winnerData.reason}
                        </p>
                    )}

                    <div
                        className="
                            mt-5
                            flex
                            flex-wrap
                            items-center
                            gap-3

                            [@media(max-height:560px)]:mt-3
                        "
                    >
                        <div
                            className={`
                                rounded-full
                                border
                                px-4
                                py-2
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.15em]

                                [@media(max-height:560px)]:px-3
                                [@media(max-height:560px)]:py-1.5

                                ${theme.badge}
                            `}
                        >
                            {TEAM_NAMES[winnerTeam] ??
                                winnerTeam}{" "}
                            Wins
                        </div>

                        <p
                            className="
                                text-[10px]
                                uppercase
                                tracking-widest
                                text-stone-600
                            "
                        >
                            Day {data.day ?? "—"}
                        </p>
                    </div>

                    <Button
                        onClick={onBackToStart}
                        variant={theme.button}
                        size="sm"
                        className="
                            mt-6
                            min-w-[210px]
                            uppercase
                            tracking-[0.12em]

                            [@media(max-height:600px)]:mt-4
                            [@media(max-height:600px)]:py-2
                            [@media(max-height:600px)]:text-xs
                        "
                    >
                        Back to Start
                    </Button>
                </div>
            </section>
        </main>
    );
};

export default GameOver;
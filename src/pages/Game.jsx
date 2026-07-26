import {
    useState,
} from "react";

import StartGame from "../Components/StartGame";
import Discussion from "@/Components/Discussion";
import Vote from "@/Components/Vote";
import Night from "@/Components/Night";
import GameOver from "@/Components/GameOver";
import LandscapeGuard from "@/Components/Landscape";

import useStore from "@/Store/useStore";

function Game() {
    const [data, setData] =
        useState({
            playerName: "",
            roomName: "",
            maxPlayer: 2,
            roomCode: "",
            mode: "",
        });

    const [
        gameType,
        setGameType,
    ] = useState(
        "single-player"
    );

    const initializeGame = useStore(
        (state) =>
            state.initializeGame
    );

    const currentState = useStore(
        (state) => state.game
    );

    const setPhase = useStore(
        (state) => state.setPhase
    );

    const nextDay = useStore(
        (state) => state.nextDay
    );

    const resetGame = useStore(
        (state) => state.resetGame
    );

    const handleOnStart = () => {
        initializeGame(
            data.playerName,
            data.mode
        );

        setData({
            playerName: "",
            roomName: "",
            maxPlayer: 2,
            roomCode: "",
            mode: "",
        });
    };

    const handlePhase = (
        phase
    ) => {
        setPhase(phase);
    };

    const handleNextDay = () => {
        nextDay();
        setPhase("Discussion");
    };

    return (
        <>
            {/*
             * Always mounted.
             *
             * It covers StartGame and every game phase
             * whenever a phone is held in portrait mode.
             */}
            <LandscapeGuard />

            {currentState.phase ===
            "Start" ? (
                <StartGame
                    data={data}
                    setData={setData}
                    onStart={
                        handleOnStart
                    }
                    gameType={
                        gameType
                    }
                    setGameType={
                        setGameType
                    }
                />
            ) : currentState.phase ===
              "Discussion" ? (
                <Discussion
                    data={
                        currentState
                    }
                    onNextSession={
                        handlePhase
                    }
                />
            ) : currentState.phase ===
              "Vote" ? (
                <Vote
                    data={
                        currentState
                    }
                    onNextPhase={
                        handlePhase
                    }
                />
            ) : currentState.phase ===
              "Night" ? (
                <Night
                    data={
                        currentState
                    }
                    onNextDay={
                        handleNextDay
                    }
                />
            ) : currentState.phase ===
              "GameOver" ? (
                <GameOver
                    data={
                        currentState
                    }
                    onBackToStart={
                        resetGame
                    }
                />
            ) : (
                <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
                    Unknown game phase
                </div>
            )}
        </>
    );
}

export default Game;
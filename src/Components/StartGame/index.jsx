import React, { useState } from "react";

import DayBackground from "../../assets/background/morning.png";
import GameModeModal from "../Modal/joinRoomModal";
import LobbyRoom from "../Lobby";

const StartGame = ({
    onStart,
    data,
    setData,
    gameType,
    setGameType,
}) => {
    const [
        isModalOpen,
        setIsModalOpen,
    ] = useState(false);

    const [
        isInLobby,
        setIsInLobby,
    ] = useState(false);

    const resetForm = () => {
        setData({
            playerName: "",
            roomName: "",
            maxPlayer: 2,
            roomCode: "",
            mode: "",
        });
    };

    const handleOnChangeRoom = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleOpenModal = (
        mode
    ) => {
        setData((previous) => ({
            ...previous,
            mode,
        }));

        setIsModalOpen(true);
    };

    return (
        <>
            {isInLobby && (
                <LobbyRoom
                    onCancel={() =>
                        setIsInLobby(false)
                    }
                />
            )}

            <GameModeModal
                isOpen={isModalOpen}
                onClose={
                    handleCloseModal
                }
                data={data}
                handleOnChangeData={
                    handleOnChangeRoom
                }
                handleOnStart={onStart}
                type={data.mode}
            />

            <main
                className="
                    relative
                    flex
                    h-screen
                    w-screen
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#134e4a]
                    bg-cover
                    bg-center
                    bg-no-repeat
                "
                style={{
                    backgroundImage:
                        `url(${DayBackground})`,
                }}
            >
                {/* Dark layer for text readability */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-black/20
                    "
                />

                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        items-center
                        gap-5
                        text-center
                    "
                >
                    <h1
                        className="
                            text-5xl
                            font-black
                            text-white
                            drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]

                            md:text-7xl

                            [@media(max-height:500px)]:text-4xl
                        "
                    >
                        Let's Play
                    </h1>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                handleOpenModal(
                                    "single-player"
                                )
                            }
                            className="
                                rounded-full
                                bg-white
                                px-6
                                py-3
                                text-sm
                                font-bold
                                text-stone-900
                                transition

                                hover:bg-stone-900
                                hover:text-white

                                active:scale-95

                                [@media(max-height:500px)]:px-5
                                [@media(max-height:500px)]:py-2
                                [@media(max-height:500px)]:text-xs
                            "
                        >
                            Start
                        </button>

                        {/* <button
                            type="button"
                            onClick={() =>
                                handleOpenModal(
                                    "multiplayer"
                                )
                            }
                            className="
                                rounded-full
                                bg-[#c4cfc8]
                                px-6
                                py-3
                                text-sm
                                font-bold
                                text-stone-900
                                transition

                                hover:bg-[#222a24]
                                hover:text-white

                                active:scale-95

                                [@media(max-height:500px)]:px-5
                                [@media(max-height:500px)]:py-2
                                [@media(max-height:500px)]:text-xs
                            "
                        >
                            Multiplayer
                        </button> */}
                    </div>
                </div>
            </main>
        </>
    );
};

export default StartGame;
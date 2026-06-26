import React, {useState} from "react";
import DayBackground from '../../assets/background/morning.png'
import { Input, NumberInput } from "../Input";
import GameModeModal from "../Modal/joinRoomModal";
import LobbyRoom from "../Lobby";
import useStore from "@/Store/useStore";


const StartGame = ({
    onStart,
    data,
    setData,
    gameType,
    setGameType,
}) => {

    const [isModalOpen , setIsModalOpen] = useState(false);
    const [isInLobby, setIsInLobby] = useState(false);

    //global state
    const initializeGame = useStore((state) => state.initializeGame);
    const currentState = useStore((state) => state.game);

    const handleOnChangeRoom = (e) => {
        const {name, value} = e.target
        setData((prev) => ({
            ...prev,
            [name] :  value
        }))
    }

    const handleOnCloseModal = () => {
        setIsModalOpen(false)
        setData({
            playerName: "",
            roomName: "",
            maxPlayer: 2,
            roomCode : "",
            mode: ""
        })
        
    }

    const handleOpenModal = (type) => {
        setIsModalOpen(true);
        setData(prev => ({
            ...prev,
            mode: type
        }))
        
    }


    return (
        <>
            {
                isInLobby && (
                    <LobbyRoom
                        onCancel={() => setIsInLobby(false)}
                    />
                )
            }
            

            <GameModeModal 
                isOpen={isModalOpen}
                onClose={() => handleOnCloseModal()}
                data={data}
                handleOnChangeData={handleOnChangeRoom}
                handleOnStart={onStart}
                type={data.mode}/>
            <div 
                style={{backgroundImage: `url(${DayBackground})`}}
                className="flex flex-col gap-4 w-screen  h-screen bg-[#134e4a] justify-center items-center">
                <h1 className="text-7xl text-white text-shadow-lg mb-8">Start Game</h1>
                <div className="flex gap-4">

                    <button 
                        className="bg-white p-4 rounded-full hover:bg-black hover:text-white"
                        onClick={() => handleOpenModal('single-player')}>Single Player</button>
                    <button 
                        className="bg-[#c4cfc8] hover:bg-[#222a24] hover:text-white p-4 rounded-full"
                        onClick={() => handleOpenModal('multiplayer')}>Multi Player</button>
                </div>
            </div>
        </>
    )
}

export default StartGame;
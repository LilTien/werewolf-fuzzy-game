import React, {useState} from "react";
import DayBackground from '../../assets/background/morning.png'
import { Input, NumberInput } from "../Input";
import GameModeModal from "../Modal/joinRoomModal";


const StartGame = () => {

    const [isModalOpen , setIsModalOpen] = useState(false);
    const [data , setData] = useState({
        playerName: "",
        roomName: "",
        maxPlayer: 2,
        roomCode : ""
    })
    const [gameState, setGameState] = useState({
        type: "single-player"
    })

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
            roomCode : ""
        })
        
    }

    const handleOpenModal = (type) => {
        setIsModalOpen(true);
        setGameState((prev) => ({
            ...prev,
            type : type
        }))
        
    }

    return (
        <>

            <GameModeModal 
                isOpen={isModalOpen}
                onClose={() => handleOnCloseModal()}
                data={data}
                handleOnChangeData={handleOnChangeRoom}
                type={gameState.type}/>
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
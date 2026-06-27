import React, { useEffect } from "react";
import useStore from "@/Store/useStore";
import DayBackground from '../../assets/background/morning.png'

const Discussion = () => {

    const gameState = useStore((state) => state.game)

    console.log(gameState)

    return (
        <>
            <div 
            style={{backgroundImage: `url(${DayBackground})`}}
            className="flex flex-col gap-4 w-screen  h-screen bg-[#134e4a] justify-center items-center">
                
            </div>
        </>
    )
}

export default Discussion
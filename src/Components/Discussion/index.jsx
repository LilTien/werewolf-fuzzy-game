import React, { useEffect } from "react";
import useStore from "@/Store/useStore";

const Discussion = () => {

    const gameState = useStore((state) => state.game)

    console.log(gameState)

    return (
        <>
        
        </>
    )
}

export default Discussion
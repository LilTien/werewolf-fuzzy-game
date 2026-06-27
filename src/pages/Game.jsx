import React, {useState} from 'react'
import StartGame from '../Components/StartGame'
import useStore from '@/Store/useStore'
import Discussion from '@/Components/Discussion'
import CardRevealAnimation from '@/Components/Animation/CardReveal'
import roles from '@/constant/roles'

function Game() {

  //local state
  const [data , setData] = useState({
     playerName: "",
     roomName: "",
     maxPlayer: 2,
     roomCode : "",
     mode: ""
  })
  const [gameType, setGameType] = useState('single-player')


  //global state
  const initializeGame = useStore((state) => state.initializeGame);
  const currentState = useStore((state) => state.game);
  


  //to start the game
  const handleOnstart = () => {
      initializeGame(data.playerName, data.mode);
      console.log(currentState)
  }

  const handleOnChangeData = (e) => {
      const {name, value} = e.target
      setData((prev) => ({
          ...prev,
          [name] :  value
      }))
  }
  return (
    <>
    <CardRevealAnimation
      cards={roles}
      assignedCardId={'werewolf'}
      isOpen={currentState.phase === "Discussion"}
      onClose={() =>{}}
      autoCloseDuration={10}
    />
      {
        currentState.phase === "Start" ? 
        (<StartGame
          data={data}
          setData={setData}
          onStart = {handleOnstart}
          gameType={gameType}
          setGameType={setGameType}
          />)
        :
        currentState.phase === "Discussion" ? 
        (
          <Discussion/>
        )
        :
        (<></>)
      }
      
    </>
  )
}

export default Game
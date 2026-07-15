import React, {useState} from 'react'
import StartGame from '../Components/StartGame'
import useStore from '@/Store/useStore'
import Discussion from '@/Components/Discussion'
import Vote from '@/Components/Vote'

function Game() {

  //local state
  const [data , setData] = useState({
     playerName: "",
     roomName: "",
     maxPlayer: 2,
     roomCode : "",
     mode: ""
  })
  const [gameType, setGameType] = useState('single-player');

  //global state
  const initializeGame = useStore((state) => state.initializeGame);
  const currentState = useStore((state) => state.game);
  const setPhase = useStore((state) => state.setPhase)
  


  //to start the game
  const handleOnstart = () => {
      initializeGame(data.playerName, data.mode);
      console.log(currentState)
  }

  const handlePhase = (phase) => {
    console.log('phase: ', phase)
    setPhase(phase)
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
          <Discussion
            data={currentState}
            onNextSession={handlePhase}/>
        )
        :
        (<Vote
          data={currentState}/>)
      }
      
    </>
  )
}

export default Game
import React, {useState} from 'react'
import StartGame from '../Components/StartGame'
import useStore from '@/Store/useStore'
import Discussion from '@/Components/Discussion'
import Vote from '@/Components/Vote'
import Night from '@/Components/Night'
import GameOver from '@/Components/GameOver'
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
  const [gameType, setGameType] = useState('single-player');

  //global state
  const initializeGame = useStore((state) => state.initializeGame);
  const currentState = useStore((state) => state.game);
  const setPhase = useStore((state) => state.setPhase);
  const nextDay = useStore((state) => state.nextDay);
  const resetGame = useStore((state) => state.resetGame);


  


  //to start the game
  const handleOnstart = () => {
      initializeGame(data.playerName, data.mode);
      setData({
        playerName: "",
        roomName: "",
        maxPlayer: 2,
        roomCode : "",
        mode: ""
      })
  }

  const handlePhase = (phase) => {
    console.log('phase: ', phase)
    setPhase(phase)
  }

  const handleNextDay = () => {
    setPhase('Discussion')
    nextDay();
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
        currentState.phase === "Vote" ? 

        (<Vote
          data={currentState}
          onNextPhase={handlePhase}/>)

        : 
        currentState.phase === "Night" ? 
        (<Night
          data={currentState}
          onNextDay={handleNextDay}/>)
        :
        currentState.phase === "GameOver" ? 
        (
          <GameOver
              data={currentState}
              onBackToStart={resetGame}
          />
        )
        :
        (<>
        Hello world
        </>)
      }
      
    </>
  )
}

export default Game
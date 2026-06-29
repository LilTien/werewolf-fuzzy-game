import React, {useState} from 'react'
import StartGame from '../Components/StartGame'
import useStore from '@/Store/useStore'
import Discussion from '@/Components/Discussion'
import CutScene from '@/Components/CutScene'

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
  const [showCutScene, setShowCutScene] = useState(false);


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
      {showCutScene && (
          <CutScene
              type="discussion"
              day={1}
              onFinish={() => setShowCutScene(false)}
          />
      )}
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
            data={currentState}/>
        )
        :
        (<></>)
      }
      
    </>
  )
}

export default Game
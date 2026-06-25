import React, {useState} from 'react'
import Modal from '.'
import Button from '../Button'
import { Input, NumberInput } from '../Input'

const TAB = {CREATE : 'Create', JOIN : 'Join'};

const GameModeModal = ({
    isOpen, 
    onClose,
    data,
    handleOnChangeData,
    type = "single-player"
}) => {

    const [activeTab, setActiveTab] = useState(TAB.CREATE)
  return (
    <> 
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={type === 'single-player' ? 'Single Player' : 'Multiplayer'}
            >
                {type === 'multiplayer' && (
                    <div className="flex gap-4 mb-6  overflow-hidden">
                    {[TAB.CREATE, TAB.JOIN].map((tab) => (
                        <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={activeTab === tab && "text-white underline"}
                        >
                            {tab === TAB.CREATE ? '▸ Create' : '▸ Join'}
                        </button>
                    ))}
                    </div>
                )}
                <div className="flex gap-4 items-center mb-4">
                    <span className="text-white">Player Name: </span>
                    <Input
                        value={data.playerName}
                        onChange={handleOnChangeData}
                        name='playerName'/>
                </div>
                {
                    type === 'multiplayer' && activeTab === TAB.CREATE &&
                    (
                        <>
                            <div className="flex gap-4 items-center mb-4">
                                <span className="text-white">Room Name: </span>
                                <Input
                                    value={data.roomName}
                                    onChange={handleOnChangeData}
                                    name='roomName'/>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-white">Max Player: </span>
                                <NumberInput 
                                        value={data.maxPlayer}
                                        onChange={handleOnChangeData}
                                        name='maxPlayer'
                                        max={8}
                                        min={2}
                                        />
                                    
                            </div>
                        </>
                    )
                }
                {type === 'multiplayer' && activeTab === TAB.JOIN && (
                    <>
                        <div className="flex gap-4 items-center mb-4">
                            <span className="text-white">Room Code: </span>
                            <Input
                                value={data.roomCode}
                                onChange={handleOnChangeData}
                                name='roomCode'/>
                        </div>
                    </>
                ) }
                
                <div className='flex gap-4 mt-8'>
                    <Button className='w-full bg-[#a3e635] hover:bg-[#1a2e05] hover:text-white border-[#ecfccb]'>{type === "single-player" ? "Start Game" : `${activeTab} Room`}</Button>
                </div>
            
        </Modal>
    
    </>
  )
}

export default GameModeModal
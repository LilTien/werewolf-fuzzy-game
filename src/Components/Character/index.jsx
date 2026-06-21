import React from 'react'
import Villager from '../../assets/character/fox-villager.png'
import Werewolf from '../../assets/character/werewolf.png'
import Seer from '../../assets/character/seer.png'
import Doctor from '../../assets/character/doctor.png'

const characterList = [
    { name: 'Villager', description: 'Has no special powers but must use logic and daily voting to find and eliminate the werewolves.', image: Villager },
    { name: 'Werewolf', description: 'Can kill a player every night. Wins when they eliminate enough villagers to equal or outnumber them.', image:Werewolf  },
    { name: 'Shaman', description: 'Can commune with the mystical world to discover the exact roles of deceased players or speak with the dead.', image: '' },
    { name: 'Knight', description: 'A powerful defender who can protect a player from night attacks, or fight back against suspected threats.', image: '' },
    { name: 'Doctor', description: 'Can choose one player to heal each night. If that player is attacked by a werewolf, they survive.', image: Doctor },
    { name: 'Jester', description: 'Wants to get caught. Wins the game instantly if they successfully trick the village into voting them out during the day.', image: '' },
    { name: 'Seer', description: 'Can look into the crystal ball each night to reveal the true identity of one chosen player.', image: Seer }
];

function CharacterPicker({ selectedCharacter = 0, onSelectCharacter }) {
  const currentCharacter = characterList[selectedCharacter];

  return (
    /* Main Container: 
      - Takes up full width (w-full) up to 896px max (max-w-4xl)
      - Centered on screen using mx-auto
      - md:justify-between pushes left column to the far left, right column to the far right 
    */
    <div className='flex flex-col md:flex-row gap-6 items-center md:items-center justify-between md:justify-between w-full   p-4'>
      
      {/* Left Column: Grid + Description (Stays at the most left on desktop) */}
      <div className='flex flex-col justify-center items-center md:items-start'>
        <h1 className='w-full text-left text-2xl md:text-7xl text-[#D3FD8D] text-white mb-8'>{characterList[selectedCharacter].name}</h1>
        <div className='grid grid-cols-5 max-w-[350px] gap-2 '>
            {characterList.map((character, index) => {
              const isSelected = selectedCharacter === index;
              
              return (
                  <div 
                    key={index}
                    onClick={() => onSelectCharacter(index)}
                    className={`
                        w-[65px] h-[65px] bg-[#8B5A2B] cursor-pointer relative
                        border-4 
                        shadow-[inset_-4px_-4px_0_0_#5c3a1a,inset_4px_4px_0_0_#b3763b]
                        ${isSelected ? 'border-yellow-400 scale-105' : 'border-white hover:border-gray-300'}
                        transition-transform duration-100
                    `}
                  >
                    {character.image && (
                        <img 
                          src={character.image} 
                          alt={character.name}
                          className='w-full h-full object-contain p-1'
                          style={{ imageRendering: 'pixelated' }} 
                        />
                    )}
                  </div>
              );
            })}
        </div>
        
        {/* Description Box */}
        <div className='text-white text-[11px] max-w-[350px] mt-4 min-h-[50px]'>
            <span>{currentCharacter?.description}</span>
        </div>
      </div>

      {/* Right Column: Big Character Showcase (Stays at the most right on desktop, bottom on mobile) */}
      <div className='w-[250px] h-[250px] md:w-[500px] md:h-[500px] flex items-center justify-center p-4 '>
        {currentCharacter?.image ? (
          <img
            src={currentCharacter.image}
            alt={currentCharacter.name}
            className='w-full h-full object-contain'
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <span className="text-gray-500 text-xs uppercase tracking-wider">No Art Available</span>
        )}
      </div>

    </div>
  );
}

export default CharacterPicker;
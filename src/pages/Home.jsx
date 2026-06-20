import React, {useState} from 'react'
import FuzzyPanel from '../Components/Stats/fuzzystats'
import PixelSnow from '../Components/Background/pixelsnow'
import CharacterPicker from '../Components/Character'

import DarkVillageBg from '../assets/background/ripped_background.png'
import WereWolfTxt from '../assets/text/werewolftext.png'
import PlayBttn from '../assets/button/playgame-button.png'
import FourCharacter from '../assets/image/allchar.png'
import CampFire from '../assets/image/campfirehut.png'
import FoxCharacter from '../assets/character/fox-villager.png'



function Home() {

    const [panelActive, setPanelAactive] = useState(0);
    const [selectedCharacter, setSelectedCharacter] = useState(0)

  return (
    <>
      {/* HERO SECTION */}
      <div
        style={{ backgroundImage: `url(${DarkVillageBg})` }}
        className="relative bg-cover bg-center w-screen min-h-screen flex flex-col items-center justify-center pt-4 py-8 overflow-x-hidden"
      >
        {/* Radial gradient overlay */}
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.92) 100%)',
          }}
        /> */}

        {/* Title / Logo */}
        <div className="relative z-10 w-full max-w-[400px] md:max-w-[600px] flex flex-col items-center justify-center">
          <img src={WereWolfTxt} alt="Werewolf Text" className="w-full h-auto object-contain" />
        </div>

        <div className="relative z-10 w-[60%] h-[60px] text-center">
          <span className="text-[11px] text-[#f87171]">

              The moon is full, the air reeks of blood, and nobody is innocent.{' '}</span>
        </div>

        {/* Play Button */}
        <div className="relative z-10 w-[320px] h-[160px] sm:w-[400px] sm:h-[200px] md:w-[500px] md:h-[250px] top-[-45px] group cursor-pointer mt-4">
          <button className="w-full h-full relative focus:outline-none">
            <img
              src={PlayBttn}
              alt="Play Button"
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 z-10 flex items-center justify-center text-stone-900 text-lg sm:text-lg md:text-xl font-bold transition-colors duration-300 group-hover:text-red-600 select-none">
              Play Game
            </span>
          </button>
        </div>
      </div>

      {/* INFORMATIVE SECTION - matches reference layout */}
      <div className="w-screen bg-[#F4F0E4]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
          {/* Row 1: Text left, Image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
            {/* Left - Title + Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#636A27] mb-4">
                Designed for 6–7 Players
              </h1>
              <p className="text-sm md:text-[13px] leading-relaxed text-stone-700">
                A quick, fun social deduction game to play with friends and family. Based on the
                classic Werewolf / Mafia party game format.
              </p>
            </div>

            {/* Right - Image Placeholder */}
            <div className="w-full flex justify-center">
              <img
                src={FourCharacter}
                alt="Werewolf Cover Art"
                className="w-full max-w-[320px] h-[320px] object-contain"
              />
            </div>
          </div>

          {/* Row 2: Image left, Text right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
            {/* Left - Image Placeholder */}
            <div className="w-full flex justify-center order-2 md:order-1">
              <img
                src={CampFire}
                alt="Gameplay Preview"
                className="w-full max-w-[320px] h-[320px] object-contain rounded-3xl"
              />
            </div>

            {/* Right - Title + Description */}
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#C09B53] mb-4">
                A Deceptively Simple Game of Trust and Betrayal
              </h2>
              <p className="text-sm md:text-[13px] leading-relaxed text-stone-700">
                Whether facing one suspect or an entire village of liars, you must show your
                mastery of social reasoning and forward-thinking strategy to spot deception,
                build alliances, and ultimately survive the night. Who will be cast out, and who
                will outwit the village?
              </p>
            </div>
          </div>

          {/* Row 3: Text left, Character grid right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left - Title + Description */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mb-4">
                Powered by a Fuzzy Logic Trust System
              </h2>
              <p className="text-sm md:text-[13px] leading-relaxed text-stone-700">
                Unlike traditional Werewolf games, every AI-controlled character dynamically
                evaluates player behavior. NPCs form opinions, build alliances, accuse suspects,
                and vote based on human-like reasoning rather than scripted decisions. Each
                character has their own personality and suspicion patterns that evolve as the
                game unfolds.
              </p>
            </div>

            {/* Right - Character Grid Placeholder */}
            <div className="grid grid-cols-2 gap-3">
                <div className='relative'>

                    <img
                        src={FoxCharacter}
                        alt="Character 1"
                        className="w-full object-cover rounded-lg cursor-pointer"
                        onClick={() => setPanelAactive(0)}
                    />
                    {
                        panelActive === 1 &&

                        <div className='absolute w-[200px] top-[156px] left-[106px]'>
                            <FuzzyPanel/>
                        </div>
                    }
                </div>
              
              <div className='relative'>

                  <img
                      src={FoxCharacter}
                      alt="Character 2"
                      className="w-full object-cover rounded-lg cursor-pointer"
                      onClick={() => setPanelAactive(1)}
                  />
                  {
                    panelActive === 0 &&
                    <div className='absolute w-[200px] top-[-86px] left-[6px]'>
                        <FuzzyPanel/>
                    </div>
                  }
              </div>

            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '600px', position: 'relative' }} className='bg-[#22090D] overflow-y-hidden'>
            <PixelSnow 
                color="#ffffff"
                flakeSize={0.01}
                minFlakeSize={1.25}
                pixelResolution={200}
                speed={1.25}
                density={0.3}
                direction={125}
                brightness={1}
                depthFade={8}
                farPlane={20}
                gamma={0.4545}
                variant="square"
            />
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">

                {/* title */}
                <h1 className='text-white text-4xl mb-4'>All Roles</h1>
                <CharacterPicker
                    selectedCharacter={selectedCharacter}
                    onSelectCharacter={setSelectedCharacter}/>
            </div>
      </div>
      <div
        className='w-screen bg-[#CCA584] h-[600px]'>
        
      </div>
    </>
  )
}

export default Home
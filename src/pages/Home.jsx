import React, {useState} from 'react'
import FuzzyPanel from '../Components/Stats/fuzzystats'
import PixelSnow from '../Components/Background/pixelsnow'
import CharacterPicker from '../Components/Character'
import Stepper from '../Components/Stepper'
import FuzzyProcessPanel from '../Components/Stepper/proccessPanel'
import useFuzzyLogic from '../hooks/useFuzzyLogic'
import FuzzificationGraph from '../Components/Graph/fuzzyficationGraph'
import InputSliders from '../Components/Slider/inputSlider'
import CharacterPanel from '../Components/Character/characterPanel'
import RulesPanel from '../Components/List/ruleList'

import DarkVillageBg from '../assets/background/ripped_background.png'
import WereWolfTxt from '../assets/text/werewolftext.png'
import PlayBttn from '../assets/button/playgame-button.png'
import FourCharacter from '../assets/image/allchar.png'
import CampFire from '../assets/image/campfirehut.png'
import FoxCharacter from '../assets/character/fox-villager.png'
import GirlCharacter from '../assets/character/girl-character.png'
import MouseCharacter from '../assets/character/traveller-mouse.png'


const fuzzyProcess = [
    {
        name: "Fuzzification",
        desc: (<span>Convert player statistics into fuzzy membership values.
                Example:

                Aggression = 70 → 0.7 High, 0.3 Medium
                Lies = 40 → 0.6 Medium, 0.4 Low</span>)
    },
    {
        name: "Inference (Mamdani)",
        desc: (<span>Apply fuzzy rules to determine suspicion.

                Example:
                IF Aggression is High
                AND Lies is High
                AND Vote Behavior is Erratic
                THEN Suspicion is Very High
                The MIN operator is used to calculate rule strength.</span>)
    },
    {
        name: "Aggregation",
        desc: (<span>Combine all activated rule outputs into a single fuzzy suspicion set using the MAX operator.
                    Multiple rules may contribute simultaneously.</span>)
    },
    {
        name: "Defuzzification",
        desc: (<span>Calculate the Centroid (Center of Gravity) of the aggregated output to produce a final Suspicion Score.
                Example:
                Suspicion = 78/100
                → NPC is highly likely to vote against that player</span>)
    },
]



function Home() {

    const [panelActive, setPanelAactive] = useState(0);
    const [selectedCharacter, setSelectedCharacter] = useState(0);
    const [values, setValues] = useState({
        suspicion: 60,
        voteErraticness: 45,
        previousLies: 30,
        aggression: 40,
    });

    const handleChange = (key, val) => {
        setValues((prev) => ({ ...prev, [key]: val }))
    }

    const { memberships, finalTrust, directive, allRules, firedRules } = useFuzzyLogic(values)

  return (
    <>
      {/* HERO SECTION */}
      <div
        style={{ backgroundImage: `url(${DarkVillageBg})` }}
        className="relative bg-cover bg-center w-screen min-h-screen flex flex-col items-center justify-center pt-4 py-8 overflow-x-hidden"
      >
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
      <div className="w-screen bg-[#F1EDE1]">
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
        className='w-screen bg-[#B45517]'>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
            <h1 className='text-4xl text-white mb-4'>System Logic</h1>
            <span className='text-[11px] text-[#f1f4f2] '>
                This system simulates the reasoning process of intelligent villagers in a social deduction game. Instead of relying on fixed rules, it uses Fuzzy Logic to evaluate uncertain social behaviors and determine each player's Suspicion Score
                The AI continuously analyzes player actions and discussion patterns to make human-like judgments during voting and accusations.
            </span>
            <div className='w-full flex justify-between text-white text-[10px] mt-8'>
                  <div className='border border-white p-2 rounded-lg'>
                    4 Behavioral Inputs
                  </div>
                  <div className='border border-white p-2 rounded-lg'>
                    81-Rule Knowledge Base
                  </div>
                  <div className='border border-white p-2 rounded-lg'>
                    Real-time Suspicion Calculation
                  </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <div>
                    <img
                        src={GirlCharacter}
                        alt="Girl Character"
                        className="w-full max-w-xs lg:max-w-md"
                    />
                </div>

                <div className="text-white max-w-[300px] md:max-w-[700px]">
                    <FuzzyProcessPanel fuzzyProcess={fuzzyProcess} />
                </div>
            </div>
        </div>
      </div>
      <div className='w-screen bg-[#541F24] '>
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
                <h1 className='text-4xl text-white text-center mb-16'>Fuzzy Variables</h1>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
                    {/* LEFT: Sliders */}
                    <div className="order-1">
                    <InputSliders values={values} onChange={handleChange} />
                    </div>

                    {/* MIDDLE: Character + Dialogue + Trust */}
                    <div className="order-2 flex items-center justify-center">
                    <CharacterPanel
                        characterImg={MouseCharacter}
                        finalTrust={finalTrust}
                        directive={directive}
                    />
                    </div>

                    {/* RIGHT: Graphs (moves to bottom & becomes a grid on smaller screens) */}
                    <div className="order-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        <FuzzificationGraph label="SUSPICION" value={values.suspicion} membership={memberships.S} />
                        <FuzzificationGraph label="VOTE ERRATICNESS" value={values.voteErraticness} membership={memberships.V} />
                        <FuzzificationGraph label="PREVIOUS LIES" value={values.previousLies} membership={memberships.L} />
                        <FuzzificationGraph label="AGGRESSION BEHAVIOR" value={values.aggression} membership={memberships.B} />
                    </div>
                </div>
                <div>
                    <h2 className='text-white mb-4'>Rules Apply</h2>
                    <RulesPanel firedRules={firedRules} allRules={allRules}/>
                </div>
            </div>

      </div>
    </>
  )
}

export default Home
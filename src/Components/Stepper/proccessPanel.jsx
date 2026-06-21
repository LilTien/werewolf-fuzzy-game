import React, { useState } from 'react'

function FuzzyProcessPanel({ fuzzyProcess = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? fuzzyProcess.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === fuzzyProcess.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="text-white  w-full">
      {/* Toggle button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            setShowAll((prev) => !prev)
            setCurrentIndex(0)
          }}
          className="text-[11px] px-3 py-1 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          {showAll ? 'Show Step by Step' : 'Show All'}
        </button>
      </div>

      {showAll ? (
        // SHOW ALL MODE
        <div className="flex flex-col gap-4">
          {fuzzyProcess.map((data, index) => (
            <div key={index} className="border border-white p-4 rounded-3xl">
              <h2 className="font-bold mb-1">{data.name}</h2>
              <p className="text-sm text-[#a1a1aa]">{data.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        // STEP BY STEP MODE
        fuzzyProcess.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            {/* Up Arrow */}
            <button
              onClick={handlePrev}
              className="w-8 h-8 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              aria-label="Previous"
            >
              ▲
            </button>

            {/* Card */}
            <div className="border border-white bg-[#E8D7BD] p-4 rounded-3xl w-full min-h-[120px]">
              <h2 className="font-bold mb-1 text-[#0a0a0a]">{fuzzyProcess[currentIndex].name}</h2>
              <p className="text-sm text-[#525252]">{fuzzyProcess[currentIndex].desc}</p>
            </div>

            {/* Down Arrow */}
            <button
              onClick={handleNext}
              className="w-8 h-8 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-black transition-colors"
              aria-label="Next"
            >
              ▼
            </button>

            {/* Step indicator */}
            <span className="text-[11px] text-gray-300">
              {currentIndex + 1} / {fuzzyProcess.length}
            </span>
          </div>
        )
      )}
    </div>
  )
}

export default FuzzyProcessPanel
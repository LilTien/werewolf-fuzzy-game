import React, { useEffect, useState } from 'react'

const DIRECTIVE_LINES = {
  EXECUTE: "I can't trust them anymore... it's time to act.",
  OBSERVE: "Something feels off. I need to watch them closer.",
  ALLIANCE: "I think we can trust them. Let's work together.",
}

function CharacterPanel({ characterImg, finalTrust, directive }) {
  const [displayedText, setDisplayedText] = useState('')
  const fullText = DIRECTIVE_LINES[directive] || ''

  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayedText(fullText.slice(0, i))
      if (i >= fullText.length) clearInterval(interval)
    }, 25)
    return () => clearInterval(interval)
  }, [fullText])

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {/* Dialogue bubble */}
      <div className="relative bg-[#E6D7B6] border border-[#374151] rounded-2xl px-4 py-3 max-w-[260px] text-center">
        <p className="text-black  text-[11px] leading-relaxed min-h-[40px]">
          {displayedText}
          <span className="animate-pulse">▌</span>
        </p>
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-[#E6D7B6] border-b border-r border-[#374151] rotate-45" />
      </div>

      {/* Character image placeholder */}
      <div className="relative flex flex-col items-center">
        <img
          src={characterImg}
          alt="Character"
          className="w-[280px] h-[280px] object-contain animate-[float_3s_ease-in-out_infinite]"
        />

        <div className="absolute bottom-4 w-32 h-6 bg-black/30 rounded-full blur-md animate-[shadowFloat_3s_ease-in-out_infinite]" />
      </div>

      {/* Trust value */}
      <div className=" rounded-xl px-6 py-3 text-center">
        <p className="text-white text-[10px] tracking-widest mb-1">FINAL TRUST VALUE</p>
        <p className="text-[#facc15] text-2xl font-bold">{finalTrust}%</p>
        <p className="text-[10px] text-white mt-1">
          DIRECTIVE → <span className="text-[#22d3ee] font-bold">{directive}</span>
        </p>
      </div>
    </div>
  )
}

export default CharacterPanel
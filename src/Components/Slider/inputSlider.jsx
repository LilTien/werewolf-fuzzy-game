import React from 'react'

const SLIDER_CONFIG = [
  { key: 'suspicion', label: 'SUSPICION', color: '#f87171' },
  { key: 'voteErraticness', label: 'VOTE ERRATICNESS', color: '#fb923c' },
  { key: 'previousLies', label: 'PREVIOUS LIES', color: '#facc15' },
  { key: 'aggression', label: 'AGGRESSION BEHAVIOR', color: '#22d3ee' },
]

function InputSliders({ values, onChange }) {
  return (
    <div className=" rounded-sm p-5 w-full">
      <h2 className="text-[#22d3ee]  text-sm tracking-widest mb-5 flex items-center gap-2">
        FUZZY SANDBOX INPUTS
      </h2>

      <div className="flex flex-col gap-6">
        {SLIDER_CONFIG.map(({ key, label, color }) => (
          <div key={key}>
            <div className="flex justify-between text-[11px] mb-2">
              <span style={{ color }}>{label}:</span>
              <span className="text-gray-300">{values[key]}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={values[key]}
              onChange={(e) => onChange(key, Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-yellow-400 bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default InputSliders
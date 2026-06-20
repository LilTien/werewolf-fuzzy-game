import React from 'react'

function FuzzyPanel({
  suspicion = 65,
  voteErraticness = 40,
  previousLies = 80,
  aggressiveBehaviour = 55,
  trustLevel = 90,
}) {
  const stats = [
    { label: 'SUSPICION', value: suspicion, color: '#ef4444' },
    { label: 'VOTE ERRATICNESS', value: voteErraticness, color: '#f59e0b' },
    { label: 'PREVIOUS LIES', value: previousLies, color: '#a855f7' },
    { label: 'AGGRESSION', value: aggressiveBehaviour, color: '#22c55e' },
  ]

  return (
    <div
      className="w-full max-w-[360px] bg-[#3B2416] p-4 select-none rounded-sm"
      style={{
        imageRendering: 'pixelated',
        border: '4px solid #8B5A2B',
        boxShadow:
          'inset 0 0 0 4px #8B5A2B, inset 0 0 0 8px #8B5A2B, 6px 6px 0 0 #000',
      }}
    >
      {/* Header */}
      <div
        className="text-[10px] text-white mb-4 pb-2 text-center tracking-widest"
        
      >
        ▸ TARGET STATUS ◂
      </div>

      {/* Stat bars */}
      <div className="flex flex-col gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between text-[8px] text-white">
              <span>{stat.label}</span>
              <span>{stat.value}%</span>
            </div>
            
          </div>
        ))}
      </div>

      {/* Trust level output */}
      <div
        className=" text-center"
      >
        <span className="text-[9px] text-white tracking-wider">
          TRUST LEVEL:{' '}
          <span className="text-[11px] text-[#e0f8cf]">{trustLevel}%</span>
        </span>
      </div>
    </div>
  )
}

export default FuzzyPanel;
import React from 'react'

function FuzzificationGraph({ label, value, membership }) {
  const W = 320
  const H = 140
  const pad = 10

  // Map domain 0-100 to SVG x coords
  const x = (v) => pad + (v / 100) * (W - pad * 2)
  const y = (mu) => H - pad - mu * (H - pad * 2 - 20)

  const lowPath = `M${x(0)},${y(1)} L${x(30)},${y(1)} L${x(60)},${y(0)} L${x(100)},${y(0)}`
  const medPath = `M${x(0)},${y(0)} L${x(30)},${y(0)} L${x(50)},${y(1)} L${x(70)},${y(0)} L${x(100)},${y(0)}`
  const highPath = `M${x(0)},${y(0)} L${x(40)},${y(0)} L${x(70)},${y(1)} L${x(100)},${y(1)}`

  const indicatorX = x(value)

  return (
    <div className="  rounded-xl p-3 w-full">
      <h3 className="text-white text-[11px] tracking-widest mb-2">{label}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* grid lines */}
        {[0, 25, 50, 75, 100].map((g) => (
          <line key={g} x1={x(g)} y1={pad} x2={x(g)} y2={H - pad} stroke="#1f2937" strokeWidth="1" />
        ))}

        <path d={lowPath} fill="none" stroke="#34d399" strokeWidth="2" />
        <path d={medPath} fill="none" stroke="#fbbf24" strokeWidth="2" />
        <path d={highPath} fill="none" stroke="#f87171" strokeWidth="2" />

        {/* current value indicator */}
        <line x1={indicatorX} y1={pad} x2={indicatorX} y2={H - pad} stroke="white" strokeDasharray="3,3" strokeWidth="1.5" />
        <circle cx={indicatorX} cy={H - pad} r="4" fill="#facc15" />
      </svg>

      <div className="flex flex-wrap justify-between text-[9px] mt-2 px-1">
        <span className="text-[#34d399]">LOW={membership.low.toFixed(2)}</span>
        <span className="text-[#fbbf24]">MED={membership.med.toFixed(2)}</span>
        <span className="text-[#f87171]">HIGH={membership.high.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default FuzzificationGraph
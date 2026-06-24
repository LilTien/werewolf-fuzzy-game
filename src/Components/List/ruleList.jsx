import React, { useState, useEffect, useRef } from 'react'

const OUTPUT_STYLES = {
  execute: {
    border: 'border-red-500',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    badge: 'bg-[#450a0a] text-red-400 ',
    dot: 'bg-[#450a0a]',
    label: 'EXECUTE',
  },
  observe: {
    border: 'border-[#a16207]',
    glow: 'shadow-[0_0_8px_rgba(250,204,21,0.4)]',
    badge: 'bg-[#a16207] text-yellow-300',
    dot: 'bg-[#a16207]',
    label: 'OBSERVE',
  },
  alliance: {
    border: 'border-[#052e16]',
    glow: 'shadow-[0_0_8px_rgba(52,211,153,0.4)]',
    badge: 'bg-[#052e16] text-[#22c55e] ',
    dot: 'bg-[#052e16]',
    label: 'ALLIANCE',
  },
}

// Individual rule card with scroll-triggered fade-in + slide
function RuleCard({ rule, index, isFired, alwaysVisible }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(alwaysVisible)

  useEffect(() => {
    if (alwaysVisible) { setVisible(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [alwaysVisible])

  const style = OUTPUT_STYLES[rule.output]

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: alwaysVisible ? `${Math.min(index * 18, 300)}ms` : '0ms' }}
    >
      <div
        className={`
          relative rounded-xl px-4 py-3  text-[11px] leading-relaxed
          bg-[#E8D7BD] border transition-all duration-300
          ${isFired
            ? `${style.border} ${style.glow} bg-[#0d1117]`
            : 'border-[#1f2937] hover:border-[#374151]'
          }
        `}
      >
        {/* fired indicator pulse dot */}
        {isFired && (
          <span className="absolute top-3 right-3 flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
          </span>
        )}

        {/* rule number */}
        <span className="text-[#4b5563] text-[10px] select-none mr-2">#{String(index + 1).padStart(2, '0')}</span>

        {/* rule text */}
        <span className={isFired ? 'text-black' : 'text-[#6b7280]'}>{rule.label}</span>

        {/* output badge + weight row */}
        <div className="flex items-center justify-between mt-2">
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold tracking-widest ${style.badge}`}>
            → {style.label}
          </span>
          {isFired && (
            <span className="text-[9px] text-gray-400">
              WEIGHT = <span className="text-white">{rule.weight.toFixed(2)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Main panel
export default function RulesPanel({ firedRules = [], allRules = [] }) {
  const [showAll, setShowAll] = useState(false)
  const firedIds = new Set(firedRules.map((r) => r.label))

  // When showing all: fired rules first (already highlighted), then the rest
  const sortedAll = showAll
    ? [
        ...allRules.filter((r) => firedIds.has(r.label)).map((r) => ({
          ...r,
          weight: firedRules.find((f) => f.label === r.label)?.weight ?? 0,
        })),
        ...allRules.filter((r) => !firedIds.has(r.label)).map((r) => ({ ...r, weight: 0 })),
      ]
    : firedRules

  const displayList = sortedAll

  return (
    <div>
      <div className="flex items-center justify-between">

        <button
          onClick={() => setShowAll((prev) => !prev)}
          className={`
            text-[10px]  px-3 py-1.5  border transition-all duration-200 mb-4
            ${showAll
              ? 'bg-white text-black border-white hover:bg-gray-200'
              : 'text-white border-white/40 hover:bg-[#22d3ee]/10'
            }
          `}
        >
          {showAll ? 'HIDE ALL' : 'SHOW ALL 81'}
        </button>
      </div>

      {/* Divider with count badge */}
      {showAll && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white" />
          <span className="text-[9px]  text-white tracking-widest">
            FIRED RULES PINNED TO TOP
          </span>
          <div className="h-px flex-1 bg-white" />
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(OUTPUT_STYLES).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className=" text-[9px] text-white tracking-widest">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Rule list */}
      <div
        className={`
          flex flex-col gap-2 overflow-y-auto pr-1
          transition-all duration-300
          ${showAll ? 'max-h-[520px]' : 'max-h-[320px]'}
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1f2937]
        `}
      >
        {displayList.length === 0 ? (
          <div className="text-center py-8 text-[#374151]  text-[11px]">
            NO RULES FIRED — adjust sliders
          </div>
        ) : (
          displayList.map((rule, i) => (
            <RuleCard
              key={rule.label}
              rule={rule}
              index={showAll ? i : i}
              isFired={firedIds.has(rule.label)}
              alwaysVisible={!showAll || i < firedRules.length}
            />
          ))
        )}
      </div>

      {/* Footer summary */}
      {firedRules.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-2 border-t border-[#1f2937]">
          {['execute', 'observe', 'alliance'].map((type) => {
            const count = firedRules.filter((r) => r.output === type).length
            if (count === 0) return null
            const s = OUTPUT_STYLES[type]
            return (
              <span key={type} className={`text-[9px]  px-2 py-1 rounded-full ${s.badge}`}>
                {count} {s.label}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
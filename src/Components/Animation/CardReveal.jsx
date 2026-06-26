import React, { useState, useEffect, useRef, useMemo } from 'react'
import Button from '../Button'
import FlipCardSd from '../../assets/sounds/flipcard.wav'
import FairySd from '../../assets/sounds/fairy-sparkle.wav'
import { Howl } from 'howler'

const HALF_FLIP = 65 // ms for one half of the card flip

// ── Sparkle particles ─────────────────────────────────────────────────────────
function SparkleField({ trigger }) {
  const particles = useMemo(() => {
    if (!trigger) return []
    const palette = ['#fbbf24', '#f59e0b', '#fef08a', '#ffffff', '#e0f8cf', '#7dd3fc', '#c4b5fd']
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * 2 * Math.PI + (Math.random() - 0.5) * 0.5
      const dist  = 70 + Math.random() * 150
      return {
        id:    i,
        dx:    Math.cos(angle) * dist,
        dy:    Math.sin(angle) * dist,
        color: palette[Math.floor(Math.random() * palette.length)],
        size:  3 + Math.random() * 8,
        delay: Math.floor(Math.random() * 200),
        dur:   500 + Math.floor(Math.random() * 500),
      }
    })
  }, [trigger])

  if (!trigger) return null

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: '50%', top: '40%',
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            animation: `sparkleOut ${p.dur}ms ${p.delay}ms ease-out forwards`,
          }}
        />
      ))}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * Props:
 *   cards            — Array<{ id, name, imageSrc, description? }>
 *   assignedCardId   — id of the card to land on
 *   isOpen           — boolean
 *   onClose          — () => void
 *   autoCloseDuration — seconds before auto-close (default 10)
 */
export default function CardRevealAnimation({
  cards = [],
  assignedCardId,
  isOpen,
  onClose,
  autoCloseDuration = 10,
}) {
  const [currentIdx,      setCurrentIdx]      = useState(0)
  const [flipPhase,       setFlipPhase]       = useState('show') // 'show' | 'hide'
  const [phase,           setPhase]           = useState('idle') // 'idle' | 'shuffling' | 'revealed'
  const [sparkleTrigger,  setSparkleTrigger]  = useState(0)
  const [screenFlash,     setScreenFlash]     = useState(false)
  const [timeLeft,        setTimeLeft]        = useState(autoCloseDuration)
  const [showText,        setShowText]        = useState(false)
  const [showControls,    setShowControls]    = useState(false)

  const idsRef   = useRef([])
  const timerRef = useRef(null)


    const flipfx = useMemo(() =>
        new Howl({
            src: [FlipCardSd],
            volume: 0.2,
        }),
    [])
    const sparklefx = useMemo(() =>
        new Howl({
            src: [FairySd],
            volume: 0.4,
        }),
    [])

  const clearAll = () => {
    idsRef.current.forEach(clearTimeout)
    idsRef.current = []
    clearInterval(timerRef.current)
  }

  const assignedIdx = useMemo(
    () => Math.max(0, cards.findIndex((c) => c.id === assignedCardId)),
    [cards, assignedCardId]
  )

  // ── Animation sequence ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) { clearAll(); return }
    if (cards.length === 0) return

    const addTO = (fn, delay) => {
      const id = setTimeout(fn, delay)
      idsRef.current.push(id)
    }

    // reset UI state
    setPhase('shuffling')
    setShowText(false)
    setShowControls(false)
    setScreenFlash(false)
    setTimeLeft(autoCloseDuration)
    setFlipPhase('show')

    // speed schedule: starts fast, exponentially slows
    const intervals = [
      ...Array(14).fill(80),
      105, 135, 178, 235, 308, 405, 540, 710, 930,
    ]
    let cursor = 350 // brief pause before first flip

    intervals.forEach((iv) => {
      cursor += iv
      addTO(() => {
        setFlipPhase('hide')
        addTO(() => {
          flipfx.play()
          setCurrentIdx(Math.floor(Math.random() * cards.length))
          setFlipPhase('show')
        }, HALF_FLIP)
      }, cursor)
    })

    // final: land on assigned card
    cursor += 1150
    addTO(() => {
      setFlipPhase('hide')
      addTO(() => {
        sparklefx.play()
        setCurrentIdx(assignedIdx)
        setFlipPhase('show')
        addTO(() => {
          setPhase('revealed')
          // screen flash
          setScreenFlash(true)
          addTO(() => setScreenFlash(false), 700)
          // sparkles
          setSparkleTrigger((n) => n + 1)
          // staggered text
          addTO(() => setShowText(true),     380)
          addTO(() => setShowControls(true), 680)
        }, HALF_FLIP + 60)
      }, HALF_FLIP)
    }, cursor)

    return clearAll
  }, [isOpen, cards.length, assignedIdx, autoCloseDuration])

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'revealed') return
    let t = autoCloseDuration
    setTimeLeft(t)
    timerRef.current = setInterval(() => {
      t -= 1
      setTimeLeft(t)
      if (t <= 0) { clearInterval(timerRef.current); onClose?.() }
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, autoCloseDuration, onClose])

  if (!isOpen) return null

  const card      = cards[currentIdx] ?? {}
  const isReveal  = phase === 'revealed'
  const timerPct  = Math.max(0, (timeLeft / autoCloseDuration) * 100)

  return (
    <>
      <style>{`
        @keyframes sparkleOut {
          0%   { opacity: 1;  transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 0;  transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.1); }
        }
        @keyframes flashIn {
          0%   { opacity: 0;   }
          15%  { opacity: 0.75; }
          100% { opacity: 0;   }
        }
        @keyframes bdIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes popIn   { from { opacity: 0; transform: translateY(14px) scale(0.88); } to { opacity: 1; transform: none; } }
        @keyframes glow {
          0%   { box-shadow: 0 0 0 rgba(163, 163, 163,0); }
          45%  { box-shadow: 0 0 55px 14px rgba(163, 163, 163, 0.75), 0 0 120px 30px rgba(163, 163, 163,0.25); }
          100% { box-shadow: 0 0 28px 5px rgba(163, 163, 163,0.38); }
        }
        @keyframes bounce {
          0%   { transform: scale(1);    }
          35%  { transform: scale(1.08); }
          65%  { transform: scale(0.97); }
          100% { transform: scale(1);    }
        }
        @keyframes ringPulse {
          0%   { opacity: 0.85; transform: translate(-50%, -50%) scale(1);   }
          100% { opacity: 0;    transform: translate(-50%, -50%) scale(2.5); }
        }
        @keyframes blink {
          0%,49% { opacity: 1;   }
          50%,100%{ opacity: 0.3; }
        }
      `}</style>

      {/* Root overlay */}
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4"
        style={{ animation: 'bdIn 0.3s ease-out' }}
      >
        {/* Dark + blur backdrop */}
        <div className="absolute inset-0 bg-black/82 backdrop-blur-xl" />

        {/* Screen flash */}
        {screenFlash && (
          <div
            className="absolute inset-0 bg-white z-40 pointer-events-none"
            style={{ animation: 'flashIn 0.65s ease-out forwards' }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-[300px]">

          {/* Top label */}
          {!isReveal ? (
            <p
              className="text-[9px] tracking-[0.35em] text-white"
              style={{ animation: 'blink 0.85s infinite' }}
            >
              ▸ REVEALING YOUR ROLE ◂
            </p>
          ) : showText && (
            <p
              className="text-[9px] tracking-[0.35em] text-white"
              style={{ animation: 'fadeUp 0.5s ease-out both' }}
            >
              ★ ROLE ASSIGNED ★
            </p>
          )}

          {/* Card + all effects */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 260, height: 364 }}
          >
            {/* Pulse rings */}
            {isReveal && (
              <>
                <div
                  className="absolute left-1/2 top-1/2 border border-[#d4d4d4]/60 rounded-2xl pointer-events-none"
                  style={{ width: 270, height: 374, animation: 'ringPulse 0.85s 0.05s ease-out forwards' }}
                />
                <div
                  className="absolute left-1/2 top-1/2 border border-[#fbbf24]/30 rounded-2xl pointer-events-none"
                  style={{ width: 270, height: 374, animation: 'ringPulse 0.85s 0.28s ease-out forwards' }}
                />
              </>
            )}

            {/* Sparkles */}
            <SparkleField trigger={sparkleTrigger} />

            {/* The card */}
            <div
              style={{
                width: 260, height: 364,
                borderRadius: 16,
                overflow: 'hidden',
                flexShrink: 0,
                transition:  `transform ${HALF_FLIP}ms ease-in-out`,
                transform:   flipPhase === 'hide' ? 'scaleX(0)' : 'scaleX(1)',
                animation:   isReveal ? 'bounce 0.55s ease-out, glow 1.8s ease-out forwards' : undefined,
              }}
            >
              {card.img ? (
                <img
                  src={card.img}
                  alt={card.name ?? 'Role Card'}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
              ) : (
                // Fallback placeholder
                <div className="w-full h-full bg-[#0a0e1a] border-2 border-[#9bbc0f]
                  flex flex-col items-center justify-center gap-3">
                  <span className="text-[#9bbc0f] text-5xl">?</span>
                  <span className="text-[#9bbc0f]/50 text-[7px]">NO IMAGE</span>
                </div>
              )}

              {/* Golden border on reveal */}
              {isReveal && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-[#d4d4d4]/65"
                  style={{ boxShadow: 'inset 0 0 28px rgba(239, 68, 68, 0.14)' }}
                />
              )}
            </div>
          </div>

          {/* Role name + description */}
          {showText && (
            <div
              className="text-center flex flex-col items-center gap-2"
              style={{ animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}
            >
              <p className="text-[#7dd3fc]/65 text-[8px] tracking-[0.3em]" >
                YOU ARE THE
              </p>
              <p
                className={`${card.evil ? "text-[#dc2626]" : "text-[#a3e635]"} text-[14px] tracking-wider`}
                style={{ textShadow: '0 0 24px rgba(251,191,36,0.7)' }}
              >
                {card.name ?? 'UNKNOWN'}
              </p>
              {card.description && (
                <p className="text-gray-400/80 text-[7px] text-center max-w-[230px] leading-loose mt-1" >
                  {card.description}
                </p>
              )}
            </div>
          )}

          {/* Timer bar + close button */}
          {showControls && (
            <div
              className="flex flex-col items-center gap-3 w-full"
              style={{ animation: 'fadeUp 0.4s 0.1s ease-out both' }}
            >
              {/* Countdown bar */}
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 h-1.5 bg-[#0f2544]  overflow-hidden">
                  <div
                    className="h-full bg-[#bef264] "
                    style={{ width: `${timerPct}%`, transition: 'width 1s linear' }}
                  />
                </div>
                <span className="text-[8px] text-gray-500 min-w-[24px] text-right">
                  {timeLeft}s
                </span>
              </div>

              <Button 
                className='w-full bg-[#34d399] border-none'
                onClick={onClose}>Done</Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
import React, { useState, useRef, useEffect } from 'react'
import Button from '../Button'
import roles from '@/constant/roles'



// ── static config ─────────────────────────────────────────────────────────────

const ALL_ROLES = ['VILLAGER', 'WEREWOLF', 'DOCTOR', 'KNIGHT', 'SEER', 'SHAMAN', 'JESTER']

const MENUS = {
  accuse: {
    label: 'ACCUSE',
    color: 'text-red-400',
    border: 'border-red-500/50',
    activeBg: 'bg-red-500/15',
    options: [
      { value: 'werewolf', label: 'WEREWOLF' },
      { value: 'shaman',   label: 'SHAMAN'   },
    ],
  },
  defend: {
    label: 'DEFEND',
    color: 'text-emerald-400',
    border: 'border-emerald-500/50',
    activeBg: 'bg-emerald-500/15',
    options: [
      { value: 'innocent', label: 'INNOCENT' },
      { value: 'villager', label: 'VILLAGER' },
      { value: 'doctor',   label: 'DOCTOR'   },
      { value: 'knight',   label: 'KNIGHT'    },
      { value: 'seer',     label: 'SEER'      },
    ],
  },
  tell_role: {
    label: 'REVEAL',
    color: 'text-violet-400',
    border: 'border-violet-500/50',
    activeBg: 'bg-violet-500/15',
    options: [], // built dynamically from ALL_ROLES
  },
}

const MSG_STYLES = {
  accuse:    { bg: 'bg-red-950/40',    border: 'border-red-800/40',    tag: '⚔',  tagColor: 'text-red-400'    },
  defend:    { bg: 'bg-emerald-950/40', border: 'border-emerald-800/40', tag: '🛡', tagColor: 'text-emerald-400' },
  tell_role: { bg: 'bg-violet-950/40', border: 'border-violet-800/40', tag: '👁', tagColor: 'text-violet-400'  },
  npc:       { bg: 'bg-[#0d1117]/60',  border: 'border-[#1f2937]/60',  tag: '💬', tagColor: 'text-amber-400'   },
}

// ── message builder ───────────────────────────────────────────────────────────

function buildMessage(type, subOption, targetName, myName, myRole, msgId) {
  let text = ''
  let isLie = false

  if (type === 'accuse') {
    text = `I suspect ${targetName} is the ${subOption.toUpperCase()}!`
  } else if (type === 'defend') {
    text = subOption === 'innocent'
      ? `${targetName} is innocent — trust them!`
      : `${targetName} is the ${subOption.toUpperCase()}, I swear it.`
  } else if (type === 'tell_role') {
    isLie = subOption.toLowerCase() !== myRole.toLowerCase()
    text = isLie
      ? `I am the ${subOption.toUpperCase()}. Believe me.`
      : `I am the ${subOption.toUpperCase()}. You can trust me.`
  }

  return { id: msgId, sender: myName, text, type, isLie, timestamp: Date.now() }
}

// ── sub option pill ───────────────────────────────────────────────────────────

function OptionPill({ label, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-1.5 rounded-lg border text-[7px] tracking-wide
        transition-all duration-150 active:scale-95
        ${highlight
          ? 'bg-amber-400/20 border-amber-400/60 text-amber-300'
          : 'bg-[#0d1117] border-[#1f2937] text-gray-300 hover:border-[#374151] hover:text-white'
        }
      `}
    >
      {label}
    </button>
  )
}

// ── chat message row ──────────────────────────────────────────────────────────

function MessageRow({ msg }) {
  const isNpc   = msg.type === 'npc'
  const s       = MSG_STYLES[msg.isLie ? 'tell_role' : msg.type] ?? MSG_STYLES.npc
  const isPlayer = msg.sender !== 'System'

  return (
    <div
      className={`flex gap-2 px-2 py-2 rounded-lg border ${s.bg} ${s.border}`}
      style={{ animation: 'msgIn 0.2s ease-out both' }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={`text-[7px] tracking-wider ${isPlayer ? 'text-amber-400' : 'text-gray-500'}`}
        >
          {msg.sender}
        </span>
        <span
          className="text-[8px] text-gray-300 leading-relaxed break-words"
        >
          {msg.text}
        </span>
      </div>
    </div>
  )
}
export default function ChatPanel({
  selectedPlayer = null,
  myName         = 'You',
  myRole         = 'villager',
  npcMessages    = [],
  onAction,
}) {
  const [activeMenu,  setActiveMenu]  = useState(null)
  const [messages,    setMessages]    = useState([])
  const [msgCounter,  setMsgCounter]  = useState(0)
  const historyRef = useRef(null)

  // merge npc messages into history whenever they arrive
  useEffect(() => {
    if (!npcMessages.length) return
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id))
      const fresh = npcMessages.filter((m) => !existingIds.has(m.id))
      return fresh.length ? [...prev, ...fresh] : prev
    })
  }, [npcMessages])

  // auto-scroll to bottom on new message
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [messages])

  // close sub-menu when player selection changes
  useEffect(() => { setActiveMenu(null) }, [selectedPlayer])

  const handleMainBtn = (menuKey) => {
    if (!selectedPlayer) return
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey))
  }

  const handleOption = (menuKey, optionValue) => {
    if (!selectedPlayer) return
    const id      = msgCounter + 1
    setMsgCounter(id)
    const message = buildMessage(menuKey, optionValue, selectedPlayer.name, myName, myRole, id)
    setMessages((prev) => [...prev, message])
    onAction?.({ type: menuKey, target: selectedPlayer, subOption: optionValue, message })
    setActiveMenu(null)
  }

  // build tell_role options dynamically with truth marker
  const tellRoleOptions = ALL_ROLES.map((r) => ({
    value: r.toLowerCase(),
    label: r.toLowerCase() === myRole.toLowerCase() ? `★ ${r}` : r,
    isTruth: r.toLowerCase() === myRole.toLowerCase(),
  }))

  const disabled  = !selectedPlayer
  const menuKeys  = Object.keys(MENUS)

  return (
    <>

      <div className="absolute top-0 right-0 flex flex-col w-[300px] h-full bg-[#1c1917]/70 backdrop-blur-sm overflow-hidden">

        {/* ── header ── */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#0f2544] flex-shrink-0 ">
          <span className="text-[8px] text-white tracking-[0.25em]" >
            💬 DISCUSSION BOX
          </span>
        </div>
        <Button
            className="mt-4 ml-4 w-[150px] text-black text-[10px] bg-[#e11d48] border-none rounded-md" size='sm'>End Discussion</Button>

        {/* ── chat history ── */}
        <div
          ref={historyRef}
          className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-2
            scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1f2937]
            min-h-0"
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[7px] text-[#a1a1aa] text-center leading-loose">
                SELECT A PLAYER<br />THEN TAKE ACTION
              </span>
            </div>
          ) : (
            messages.map((msg) => <MessageRow key={msg.id} msg={msg} />)
          )}
        </div>

        {/* ── action area ── */}
        <div className="flex-shrink-0 border-t border-[#0f2544] bg-[#040912]/60">

          {/* target indicator */}
          <div
            className={`
              mx-2 mt-2 px-3 py-2 rounded-lg border flex items-center gap-2
              transition-all duration-200
              ${selectedPlayer
                ? 'border-white bg-amber-500/8'
                : 'border-[#0f2544] bg-transparent'
              }
            `}
            style={selectedPlayer ? { animation: 'targetPulse 2s infinite' } : {}}
          >
            <span className={`text-[8px] ${selectedPlayer ? 'text-white' : 'text-[#1f2937]'}`}>◎</span>
            <span
              className={`text-[7px] tracking-wider ${selectedPlayer ? 'text-white' : 'text-[#1f2937]'}`}
            >
              {selectedPlayer ? `TARGET: ${selectedPlayer.name}` : 'NO TARGET — CLICK A PLAYER'}
            </span>
          </div>

          {/* sub-menu */}
          <div className="min-h-[44px] px-2 mt-2">
            {activeMenu && (
              <div
                className="flex flex-wrap gap-1.5"
                style={{ animation: 'subIn 0.18s ease-out both' }}
              >
                {(activeMenu === 'tell_role' ? tellRoleOptions : MENUS[activeMenu].options).map((opt) => (
                  <OptionPill
                    key={opt.value}
                    label={opt.label ?? opt.value.toUpperCase()}
                    onClick={() => handleOption(activeMenu, opt.value)}
                    highlight={opt.isTruth}
                  />
                ))}
              </div>
            )}
          </div>

          {/* main action buttons */}
          <div className="flex gap-1.5 px-2 pb-2 mt-1">
            {menuKeys.map((key) => {
              const menu     = MENUS[key]
              const isActive = activeMenu === key

              return (
                <button
                  key={key}
                  onClick={() => handleMainBtn(key)}
                  disabled={disabled}
                  className={`
                    flex-1 py-2.5 rounded-xl border text-[7px] tracking-wide
                    transition-all duration-150
                    ${disabled
                      ? 'border-[#0f2544] text-[#1f2937] bg-transparent cursor-not-allowed'
                      : isActive
                      ? `${menu.border} ${menu.activeBg} ${menu.color} scale-[0.97]`
                      : `border-[#1f2937] text-gray-500 hover:${menu.border} hover:${menu.color} hover:bg-[#0d1117] active:scale-95`
                    }
                  `}
                >
                  {menu.label}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </>
  )
}
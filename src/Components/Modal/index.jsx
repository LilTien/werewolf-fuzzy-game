import React, { useEffect } from 'react'

/**
 * Reusable modal shell.
 *
 * Props:
 *   isOpen       — controls visibility
 *   onClose      — called when backdrop or ✕ is clicked
 *   title        — string shown in the header
 *   icon         — optional emoji/string icon beside the title
 *   children     — the content slot (any form, message, etc.)
 *   maxWidth     — Tailwind max-w class, default 'max-w-md'
 *   hideClose    — hides the ✕ button (useful for forced-step flows)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  icon='',
  children,
  maxWidth = 'max-w-md',
  hideClose = false,
}) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          relative z-10 w-full ${maxWidth}
          rounded-md
          bg-[#172554]/80 backdrop-blur-xl
          animate-modal-in
        `}
        style={{
          animation: 'modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 ">
          <div className="flex items-center gap-3 ">
            {icon && <span className="text-xl">{icon}</span>}
            <h2 className="w-full text-white text-center text-sm tracking-[0.15em] uppercase">
              {title}
            </h2>
          </div>
          {!hideClose && (
            <button
              onClick={onClose}
              className="text-blue-400/60 hover:text-white transition-colors text-lg leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content slot */}
        <div className="px-6 py-5">{children}</div>
      </div>

      {/* Keyframe injected inline so no CSS file needed */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  )
}
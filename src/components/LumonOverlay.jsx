import { useState, useEffect, useRef } from 'react'

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"

const MESSAGES = [
  { text: "Initializing System", duration: 1200 },
  { text: "Portfolio Ready.", duration: 1500 }
]

function LumonOverlay({ onComplete }) {
  const [mainText, setMainText] = useState('')
  const [showEnter, setShowEnter] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const timers = []
    const intervals = []
    let cancelled = false

    function scrambleText(targetText, callback) {
      const len = targetText.length
      const id = setInterval(() => {
        if (cancelled) return
        const randomStr = Array.from({ length: len }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("")
        setMainText(randomStr)
      }, 40)
      intervals.push(id)

      // Stop shuffling and show the real text after 800ms
      const revealTimer = setTimeout(() => {
        clearInterval(id)
        if (cancelled) return
        setMainText(targetText)
        // Hold the revealed text for a beat before callback
        const holdTimer = setTimeout(() => {
          if (!cancelled && callback) callback()
        }, 400)
        timers.push(holdTimer)
      }, 800)
      timers.push(revealTimer)
    }

    function runSequence(msgIndex) {
      if (cancelled) return
      if (msgIndex >= MESSAGES.length) {
        if (!cancelled) setShowEnter(true)
        return
      }

      const msg = MESSAGES[msgIndex]
      scrambleText(msg.text, () => {
        const t = setTimeout(() => runSequence(msgIndex + 1), msg.duration)
        timers.push(t)
      })
    }

    const startTimer = setTimeout(() => runSequence(0), 800)
    timers.push(startTimer)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      intervals.forEach(clearInterval)
    }
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 5,
      pointerEvents: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* CRT scanlines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.03) 50%),
                     linear-gradient(90deg, rgba(255, 0, 0, 0.01), rgba(0, 255, 0, 0.005), rgba(0, 0, 255, 0.01))`,
        backgroundSize: '100% 4px, 3px 100%',
        pointerEvents: 'none',
        zIndex: 10
      }} />

      {/* Noise grain */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
        opacity: 0.08,
        pointerEvents: 'none',
        zIndex: 11
      }} />

      {/* Init sequence - top left */}
      <div style={{
        position: 'absolute',
        top: 48,
        left: 48,
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(68, 66, 62, 0.7)',
        lineHeight: 1.5,
        textShadow: '0 0 8px rgba(255,255,255,0.8)'
      }}>
        <div>SYS_BOOT: OK</div>
        <div>LINK_ESTABLISHED: 127.0.0.1</div>
        <div>SECURITY: LEVEL_KIER</div>
        <div>DATA_REFINEMENT_V4.2</div>
      </div>

      {/* Main terminal content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        maxWidth: 1200,
        padding: 40
      }}>
        <h1 style={{
          fontSize: 'clamp(1rem, 2.5vw, 2rem)',
          letterSpacing: 3,
          marginBottom: 40,
          color: 'rgba(45, 42, 38, 0.85)',
          fontWeight: 700,
          textShadow: '0 0 12px rgba(255,255,255,0.9)',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          MACRODATA REFINEMENT DIVISION
        </h1>

        <div style={{
          fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
          lineHeight: 1.2,
          textTransform: 'uppercase',
          letterSpacing: 4,
          fontWeight: 400,
          minHeight: '4.5rem',
          color: 'rgba(45, 42, 38, 0.9)',
          textShadow: '0 0 12px rgba(255,255,255,0.9)',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          {mainText}
        </div>

      </div>

      {showEnter && (
        <div style={{
          position: 'absolute',
          top: '60%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
        <button
          onClick={() => {
            if (onCompleteRef.current) onCompleteRef.current()
          }}
          style={{
            padding: '12px 40px',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1.5px solid #2D2A26',
            color: '#2D2A26',
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            pointerEvents: 'auto',
            transition: 'background 0.3s ease, color 0.3s ease',
            animation: 'enterFadeIn 0.8s ease forwards'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2D2A26'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'
            e.currentTarget.style.color = '#2D2A26'
          }}
        >
          click to enter
        </button>
        </div>
      )}

      <style>{`
        @keyframes enterFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  )
}

export default LumonOverlay

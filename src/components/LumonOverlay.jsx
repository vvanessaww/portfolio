import { useState, useEffect, useRef, useCallback } from 'react'

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"

const MESSAGES = [
  { text: "Initializing System", duration: 600, scramble: true },
  { text: "Portfolio Ready.", duration: 800, scramble: true }
]

function LumonOverlay({ onComplete }) {
  const [mainText, setMainText] = useState('')
  const currentMsgRef = useRef(0)
  const intervalsRef = useRef([])

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(clearInterval)
    }
  }, [])

  const scrambleText = useCallback((targetText, callback) => {
    let iteration = 0
    const id = setInterval(() => {
      const result = targetText.split("").map((char, index) => {
        if (index < iteration) return targetText[index]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join("")
      setMainText(result)
      if (iteration >= targetText.length) {
        clearInterval(id)
        if (callback) callback()
      }
      iteration += 1 / 3
    }, 30)
    intervalsRef.current = [...intervalsRef.current, id]
  }, [])

  const typeText = useCallback((targetText, callback) => {
    let index = 0
    setMainText('')
    const id = setInterval(() => {
      setMainText(prev => prev + targetText[index])
      index++
      if (index >= targetText.length) {
        clearInterval(id)
        if (callback) callback()
      }
    }, 60)
    intervalsRef.current = [...intervalsRef.current, id]
  }, [])


  const runSequence = useCallback(() => {
    if (currentMsgRef.current >= MESSAGES.length) {
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 600)
      return
    }

    const msg = MESSAGES[currentMsgRef.current]
    const next = () => {
      setTimeout(() => {
        currentMsgRef.current++
        runSequence()
      }, msg.duration)
    }

    if (msg.scramble) {
      scrambleText(msg.text, next)
    } else {
      typeText(msg.text, next)
    }
  }, [scrambleText, typeText, onComplete])

  // Start sequence after mount
  useEffect(() => {
    const timer = setTimeout(runSequence, 500)
    return () => clearTimeout(timer)
  }, [runSequence])

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

    </div>
  )
}

export default LumonOverlay

import { useState, useEffect, useRef } from 'react'

function IntroScreen({ onEnter }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const audioContextRef = useRef(null)
  const line1 = 'from the desk of'
  const line2 = 'Vanessa Wang'
  const fullText = line1 + '\n' + line2
  const typingSpeed = 64 // milliseconds per character (20% faster)

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play typing sound
  const playTypingSound = () => {
    if (!audioContextRef.current) return
    
    const audioContext = audioContextRef.current
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800 // Higher frequency for crisp click
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.02)
  }

  useEffect(() => {
    let currentIndex = 0
    
    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        // Play sound for each character (skip spaces and newlines)
        if (currentIndex > 0 && fullText[currentIndex - 1] !== ' ' && fullText[currentIndex - 1] !== '\n') {
          playTypingSound()
        }
        currentIndex++
        setTimeout(typeText, typingSpeed)
      } else {
        // Show button after typing is complete
        setTimeout(() => setShowButton(true), 500)
      }
    }

    // Start typing after a brief delay
    setTimeout(typeText, 800)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEnterClick = () => {
    setIsExiting(true)
    // Wait for fade-out animation before calling onEnter
    setTimeout(() => {
      onEnter()
    }, 600)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Georgia", "Times New Roman", serif',
      overflow: 'hidden',
      opacity: isExiting ? 0 : 1,
      transform: isExiting ? 'scale(0.95)' : 'scale(1)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      zIndex: 9999,
      margin: 0,
      padding: 0
    }}>
      {/* Typing text - centered */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        padding: '0 20px'
      }}>
        <div className="intro-text">
          {displayedText.split('\n')[0]}
          {displayedText.includes('\n') && <br />}
          {displayedText.split('\n')[1] && (
            <span className="intro-name">
              {displayedText.split('\n')[1]}
            </span>
          )}
          {displayedText.length < fullText.length && (
            <span style={{
              borderRight: '2px solid #2a2a2a',
              animation: 'blink 1s step-end infinite',
              marginLeft: '2px'
            }}>
              &nbsp;
            </span>
          )}
        </div>
      </div>

      {/* Enter button - positioned below text */}
      <div className="intro-button-container">
        {showButton && (
          <button
            onClick={handleEnterClick}
            className="intro-button"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2a2a'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#2a2a2a'
            }}
          >
            click to enter
          </button>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes blink {
          0%, 50% { border-color: #2a2a2a; }
          51%, 100% { border-color: transparent; }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .intro-text {
          font-size: 32px;
          line-height: 1.6;
          color: #2a2a2a;
          letter-spacing: 0.5px;
        }
        
        .intro-name {
          font-size: 48px;
          font-weight: 500;
        }
        
        .intro-button-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + 140px));
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
        }
        
        .intro-button {
          padding: 16px 48px;
          background: transparent;
          border: 2px solid #2a2a2a;
          color: #2a2a2a;
          font-size: 16px;
          font-family: "Georgia", "Times New Roman", serif;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
          opacity: 0;
          animation: fadeIn 0.6s ease forwards;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .intro-text {
            font-size: 24px;
          }
          
          .intro-name {
            font-size: 36px;
          }
          
          .intro-button-container {
            transform: translate(-50%, calc(-50% + 100px));
          }
          
          .intro-button {
            padding: 12px 32px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .intro-text {
            font-size: 20px;
          }
          
          .intro-name {
            font-size: 28px;
          }
          
          .intro-button-container {
            transform: translate(-50%, calc(-50% + 90px));
          }
          
          .intro-button {
            padding: 10px 24px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}

export default IntroScreen

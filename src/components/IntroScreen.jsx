import { useState, useEffect } from 'react'

function IntroScreen({ onEnter }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const line1 = 'from the desk of'
  const line2 = 'Vanessa Wang'
  const fullText = line1 + '\n' + line2
  const typingSpeed = 64 // milliseconds per character (20% faster)

  useEffect(() => {
    let currentIndex = 0
    
    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
        setTimeout(typeText, typingSpeed)
      } else {
        // Show button after typing is complete
        setTimeout(() => setShowButton(true), 500)
      }
    }

    // Start typing after a brief delay
    setTimeout(typeText, 800)
  }, [])

  const handleEnterClick = () => {
    setIsExiting(true)
    // Wait for fade-out animation before calling onEnter
    setTimeout(() => {
      onEnter()
    }, 300)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Georgia", "Times New Roman", serif',
      position: 'relative',
      overflow: 'hidden',
      opacity: isExiting ? 0 : 1,
      transform: isExiting ? 'scale(0.8)' : 'scale(1)',
      transition: 'opacity 0.3s ease, transform 0.3s ease'
    }}>
      {/* Typing text - centered */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        whiteSpace: 'pre-wrap'
      }}>
        <div style={{
          fontSize: '32px',
          lineHeight: '1.6',
          color: '#2a2a2a',
          letterSpacing: '0.5px'
        }}>
          {displayedText.split('\n')[0]}
          {displayedText.includes('\n') && <br />}
          {displayedText.split('\n')[1] && (
            <span style={{ fontSize: '48px', fontWeight: '500' }}>
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

      {/* Enter button - fixed position */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {showButton && (
          <button
            onClick={handleEnterClick}
            style={{
              padding: '16px 48px',
              background: 'transparent',
              border: '2px solid #2a2a2a',
              color: '#2a2a2a',
              fontSize: '16px',
              fontFamily: '"Georgia", "Times New Roman", serif',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'background 0.3s ease, color 0.3s ease',
              opacity: 0,
              animation: 'fadeIn 0.6s ease forwards',
              whiteSpace: 'nowrap'
            }}
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
      `}</style>
    </div>
  )
}

export default IntroScreen

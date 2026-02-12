import { useState, useEffect } from 'react'

function IntroScreen({ onEnter }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showButton, setShowButton] = useState(false)
  const line1 = 'from the desk of'
  const line2 = 'Vanessa Wang'
  const fullText = line1 + '\n' + line2
  const typingSpeed = 80 // milliseconds per character

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
      overflow: 'hidden'
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
      {showButton && (
        <button
          onClick={onEnter}
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '16px 48px',
            background: 'transparent',
            border: '2px solid #2a2a2a',
            color: '#2a2a2a',
            fontSize: '16px',
            fontFamily: '"Georgia", "Times New Roman", serif',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            opacity: 0,
            animation: 'fadeIn 0.6s ease forwards'
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

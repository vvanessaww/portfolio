import { useState, useEffect } from 'react'
import IntroScreen from '../components/IntroScreen'
import DeskScene from '../components/DeskScene'

function Home({ onEnter, hasEntered, activeView, onCloseView, isNightMode }) {
  const [showIntro, setShowIntro] = useState(!hasEntered)
  const [showHint, setShowHint] = useState(false)
  const [hintFading, setHintFading] = useState(false)

  const handleEnter = () => {
    setShowIntro(false)
    if (onEnter) onEnter()
  }

  // Show hint after entering the site
  useEffect(() => {
    if (hasEntered && !showIntro) {
      const showTimer = setTimeout(() => setShowHint(true), 1500)
      const fadeTimer = setTimeout(() => setHintFading(true), 6500)
      const hideTimer = setTimeout(() => setShowHint(false), 7500)
      return () => {
        clearTimeout(showTimer)
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [hasEntered, showIntro])

  if (showIntro) {
    return <IntroScreen onEnter={handleEnter} />
  }

  return (
    <div className="page home-page">
      <div className="hero-section">
        <DeskScene 
          activeView={activeView}
          onCloseView={onCloseView}
          isNightMode={isNightMode}
        />
        <div className="hero-overlay">
          <h1>Vanessa's Desk</h1>
          <p className="hero-subtitle">(click around to explore my work)</p>
        </div>
        {showHint && (
          <div className={`hint-toast ${hintFading ? 'hint-fade-out' : 'hint-fade-in'}`}>
            <span>hint: toggle ☀️/🌙 to switch between 9–5 & after hours, or 🔊 to hear the sounds of the workday</span>
          </div>
        )}
        {/* Screen reader fallback */}
        <div className="sr-only" role="region" aria-label="Portfolio navigation">
          <p>Interactive 3D desk scene. Use the navigation bar above to explore: Writing, About Me, or Project.</p>
        </div>
      </div>
    </div>
  )
}

export default Home

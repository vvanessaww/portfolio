import { useState } from 'react'
import IntroScreen from '../components/IntroScreen'
import DeskScene from '../components/DeskScene'

function Home({ onEnter, hasEntered, activeView, onCloseView }) {
  const [showIntro, setShowIntro] = useState(!hasEntered)

  const handleEnter = () => {
    setShowIntro(false)
    if (onEnter) onEnter()
  }

  if (showIntro) {
    return <IntroScreen onEnter={handleEnter} />
  }

  return (
    <div className="page home-page">
      <div className="hero-section">
        <DeskScene 
          activeView={activeView}
          onCloseView={onCloseView}
        />
        <div className="hero-overlay">
          <h1>Vanessa's Desk</h1>
          <p className="hero-subtitle">(click objects on desk to explore my work)</p>
        </div>
      </div>
    </div>
  )
}

export default Home

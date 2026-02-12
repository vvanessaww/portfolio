import { useState } from 'react'
import IntroScreen from '../components/IntroScreen'
import DeskScene from '../components/DeskScene'
import AudioPlayer from '../components/AudioPlayer'

function Home({ onEnter, hasEntered, activeView, onCloseView, isMuted, onToggleMute }) {
  const [showIntro, setShowIntro] = useState(!hasEntered)

  const handleEnter = () => {
    setShowIntro(false)
    if (onEnter) onEnter()
  }

  if (showIntro) {
    return (
      <>
        <IntroScreen onEnter={handleEnter} />
        <AudioPlayer 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      </>
    )
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
      <AudioPlayer 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        isMuted={isMuted}
        onToggleMute={onToggleMute}
      />
    </div>
  )
}

export default Home

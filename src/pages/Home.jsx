import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IntroScreen from '../components/IntroScreen'
import DeskScene from '../components/DeskScene'
import AudioPlayer from '../components/AudioPlayer'

function Home({ onEnter, hasEntered }) {
  const navigate = useNavigate()
  const [showIntro, setShowIntro] = useState(!hasEntered)

  const handleObjectClick = (objectName) => {
    // Navigate based on clicked object
    switch(objectName) {
      case 'laptop':
        navigate('/projects')
        break
      case 'postcard':
        navigate('/strava')
        break
      case 'notebook':
        navigate('/writing')
        break
      default:
        console.log(`Clicked: ${objectName}`)
    }
  }

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
        <DeskScene onObjectClick={handleObjectClick} />
        <div className="hero-overlay">
          <h1>Vanessa's Desk</h1>
          <p className="hero-subtitle">(click objects to explore my work)</p>
        </div>
      </div>
      <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
    </div>
  )
}

export default Home

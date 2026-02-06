import { useNavigate } from 'react-router-dom'
import DeskScene from '../components/DeskScene'
import AudioPlayer from '../components/AudioPlayer'

function Home() {
  const navigate = useNavigate()

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

  return (
    <div className="page home-page">
      <div className="hero-section">
        <DeskScene onObjectClick={handleObjectClick} />
        <div className="hero-overlay">
          <h1>Vanessa's Desk</h1>
          <p className="hero-subtitle">(click objects to explore my work)</p>
        </div>
      </div>
      <AudioPlayer src="https://cdn.pixabay.com/audio/2022/05/13/audio_1808fbf07a.mp3" />
    </div>
  )
}

export default Home

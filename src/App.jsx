import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AudioPlayer from './components/AudioPlayer'

function App() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [activeView, setActiveView] = useState(null)
  const [isMuted, setIsMuted] = useState(true) // Default to muted

  const handleNavClick = (view, e) => {
    e.preventDefault()
    setActiveView(view)
  }

  const closeView = () => {
    setActiveView(null)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="app">
      {hasEnteredSite && (
        <nav className="nav">
          <a href="/" onClick={(e) => { e.preventDefault(); setActiveView(null) }}>Home</a>
          <a href="#" onClick={(e) => handleNavClick('writing', e)}>Writing</a>
          <a href="#" onClick={(e) => handleNavClick('about', e)}>About Me</a>
          <a href="#" onClick={(e) => handleNavClick('project', e)}>Project</a>
        </nav>
      )}
      <main className="main">
        <Routes>
          <Route path="/" element={
            <Home 
              onEnter={() => setHasEnteredSite(true)} 
              hasEntered={hasEnteredSite}
              activeView={activeView}
              onCloseView={closeView}
            />
          } />
        </Routes>
      </main>
      {/* Audio player at app level so it never unmounts */}
      <AudioPlayer 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />
    </div>
  )
}

export default App

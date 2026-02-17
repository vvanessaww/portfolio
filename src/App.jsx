import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AudioPlayer from './components/AudioPlayer'

function App() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [activeView, setActiveView] = useState(null)
  const [isMuted, setIsMuted] = useState(true) // Default to muted
  const [isNightMode, setIsNightMode] = useState(true) // Default to night

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
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <a href="/" onClick={(e) => { e.preventDefault(); setActiveView(null) }} aria-label="Home">Home</a>
          <a href="#" onClick={(e) => handleNavClick('writing', e)} aria-label="Writing">Writing</a>
          <a href="#" onClick={(e) => handleNavClick('about', e)} aria-label="About Me">About Me</a>
          <a href="#" onClick={(e) => handleNavClick('project', e)} aria-label="Project">Project</a>
          <button 
            className="day-night-toggle"
            onClick={() => setIsNightMode(!isNightMode)}
            aria-label={isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
            title={isNightMode ? 'Day mode' : 'Night mode'}
          >
            {isNightMode ? '☀️' : '🌙'}
          </button>
        </nav>
      )}
      <main className="main" role="main">
        <Routes>
          <Route path="/" element={
            <Home 
              onEnter={() => setHasEnteredSite(true)} 
              hasEntered={hasEnteredSite}
              activeView={activeView}
              onCloseView={closeView}
              isNightMode={isNightMode}
            />
          } />
          <Route path="*" element={
            <Home 
              onEnter={() => setHasEnteredSite(true)} 
              hasEntered={hasEnteredSite}
              activeView={activeView}
              onCloseView={closeView}
              isNightMode={isNightMode}
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

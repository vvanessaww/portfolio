import { useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectModal from './components/ProjectModal'
import { getProjectByObject } from './data/projects'

function App() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [activeView, setActiveView] = useState(null)
  const [activeProject, setActiveProject] = useState(null)
  const [isMuted, setIsMuted] = useState(false) // Default to sound on
  const [isNightMode, setIsNightMode] = useState(false) // Default to day
  const audioRef = useRef(null)

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch(() => {})
    }
  }

  const handleNavClick = (view, e) => {
    e.preventDefault()
    setActiveView(view)
  }

  const closeView = () => {
    setActiveView(null)
  }

  const handleProjectClick = (objectName) => {
    const project = getProjectByObject(objectName)
    if (project) {
      setActiveProject(project)
    }
  }

  const closeProject = () => {
    setActiveProject(null)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
    setIsMuted(!isMuted)
  }

  return (
    <div className="app">
      {hasEnteredSite && (
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <a href="/" onClick={(e) => { e.preventDefault(); setActiveView(null) }} aria-label="Home">home</a>
          <a href="#" onClick={(e) => handleNavClick('writing', e)} aria-label="Writing">writing</a>
          <a href="#" onClick={(e) => handleNavClick('about', e)} aria-label="About Me">about me</a>
          <a href="#" onClick={(e) => handleNavClick('project', e)} aria-label="Project">project</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProjectClick('bookshelf') }} aria-label="Books">books</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleProjectClick('tablet') }} aria-label="Git Art">git art</a>
          <div className="nav-controls">
            <button 
              className="nav-icon-button"
              onClick={() => setIsNightMode(!isNightMode)}
              aria-label={isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
              title={isNightMode ? 'Day mode' : 'Night mode'}
            >
              {isNightMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button 
              className="nav-icon-button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      )}
      <main className="main" role="main">
        <Routes>
          <Route path="/" element={
            <Home 
              onEnter={() => { setHasEnteredSite(true); startAudio(); }} 
              hasEntered={hasEnteredSite}
              activeView={activeView}
              onCloseView={closeView}
              onProjectClick={handleProjectClick}
              isNightMode={isNightMode}
            />
          } />
          <Route path="*" element={
            <Home 
              onEnter={() => { setHasEnteredSite(true); startAudio(); }} 
              hasEntered={hasEnteredSite}
              activeView={activeView}
              onCloseView={closeView}
              onProjectClick={handleProjectClick}
              isNightMode={isNightMode}
            />
          } />
        </Routes>
      </main>
      {/* Hidden audio element - controls are in the nav */}
      <audio ref={audioRef} src="/ambient.mp3" loop />
      
      {/* Project Modal */}
      {activeProject && (
        <ProjectModal project={activeProject} onClose={closeProject} />
      )}
    </div>
  )
}

export default App

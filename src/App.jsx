import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)
  const [activeView, setActiveView] = useState(null)

  const handleNavClick = (view, e) => {
    e.preventDefault()
    setActiveView(view)
  }

  const closeView = () => {
    setActiveView(null)
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
    </div>
  )
}

export default App

import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Strava from './pages/Strava'
import Projects from './pages/Projects'
import Writing from './pages/Writing'

function App() {
  const [hasEnteredSite, setHasEnteredSite] = useState(false)

  return (
    <div className="app">
      {hasEnteredSite && (
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/strava">Strava</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/writing">Writing</Link>
        </nav>
      )}
      <main className="main">
        <Routes>
          <Route path="/" element={<Home onEnter={() => setHasEnteredSite(true)} hasEntered={hasEnteredSite} />} />
          <Route path="/strava" element={<Strava />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/writing" element={<Writing />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

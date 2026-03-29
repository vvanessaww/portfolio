import { useState } from 'react'

const SKILLS = [
  { label: 'BUILDING PRODUCTS', width: 92 },
  { label: 'PUSHING LIMITS', width: 88 },
  { label: 'THINKING CRITICALLY', width: 85 },
  { label: 'PERPETUALLY LEARNING', width: 80 }
]

const BINS = [
  {
    num: 1,
    status: 'ACTIVE',
    title: 'VIBE CHECK',
    desc: 'Coachella 2026 vibe check. Take a short quiz to find your stage and recommended artists, or share with a friend to find your coachella chemistry.',
    link: null
  },
  {
    num: 2,
    status: 'ACTIVE',
    title: 'GIT ART',
    desc: 'GitHub contribution graph → retro pixel art. 7 style options including Tetris, Pacman, and custom text rendering.',
    link: null
  },
  {
    num: 3,
    status: 'ACTIVE',
    title: 'BOOKWORM',
    desc: 'Personal digital library with niche genre tracking and reading goals. Goodreads export with Google Books API cover lookup.',
    link: null
  },
  {
    num: 4,
    status: 'IN PROGRESS',
    title: 'STRAVA POSTCARD',
    desc: 'Strava activities → vintage commemorative postcards. Route visualization with activity stats overlay.',
    link: null
  },
  {
    num: 5,
    status: 'ACTIVE',
    title: 'WRITING',
    desc: 'Musings on life in New York and the digital world. Published on Substack.',
    link: null
  }
]

function TerminalOverlay({ onProjectClick }) {
  const [activeTab, setActiveTab] = useState('projects')
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

  const handleBinClick = (bin) => {
    if (bin.link) {
      window.location.href = bin.link
      return
    }
    const binToObject = {
      'VIBE CHECK': 'vibecheck',
      'GIT ART': 'tablet',
      'BOOKWORM': 'bookshelf',
      'STRAVA POSTCARD': 'postcard',
      'WRITING': 'notebook'
    }
    if (onProjectClick && binToObject[bin.title]) {
      onProjectClick(binToObject[bin.title])
    }
  }

  return (
    <div className="terminal-casing">
      {/* Left Panel */}
      <div className={`panel-left ${leftOpen ? '' : 'collapsed'}`}>
        <button className="panel-toggle" onClick={() => setLeftOpen(prev => !prev)}>
          <span className={`panel-chevron ${leftOpen ? '' : 'closed'}`}>&#9666;</span>
        </button>
        {leftOpen && (
          <div className="panel-body">
            <div className="panel-heading">Employee Info</div>
            <div className="employee-data">
              <h2 className="employee-name">Vanessa W.</h2>
              <div className="data-row">
                <span className="data-label">ROLE</span>
                <span className="data-value">Product Manager</span>
              </div>
              <div className="data-row">
                <span className="data-label">DEPT</span>
                <span className="data-value">MDR / PRODUCT</span>
              </div>
              <div className="data-row">
                <span className="data-label">LOCATION</span>
                <span className="data-value">New York City</span>
              </div>
            </div>

            <div className="contact-links">
              <div className="section-title">Contact Info</div>
              <a href="https://github.com/vvanessaww" target="_blank" rel="noopener noreferrer" className="contact-link">GITHUB</a>
              <a href="https://linkedin.com/in/vanessazwang" target="_blank" rel="noopener noreferrer" className="contact-link">LINKEDIN</a>
              <a href="https://x.com/vanessazwang" target="_blank" rel="noopener noreferrer" className="contact-link">X</a>
            </div>

            <div className="skill-matrix">
              <div className="section-title">Core Competencies</div>
              {SKILLS.map((skill) => (
                <div key={skill.label}>
                  <div className="data-label">{skill.label}</div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: `${skill.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Center Viewport - transparent, desk scene shows through */}
      <div className="panel-center">
        <div className="viewport-overlay">
          <div className="crosshair ch-tl" />
          <div className="crosshair ch-tr" />
          <div className="crosshair ch-bl" />
          <div className="crosshair ch-br" />
        </div>
        <div className="viewport-label">OPTICAL INPUT VIEWPORT</div>
      </div>

      {/* Right Panel */}
      <div className={`panel-right ${rightOpen ? '' : 'collapsed'}`}>
        <button className="panel-toggle panel-toggle-right" onClick={() => setRightOpen(prev => !prev)}>
          <span className={`panel-chevron ${rightOpen ? 'right' : 'right closed'}`}>&#9656;</span>
        </button>
        {rightOpen && (
          <div className="panel-body">
            <div className="panel-heading">Projects</div>
            <ul className="bin-list">
              {BINS.map((bin) => (
                <li
                  key={bin.num}
                  className="bin-item"
                  onClick={() => handleBinClick(bin)}
                >
                  <div className="bin-header">
                    <span className="bin-num">{bin.num}</span>
                    <strong className="bin-title">{bin.title}</strong>
                    <span className="bin-status">{bin.status}</span>
                  </div>
                  <div className="bin-content">
                    {bin.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hardware labels */}
      <span className="hardware-label hl-top">MDR-T MK. IV</span>
      <span className="hardware-label hl-bottom">SEVERED FLOOR</span>

      {/* Mobile layout */}
      <div className="mobile-terminal">
        {/* Mobile viewport (desk scene shows through) */}
        <div className="mobile-viewport" />

        {/* Mobile content area - shown based on active tab */}
        {activeTab === 'info' && (
          <div className="mobile-content">
            <div className="panel-heading">Employee Info</div>
            <div className="employee-data">
              <h2 className="employee-name">Vanessa W.</h2>
              <div className="data-row">
                <span className="data-label">ROLE</span>
                <span className="data-value">Product Manager</span>
              </div>
              <div className="data-row">
                <span className="data-label">DEPT</span>
                <span className="data-value">MDR / PRODUCT</span>
              </div>
              <div className="data-row">
                <span className="data-label">LOCATION</span>
                <span className="data-value">New York City</span>
              </div>
            </div>
            <div className="skill-matrix">
              <div className="section-title">Core Competencies</div>
              {SKILLS.map((skill) => (
                <div key={skill.label}>
                  <div className="data-label">{skill.label}</div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: `${skill.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="contact-links">
              <div className="section-title">Contact Info</div>
              <a href="https://github.com/vvanessaww" target="_blank" rel="noopener noreferrer" className="contact-link">GITHUB</a>
              <a href="https://linkedin.com/in/vanessazwang" target="_blank" rel="noopener noreferrer" className="contact-link">LINKEDIN</a>
              <a href="https://x.com/vanessazwang" target="_blank" rel="noopener noreferrer" className="contact-link">X</a>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="mobile-content">
            <div className="panel-heading">Projects</div>
            <ul className="bin-list">
              {BINS.map((bin) => (
                <li
                  key={bin.num}
                  className="bin-item"
                  onClick={() => handleBinClick(bin)}
                >
                  <div className="bin-header">
                    <span className="bin-num">{bin.num}</span>
                    <strong className="bin-title">{bin.title}</strong>
                    <span className="bin-status">{bin.status}</span>
                  </div>
                  <div className="bin-content">
                    {bin.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom tab nav */}
        <nav className="mobile-tab-nav">
          {['INFO', 'PROJECTS'].map((tab) => (
            <button
              key={tab}
              className={`mobile-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default TerminalOverlay

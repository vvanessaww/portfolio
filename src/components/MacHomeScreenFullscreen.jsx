import { useState, useEffect } from 'react'

function MacHomeScreenFullscreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in on mount
    const timer = setTimeout(() => setIsVisible(true), 10)
    
    // Handle ESC key
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEsc)
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div 
      className="modal-overlay"
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 300ms ease',
        cursor: 'pointer'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1400px',
          height: '90vh',
          background: '#1e3a5f',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          cursor: 'default',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms ease',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
      {/* Close X button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'background 0.2s ease',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1',
          padding: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        aria-label="Close"
      >
        ×
      </button>
      {/* Menu bar */}
      <div style={{
        width: '100%', height: '28px', background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center',
        padding: '0 16px', fontSize: '13px', color: '#fff',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
      }}>
        <span style={{ fontWeight: 600, marginRight: '20px' }}>🍎</span>
        <span style={{ marginRight: '16px' }}>Finder</span>
        <span style={{ marginRight: '16px' }}>File</span>
        <span style={{ marginRight: '16px' }}>Edit</span>
        <span style={{ marginRight: '16px' }}>View</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
          <span>🔋</span>
          <span>📶</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Windows area */}
      <div style={{
        flex: 1, position: 'relative', padding: '20px', display: 'flex',
        gap: '20px', flexWrap: 'wrap', overflowY: 'auto',
        WebkitOverflowScrolling: 'touch', minHeight: 0
      }}>
        {/* LinkedIn window */}
        <div 
          style={{
            flex: '1 1 300px', minWidth: '280px', maxWidth: '100%',
            borderRadius: '8px', background: '#fff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', minHeight: '400px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            height: '40px', background: '#f6f6f6', borderBottom: '1px solid #ddd',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px'
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            <div style={{ flex: 1, textAlign: 'center', fontSize: '13px', color: '#666' }}>LinkedIn - Vanessa Wang</div>
          </div>
          
          <div style={{ flex: 1, overflow: 'auto', background: '#f3f2ef' }}>
            <div style={{ background: '#0a66c2', height: '120px' }} />
            <div style={{ padding: '0 24px' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: '#fff', border: '4px solid #fff',
                marginTop: '-60px', marginBottom: '12px', overflow: 'hidden'
              }}>
                <img src="/profile-photo.jpg" alt="Vanessa Wang" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '600', margin: '8px 0', color: '#000', fontFamily: '"Michroma", "Eurostile", sans-serif', textTransform: 'uppercase' }}>Vanessa Wang</h1>
                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>Product Manager @ ServiceNow</p>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>New York, NY · 1000+ connections</p>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); window.open('https://www.linkedin.com/in/vvanessaww', '_blank') }}
                style={{
                  marginTop: '12px', padding: '8px 20px', background: '#0a66c2',
                  color: '#fff', border: 'none', borderRadius: '24px', fontSize: '14px',
                  fontWeight: '600', cursor: 'pointer',
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  transition: 'background 0.2s ease', boxShadow: '0 2px 8px rgba(10,102,194,0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#004182'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0a66c2'}
              >View Full Profile →</button>
              
              <div style={{ marginTop: '16px', padding: '16px', background: '#fff', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#000', fontFamily: '"Michroma", "Eurostile", sans-serif', textTransform: 'uppercase' }}>About</h2>
                <p style={{ fontSize: '13px', color: '#000', lineHeight: '1.6' }}>
                  Product Manager with an engineering background, currently building enterprise software at ServiceNow. I enjoy solving complex problems & owning ambiguous spaces.
                </p>
              </div>
              <div style={{ marginTop: '12px', padding: '16px', background: '#fff', borderRadius: '8px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#000', fontFamily: '"Michroma", "Eurostile", sans-serif', textTransform: 'uppercase' }}>Experience</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ fontSize: '28px' }}>🏢</div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0', color: '#000', fontFamily: '"Michroma", "Eurostile", sans-serif', textTransform: 'uppercase' }}>Product Manager</h3>
                    <p style={{ fontSize: '13px', color: '#666', margin: '4px 0' }}>ServiceNow</p>
                    <p style={{ fontSize: '11px', color: '#999', margin: '4px 0' }}>2024 - Present</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal window */}
        <div 
          style={{
            flex: '1 1 280px', minWidth: '280px', maxWidth: '100%',
            borderRadius: '8px', background: '#1e1e1e',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', minHeight: '300px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            height: '40px', background: '#2d2d2d', display: 'flex',
            alignItems: 'center', padding: '0 16px', gap: '8px',
            borderBottom: '1px solid #1a1a1a'
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            <div style={{ flex: 1, textAlign: 'center', fontSize: '13px', color: '#999' }}>Terminal</div>
          </div>
          
          <div style={{ 
            flex: 1, padding: '16px',
            fontFamily: '"SF Mono", Monaco, "Courier New", monospace',
            fontSize: '13px', color: '#00ff00', overflow: 'auto', lineHeight: '1.6'
          }}>
            <div style={{ color: '#fff' }}>Last login: {new Date().toDateString()}</div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#4a9eff' }}>vanessa@macbook</span>
              <span style={{ color: '#fff' }}> ~ % </span>
              <span style={{ color: '#00ff00' }}>whoami</span>
            </div>
            <div>product manager at servicenow </div>
            <div style={{ marginTop: '12px' }}>
              <span style={{ color: '#4a9eff' }}>vanessa@macbook</span>
              <span style={{ color: '#fff' }}> ~ % </span>
              <span style={{ color: '#00ff00' }}>ls -la ~/projects</span>
            </div>
            <div>* portfolio website</div>
            <div>* thoughtful: a smart journal</div>
            <div>* kudos card: digital to analog</div>
            <div style={{ marginTop: '12px' }}>
              <span style={{ color: '#4a9eff' }}>vanessa@macbook</span>
              <span style={{ color: '#fff' }}> ~ % </span>
              <span style={{ color: '#00ff00' }}>echo $PATH</span>
            </div>
            <div>pushing my limits, learning new things, and creating more than i consume.</div>
            <div style={{ marginTop: '12px' }}>
              <span style={{ color: '#4a9eff' }}>vanessa@macbook</span>
              <span style={{ color: '#fff' }}> ~ % </span>
              <span style={{ animation: 'blink 1s infinite' }}>▊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dock */}
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px', cursor: 'default' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(40px)',
          borderRadius: '16px', padding: '8px 16px', display: 'flex', gap: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {['📁', '🌐', '✉️', '📅', '🎵', '📸', '⚙️'].map((icon, i) => (
            <div key={i} style={{
              width: '60px', height: '60px',
              background: `linear-gradient(135deg, ${['#5EA3F7', '#FF5E5E', '#FFD93D', '#6BCF7F', '#FF8C69', '#A78BFA', '#94A3B8'][i]}, ${['#2D7DD2', '#D93A3A', '#F4C430', '#48A760', '#E56B50', '#845EC2', '#64748B'][i]})`,
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '32px', cursor: 'default',
              transition: 'transform 0.2s ease', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>{icon}</div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default MacHomeScreenFullscreen

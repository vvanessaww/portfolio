import { useState } from 'react'

function NotebookFullscreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useState(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div 
      onClick={handleClose}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)', zIndex: 1000, cursor: 'pointer',
        opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
      }}
    >
      <div className="notebook-content" style={{
        width: '800px', height: '90%', background: '#f5f5f0',
        borderRadius: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative', padding: '60px 80px', overflow: 'auto'
      }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ width: '100%', height: '32px', borderBottom: '1px solid #d0d0d0', marginBottom: '0px' }} />
        ))}
        
        <div style={{
          position: 'absolute', left: '80px', top: '60px', bottom: '60px',
          width: '2px', background: '#ff8888', opacity: 0.3
        }} />
        
        <div style={{
          position: 'absolute', top: '70px', left: '100px', right: '80px',
          fontFamily: '"Caveat", cursive', fontSize: '24px', lineHeight: '34px',
          color: '#2a2a2a', pointerEvents: 'none'
        }}>
          <div style={{ marginBottom: '24px', fontSize: '18px', color: '#666' }}>02/07/2026</div>
          <div style={{ marginBottom: '16px' }}>Writing is one of many ways I love to express myself - I enjoy thinking</div>
          <div style={{ marginBottom: '16px' }}>deeply about a variety of topics, and writing gives me a medium to</div>
          <div style={{ marginBottom: '16px' }}>translate that into a tangible, shareable artifact. Most of my musings</div>
          <div style={{ marginBottom: '16px' }}>on life in New York and the digital world can be found here:</div>
          <div style={{ 
            marginTop: '24px', fontSize: '20px', color: '#2a5a8a',
            textDecoration: 'underline', cursor: 'pointer', pointerEvents: 'auto'
          }}
          onClick={(e) => { e.stopPropagation(); window.open('https://vanessawang.substack.com', '_blank') }}>
            vanessawang.substack.com
          </div>
        </div>
        
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%',
          transform: 'translateX(-50%)', color: '#888', fontSize: '14px',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          textAlign: 'center', zIndex: 10
        }}>Click anywhere to close</div>
      </div>
    </div>
  )
}

export default NotebookFullscreen

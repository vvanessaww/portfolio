import { useState } from 'react'

function PostcardFullscreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  // Trigger animation on mount
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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      <div className="postcard-content" style={{
        width: '800px',
        height: '500px',
        background: '#e8e4dc',
        borderRadius: '4px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        padding: '40px'
      }}>
        <div style={{
          flex: 1,
          borderRadius: '4px',
          marginRight: '30px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/postcard-image.jpg" 
            alt="Central Park, NYC" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          fontFamily: '"Caveat", cursive',
          padding: '10px 0'
        }}>
          <div style={{ fontSize: '22px', lineHeight: '1.8', color: '#2a2a2a' }}>
            <p style={{ marginBottom: '16px' }}>I'm constantly thinking through</p>
            <p style={{ marginBottom: '16px' }}>the next idea in my head. Now</p>
            <p style={{ marginBottom: '16px' }}>I'm trying to replace that with</p>
            <p style={{ marginBottom: '16px' }}>building.</p>
            <p style={{ marginTop: '32px', fontStyle: 'italic', fontSize: '20px', color: '#666' }}>Coming soon...</p>
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ width: '80%', height: '2px', background: '#5a5a5a', marginBottom: '20px', opacity: 0.4 }} />
            ))}
          </div>
          
          <div style={{
            position: 'absolute', top: '40px', right: '40px',
            width: '60px', height: '70px', background: '#8a3a3a',
            border: '2px dashed #fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '24px'
          }}>📮</div>
        </div>
        
        <div style={{
          position: 'fixed', bottom: '15px', left: '50%',
          transform: 'translateX(-50%)', color: '#888', fontSize: '13px',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          textAlign: 'center', zIndex: 10
        }}>Click anywhere to close</div>
      </div>
    </div>
  )
}

export default PostcardFullscreen

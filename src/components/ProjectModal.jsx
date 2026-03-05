import { useState, useEffect } from 'react'

function ProjectModal({ project, onClose }) {
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

  if (!project) return null

  return (
    <div 
      className="modal-overlay"
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
      onClick={handleClose}
    >
      <div 
        className="modal-content"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '1100px',
          width: '100%',
          height: 'fit-content',
          maxHeight: '90vh',
          position: 'relative',
          cursor: 'default',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms ease',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side: Preview */}
        <div style={{
          flex: '1.2',
          background: '#f5f5f5',
          position: 'relative',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {project.previewUrl && (
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <iframe
                src={project.previewUrl}
                style={{
                  width: '200%',
                  height: '200%',
                  border: 'none',
                  transform: 'scale(0.5)',
                  transformOrigin: 'top left',
                  pointerEvents: 'none'
                }}
                title={`${project.title} preview`}
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Right side: Info & Actions */}
        <div style={{
          flex: '1',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0, 0, 0, 0.05)',
              color: '#1a1a1a',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Header */}
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 16px',
              color: '#1a1a1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {project.title}
            </h2>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#666',
              margin: '0 0 24px'
            }}>
              {project.description}
            </p>

            {/* Tech stack */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#999',
                margin: '0 0 10px'
              }}>
                Tech Stack
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      display: 'inline-block',
                      padding: '5px 12px',
                      background: '#f0f0f0',
                      color: '#333',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 24px',
                background: '#1a1a1a',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                transition: 'background 0.2s ease',
                border: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
            >
              Open Live Site ↗
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 24px',
                background: '#f5f5f5',
                color: '#1a1a1a',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                transition: 'background 0.2s ease',
                border: '1px solid #e0e0e0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#ebebeb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
            >
              View Code on GitHub ↗
            </a>
          </div>
        </div>
      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 900px) {
          .modal-content {
            flex-direction: column !important;
            max-height: 95vh !important;
            overflow-y: auto !important;
          }
          .modal-content > div:first-child {
            min-height: 300px !important;
          }
          .modal-content > div:last-child {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectModal

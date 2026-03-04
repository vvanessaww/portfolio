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
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          cursor: 'default',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 300ms ease',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0, 0, 0, 0.05)',
            color: '#1a1a1a',
            fontSize: '20px',
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
        <div style={{
          padding: '40px 40px 24px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 12px',
            color: '#1a1a1a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {project.title}
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#666',
            margin: 0
          }}>
            {project.description}
          </p>
        </div>

        {/* Preview iframe */}
        {project.previewUrl && (
          <div style={{
            padding: '0',
            background: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              background: '#fff',
              overflow: 'hidden'
            }}>
              <iframe
                src={project.previewUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title={`${project.title} preview`}
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Tech stack */}
        <div style={{
          padding: '24px 40px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#999',
            margin: '0 0 12px'
          }}>
            Tech Stack
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: '#f0f0f0',
                  color: '#333',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Features (if available) */}
        {project.features && project.features.length > 0 && (
          <div style={{
            padding: '24px 40px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#999',
              margin: '0 0 12px'
            }}>
              Features
            </h3>
            <ul style={{
              margin: 0,
              padding: '0 0 0 20px',
              listStyle: 'none'
            }}>
              {project.features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#666',
                    position: 'relative',
                    paddingLeft: '12px'
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    color: '#999'
                  }}>•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          padding: '32px 40px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '14px 28px',
              background: '#1a1a1a',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '15px',
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
              flex: '1',
              minWidth: '200px',
              padding: '14px 28px',
              background: '#f5f5f5',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '15px',
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

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .modal-content {
            border-radius: 12px !important;
            max-height: 95vh !important;
          }
          .modal-content > div {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .modal-content h2 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectModal

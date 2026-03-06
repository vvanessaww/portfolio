import { useState, useEffect } from 'react'

function ProjectModal({ project, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

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

  useEffect(() => {
    // Preload image if it's an image preview
    if (project?.previewUrl && project?.previewType === 'image') {
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.src = project.previewUrl
    } else {
      // For iframes, just set loaded after modal animation
      const timer = setTimeout(() => setImageLoaded(true), 400)
      return () => clearTimeout(timer)
    }
  }, [project])

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
        {/* Left side: Preview or Placeholder */}
        <div style={{
          flex: '1.2',
          background: project.previewUrl ? '#f5f5f5' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {!imageLoaded && project.previewUrl && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(0, 0, 0, 0.1)',
                borderTop: '3px solid #666',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {project.previewUrl ? (
            project.previewType === 'image' ? (
              <img
                src={project.previewUrl}
                alt={`${project.title} preview`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 400ms ease'
                }}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 400ms ease'
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
            )
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#ffffff',
              padding: '40px'
            }}>
              <div style={{
                fontSize: '72px',
                marginBottom: '20px',
                opacity: 0.9
              }}>
                {project.id === 'writing' ? '✍️' : project.comingSoon ? '🚧' : '🎨'}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 12px',
                fontFamily: '"Michroma", "Eurostile", sans-serif',
                textTransform: 'uppercase'
              }}>
                {project.title}
              </h3>
              {!project.comingSoon && (
                <p style={{
                  fontSize: '16px',
                  opacity: 0.9,
                  maxWidth: '300px',
                  margin: '0 auto',
                  lineHeight: '1.5'
                }}>
                  Click "Open Live Site" below to view
                </p>
              )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                color: '#1a1a1a',
                fontFamily: '"Michroma", "Eurostile", sans-serif',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                {project.title}
              </h2>
              {project.comingSoon && (
                <span style={{
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                }}>
                  Coming Soon
                </span>
              )}
            </div>
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
                margin: '0 0 10px',
                fontFamily: '"Michroma", "Eurostile", sans-serif'
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
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {project.comingSoon ? (
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '8px'
              }}>🚧</div>
              <div style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#667eea',
                marginBottom: '4px',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
              }}>
                Coming Soon
              </div>
              <div style={{
                fontSize: '13px',
                color: '#666',
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
              }}>
                This project is still under development
              </div>
            </div>
          ) : (
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
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
              >
                Open Live Site ↗
              </a>
              {project.githubUrl && (
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
                    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ebebeb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
                >
                  View Code on GitHub ↗
                </a>
              )}
            </div>
          )}
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
            min-height: 55vw !important;
            flex: none !important;
            height: 55vw !important;
          }
          .modal-content > div:last-child {
            padding: 24px !important;
          }
        }
        @media (max-width: 500px) {
          .modal-overlay {
            padding: 8px !important;
          }
          .modal-content {
            flex-direction: column !important;
            max-height: 97vh !important;
            overflow-y: auto !important;
            border-radius: 12px !important;
          }
          .modal-content > div:first-child {
            min-height: 70vw !important;
            flex: none !important;
            height: 70vw !important;
          }
          .modal-content > div:first-child iframe {
            width: 300% !important;
            height: 300% !important;
            transform: scale(0.3334) !important;
            transform-origin: top left !important;
          }
          .modal-content > div:last-child {
            padding: 20px !important;
          }
          .modal-content > div:last-child h2 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectModal

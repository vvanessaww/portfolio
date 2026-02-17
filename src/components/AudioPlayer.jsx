import { useRef, useEffect } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ src, isMuted, onToggleMute, hidden = false }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      // Auto-play on mount if not muted
      if (!isMuted) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(err => {
          console.log('Autoplay prevented:', err)
        })
      }
    }
  }, [isMuted])

  if (hidden) {
    return (
      <audio ref={audioRef} loop>
        <source src={src} type="audio/mpeg" />
      </audio>
    )
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} loop>
        <source src={src} type="audio/mpeg" />
      </audio>
      
      <button 
        className="sound-button" 
        onClick={onToggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default AudioPlayer

import { useRef, useEffect } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ src, isMuted, onToggleMute }) {
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
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
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

export default AudioPlayer

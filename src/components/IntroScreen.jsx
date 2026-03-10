import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Severance-inspired hallway scene
function HallwayScene() {
  const hallwayLength = 35
  const hallwayWidth = 3
  const hallwayHeight = 2.8

  return (
    <>
      {/* Brighter ambient wash */}
      <ambientLight intensity={0.7} />

      {/* Fog - makes hallway fade to white, feels endless */}
      <fog attach="fog" args={['#ffffff', 12, 32]} />

      {/* Fluorescent strip lights - evenly spaced, cast light downward onto floor */}
      {Array.from({ length: 14 }, (_, i) => -1 - i * 2.4).map((z, i) => (
        <group key={i}>
          {/* Main downward light */}
          <pointLight
            position={[0, hallwayHeight - 0.2, z]}
            intensity={1.0}
            distance={6}
            color="#f8f8ff"
          />
          {/* Floor bounce - subtle pool of light below each fixture */}
          <spotLight
            position={[0, hallwayHeight - 0.1, z]}
            angle={Math.PI / 3}
            penumbra={0.8}
            intensity={0.5}
            distance={4}
            color="#f8f8ff"
            target-position={[0, 0, z]}
          />
          {/* Rectangular fluorescent panel */}
          <mesh position={[0, hallwayHeight - 0.02, z]}>
            <boxGeometry args={[0.5, 0.03, 1.6]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f0f0ff"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* Floor - lighter linoleum */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -hallwayLength / 2]} receiveShadow>
        <planeGeometry args={[hallwayWidth, hallwayLength]} />
        <meshStandardMaterial color="#dcdeda" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, hallwayHeight, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayWidth, hallwayLength]} />
        <meshStandardMaterial color="#f7f7f7" />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayLength, hallwayHeight]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayLength, hallwayHeight]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Left baseboard */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hallwayWidth / 2 + 0.001, 0.05, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayLength, 0.1]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      {/* Right baseboard */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hallwayWidth / 2 - 0.001, 0.05, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayLength, 0.1]} />
        <meshStandardMaterial color="#d0d0d0" />
      </mesh>

      {/* Back wall - distant, mostly hidden by fog */}
      <mesh position={[0, hallwayHeight / 2, -hallwayLength]}>
        <planeGeometry args={[hallwayWidth, hallwayHeight]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </>
  )
}

function MouseCamera() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08

    const targetX = smooth.current.x * 1.2
    const targetY = 1.4 - smooth.current.y * 0.5

    camera.position.x = smooth.current.x * 0.5
    camera.position.y = 1.4 - smooth.current.y * 0.2
    camera.lookAt(targetX, targetY, -10)
  })

  return null
}

function IntroScreen({ onEnter }) {
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    // Fade in from white
    const fadeTimer = setTimeout(() => setFadeIn(true), 50)
    // Show button after scene loads
    const buttonTimer = setTimeout(() => setShowButton(true), 1200)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  const handleEnterClick = () => {
    setIsExiting(true)
    // Wait for fade to black, then trigger scene change
    setTimeout(() => {
      onEnter()
    }, 1000)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#ffffff',
      overflow: 'hidden',
      zIndex: 9999,
      margin: 0,
      padding: 0,
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 800ms ease-in'
    }}>
      {/* Three.js Canvas */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        shadows
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ffffff']} />
        <PerspectiveCamera makeDefault position={[0, 1.4, -2]} fov={60} />
        <Suspense fallback={null}>
          <HallwayScene />
        </Suspense>
        <MouseCamera />
      </Canvas>

      {/* Globe logo and button container */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        pointerEvents: 'none'
      }}>
        {/* Lumon-style globe logo with name */}
        <svg
          viewBox="0 0 400 200"
          style={{
            width: 'clamp(220px, 36vw, 400px)',
            height: 'auto',
            filter: 'drop-shadow(0 1px 6px rgba(255,255,255,0.9))'
          }}
        >
          <defs>
            {/* Clip to top half of oval (above text band) */}
            <clipPath id="clipTop">
              <rect x="0" y="0" width="400" height="85" />
            </clipPath>
            {/* Clip to bottom half of oval (below text band) */}
            <clipPath id="clipBottom">
              <rect x="0" y="115" width="400" height="100" />
            </clipPath>
            {/* Clip to inside the oval */}
            <clipPath id="clipGlobe">
              <ellipse cx="200" cy="100" rx="170" ry="80" />
            </clipPath>
          </defs>

          {/* Globe oval outline */}
          <ellipse cx="200" cy="100" rx="170" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="3" />

          {/* Vertical meridian - center */}
          <line x1="200" y1="20" x2="200" y2="85" stroke="#1a1a1a" strokeWidth="2.2" />
          <line x1="200" y1="115" x2="200" y2="180" stroke="#1a1a1a" strokeWidth="2.2" />

          {/* Vertical meridians - inner pair */}
          <ellipse cx="200" cy="100" rx="28" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipTop)" />
          <ellipse cx="200" cy="100" rx="28" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipBottom)" />

          {/* Vertical meridians - outer pair */}
          <ellipse cx="200" cy="100" rx="65" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipTop)" />
          <ellipse cx="200" cy="100" rx="65" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipBottom)" />

          {/* Vertical meridians - widest pair */}
          <ellipse cx="200" cy="100" rx="110" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipTop)" />
          <ellipse cx="200" cy="100" rx="110" ry="80" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipBottom)" />

          {/* Horizontal latitude line - upper */}
          <ellipse cx="200" cy="60" rx="155" ry="10" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipGlobe)" />

          {/* Horizontal latitude line - lower */}
          <ellipse cx="200" cy="140" rx="155" ry="10" fill="none" stroke="#1a1a1a" strokeWidth="2.2"
            clipPath="url(#clipGlobe)" />

          {/* Name text across the globe center */}
          <text
            x="200" y="107"
            textAnchor="middle"
            fontFamily="'Michroma', 'Eurostile', sans-serif"
            fontSize="20"
            fontWeight="700"
            letterSpacing="0.2em"
            fill="#1a1a1a"
          >
            VANESSA WANG
          </text>
        </svg>

        {/* Enter button - always rendered, opacity toggled to prevent layout shift */}
        <div style={{ pointerEvents: showButton ? 'auto' : 'none' }}>
          <button
            onClick={handleEnterClick}
            className={`intro-button ${showButton ? 'intro-button-visible' : ''}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'
              e.currentTarget.style.color = '#1a1a1a'
            }}
          >
            click to enter
          </button>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        .intro-button {
          padding: 14px 44px;
          background: rgba(255, 255, 255, 0.85);
          border: 1.5px solid #1a1a1a;
          color: #1a1a1a;
          font-size: 11px;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 1.2s ease-out, background 0.3s ease, color 0.3s ease;
          opacity: 0;
          white-space: nowrap;
          backdrop-filter: blur(5px);
        }

        .intro-button-visible {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .intro-button {
            padding: 12px 32px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .intro-button {
            padding: 10px 24px;
            font-size: 13px;
          }
        }
      `}</style>

      {/* Fade to black overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        opacity: isExiting ? 1 : 0,
        transition: 'opacity 0.8s ease-in',
        zIndex: 10000,
        pointerEvents: 'none'
      }} />
    </div>
  )
}

export default IntroScreen

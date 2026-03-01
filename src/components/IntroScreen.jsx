import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Hallway scene component
function HallwayScene() {
  const hallwayLength = 12
  const hallwayWidth = 3
  const hallwayHeight = 3.5
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight position={[2, 5, 2]} intensity={0.8} />
      
      {/* Ceiling lights */}
      {[0, -2, -4, -6, -8].map((z, i) => (
        <group key={i}>
          <pointLight position={[0, hallwayHeight - 0.2, z]} intensity={1.2} distance={4} />
          <mesh position={[0, hallwayHeight - 0.05, z]}>
            <boxGeometry args={[0.8, 0.05, 1.2]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -hallwayLength / 2]} receiveShadow>
        <planeGeometry args={[hallwayWidth, hallwayLength]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      
      {/* Floor stripe (center line) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -hallwayLength / 2]}>
        <planeGeometry args={[0.05, hallwayLength]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, hallwayHeight, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayWidth, hallwayLength]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayLength, hallwayHeight]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2]}>
        <planeGeometry args={[hallwayLength, hallwayHeight]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, hallwayHeight / 2, -hallwayLength]}>
        <planeGeometry args={[hallwayWidth, hallwayHeight]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
    </>
  )
}

function IntroScreen({ onEnter }) {
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Show button after scene loads
    const timer = setTimeout(() => setShowButton(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleEnterClick = () => {
    setIsExiting(true)
    setTimeout(() => {
      onEnter()
    }, 600)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: isExiting ? 0 : 1,
      transform: isExiting ? 'scale(0.95)' : 'scale(1)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      zIndex: 9999,
      margin: 0,
      padding: 0
    }}>
      {/* Three.js Canvas */}
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'block'
        }}
        shadows
      >
        <PerspectiveCamera makeDefault position={[0, 1.6, 3.5]} fov={60} />
        <Suspense fallback={null}>
          <HallwayScene />
        </Suspense>
        {/* Subtle camera control - limited rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 2.8}
          maxAzimuthAngle={Math.PI / 12}
          minAzimuthAngle={-Math.PI / 12}
          target={[0, 1.4, 0]}
        />
      </Canvas>

      {/* Name text and button container */}
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
        gap: '32px'
      }}>
        <h1 style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 500,
          color: '#2a2a2a',
          margin: 0,
          letterSpacing: '2px',
          textShadow: '0 2px 10px rgba(255, 255, 255, 0.9)',
          animation: 'fadeIn 1s ease forwards',
          opacity: 0,
          pointerEvents: 'none'
        }}>
          Vanessa Wang
        </h1>
        
        {/* Enter button */}
        <div style={{
          pointerEvents: 'auto'
        }}>
        {showButton && (
          <button
            onClick={handleEnterClick}
            className="intro-button"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2a2a2a'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
              e.currentTarget.style.color = '#2a2a2a'
            }}
          >
            click to enter
          </button>
        )}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .intro-button {
          padding: 16px 48px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #2a2a2a;
          color: #2a2a2a;
          font-size: 16px;
          font-family: "Georgia", "Times New Roman", serif;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
          opacity: 0;
          animation: fadeIn 0.8s ease 0.3s forwards;
          white-space: nowrap;
          backdrop-filter: blur(5px);
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
    </div>
  )
}

export default IntroScreen

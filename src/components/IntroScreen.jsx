import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import LumonOverlay from './LumonOverlay'

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
  const [isExiting, setIsExiting] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(fadeTimer)
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

      {/* Lumon terminal overlay */}
      <LumonOverlay onComplete={handleEnterClick} />

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

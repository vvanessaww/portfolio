import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import LumonOverlay from './LumonOverlay'

// Helper for merging geometries at positions
function transformedGeo(geo, { position = [0,0,0], rotation = [0,0,0] } = {}) {
  const clone = geo.clone()
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  m.compose(new THREE.Vector3(...position), q, new THREE.Vector3(1, 1, 1))
  clone.applyMatrix4(m)
  return clone
}

// Severance-inspired hallway — optimized: 28 lights → 4 lights, merged geometry
function HallwayScene() {
  const hallwayLength = 35
  const hallwayWidth = 3
  const hallwayHeight = 2.8

  // Merge all fluorescent panels into one mesh
  const { panelGeo, panelMat } = useMemo(() => {
    const base = new THREE.BoxGeometry(0.5, 0.03, 1.6)
    const panels = Array.from({ length: 14 }, (_, i) => {
      const z = -1 - i * 2.4
      return transformedGeo(base, { position: [0, hallwayHeight - 0.02, z] })
    })
    return {
      panelGeo: mergeGeometries(panels),
      panelMat: new THREE.MeshStandardMaterial({
        color: '#ffffff', emissive: '#f0f0ff', emissiveIntensity: 2,
      }),
    }
  }, [])

  // Shared materials
  const mats = useMemo(() => ({
    floor: new THREE.MeshStandardMaterial({ color: '#dcdeda' }),
    ceiling: new THREE.MeshStandardMaterial({ color: '#f7f7f7' }),
    wall: new THREE.MeshStandardMaterial({ color: '#f5f5f5' }),
    baseboard: new THREE.MeshStandardMaterial({ color: '#d0d0d0' }),
  }), [])

  // Shared geometries
  const geos = useMemo(() => ({
    floor: new THREE.PlaneGeometry(hallwayWidth, hallwayLength),
    ceiling: new THREE.PlaneGeometry(hallwayWidth, hallwayLength),
    wall: new THREE.PlaneGeometry(hallwayLength, hallwayHeight),
    baseboard: new THREE.PlaneGeometry(hallwayLength, 0.1),
    backWall: new THREE.PlaneGeometry(hallwayWidth, hallwayHeight),
  }), [])

  return (
    <>
      {/* Simplified lighting: 1 ambient + 3 point lights instead of 28 */}
      <ambientLight intensity={0.9} color="#f8f8ff" />
      <pointLight position={[0, hallwayHeight - 0.3, -5]} intensity={2} distance={12} color="#f8f8ff" />
      <pointLight position={[0, hallwayHeight - 0.3, -15]} intensity={2} distance={12} color="#f8f8ff" />
      <pointLight position={[0, hallwayHeight - 0.3, -25]} intensity={1.5} distance={12} color="#f8f8ff" />

      <fog attach="fog" args={['#ffffff', 12, 32]} />

      {/* Merged fluorescent panels — 1 draw call */}
      <mesh geometry={panelGeo} material={panelMat} />

      {/* Walls/floor/ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -hallwayLength / 2]} geometry={geos.floor} material={mats.floor} />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, hallwayHeight, -hallwayLength / 2]} geometry={geos.ceiling} material={mats.ceiling} />
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2]} geometry={geos.wall} material={mats.wall} />
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hallwayWidth / 2, hallwayHeight / 2, -hallwayLength / 2]} geometry={geos.wall} material={mats.wall} />
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-hallwayWidth / 2 + 0.001, 0.05, -hallwayLength / 2]} geometry={geos.baseboard} material={mats.baseboard} />
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[hallwayWidth / 2 - 0.001, 0.05, -hallwayLength / 2]} geometry={geos.baseboard} material={mats.baseboard} />
      <mesh position={[0, hallwayHeight / 2, -hallwayLength]} geometry={geos.backWall} material={mats.wall} />
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
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#ffffff']} />
        <PerspectiveCamera makeDefault position={[0, 1.4, -2]} fov={60} />
        <Suspense fallback={null}>
          <HallwayScene />
        </Suspense>
        <MouseCamera />
      </Canvas>

      <LumonOverlay onComplete={handleEnterClick} />

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

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useState, useRef } from 'react'
import * as THREE from 'three'

// Interactive object wrapper with hover/click states
function InteractiveObject({ children, name, position, rotation, onClick }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        console.log(`Clicked: ${name}`)
        if (onClick) onClick(name)
      }}
      scale={hovered ? 1.05 : 1}
    >
      {children}
    </group>
  )
}

// Minimalist desk
function Desk() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[4, 0.08, 2]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Legs */}
      {[[-1.8, 0, -0.8], [1.8, 0, -0.8], [-1.8, 0, 0.8], [1.8, 0, 0.8]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.08, 1.5, 0.08]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Laptop with screen and keyboard
function Laptop({ hovered }) {
  const screenAngle = -Math.PI / 6
  return (
    <group>
      {/* Base/keyboard */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? "#4a4a4a" : "#333333"} 
          roughness={0.4} 
          metalness={0.6} 
        />
      </mesh>
      {/* Keyboard detail */}
      <mesh position={[0, 0.04, 0.02]}>
        <boxGeometry args={[0.5, 0.005, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Trackpad */}
      <mesh position={[0, 0.04, -0.12]}>
        <boxGeometry args={[0.15, 0.002, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
      </mesh>
      {/* Screen */}
      <group position={[0, 0.04, 0.2]} rotation={[screenAngle, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.58, 0.4, 0.015]} />
          <meshStandardMaterial 
            color={hovered ? "#4a4a4a" : "#333333"} 
            roughness={0.4} 
            metalness={0.6} 
          />
        </mesh>
        {/* Screen display */}
        <mesh position={[0, 0.2, 0.008]}>
          <boxGeometry args={[0.5, 0.32, 0.001]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            emissive={hovered ? "#1a3a5a" : "#0a1a2a"}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Apple logo on back of screen */}
        <mesh position={[0, 0.25, -0.009]}>
          <circleGeometry args={[0.04, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.2}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  )
}

// Postcard/photo frame
function Postcard({ hovered }) {
  return (
    <group>
      {/* Card base */}
      <mesh>
        <boxGeometry args={[0.25, 0.35, 0.01]} />
        <meshStandardMaterial 
          color={hovered ? "#f5f5f0" : "#e8e4dc"} 
          roughness={0.9} 
        />
      </mesh>
      {/* Photo area */}
      <mesh position={[0, 0.03, 0.006]}>
        <boxGeometry args={[0.2, 0.2, 0.001]} />
        <meshStandardMaterial 
          color="#8fa4b8"
          emissive={hovered ? "#2a4a6a" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Text lines */}
      {[-0.08, -0.12].map((y, i) => (
        <mesh key={i} position={[0, y, 0.006]}>
          <boxGeometry args={[0.18, 0.015, 0.001]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      ))}
    </group>
  )
}

// Notebook
function Notebook({ hovered }) {
  return (
    <group>
      {/* Cover */}
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? "#4a6a8a" : "#2c4a6a"} 
          roughness={0.7} 
        />
      </mesh>
      {/* Pages */}
      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[0.28, 0.015, 0.38]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.95} />
      </mesh>
      {/* Spine detail */}
      <mesh position={[-0.14, 0.015, 0]}>
        <boxGeometry args={[0.02, 0.032, 0.4]} />
        <meshStandardMaterial 
          color={hovered ? "#3a5a7a" : "#1c3a5a"} 
          roughness={0.5} 
        />
      </mesh>
      {/* Elastic band */}
      <mesh position={[0.05, 0.031, 0]}>
        <boxGeometry args={[0.01, 0.002, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

// Coffee mug (bonus ambient object)
function Mug() {
  return (
    <group position={[1.4, 0.35, -0.5]}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#f0f0e8" roughness={0.3} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.01, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#f0f0e8" roughness={0.3} />
      </mesh>
      {/* Coffee */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#3d2314" roughness={0.1} />
      </mesh>
    </group>
  )
}

// Pen holder with pens
function PenHolder() {
  return (
    <group position={[-1.5, 0.35, -0.6]}>
      {/* Cup */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.04, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Pens */}
      {[[0.02, 0.08, 0.01], [-0.01, 0.09, -0.02], [0, 0.07, 0.02]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[(Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.2]}>
          <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
          <meshStandardMaterial color={['#2a4a7a', '#7a2a2a', '#2a2a2a'][i]} />
        </mesh>
      ))}
    </group>
  )
}

// Palm tree plant
function PalmTree() {
  return (
    <group position={[-2.5, -1.2, 1.8]} scale={3}>
      {/* Pot */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.15, 8]} />
        <meshStandardMaterial color="#2a2520" roughness={0.7} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.02, 8]} />
        <meshStandardMaterial color="#3d2f1f" roughness={0.95} />
      </mesh>
      {/* Trunk - taller */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.5, 6]} />
        <meshStandardMaterial color="#4a3f2a" roughness={0.8} />
      </mesh>
      {/* Lower frond layer */}
      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <group key={`lower-${i}`} position={[0, 0.48, 0]} rotation={[0, rad, Math.PI / 5]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.02, 0.16, 0.01]} />
              <meshStandardMaterial color="#3a6818" roughness={0.6} />
            </mesh>
          </group>
        )
      })}
      {/* Upper frond layer */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <group key={`upper-${i}`} position={[0, 0.58, 0]} rotation={[0, rad, Math.PI / 6]}>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.02, 0.2, 0.01]} />
              <meshStandardMaterial color="#2d5016" roughness={0.6} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// Window on background wall
function Window() {
  return (
    <group position={[1.5, 1.8, -2.98]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[0.8, 1, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Glass panes */}
      <mesh position={[-0.2, 0.25, 0.025]}>
        <boxGeometry args={[0.35, 0.45, 0.01]} />
        <meshStandardMaterial 
          color="#d0e8ff" 
          transparent 
          opacity={0.3} 
          emissive="#8ab4d5" 
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0.2, 0.25, 0.025]}>
        <boxGeometry args={[0.35, 0.45, 0.01]} />
        <meshStandardMaterial 
          color="#d0e8ff" 
          transparent 
          opacity={0.3} 
          emissive="#8ab4d5" 
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-0.2, -0.25, 0.025]}>
        <boxGeometry args={[0.35, 0.45, 0.01]} />
        <meshStandardMaterial 
          color="#d0e8ff" 
          transparent 
          opacity={0.3} 
          emissive="#8ab4d5" 
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0.2, -0.25, 0.025]}>
        <boxGeometry args={[0.35, 0.45, 0.01]} />
        <meshStandardMaterial 
          color="#d0e8ff" 
          transparent 
          opacity={0.3} 
          emissive="#8ab4d5" 
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

// Desk lamp with functional light
function DeskLamp() {
  return (
    <group position={[1.6, 0.3, -0.7]} scale={1.8}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Arm */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 12, Math.PI / 3, -Math.PI / 4]}>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Shade */}
      <mesh position={[0.05, 0.25, 0.08]} rotation={[-Math.PI / 3, Math.PI / 3, -Math.PI / 8]}>
        <coneGeometry args={[0.08, 0.12, 16, 1, true]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Light source */}
      <spotLight
        position={[0.05, 0.22, 0.08]}
        angle={Math.PI / 5}
        penumbra={0.5}
        intensity={0.8}
        color="#fff8e1"
        distance={4}
        target-position={[-0.9, 0, 0.4]}
      />
    </group>
  )
}

// Bookshelf with books
function Bookshelf() {
  return (
    <group position={[-3, -1.25, -1]}>
      {/* Main frame */}
      {/* Left side */}
      <mesh position={[-0.75, 1.5, 0]}>
        <boxGeometry args={[0.05, 3, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Right side */}
      <mesh position={[0.75, 1.5, 0]}>
        <boxGeometry args={[0.05, 3, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, 1.5, -0.175]}>
        <boxGeometry args={[1.5, 3, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
      {/* Shelves */}
      {[0.2, 0.9, 1.6, 2.3, 2.95].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.5, 0.04, 0.4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      {/* Books on shelves */}
      {[0.25, 0.92, 1.63, 2.33].map((shelfY, shelfIndex) => {
        const booksOnShelf = 8 + Math.floor(Math.random() * 3)
        return Array.from({ length: booksOnShelf }).map((_, bookIndex) => {
          const bookWidth = 0.03 + Math.random() * 0.04
          const bookHeight = 0.2 + Math.random() * 0.15
          const xPos = -0.65 + (bookIndex * 0.16)
          const colors = ['#8b4513', '#2c4a6a', '#4a2a2a', '#2a4a2a', '#5a3a1a', '#1a2a4a', '#4a1a3a']
          const bookColor = colors[Math.floor(Math.random() * colors.length)]
          
          return (
            <mesh 
              key={`shelf${shelfIndex}-book${bookIndex}`} 
              position={[xPos, shelfY + bookHeight / 2, 0.05]}
              rotation={[0, (Math.random() - 0.5) * 0.1, 0]}
            >
              <boxGeometry args={[bookWidth, bookHeight, 0.12]} />
              <meshStandardMaterial color={bookColor} roughness={0.8} />
            </mesh>
          )
        })
      })}
    </group>
  )
}

// Cloud couch (CB2 style)
function CloudCouch() {
  return (
    <group position={[3, -1.25, 0.5]}>
      {/* Base/frame */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.8, 0.15, 1]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.9} />
      </mesh>
      {/* Main seat cushion - puffy */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.7, 0.3, 0.9]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.95} />
      </mesh>
      {/* Left seat cushion puff */}
      <mesh position={[-0.45, 0.4, 0]} scale={[1, 1.1, 1]}>
        <boxGeometry args={[0.7, 0.35, 0.85]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      {/* Right seat cushion puff */}
      <mesh position={[0.45, 0.4, 0]} scale={[1, 1.1, 1]}>
        <boxGeometry args={[0.7, 0.35, 0.85]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      {/* Back cushions - cloud style */}
      {[-0.5, 0, 0.5].map((xPos, i) => (
        <group key={i} position={[xPos, 0.7, -0.35]}>
          {/* Main back cushion */}
          <mesh>
            <boxGeometry args={[0.5, 0.6, 0.25]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} />
          </mesh>
          {/* Puffy detail on top */}
          <mesh position={[0, 0.25, 0.05]} scale={[0.9, 0.8, 0.8]}>
            <boxGeometry args={[0.5, 0.3, 0.2]} />
            <meshStandardMaterial color="#fafafa" roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Arm rests - chunky and puffy */}
      <mesh position={[-0.8, 0.45, 0]}>
        <boxGeometry args={[0.25, 0.5, 0.9]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.95} />
      </mesh>
      <mesh position={[0.8, 0.45, 0]}>
        <boxGeometry args={[0.25, 0.5, 0.9]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.95} />
      </mesh>
    </group>
  )
}

// Carpet
function Carpet() {
  return (
    <group position={[1, -1.24, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Main carpet */}
      <mesh>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.95} />
      </mesh>
      {/* Subtle pattern/border */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[3.3, 2.3]} />
        <meshStandardMaterial color="#9a8a7a" roughness={0.98} />
      </mesh>
    </group>
  )
}

// Desk chair
function DeskChair() {
  return (
    <group position={[0, -1.25, -1.3]}>
      {/* Base (5-star) */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        return (
          <group key={i} rotation={[0, rad, 0]}>
            <mesh position={[0.25, 0.03, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.1]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Wheel */}
            <mesh position={[0.4, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
            </mesh>
          </group>
        )
      })}
      {/* Central column */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 1.0, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[0.55, 0.1, 0.55]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* Seat cushion detail */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1.45, -0.22]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      {/* Backrest cushion */}
      <mesh position={[0, 1.45, -0.17]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.5, 0.65, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Main scene content
function Scene({ onObjectClick }) {
  const [hoveredObject, setHoveredObject] = useState(null)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-3, 4, -2]} 
        intensity={0.3} 
        color="#a0c0ff"
      />
      <pointLight position={[0, 2, 0]} intensity={0.2} color="#fff5e6" />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Background wall */}
      <mesh position={[0, 1, -3]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color="#252525" roughness={0.95} />
      </mesh>

      {/* Desk */}
      <Desk />

      {/* Interactive objects on desk */}
      <InteractiveObject 
        name="laptop" 
        position={[0, 0.3, 0]}
        onClick={onObjectClick}
      >
        <Laptop hovered={hoveredObject === 'laptop'} />
      </InteractiveObject>

      <InteractiveObject 
        name="postcard" 
        position={[-0.8, 0.47, 0.2]}
        rotation={[-Math.PI / 12, 0.1, 0]}
        onClick={onObjectClick}
      >
        <Postcard hovered={hoveredObject === 'postcard'} />
      </InteractiveObject>

      <InteractiveObject 
        name="notebook" 
        position={[0.9, 0.3, 0.3]}
        rotation={[0, -0.2, 0]}
        onClick={onObjectClick}
      >
        <Notebook hovered={hoveredObject === 'notebook'} />
      </InteractiveObject>

      {/* Ambient objects (non-interactive) */}
      <Mug />
      <PenHolder />
      <PalmTree />
      <Window />
      <DeskLamp />
      <DeskChair />
      <Bookshelf />
      <CloudCouch />
      <Carpet />
    </>
  )
}

// Main exported component
function DeskScene({ onObjectClick }) {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: '500px',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)'
    }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 2.5, 4], 
          fov: 45,
          near: 0.1,
          far: 100
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene onObjectClick={onObjectClick} />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0.2, 0]}
        />
      </Canvas>
    </div>
  )
}

export default DeskScene

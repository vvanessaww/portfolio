import { Canvas, useLoader } from '@react-three/fiber'
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

// Mac Home Screen Component (mini version for laptop)
function MacHomeScreen({ mini = false }) {
  const scale = mini ? 0.001 : 1
  const wallpaperColor = "#1e3a5f"
  
  return (
    <group scale={[1, 1, scale]}>
      {/* Wallpaper gradient */}
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={wallpaperColor}
          emissive={wallpaperColor}
          emissiveIntensity={mini ? 0.3 : 0.2}
        />
      </mesh>
      
      {mini && (
        <>
          {/* Dock at bottom */}
          <mesh position={[0, -0.4, 0.001]}>
            <planeGeometry args={[0.6, 0.08]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={0.3}
              emissive="#ffffff"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* App icons in dock */}
          {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
            <mesh key={i} position={[x, -0.4, 0.002]}>
              <planeGeometry args={[0.05, 0.05]} />
              <meshStandardMaterial 
                color={['#3a7dff', '#ff3a3a', '#3aff3a', '#ff3aff', '#ffaa3a'][i]}
                emissive={['#3a7dff', '#ff3a3a', '#3aff3a', '#ff3aff', '#ffaa3a'][i]}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
          
          {/* Menu bar at top */}
          <mesh position={[0, 0.47, 0.001]}>
            <planeGeometry args={[1, 0.03]} />
            <meshStandardMaterial 
              color="#000000"
              transparent
              opacity={0.4}
            />
          </mesh>
        </>
      )}
    </group>
  )
}

// Laptop with screen and keyboard
function Laptop({ hovered }) {
  const screenAngle = -Math.PI / 12  // 90 degrees to table (nearly perpendicular)
  return (
    <group scale={1.3}>
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
        {/* Screen display with Mac home screen */}
        <group position={[0, 0.2, -0.008]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <planeGeometry args={[0.5, 0.32]} />
            <meshStandardMaterial 
              color="#0a0a0a" 
              emissive={hovered ? "#1a3a5a" : "#0a1a2a"}
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Mac home screen on laptop display */}
          <group scale={[0.5, 0.32, 1]} position={[0, 0, 0.001]}>
            <MacHomeScreen mini={true} />
          </group>
        </group>
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

// Curved desktop monitor
function CurvedMonitor() {
  const segments = 32
  const radius = 0.6
  const angle = Math.PI / 3
  
  return (
    <group position={[0, 0.95, 0.4]} rotation={[0, 0, 0]} scale={1.2}>
      {/* Chrome arched monitor stand base */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.02, 16]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Chrome arched stand */}
      <mesh position={[0, -0.35, -0.05]} rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[0.15, 0.015, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Chrome connection arm */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.1, 12]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Monitor back housing - curved */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Curved screen - clean glass, no bars */}
      {Array.from({ length: segments }).map((_, i) => {
        const segmentAngle = (angle / segments) * i - angle / 2
        const x = Math.sin(segmentAngle) * radius
        const z = Math.cos(segmentAngle) * radius - radius + 0.025
        return (
          <mesh 
            key={i} 
            position={[x, 0, z]} 
            rotation={[0, -segmentAngle, 0]}
          >
            <boxGeometry args={[1 / segments, 0.55, 0.01]} />
            <meshStandardMaterial 
              color="#0a0a0a" 
              transparent
              opacity={0.9}
              roughness={0.02}
              metalness={0.1}
            />
          </mesh>
        )
      })}
      {/* Bezel bottom */}
      <mesh position={[0, -0.3, 0.02]}>
        <boxGeometry args={[1.02, 0.04, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

// Photo Frame with real image texture
function PhotoFrame({ imagePath, size = [0.25, 0.18], hovered, frameColor = "#1a1a1a" }) {
  const texture = useLoader(THREE.TextureLoader, imagePath)
  const [width, height] = size
  const frameThickness = 0.02
  const frameDepth = 0.02
  
  return (
    <group>
      {/* Frame borders - top, bottom, left, right */}
      {/* Top border */}
      <mesh position={[0, height / 2 + frameThickness / 2, 0]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        <meshStandardMaterial 
          color={frameColor} 
          roughness={0.3} 
          metalness={frameColor === "#ffffff" ? 0.1 : 0.4}
        />
      </mesh>
      {/* Bottom border */}
      <mesh position={[0, -height / 2 - frameThickness / 2, 0]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        <meshStandardMaterial 
          color={frameColor} 
          roughness={0.3} 
          metalness={frameColor === "#ffffff" ? 0.1 : 0.4}
        />
      </mesh>
      {/* Left border */}
      <mesh position={[-width / 2 - frameThickness / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshStandardMaterial 
          color={frameColor} 
          roughness={0.3} 
          metalness={frameColor === "#ffffff" ? 0.1 : 0.4}
        />
      </mesh>
      {/* Right border */}
      <mesh position={[width / 2 + frameThickness / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshStandardMaterial 
          color={frameColor} 
          roughness={0.3} 
          metalness={frameColor === "#ffffff" ? 0.1 : 0.4}
        />
      </mesh>
      
      {/* Photo with texture */}
      <mesh position={[0, 0, -frameDepth / 2 + 0.001]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={texture} 
          emissive={hovered ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>
    </group>
  )
}

// Postcard/photo frame
function Postcard({ hovered }) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      {/* Card base - horizontal postcard */}
      <mesh>
        <planeGeometry args={[0.35, 0.22]} />
        <meshStandardMaterial 
          color={hovered ? "#f5f5f0" : "#e8e4dc"} 
          roughness={0.9} 
        />
      </mesh>
      {/* Photo area on right side */}
      <mesh position={[0.08, -0.02, 0.001]}>
        <planeGeometry args={[0.14, 0.16]} />
        <meshStandardMaterial 
          color="#8fa4b8"
          emissive={hovered ? "#2a4a6a" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      {/* Text lines on left side */}
      {[0.03, 0.06, 0.09].map((y, i) => (
        <mesh key={i} position={[-0.08, y, 0.001]}>
          <planeGeometry args={[0.14, 0.01]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
      {/* Address lines on left side (bottom) */}
      {[-0.03, -0.06].map((y, i) => (
        <mesh key={`addr-${i}`} position={[-0.08, y, 0.001]}>
          <planeGeometry args={[0.14, 0.008]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
      ))}
      {/* Stamp in top left corner */}
      <mesh position={[-0.13, 0.08, 0.001]}>
        <planeGeometry args={[0.03, 0.035]} />
        <meshStandardMaterial color="#8a3a3a" />
      </mesh>
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
    <group position={[0, 0.35, 0]}>
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
function PalmTree({ position = [-2.5, -1.2, 1.8], scale = 3 }) {
  return (
    <group position={position} scale={scale}>
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

// Floor-to-ceiling window with cityscape
function FloorToCeilingWindow() {
  return (
    <group position={[4.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Glass panels - clearer, much wider to reach couch */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <mesh key={`glass-${i}`} position={[0, y, 0]}>
          <boxGeometry args={[10, 2, 0.02]} />
          <meshStandardMaterial 
            color="#e0f0ff" 
            transparent 
            opacity={0.1}
            emissive="#b0d0e8" 
            emissiveIntensity={0.05}
            roughness={0.05}
            metalness={0.05}
          />
        </mesh>
      ))}
      {/* Horizontal dividers */}
      {[-0.5, 0.5, 1.5].map((y, i) => (
        <mesh key={`h-div-${i}`} position={[0, y, 0.01]}>
          <boxGeometry args={[10, 0.06, 0.04]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      {/* Vertical dividers - only 3 */}
      {[-2.5, 0, 2.5].map((x, i) => (
        <mesh key={`v-div-${i}`} position={[x, 1, 0.01]}>
          <boxGeometry args={[0.06, 6, 0.04]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      {/* Cityscape silhouette behind glass */}
      <group position={[0, 0, -0.5]}>
        {/* Buildings at different heights - even more buildings for full window */}
        {[
          [-4.2, 0.7, 0.35, 1.4],
          [-3.8, 1.0, 0.4, 2.0],
          [-3.4, 0.65, 0.3, 1.3],
          [-3.0, 0.85, 0.35, 1.7],
          [-2.6, 1.2, 0.4, 2.4],
          [-2.2, 0.75, 0.3, 1.5],
          [-1.8, 0.9, 0.35, 1.8],
          [-1.4, 1.3, 0.4, 2.6],
          [-1.0, 0.8, 0.3, 1.6],
          [-0.6, 1.1, 0.35, 2.2],
          [-0.2, 0.7, 0.4, 1.4],
          [0.2, 1.0, 0.35, 2.0],
          [0.6, 0.65, 0.3, 1.3],
          [1.0, 0.95, 0.4, 1.9],
          [1.4, 1.25, 0.35, 2.5],
          [1.8, 0.8, 0.3, 1.6],
          [2.2, 1.15, 0.4, 2.3],
          [2.6, 0.7, 0.35, 1.4],
          [3.0, 0.9, 0.3, 1.8],
          [3.4, 1.05, 0.4, 2.1],
          [3.8, 0.75, 0.35, 1.5],
          [4.2, 0.85, 0.3, 1.7]
        ].map(([x, height, width, yOffset], i) => (
          <mesh key={`building-${i}`} position={[x, -1.5 + height / 2, 0]}>
            <boxGeometry args={[width, height, 0.1]} />
            <meshStandardMaterial 
              color="#1a2a3a" 
              emissive="#2a4a6a"
              emissiveIntensity={0.3}
              roughness={0.7}
            />
            {/* Window dots on buildings - static positions */}
            {Array.from({ length: 3 }).map((_, wi) => (
              <mesh key={`window-${wi}`} position={[0, (wi - 1) * height * 0.2, 0.06]}>
                <boxGeometry args={[width * 0.15, 0.03, 0.01]} />
                <meshStandardMaterial 
                  color="#ffdd88" 
                  emissive="#ffdd88"
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))}
          </mesh>
        ))}
      </group>
    </group>
  )
}

// Desk lamp with functional light
function DeskLamp() {
  const stemHeight = 0.4
  return (
    <group position={[1.6, 0.3, -0.7]}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Upright stem */}
      <mesh position={[0, 0.04 + stemHeight / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, stemHeight, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Shade at top of stem */}
      <mesh position={[0, 0.04 + stemHeight, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.12, 16, 1, false]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Light bulb */}
      <mesh position={[0, 0.04 + stemHeight - 0.04, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial 
          color="#fff8e1" 
          emissive="#fff8e1"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Light source */}
      <spotLight
        position={[0, 0.04 + stemHeight - 0.02, 0]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={0.8}
        color="#fff8e1"
        distance={4}
        target-position={[0, 0, 0]}
      />
    </group>
  )
}

// Bookshelf with books
function Bookshelf() {
  return (
    <group position={[-3.5, -1.25, -1.5]}>
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

// Abstract art painting
function AbstractArt({ position, colors, pattern = 'geometric' }) {
  const frameColor = '#1a1a1a'
  const canvasWidth = 1.2
  const canvasHeight = 1.4
  
  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[canvasWidth + 0.1, canvasHeight + 0.1, 0.05]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Canvas background */}
      <mesh>
        <planeGeometry args={[canvasWidth, canvasHeight]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.8} />
      </mesh>
      
      {/* Abstract shapes */}
      {pattern === 'geometric' && (
        <>
          {/* Geometric shapes */}
          <mesh position={[-0.2, 0.3, 0.001]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial color={colors[0]} roughness={0.7} />
          </mesh>
          <mesh position={[0.3, -0.2, 0.001]} rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial color={colors[1]} roughness={0.7} />
          </mesh>
          <mesh position={[-0.1, -0.3, 0.002]}>
            <circleGeometry args={[0.15, 3]} />
            <meshStandardMaterial color={colors[2]} roughness={0.7} />
          </mesh>
          <mesh position={[0.2, 0.4, 0.001]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshStandardMaterial color={colors[3]} roughness={0.7} />
          </mesh>
        </>
      )}
      
      {pattern === 'organic' && (
        <>
          {/* Organic flowing shapes */}
          {[0, 1, 2, 3, 4].map((i) => {
            const x = (Math.random() - 0.5) * 0.8
            const y = (Math.random() - 0.5) * 1.0
            const size = 0.15 + Math.random() * 0.2
            return (
              <mesh key={i} position={[x, y, 0.001 + i * 0.0001]}>
                <circleGeometry args={[size, 32]} />
                <meshStandardMaterial 
                  color={colors[i % colors.length]} 
                  roughness={0.7}
                  transparent
                  opacity={0.7 + Math.random() * 0.3}
                />
              </mesh>
            )
          })}
        </>
      )}
      
      {pattern === 'lines' && (
        <>
          {/* Abstract lines */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <mesh 
              key={i} 
              position={[0, -0.5 + i * 0.18, 0.001]}
              rotation={[0, 0, (Math.random() - 0.5) * 0.5]}
            >
              <planeGeometry args={[0.9, 0.05]} />
              <meshStandardMaterial color={colors[i % colors.length]} roughness={0.7} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

// Pink teddy bear - sitting in corner
function TeddyBear() {
  const pinkColor = "#ffb6c1"
  const darkPinkColor = "#ff9cb0"
  
  return (
    <group position={[-1.3, 0.05, 4.4]} scale={0.4} rotation={[0.2, Math.PI * 0.75, 0]}>
      {/* Body - squashed and wider for plush sitting look */}
      <mesh position={[0, 0.4, 0]} scale={[1.1, 0.8, 1.1]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color={pinkColor} roughness={0.95} />
      </mesh>
      
      {/* Head - slightly tilted */}
      <mesh position={[0, 0.95, -0.05]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={pinkColor} roughness={0.95} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.2, 1.15, -0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={darkPinkColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.2, 1.15, -0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={darkPinkColor} roughness={0.95} />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0, 0.9, 0.25]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={darkPinkColor} roughness={0.95} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.95, 0.35]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#3d2f1f" roughness={0.5} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 1.0, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.1, 1.0, 0.3]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Arms - relaxed at sides */}
      <mesh position={[-0.4, 0.5, 0.1]} rotation={[0.3, 0, -0.8]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
        <meshStandardMaterial color={pinkColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.4, 0.5, 0.1]} rotation={[0.3, 0, 0.8]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 16]} />
        <meshStandardMaterial color={pinkColor} roughness={0.95} />
      </mesh>
      
      {/* Legs - sitting position, extended forward */}
      <mesh position={[-0.15, 0.15, 0.3]} rotation={[1.3, 0, 0]} scale={[1, 1, 1.2]}>
        <capsuleGeometry args={[0.13, 0.3, 8, 16]} />
        <meshStandardMaterial color={pinkColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.15, 0.15, 0.3]} rotation={[1.3, 0, 0]} scale={[1, 1, 1.2]}>
        <capsuleGeometry args={[0.13, 0.3, 8, 16]} />
        <meshStandardMaterial color={pinkColor} roughness={0.95} />
      </mesh>
      
      {/* Feet pads */}
      <mesh position={[-0.15, 0.08, 0.6]} rotation={[1.3, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={darkPinkColor} roughness={0.95} />
      </mesh>
      <mesh position={[0.15, 0.08, 0.6]} rotation={[1.3, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={darkPinkColor} roughness={0.95} />
      </mesh>
      
      {/* Belly spot - larger and softer */}
      <mesh position={[0, 0.45, 0.4]} scale={[1, 0.9, 1]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ffe0e8" roughness={0.95} />
      </mesh>
    </group>
  )
}

// Cloud couch (CB2 style)
function CloudCouch() {
  return (
    <group position={[0, -1.25, 5]} scale={1.8} rotation={[0, Math.PI, 0]}>
      {/* Base/frame */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.8, 0.15, 1]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.9} />
      </mesh>
      {/* Main seat cushion - puffy */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.7, 0.3, 0.9]} />
        <meshStandardMaterial color="#dadada" roughness={0.95} />
      </mesh>
      {/* Left seat cushion puff */}
      <mesh position={[-0.45, 0.4, 0]} scale={[1, 1.1, 1]}>
        <boxGeometry args={[0.7, 0.35, 0.85]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.95} />
      </mesh>
      {/* Right seat cushion puff */}
      <mesh position={[0.45, 0.4, 0]} scale={[1, 1.1, 1]}>
        <boxGeometry args={[0.7, 0.35, 0.85]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.95} />
      </mesh>
      {/* Back cushions - cloud style */}
      {[-0.5, 0, 0.5].map((xPos, i) => (
        <group key={i} position={[xPos, 0.7, -0.35]}>
          {/* Main back cushion */}
          <mesh>
            <boxGeometry args={[0.5, 0.6, 0.25]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.95} />
          </mesh>
          {/* Puffy detail on top */}
          <mesh position={[0, 0.25, 0.05]} scale={[0.9, 0.8, 0.8]}>
            <boxGeometry args={[0.5, 0.3, 0.2]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.95} />
          </mesh>
        </group>
      ))}
      {/* Arm rests - chunky and puffy */}
      <mesh position={[-0.8, 0.45, 0]}>
        <boxGeometry args={[0.25, 0.5, 0.9]} />
        <meshStandardMaterial color="#dadada" roughness={0.95} />
      </mesh>
      <mesh position={[0.8, 0.45, 0]}>
        <boxGeometry args={[0.25, 0.5, 0.9]} />
        <meshStandardMaterial color="#dadada" roughness={0.95} />
      </mesh>
    </group>
  )
}

// Glass coffee table
function CoffeeTable() {
  return (
    <group position={[0, -1.25, 3.2]}>
      {/* Glass top - oval shaped, larger */}
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.1, 1]}>
        <cylinderGeometry args={[0.7, 0.7, 0.03, 32]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glass edge highlight */}
      <mesh position={[0, 0.415, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.1, 1]}>
        <torusGeometry args={[0.7, 0.015, 8, 32]} />
        <meshStandardMaterial 
          color="#e0e0e0"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Brown wood legs */}
      {[
        [-0.45, 0.2, -0.3],
        [0.45, 0.2, -0.3],
        [-0.45, 0.2, 0.3],
        [0.45, 0.2, 0.3]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.025, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#5a3f2a" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}
      {/* Leg connectors/stretchers */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[0.5, 0.015, 8, 16]} />
        <meshStandardMaterial color="#5a3f2a" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Coffee mug */}
      <group position={[-0.3, 0.43, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.02, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} />
        </mesh>
        {/* Coffee */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.01, 16]} />
          <meshStandardMaterial color="#3d2314" roughness={0.1} />
        </mesh>
      </group>
      {/* Coffee table books - much larger */}
      {/* Book 1 - bottom */}
      <mesh position={[0.3, 0.43, -0.2]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.55]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Book 2 - middle */}
      <mesh position={[0.27, 0.48, -0.18]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.37, 0.05, 0.5]} />
        <meshStandardMaterial color="#2c4a6a" roughness={0.8} />
      </mesh>
      {/* Book 3 - top */}
      <mesh position={[0.25, 0.53, -0.15]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.33, 0.04, 0.45]} />
        <meshStandardMaterial color="#4a2a2a" roughness={0.8} />
      </mesh>
      {/* Candle with flickering light - larger */}
      <group position={[0, 0.43, 0.1]} scale={1.5}>
        {/* Candle body */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 16]} />
          <meshStandardMaterial color="#f5e6d3" roughness={0.7} />
        </mesh>
        {/* Wick */}
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.015, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Flame glow */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial 
            color="#ff6600" 
            emissive="#ff6600"
            emissiveIntensity={1}
          />
        </mesh>
        {/* Flickering point light */}
        <pointLight
          position={[0, 0.08, 0]}
          color="#ffaa55"
          intensity={0.4 + Math.sin(Date.now() * 0.003) * 0.15}
          distance={1.2}
          decay={2}
        />
      </group>
    </group>
  )
}

// Floor lamp next to sofa
function FloorLamp() {
  return (
    <group position={[2.3, -1.25, 5]} scale={1.8}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 1.8, 12]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.25, 0.35, 16, 1, true]} />
        <meshStandardMaterial 
          color="#f5f5f0" 
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Light bulb glow */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color="#fff8e1" 
          emissive="#fff8e1"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Light source */}
      <pointLight
        position={[0, 1.65, 0]}
        color="#fff8e1"
        intensity={1.2}
        distance={4}
        decay={2}
      />
    </group>
  )
}

// Carpet
function Carpet() {
  return (
    <group position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

// Striped rug under couch area
function StripedRug() {
  return (
    <group position={[0, -1.239, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Base rug */}
      <mesh>
        <planeGeometry args={[5, 3.5]} />
        <meshStandardMaterial color="#1a3a5a" roughness={0.95} />
      </mesh>
      {/* White stripes */}
      {[-1.5, -0.75, 0, 0.75, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.001]}>
          <planeGeometry args={[5, 0.15]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

// Bar cart
function BarCart() {
  return (
    <group position={[-2.5, -1.25, 5]} scale={1.5}>
      {/* Frame - dark brown */}
      {/* Top panel (closed top) */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.64, 0.02, 0.44]} />
        <meshStandardMaterial color="#3d2f1f" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Top shelf */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.4]} />
        <meshStandardMaterial color="#3d2f1f" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Bottom shelf */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.4]} />
        <meshStandardMaterial color="#3d2f1f" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Legs */}
      {[[-0.25, 0.45, -0.15], [0.25, 0.45, -0.15], [-0.25, 0.45, 0.15], [0.25, 0.45, 0.15]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#2a1f14" roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
      {/* Bottles on top shelf */}
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={`bottle-${i}`} position={[x, 0.7, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial 
            color={['#2a4a2a', '#4a2a2a', '#2a3a4a'][i]} 
            transparent
            opacity={0.7}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Glasses on bottom shelf */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={`glass-${i}`} position={[x, 0.35, 0]}>
          <cylinderGeometry args={[0.025, 0.02, 0.08, 8]} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            transparent
            opacity={0.3}
            roughness={0.05}
            metalness={0.1}
          />
        </mesh>
      ))}
      {/* Handle/rail */}
      <mesh position={[0.3, 0.45, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2a1f14" roughness={0.5} metalness={0.3} />
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

      {/* Floor - dark wood panels */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2a1f14" roughness={0.7} />
      </mesh>
      {/* Wood panel lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-10 + i * 1.4, -1.249, 0]}>
          <planeGeometry args={[0.02, 20]} />
          <meshStandardMaterial color="#1a1408" roughness={0.8} />
        </mesh>
      ))}

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
        position={[-0.8, 0.3, 0.2]}
        rotation={[0, 0, 0]}
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
      <group position={[0.6, 0, 0.3]}>
        <PenHolder />
      </group>
      <PalmTree position={[2.5, -1.2, -1.5]} scale={3} />
      <PalmTree position={[2.5, -1.2, -0.5]} scale={2.7} />
      <PalmTree position={[2.5, -1.2, 0.5]} scale={3.3} />
      <FloorToCeilingWindow />
      <DeskLamp />
      <DeskChair />
      <Bookshelf />
      <CloudCouch />
      <TeddyBear />
      <CoffeeTable />
      <FloorLamp />
      <Carpet />
      <StripedRug />
      <BarCart />
    </>
  )
}

// Full-screen Postcard overlay
function PostcardFullscreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  // Trigger animation on mount
  useState(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for fade-out animation
  }

  return (
    <div 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      {/* Postcard */}
      <div style={{
        width: '800px',
        height: '500px',
        background: '#e8e4dc',
        borderRadius: '4px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        padding: '40px'
      }}>
        {/* Left side - photo */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #8fa4b8 0%, #6a8a9a 100%)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: 'rgba(255,255,255,0.3)',
          marginRight: '30px'
        }}>
          🏞️
        </div>
        
        {/* Right side - text */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: '"Courier New", monospace'
        }}>
          {/* Message area */}
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                width: '100%',
                height: '2px',
                background: '#2a2a2a',
                marginBottom: '28px',
                opacity: 0.3
              }} />
            ))}
          </div>
          
          {/* Address area */}
          <div style={{ marginTop: 'auto' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{
                width: '80%',
                height: '2px',
                background: '#5a5a5a',
                marginBottom: '20px',
                opacity: 0.4
              }} />
            ))}
          </div>
          
          {/* Stamp */}
          <div style={{
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '60px',
            height: '70px',
            background: '#8a3a3a',
            border: '2px dashed #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            📮
          </div>
        </div>
        
        {/* Close hint */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#888',
          fontSize: '13px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Click anywhere to close
        </div>
      </div>
    </div>
  )
}

// Full-screen Notebook overlay
function NotebookFullscreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  // Trigger animation on mount
  useState(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for fade-out animation
  }

  return (
    <div 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}
    >
      {/* Notebook page */}
      <div style={{
        width: '800px',
        height: '90%',
        background: '#f5f5f0',
        borderRadius: '8px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        padding: '60px 80px',
        overflow: 'auto'
      }}>
        {/* Ruled lines */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{
            width: '100%',
            height: '32px',
            borderBottom: '1px solid #d0d0d0',
            marginBottom: '0px'
          }} />
        ))}
        
        {/* Left margin line */}
        <div style={{
          position: 'absolute',
          left: '80px',
          top: '60px',
          bottom: '60px',
          width: '2px',
          background: '#ff8888',
          opacity: 0.3
        }} />
        
        {/* Handwritten content */}
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '100px',
          right: '80px',
          fontFamily: '"Caveat", cursive',
          fontSize: '24px',
          lineHeight: '34px',
          color: '#2a2a2a',
          pointerEvents: 'none'
        }}>
          <div style={{ marginBottom: '24px', fontSize: '18px', color: '#666' }}>
            02/07/2026
          </div>
          <div style={{ marginBottom: '16px' }}>
            Writing is one of many ways I love to express myself - I enjoy thinking
          </div>
          <div style={{ marginBottom: '16px' }}>
            deeply about a variety of topics, and writing gives me a medium to
          </div>
          <div style={{ marginBottom: '16px' }}>
            translate that into a tangible, shareable artifact. Most of my musings
          </div>
          <div style={{ marginBottom: '16px' }}>
            on life in New York and the digital world can be found here:
          </div>
          <div style={{ 
            marginTop: '24px',
            fontSize: '20px',
            color: '#2a5a8a',
            textDecoration: 'underline',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            window.open('https://vanessawang.substack.com', '_blank')
          }}>
            vanessawang.substack.com
          </div>
        </div>
        
        {/* Close hint */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#888',
          fontSize: '14px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Click anywhere to close
        </div>
      </div>
    </div>
  )
}

// Full-screen Mac Home Screen overlay
function MacHomeScreenFullscreen({ onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  // Trigger animation on mount
  useState(() => {
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for fade-out animation
  }

  return (
    <div 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#1e3a5f',
        zIndex: 1000,
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Menu bar */}
      <div style={{
        width: '100%',
        height: '28px',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        fontSize: '13px',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <span style={{ fontWeight: 600, marginRight: '20px' }}>🍎</span>
        <span style={{ marginRight: '16px' }}>Finder</span>
        <span style={{ marginRight: '16px' }}>File</span>
        <span style={{ marginRight: '16px' }}>Edit</span>
        <span style={{ marginRight: '16px' }}>View</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
          <span>🔋</span>
          <span>📶</span>
          <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Desktop area */}
      <div style={{
        flex: 1,
        position: 'relative',
        padding: '20px'
      }}>
        {/* Desktop icons */}
        {['Documents', 'Downloads', 'Projects'].map((name, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: 20 + (i * 90),
            right: 20,
            width: '70px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              margin: '0 auto 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              📁
            </div>
            {name}
          </div>
        ))}
      </div>

      {/* Dock */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '8px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(40px)',
          borderRadius: '16px',
          padding: '8px 16px',
          display: 'flex',
          gap: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {['📁', '🌐', '✉️', '📅', '🎵', '📸', '⚙️'].map((icon, i) => (
            <div key={i} style={{
              width: '60px',
              height: '60px',
              background: `linear-gradient(135deg, ${['#5EA3F7', '#FF5E5E', '#FFD93D', '#6BCF7F', '#FF8C69', '#A78BFA', '#94A3B8'][i]}, ${['#2D7DD2', '#D93A3A', '#F4C430', '#48A760', '#E56B50', '#845EC2', '#64748B'][i]})`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px) scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main exported component
function DeskScene({ onObjectClick }) {
  const [showMacScreen, setShowMacScreen] = useState(false)
  const [showNotebook, setShowNotebook] = useState(false)
  const [showPostcard, setShowPostcard] = useState(false)

  const handleObjectClick = (name) => {
    if (name === 'laptop') {
      setShowMacScreen(true)
    } else if (name === 'notebook') {
      setShowNotebook(true)
    } else if (name === 'postcard') {
      setShowPostcard(true)
    } else if (onObjectClick) {
      onObjectClick(name)
    }
  }

  return (
    <>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '500px',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)'
      }}>
        <Canvas
          shadows
          camera={{ 
            position: [0, 2.5, -4], 
            fov: 45,
            near: 0.1,
            far: 100
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Scene onObjectClick={handleObjectClick} />
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
      
      {showMacScreen && (
        <MacHomeScreenFullscreen onClose={() => setShowMacScreen(false)} />
      )}
      
      {showNotebook && (
        <NotebookFullscreen onClose={() => setShowNotebook(false)} />
      )}
      
      {showPostcard && (
        <PostcardFullscreen onClose={() => setShowPostcard(false)} />
      )}
    </>
  )
}

export default DeskScene

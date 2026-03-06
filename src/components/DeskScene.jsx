import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress } from '@react-three/drei'
import { useState, useRef, Suspense, useEffect, useMemo, lazy } from 'react'
import * as THREE from 'three'

const PostcardFullscreen = lazy(() => import('./PostcardFullscreen'))
const NotebookFullscreen = lazy(() => import('./NotebookFullscreen'))
const MacHomeScreenFullscreen = lazy(() => import('./MacHomeScreenFullscreen'))

// Interactive object wrapper with hover/click states and subtle float animation
function InteractiveObject({ children, name, position, rotation, onClick, floatSpeed = 1, floatAmount = 0.008 }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const initialY = useRef(position ? position[1] : 0)
  const offset = useRef(Math.random() * Math.PI * 2) // random phase offset per object

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialY.current + Math.sin(clock.elapsedTime * floatSpeed + offset.current) * floatAmount
    }
  })

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
function Mug({ position = [1.4, 0.35, -0.5] }) {
  return (
    <group position={position}>
      {/* Outer mug body */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.07, 0.16, 24]} />
        <meshStandardMaterial color="#f0f0e8" roughness={0.3} />
      </mesh>
      
      {/* Inner mug (brown interior to show coffee) */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.075, 0.065, 0.15, 24]} />
        <meshStandardMaterial color="#3d2314" roughness={0.4} side={THREE.BackSide} />
      </mesh>
      
      {/* Handle - curved, positioned further out */}
      <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.013, 12, 20, Math.PI]} />
        <meshStandardMaterial color="#f0f0e8" roughness={0.3} />
      </mesh>
      
      {/* Coffee surface on top - positioned at rim level */}
      <mesh position={[0, 0.075, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.005, 24]} />
        <meshStandardMaterial color="#2d1a0f" roughness={0.2} emissive="#1a0f08" emissiveIntensity={0.2} />
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

// Tablet for Git Art
function Tablet({ hovered }) {
  return (
    <group>
      {/* Tablet body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.01]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.6}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.32, 0.22]} />
        <meshStandardMaterial 
          color={hovered ? "#00ff00" : "#1e3a5f"}
          emissive={hovered ? "#00ff00" : "#1e3a5f"}
          emissiveIntensity={hovered ? 0.5 : 0.3}
        />
      </mesh>
      {/* Git Art text hint */}
      {hovered && (
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 0.05]} />
          <meshStandardMaterial 
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
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
function FloorToCeilingWindow({ isNightMode = true }) {
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
      {/* Sky backdrop behind buildings */}
      <mesh position={[0, 0, -0.8]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial 
          color={isNightMode ? '#0a1628' : '#6bb3d9'} 
          emissive={isNightMode ? '#0a1628' : '#6bb3d9'}
          emissiveIntensity={isNightMode ? 0.15 : 0.3}
        />
      </mesh>
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
              color={isNightMode ? "#1a2a3a" : "#8a9aaa"} 
              emissive={isNightMode ? "#2a4a6a" : "#a0b0c0"}
              emissiveIntensity={isNightMode ? 0.3 : 0.1}
              roughness={0.7}
            />
            {/* Window dots on buildings - static positions */}
            {Array.from({ length: 3 }).map((_, wi) => (
              <mesh key={`window-${wi}`} position={[0, (wi - 1) * height * 0.2, 0.06]}>
                <boxGeometry args={[width * 0.15, 0.03, 0.01]} />
                <meshStandardMaterial 
                  color={isNightMode ? "#ffdd88" : "#c0e0ff"} 
                  emissive={isNightMode ? "#ffdd88" : "#a0c0e0"}
                  emissiveIntensity={isNightMode ? 0.8 : 0.2}
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
      {/* Light source - centered */}
      <spotLight
        position={[0, 0.04 + stemHeight - 0.04, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={1}
        color="#fff8e1"
        distance={3}
        target-position={[0, -0.5, 0]}
        castShadow
      />
    </group>
  )
}

// Bookshelf with books
function Bookshelf({ hovered }) {
  // Generate books once and memoize to prevent re-renders from changing them
  const books = useMemo(() => {
    return [0.25, 0.92, 1.63, 2.33].flatMap((shelfY, shelfIndex) => {
      const booksOnShelf = 8 + Math.floor(Math.random() * 3)
      return Array.from({ length: booksOnShelf }).map((_, bookIndex) => {
        const bookWidth = 0.03 + Math.random() * 0.04
        const bookHeight = 0.2 + Math.random() * 0.15
        const xPos = -0.65 + (bookIndex * 0.16)
        const colors = ['#8b4513', '#2c4a6a', '#4a2a2a', '#2a4a2a', '#5a3a1a', '#1a2a4a', '#4a1a3a']
        const bookColor = colors[Math.floor(Math.random() * colors.length)]
        const rotation = (Math.random() - 0.5) * 0.1
        
        return {
          key: `shelf${shelfIndex}-book${bookIndex}`,
          position: [xPos, shelfY + bookHeight / 2, 0.05],
          rotation: [0, rotation, 0],
          width: bookWidth,
          height: bookHeight,
          color: bookColor
        }
      })
    })
  }, [])

  return (
    <group>
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
      {books.map((book) => (
        <mesh 
          key={book.key} 
          position={book.position}
          rotation={book.rotation}
        >
          <boxGeometry args={[book.width, book.height, 0.12]} />
          <meshStandardMaterial 
            color={book.color} 
            roughness={0.8}
            emissive={hovered ? book.color : "#000000"}
            emissiveIntensity={hovered ? 0.15 : 0}
          />
        </mesh>
      ))}
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

// Throw pillows for couch
function ThrowPillow({ position, rotation = [0, 0, 0] }) {
  const grayColor = "#8a8a8a"
  
  return (
    <group position={position} rotation={rotation}>
      {/* Main pillow body */}
      <mesh>
        <boxGeometry args={[0.55, 0.55, 0.22]} />
        <meshStandardMaterial color={grayColor} roughness={0.85} />
      </mesh>
      {/* Slight puff detail */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.52, 0.52, 0.12]} />
        <meshStandardMaterial color={grayColor} roughness={0.9} />
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

// Ceiling light fixture
function CeilingLight() {
  return (
    <group position={[0, 3.5, 2]}>
      {/* Ceiling mount */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Wire/rod */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.8} />
      </mesh>
      
      {/* Light fixture - modern dome shade */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#f8f8f8" 
          roughness={0.2}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Light bulb glow inside */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial 
          color="#fff8e1" 
          emissive="#fff8e1"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Main light source */}
      <pointLight
        position={[0, -0.5, 0]}
        color="#fff8e1"
        intensity={2.5}
        distance={12}
        decay={1.5}
        castShadow
      />
      
      {/* Additional fill light for softer illumination */}
      <pointLight
        position={[0, -0.5, 0]}
        color="#ffffff"
        intensity={1}
        distance={8}
        decay={2}
      />
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

// Lily bouquet on bar cart
function LilyBouquet() {
  return (
    <group position={[-2.5, 0.13, 5]}>
      {/* Chrome vase */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.3, 16]} />
        <meshStandardMaterial 
          color="#d0d0d0" 
          roughness={0.1} 
          metalness={0.9}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Vase neck */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.05, 16]} />
        <meshStandardMaterial 
          color="#d0d0d0" 
          roughness={0.1} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Lily stems (green) */}
      {[-0.03, 0, 0.03].map((x, i) => (
        <mesh key={`stem-${i}`} position={[x, 0.45, x * 0.5]}>
          <cylinderGeometry args={[0.005, 0.005, 0.4, 8]} />
          <meshStandardMaterial color="#4a7c4a" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Lily flowers - light pink */}
      {/* Center lily */}
      <group position={[0, 0.65, 0]}>
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <mesh 
              key={`petal-center-${i}`} 
              position={[Math.sin(rad) * 0.02, 0, Math.cos(rad) * 0.02]}
              rotation={[Math.PI / 3, rad, 0]}
            >
              <boxGeometry args={[0.04, 0.08, 0.001]} />
              <meshStandardMaterial 
                color="#ffc0cb" 
                roughness={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })}
        {/* Center */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#f4a460" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Left lily */}
      <group position={[-0.04, 0.62, -0.02]} rotation={[0.3, -0.5, 0]}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <mesh 
              key={`petal-left-${i}`} 
              position={[Math.sin(rad) * 0.018, 0, Math.cos(rad) * 0.018]}
              rotation={[Math.PI / 3, rad, 0]}
            >
              <boxGeometry args={[0.035, 0.07, 0.001]} />
              <meshStandardMaterial 
                color="#ffb6c1" 
                roughness={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#f4a460" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Right lily */}
      <group position={[0.04, 0.6, 0.02]} rotation={[-0.2, 0.4, 0]}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <mesh 
              key={`petal-right-${i}`} 
              position={[Math.sin(rad) * 0.018, 0, Math.cos(rad) * 0.018]}
              rotation={[Math.PI / 3, rad, 0]}
            >
              <boxGeometry args={[0.035, 0.07, 0.001]} />
              <meshStandardMaterial 
                color="#ffb6c1" 
                roughness={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#f4a460" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Leaves */}
      {[-0.02, 0.02].map((x, i) => (
        <mesh 
          key={`leaf-${i}`} 
          position={[x, 0.45, x * 0.3]} 
          rotation={[0, i * Math.PI, Math.PI / 6]}
        >
          <boxGeometry args={[0.015, 0.06, 0.001]} />
          <meshStandardMaterial 
            color="#3a6a3a" 
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
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
function Scene({ onObjectClick, isNightMode = true }) {
  const [hoveredObject, setHoveredObject] = useState(null)

  return (
    <>
      {/* Lighting - varies by day/night */}
      <ambientLight intensity={isNightMode ? 0.4 : 1.2} color={isNightMode ? '#ffffff' : '#fff8f0'} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={isNightMode ? 1 : 2.5} 
        color={isNightMode ? '#ffffff' : '#fff5e6'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-3, 4, -2]} 
        intensity={isNightMode ? 0.3 : 0.8} 
        color={isNightMode ? '#a0c0ff' : '#ffe0c0'}
      />
      <pointLight position={[0, 2, 0]} intensity={isNightMode ? 0.2 : 0.5} color={isNightMode ? '#fff5e6' : '#ffffff'} />

      {/* Environment for reflections */}
      <Environment preset={isNightMode ? 'city' : 'apartment'} />

      {/* Floor - dark wood panels */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={isNightMode ? '#2a1f14' : '#4a3828'} roughness={0.7} />
      </mesh>
      {/* Wood panel lines */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-10 + i * 1.4, -1.249, 0]}>
          <planeGeometry args={[0.02, 20]} />
          <meshStandardMaterial color={isNightMode ? '#1a1408' : '#3a2a18'} roughness={0.8} />
        </mesh>
      ))}

      {/* Background wall */}
      <mesh position={[0, 1, -3]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color={isNightMode ? '#252525' : '#e8e4dc'} roughness={0.95} />
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

      <InteractiveObject 
        name="tablet" 
        position={[-0.5, 0.3, -0.4]}
        rotation={[0, 0.3, 0]}
        onClick={onObjectClick}
      >
        <Tablet hovered={hoveredObject === 'tablet'} />
      </InteractiveObject>

      {/* Ambient objects (non-interactive) */}
      <group position={[0.6, 0, 0.3]}>
        <PenHolder />
      </group>
      <PalmTree position={[2.5, -1.2, -1.5]} scale={3} />
      <PalmTree position={[2.5, -1.2, -0.5]} scale={2.7} />
      <PalmTree position={[2.5, -1.2, 0.5]} scale={3.3} />
      <FloorToCeilingWindow isNightMode={isNightMode} />
      <DeskLamp />
      <Mug position={[-1.2, 0.3, 0.4]} />
      <DeskChair />
      
      <InteractiveObject
        name="bookshelf"
        position={[-3.0, -1.25, 0.5]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={onObjectClick}
        floatSpeed={0.5}
        floatAmount={0.005}
      >
        <Bookshelf hovered={hoveredObject === 'bookshelf'} />
      </InteractiveObject>
      
      <CloudCouch />
      <ThrowPillow position={[-0.7, 0.05, 4.9]} rotation={[0, 0.3, 0]} />
      <ThrowPillow position={[0.7, 0.05, 4.9]} rotation={[0, -0.2, 0]} />
      <CoffeeTable />
      <FloorLamp />
      <CeilingLight />
      <Carpet />
      <StripedRug />
      <BarCart />
      <LilyBouquet />
    </>
  )
}

// Fullscreen overlays are lazy-loaded from separate files
// Loader spinner overlay with progress - renders outside Canvas, uses useProgress
function LoadingSpinner({ onLoaded }) {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const hasFinished = useRef(false)

  // Smooth fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 30)
    return () => clearTimeout(t)
  }, [])

  // When loading completes, trigger crossfade out
  useEffect(() => {
    if (!active && progress >= 100 && !hasFinished.current) {
      hasFinished.current = true
      // Small delay to ensure scene has rendered at least one frame
      const t1 = setTimeout(() => {
        setFadeOut(true)
        onLoaded()
      }, 100)
      const t2 = setTimeout(() => setVisible(false), 600) // 500ms fade + buffer
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [active, progress, onLoaded])

  if (!visible) return null

  return (
    <>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: fadeIn && !fadeOut ? 1 : 0,
        transition: fadeOut ? 'opacity 500ms ease-out' : 'opacity 300ms ease-in',
      }}>
        <div style={{ textAlign: 'center', color: '#fff', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255, 255, 255, 0.2)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ fontSize: '15px', opacity: 0.9, fontWeight: '400' }}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

// Main exported component
function DeskScene({ activeView, onCloseView, onProjectClick, isNightMode = true }) {
  const [showMacScreen, setShowMacScreen] = useState(false)
  const [showNotebook, setShowNotebook] = useState(false)
  const [showPostcard, setShowPostcard] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  const handleObjectClick = (name) => {
    // Check if it's a project object (bookshelf, tablet, notebook, postcard)
    if (name === 'bookshelf' || name === 'tablet' || name === 'notebook' || name === 'postcard') {
      if (onProjectClick) {
        onProjectClick(name)
      }
    } else if (name === 'laptop') {
      setShowMacScreen(true)
    }
  }

  const handleLoaded = useRef(() => setSceneReady(true)).current

  // Determine what to show based on activeView prop or internal state
  const shouldShowMacScreen = activeView === 'about' || showMacScreen
  const shouldShowPostcard = activeView === 'project' || showPostcard
  // overlay state removed

  const handleClose = (type) => {
    if (onCloseView) {
      onCloseView()
    }
    if (type === 'mac') setShowMacScreen(false)
    if (type === 'postcard') setShowPostcard(false)
  }

  return (
    <>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '500px',
        background: isNightMode 
          ? 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 50%, #000000 100%)'
          : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 50%, #d0d0d0 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transition: 'background 0.8s ease',
        margin: 0,
        padding: 0
      }}>
        {/* Loading spinner with progress percentage - crossfades with scene */}
        <LoadingSpinner onLoaded={handleLoaded} />
        
        <Canvas
          shadows
          camera={{ 
            position: [0, 2.5, -4], 
            fov: 45,
            near: 0.1,
            far: 100
          }}
          style={{
            width: '100%',
            height: '100%',
            opacity: sceneReady ? 1 : 0,
            transition: 'opacity 500ms ease-in',
          }}
        >
          <Suspense fallback={null}>
            <Scene onObjectClick={handleObjectClick} isNightMode={isNightMode} />
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              minDistance={2}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.2}
              target={[0, 0.2, 0]}
            />
          </Suspense>
        </Canvas>
      </div>
      
      <Suspense fallback={null}>
        {shouldShowMacScreen && (
          <MacHomeScreenFullscreen onClose={() => handleClose('mac')} />
        )}
        
        {shouldShowPostcard && (
          <PostcardFullscreen onClose={() => handleClose('postcard')} />
        )}
      </Suspense>
    </>
  )
}

export default DeskScene

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import { useState, useRef, Suspense, useEffect, useMemo, lazy } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Helper: create a geometry at a given position/rotation/scale and return it for merging
function transformedGeo(geo, { position = [0,0,0], rotation = [0,0,0], scale = [1,1,1] } = {}) {
  const clone = geo.clone()
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation))
  m.compose(new THREE.Vector3(...position), q, new THREE.Vector3(...scale))
  clone.applyMatrix4(m)
  return clone
}

const PostcardFullscreen = lazy(() => import('./PostcardFullscreen'))
const NotebookFullscreen = lazy(() => import('./NotebookFullscreen'))
const MacHomeScreenFullscreen = lazy(() => import('./MacHomeScreenFullscreen'))

// Label names for interactive objects
const OBJECT_LABELS = {
  laptop: 'about',
  postcard: 'postcard',
  notebook: 'writing',
  tablet: 'git art',
  bookshelf: 'books',
}

// Shared geometry + material factory (call inside useMemo)
function createSharedAssets() {
  const geo = {
    box: (args) => new THREE.BoxGeometry(...args),
    plane: (args) => new THREE.PlaneGeometry(...args),
    cylinder: (args) => new THREE.CylinderGeometry(...args),
    sphere: (args) => new THREE.SphereGeometry(...args),
    circle: (args) => new THREE.CircleGeometry(...args),
    cone: (args) => new THREE.ConeGeometry(...args),
    torus: (args) => new THREE.TorusGeometry(...args),
  }
  return { geo }
}

// Reusable material creator with caching
const materialCache = new Map()
function getMaterial(props) {
  const key = JSON.stringify(props)
  if (!materialCache.has(key)) {
    materialCache.set(key, new THREE.MeshStandardMaterial(props))
  }
  return materialCache.get(key)
}

// Interactive object wrapper with hover/click states and labels
function InteractiveObject({ children, name, position, rotation, onClick, floatSpeed = 1, floatAmount = 0, labelOffset = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const initialY = useRef(position ? position[1] : 0)
  const offset = useRef(Math.random() * Math.PI * 2)

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
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick(name)
      }}
    >
      {children}
      {hovered && (
        <Html center position={labelOffset} style={{ pointerEvents: 'none' }}>
          <span style={{
            color: '#ffffff',
            fontSize: '11px',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 10px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)',
          }}>
            {OBJECT_LABELS[name] || name}
          </span>
        </Html>
      )}
    </group>
  )
}

// Minimalist desk — shared geometries
function Desk() {
  const { surface, legGeo, surfaceMat, legMat } = useMemo(() => ({
    surface: new THREE.BoxGeometry(4, 0.08, 2),
    legGeo: new THREE.BoxGeometry(0.08, 1.5, 0.08),
    surfaceMat: new THREE.MeshStandardMaterial({ color: '#2c2c2c', roughness: 0.3, metalness: 0.1 }),
    legMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.5, metalness: 0.2 }),
  }), [])

  const legPositions = useMemo(() => [[-1.8, 0, -0.8], [1.8, 0, -0.8], [-1.8, 0, 0.8], [1.8, 0, 0.8]], [])

  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.75, 0]} geometry={surface} material={surfaceMat} />
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={legGeo} material={legMat} />
      ))}
    </group>
  )
}

// Laptop with screen and keyboard — shared materials
function Laptop({ hovered }) {
  const assets = useMemo(() => {
    const bodyColor = '#333333'
    const bodyHover = '#4a4a4a'
    return {
      baseGeo: new THREE.BoxGeometry(0.6, 0.03, 0.4),
      kbGeo: new THREE.BoxGeometry(0.5, 0.005, 0.25),
      trackpadGeo: new THREE.BoxGeometry(0.15, 0.002, 0.08),
      screenShellGeo: new THREE.BoxGeometry(0.58, 0.4, 0.015),
      screenGeo: new THREE.PlaneGeometry(0.5, 0.32),
      miniScreenGeo: new THREE.PlaneGeometry(1, 1),
      dockGeo: new THREE.PlaneGeometry(0.6, 0.08),
      iconGeo: new THREE.PlaneGeometry(0.05, 0.05),
      menuGeo: new THREE.PlaneGeometry(1, 0.03),
      logoGeo: new THREE.CircleGeometry(0.04, 16),
      darkMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.8 }),
      trackpadMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.3 }),
      logoMat: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 0.2, roughness: 0.3 }),
      dockMat: new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.3, emissive: '#ffffff', emissiveIntensity: 0.1 }),
      menuMat: new THREE.MeshStandardMaterial({ color: '#000000', transparent: true, opacity: 0.4 }),
      bodyColor,
      bodyHover,
    }
  }, [])

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hovered ? assets.bodyHover : assets.bodyColor,
    roughness: 0.4, metalness: 0.6,
  }), [hovered])

  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    emissive: hovered ? '#1a3a5a' : '#0a1a2a',
    emissiveIntensity: 0.3,
  }), [hovered])

  const wallpaperMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e3a5f', emissive: '#1e3a5f', emissiveIntensity: 0.3,
  }), [])

  const iconColors = ['#3a7dff', '#ff3a3a', '#3aff3a', '#ff3aff', '#ffaa3a']
  const iconMats = useMemo(() => iconColors.map(c =>
    new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3 })
  ), [])

  const screenAngle = -Math.PI / 12
  return (
    <group scale={1.3}>
      <mesh position={[0, 0.02, 0]} geometry={assets.baseGeo} material={bodyMat} />
      <mesh position={[0, 0.04, 0.02]} geometry={assets.kbGeo} material={assets.darkMat} />
      <mesh position={[0, 0.04, -0.12]} geometry={assets.trackpadGeo} material={assets.trackpadMat} />
      <group position={[0, 0.04, 0.2]} rotation={[screenAngle, 0, 0]}>
        <mesh position={[0, 0.2, 0]} geometry={assets.screenShellGeo} material={bodyMat} />
        <group position={[0, 0.2, -0.008]} rotation={[0, Math.PI, 0]}>
          <mesh geometry={assets.screenGeo} material={screenMat} />
          <group scale={[0.5, 0.32, 1]} position={[0, 0, 0.001]}>
            <mesh geometry={assets.miniScreenGeo} material={wallpaperMat} />
            <mesh position={[0, -0.4, 0.001]} geometry={assets.dockGeo} material={assets.dockMat} />
            {[-0.2, -0.1, 0, 0.1, 0.2].map((x, i) => (
              <mesh key={i} position={[x, -0.4, 0.002]} geometry={assets.iconGeo} material={iconMats[i]} />
            ))}
            <mesh position={[0, 0.47, 0.001]} geometry={assets.menuGeo} material={assets.menuMat} />
          </group>
        </group>
        <mesh position={[0, 0.25, -0.009]} geometry={assets.logoGeo} material={assets.logoMat} />
      </group>
    </group>
  )
}

// Postcard/photo frame
function Postcard({ hovered }) {
  const assets = useMemo(() => ({
    cardGeo: new THREE.PlaneGeometry(0.35, 0.22),
    photoGeo: new THREE.PlaneGeometry(0.14, 0.16),
    textGeo: new THREE.PlaneGeometry(0.14, 0.01),
    addrGeo: new THREE.PlaneGeometry(0.14, 0.008),
    stampGeo: new THREE.PlaneGeometry(0.03, 0.035),
    textMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a' }),
    addrMat: new THREE.MeshStandardMaterial({ color: '#5a5a5a' }),
    stampMat: new THREE.MeshStandardMaterial({ color: '#8a3a3a' }),
  }), [])

  const cardMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hovered ? '#f5f5f0' : '#e8e4dc', roughness: 0.9,
  }), [hovered])

  const photoMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8fa4b8',
    emissive: hovered ? '#2a4a6a' : '#000000',
    emissiveIntensity: hovered ? 0.3 : 0,
  }), [hovered])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={assets.cardGeo} material={cardMat} />
      <mesh position={[0.08, -0.02, 0.001]} geometry={assets.photoGeo} material={photoMat} />
      {[0.03, 0.06, 0.09].map((y, i) => (
        <mesh key={i} position={[-0.08, y, 0.001]} geometry={assets.textGeo} material={assets.textMat} />
      ))}
      {[-0.03, -0.06].map((y, i) => (
        <mesh key={i} position={[-0.08, y, 0.001]} geometry={assets.addrGeo} material={assets.addrMat} />
      ))}
      <mesh position={[-0.13, 0.08, 0.001]} geometry={assets.stampGeo} material={assets.stampMat} />
    </group>
  )
}

// Notebook
function Notebook({ hovered }) {
  const assets = useMemo(() => ({
    coverGeo: new THREE.BoxGeometry(0.3, 0.03, 0.4),
    pagesGeo: new THREE.BoxGeometry(0.28, 0.015, 0.38),
    spineGeo: new THREE.BoxGeometry(0.02, 0.032, 0.4),
    bandGeo: new THREE.BoxGeometry(0.01, 0.002, 0.4),
    pagesMat: new THREE.MeshStandardMaterial({ color: '#f5f5f0', roughness: 0.95 }),
    bandMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a' }),
  }), [])

  const coverMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hovered ? '#4a6a8a' : '#2c4a6a', roughness: 0.7,
  }), [hovered])

  const spineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hovered ? '#3a5a7a' : '#1c3a5a', roughness: 0.5,
  }), [hovered])

  return (
    <group>
      <mesh position={[0, 0.015, 0]} geometry={assets.coverGeo} material={coverMat} />
      <mesh position={[0, 0.008, 0]} geometry={assets.pagesGeo} material={assets.pagesMat} />
      <mesh position={[-0.14, 0.015, 0]} geometry={assets.spineGeo} material={spineMat} />
      <mesh position={[0.05, 0.031, 0]} geometry={assets.bandGeo} material={assets.bandMat} />
    </group>
  )
}

// Tablet for Git Art
function Tablet({ hovered }) {
  const assets = useMemo(() => ({
    bodyGeo: new THREE.BoxGeometry(0.35, 0.25, 0.01),
    screenGeo: new THREE.PlaneGeometry(0.32, 0.22),
    hintGeo: new THREE.PlaneGeometry(0.2, 0.05),
    bodyMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.2, metalness: 0.6 }),
  }), [])

  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: hovered ? '#00ff00' : '#1e3a5f',
    emissive: hovered ? '#00ff00' : '#1e3a5f',
    emissiveIntensity: hovered ? 0.5 : 0.3,
  }), [hovered])

  const hintMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00ff00', emissive: '#00ff00', emissiveIntensity: 0.8, transparent: true, opacity: 0.8,
  }), [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={assets.bodyGeo} material={assets.bodyMat} />
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={assets.screenGeo} material={screenMat} />
      {hovered && (
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={assets.hintGeo} material={hintMat} />
      )}
    </group>
  )
}

// Coffee mug — shared geometries
function Mug({ position = [1.4, 0.35, -0.5] }) {
  const assets = useMemo(() => ({
    outerGeo: new THREE.CylinderGeometry(0.08, 0.07, 0.16, 12),
    innerGeo: new THREE.CylinderGeometry(0.075, 0.065, 0.15, 12),
    handleGeo: new THREE.TorusGeometry(0.045, 0.013, 8, 12, Math.PI),
    coffeeGeo: new THREE.CylinderGeometry(0.075, 0.075, 0.005, 12),
    outerMat: new THREE.MeshStandardMaterial({ color: '#f0f0e8', roughness: 0.3 }),
    innerMat: new THREE.MeshStandardMaterial({ color: '#3d2314', roughness: 0.4, side: THREE.BackSide }),
    coffeeMat: new THREE.MeshStandardMaterial({ color: '#2d1a0f', roughness: 0.2, emissive: '#1a0f08', emissiveIntensity: 0.2 }),
  }), [])

  return (
    <group position={position}>
      <mesh geometry={assets.outerGeo} material={assets.outerMat} />
      <mesh position={[0, 0.005, 0]} geometry={assets.innerGeo} material={assets.innerMat} />
      <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={assets.handleGeo} material={assets.outerMat} />
      <mesh position={[0, 0.075, 0]} geometry={assets.coffeeGeo} material={assets.coffeeMat} />
    </group>
  )
}

// Pen holder with pens — reduced segments
function PenHolder() {
  const assets = useMemo(() => ({
    cupGeo: new THREE.CylinderGeometry(0.05, 0.04, 0.1, 6),
    penGeo: new THREE.CylinderGeometry(0.006, 0.006, 0.12, 4),
    cupMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4, metalness: 0.3 }),
    penMats: ['#2a4a7a', '#7a2a2a', '#2a2a2a'].map(c => new THREE.MeshStandardMaterial({ color: c })),
  }), [])

  const pens = useMemo(() => [
    { pos: [0.02, 0.08, 0.01], rot: [-0.1, 0, 0.05] },
    { pos: [-0.01, 0.09, -0.02], rot: [0.1, 0, -0.1] },
    { pos: [0, 0.07, 0.02], rot: [0.05, 0, 0.08] },
  ], [])

  return (
    <group position={[0, 0.35, 0]}>
      <mesh geometry={assets.cupGeo} material={assets.cupMat} />
      {pens.map((pen, i) => (
        <mesh key={i} position={pen.pos} rotation={pen.rot} geometry={assets.penGeo} material={assets.penMats[i]} />
      ))}
    </group>
  )
}

// Palm tree — merged into 2 meshes (brown parts + green parts)
function PalmTree({ position = [-2.5, -1.2, 1.8], scale = 3 }) {
  const { brownGeo, greenGeo, brownMat, greenMat } = useMemo(() => {
    const potGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.15, 6)
    const soilGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.02, 6)
    const trunkGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.5, 4)
    const frondGeo = new THREE.BoxGeometry(0.02, 0.16, 0.01)
    const frondGeoUpper = new THREE.BoxGeometry(0.02, 0.2, 0.01)

    const brownParts = [
      transformedGeo(potGeo, { position: [0, 0.05, 0] }),
      transformedGeo(soilGeo, { position: [0, 0.12, 0] }),
      transformedGeo(trunkGeo, { position: [0, 0.35, 0] }),
    ]

    const greenParts = []
    for (const angle of [0, 90, 180, 270]) {
      const rad = (angle * Math.PI) / 180
      const e = new THREE.Euler(0, rad, Math.PI / 5)
      const q = new THREE.Quaternion().setFromEuler(e)
      const m = new THREE.Matrix4()
      const childPos = new THREE.Vector3(0, 0.08, 0).applyQuaternion(q).add(new THREE.Vector3(0, 0.48, 0))
      m.compose(childPos, q, new THREE.Vector3(1, 1, 1))
      const g = frondGeo.clone()
      g.applyMatrix4(m)
      greenParts.push(g)
    }
    for (const angle of [45, 135, 225, 315]) {
      const rad = (angle * Math.PI) / 180
      const e = new THREE.Euler(0, rad, Math.PI / 6)
      const q = new THREE.Quaternion().setFromEuler(e)
      const m = new THREE.Matrix4()
      const childPos = new THREE.Vector3(0, 0.1, 0).applyQuaternion(q).add(new THREE.Vector3(0, 0.58, 0))
      m.compose(childPos, q, new THREE.Vector3(1, 1, 1))
      const g = frondGeoUpper.clone()
      g.applyMatrix4(m)
      greenParts.push(g)
    }

    return {
      brownGeo: mergeGeometries(brownParts),
      greenGeo: mergeGeometries(greenParts),
      brownMat: new THREE.MeshStandardMaterial({ color: '#3a2f1f', roughness: 0.8 }),
      greenMat: new THREE.MeshStandardMaterial({ color: '#3a6818', roughness: 0.6 }),
    }
  }, [])

  return (
    <group position={position} scale={scale}>
      <mesh geometry={brownGeo} material={brownMat} />
      <mesh geometry={greenGeo} material={greenMat} />
    </group>
  )
}

// Floor-to-ceiling window — merged: glass(1), dividers(1), sky(1), buildings(1), windows(1) = 5 meshes
function FloorToCeilingWindow({ isNightMode = true }) {
  const { glassGeo, divGeo, skyGeo, buildingGeo, winGeo } = useMemo(() => {
    const glassBase = new THREE.BoxGeometry(10, 2, 0.02)
    const glassParts = [-1.5, -0.5, 0.5, 1.5].map(y => transformedGeo(glassBase, { position: [0, y, 0] }))

    const hDiv = new THREE.BoxGeometry(10, 0.06, 0.04)
    const vDiv = new THREE.BoxGeometry(0.06, 6, 0.04)
    const divParts = [
      ...[-0.5, 0.5, 1.5].map(y => transformedGeo(hDiv, { position: [0, y, 0.01] })),
      ...[-2.5, 0, 2.5].map(x => transformedGeo(vDiv, { position: [x, 1, 0.01] })),
    ]

    const buildings = [
      [-4, 0.8, 0.4], [-3, 1.1, 0.35], [-2, 1.3, 0.4], [-1, 0.7, 0.35],
      [0, 1.0, 0.4], [1, 0.85, 0.35], [2, 1.2, 0.4], [3, 0.75, 0.35],
      [4, 0.95, 0.4], [-1.5, 0.65, 0.3], [0.5, 1.15, 0.3], [2.5, 0.9, 0.3],
    ]
    const bParts = []
    const wParts = []
    for (const [x, height, width] of buildings) {
      const y = -1.5 + height / 2
      bParts.push(transformedGeo(new THREE.BoxGeometry(width, height, 0.1), { position: [x, y, -0.5] }))
      const wGeo = new THREE.BoxGeometry(width * 0.15, 0.03, 0.01)
      wParts.push(transformedGeo(wGeo, { position: [x, y + 0.2 * height, -0.44] }))
      wParts.push(transformedGeo(wGeo, { position: [x, y - 0.2 * height, -0.44] }))
    }

    return {
      glassGeo: mergeGeometries(glassParts),
      divGeo: mergeGeometries(divParts),
      skyGeo: new THREE.PlaneGeometry(12, 8),
      buildingGeo: mergeGeometries(bParts),
      winGeo: mergeGeometries(wParts),
    }
  }, [])

  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e0f0ff', transparent: true, opacity: 0.1,
    emissive: '#b0d0e8', emissiveIntensity: 0.05, roughness: 0.05, metalness: 0.05,
  }), [])

  const divMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4, metalness: 0.6 }), [])

  const skyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isNightMode ? '#0a1628' : '#6bb3d9',
    emissive: isNightMode ? '#0a1628' : '#6bb3d9',
    emissiveIntensity: isNightMode ? 0.15 : 0.3,
  }), [isNightMode])

  const buildingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isNightMode ? '#1a2a3a' : '#8a9aaa',
    emissive: isNightMode ? '#2a4a6a' : '#a0b0c0',
    emissiveIntensity: isNightMode ? 0.3 : 0.1, roughness: 0.7,
  }), [isNightMode])

  const windowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isNightMode ? '#ffdd88' : '#c0e0ff',
    emissive: isNightMode ? '#ffdd88' : '#a0c0e0',
    emissiveIntensity: isNightMode ? 0.8 : 0.2,
  }), [isNightMode])

  return (
    <group position={[4.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh geometry={glassGeo} material={glassMat} />
      <mesh geometry={divGeo} material={divMat} />
      <mesh position={[0, 0, -0.8]} geometry={skyGeo} material={skyMat} />
      <mesh geometry={buildingGeo} material={buildingMat} />
      <mesh geometry={winGeo} material={windowMat} />
    </group>
  )
}

// Desk lamp — shared geometries
function DeskLamp() {
  const assets = useMemo(() => {
    const stemHeight = 0.4
    return {
      stemHeight,
      baseGeo: new THREE.CylinderGeometry(0.08, 0.1, 0.04, 8),
      stemGeo: new THREE.CylinderGeometry(0.015, 0.015, stemHeight, 6),
      shadeGeo: new THREE.ConeGeometry(0.08, 0.12, 8, 1, false),
      bulbGeo: new THREE.SphereGeometry(0.025, 8, 8),
      baseMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4, metalness: 0.6 }),
      stemMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.5, metalness: 0.5 }),
      shadeMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide }),
      bulbMat: new THREE.MeshStandardMaterial({ color: '#fff8e1', emissive: '#fff8e1', emissiveIntensity: 1.2 }),
    }
  }, [])

  return (
    <group position={[1.6, 0.3, -0.7]}>
      <mesh position={[0, 0.02, 0]} geometry={assets.baseGeo} material={assets.baseMat} />
      <mesh position={[0, 0.04 + assets.stemHeight / 2, 0]} geometry={assets.stemGeo} material={assets.stemMat} />
      <mesh position={[0, 0.04 + assets.stemHeight, 0]} rotation={[Math.PI, 0, 0]} geometry={assets.shadeGeo} material={assets.shadeMat} />
      <mesh position={[0, 0.04 + assets.stemHeight - 0.04, 0]} geometry={assets.bulbGeo} material={assets.bulbMat} />
      <spotLight
        position={[0, 0.04 + assets.stemHeight - 0.04, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={1}
        color="#fff8e1"
        distance={3}
        castShadow
      />
    </group>
  )
}

// Bookshelf — frame merged (1 mesh), books grouped by color (7 meshes) = 8 total
function Bookshelf({ hovered }) {
  const { frameGeo, frameMat, bookGroups } = useMemo(() => {
    const sideGeo = new THREE.BoxGeometry(0.05, 3, 0.4)
    const backGeo = new THREE.BoxGeometry(1.5, 3, 0.05)
    const shelfGeo = new THREE.BoxGeometry(1.5, 0.04, 0.4)

    const frameParts = [
      transformedGeo(sideGeo, { position: [-0.75, 1.5, 0] }),
      transformedGeo(sideGeo, { position: [0.75, 1.5, 0] }),
      transformedGeo(backGeo, { position: [0, 1.5, -0.175] }),
      ...[0.2, 0.9, 1.6, 2.3, 2.95].map(y => transformedGeo(shelfGeo, { position: [0, y, 0] })),
    ]

    const colors = ['#8b4513', '#2c4a6a', '#4a2a2a', '#2a4a2a', '#5a3a1a', '#1a2a4a', '#4a1a3a']
    const byColor = Object.fromEntries(colors.map(c => [c, []]))

    for (const shelfY of [0.25, 0.92, 1.63, 2.33]) {
      const count = 10 + Math.floor(Math.random() * 3)
      for (let bi = 0; bi < count; bi++) {
        const w = 0.03 + Math.random() * 0.03
        const h = 0.2 + Math.random() * 0.15
        const color = colors[Math.floor(Math.random() * colors.length)]
        byColor[color].push(transformedGeo(
          new THREE.BoxGeometry(w, h, 0.12),
          { position: [-0.65 + bi * 0.12, shelfY + h / 2, 0.05], rotation: [0, (Math.random() - 0.5) * 0.1, 0] }
        ))
      }
    }

    const groups = colors
      .filter(c => byColor[c].length > 0)
      .map(c => ({ color: c, geo: mergeGeometries(byColor[c]) }))

    return {
      frameGeo: mergeGeometries(frameParts),
      frameMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.6, metalness: 0.2 }),
      bookGroups: groups,
    }
  }, [])

  const bookMats = useMemo(() =>
    bookGroups.map(g => new THREE.MeshStandardMaterial({
      color: g.color,
      roughness: 0.8,
      emissive: hovered ? g.color : '#000000',
      emissiveIntensity: hovered ? 0.15 : 0,
    })),
  [hovered, bookGroups])

  return (
    <group>
      <mesh geometry={frameGeo} material={frameMat} />
      {bookGroups.map((g, i) => (
        <mesh key={g.color} geometry={g.geo} material={bookMats[i]} />
      ))}
    </group>
  )
}

// Cloud couch — shared geometry/material
function CloudCouch() {
  const assets = useMemo(() => ({
    frameMat: new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.9 }),
    seatMat: new THREE.MeshStandardMaterial({ color: '#dadada', roughness: 0.95 }),
    cushionMat: new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.95 }),
    puffMat: new THREE.MeshStandardMaterial({ color: '#e5e5e5', roughness: 0.95 }),
  }), [])

  return (
    <group position={[0, -1.25, 5]} scale={1.8} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.8, 0.15, 1]} />
        <primitive object={assets.frameMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.7, 0.3, 0.9]} />
        <primitive object={assets.seatMat} attach="material" />
      </mesh>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0]} scale={[1, 1.1, 1]}>
          <boxGeometry args={[0.7, 0.35, 0.85]} />
          <primitive object={assets.cushionMat} attach="material" />
        </mesh>
      ))}
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, 0.7, -0.35]}>
          <mesh>
            <boxGeometry args={[0.5, 0.6, 0.25]} />
            <primitive object={assets.cushionMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.25, 0.05]} scale={[0.9, 0.8, 0.8]}>
            <boxGeometry args={[0.5, 0.3, 0.2]} />
            <primitive object={assets.puffMat} attach="material" />
          </mesh>
        </group>
      ))}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]}>
          <boxGeometry args={[0.25, 0.5, 0.9]} />
          <primitive object={assets.seatMat} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

// Throw pillow
function ThrowPillow({ position, rotation = [0, 0, 0] }) {
  const assets = useMemo(() => ({
    mainGeo: new THREE.BoxGeometry(0.55, 0.55, 0.22),
    puffGeo: new THREE.BoxGeometry(0.52, 0.52, 0.12),
    mat: new THREE.MeshStandardMaterial({ color: '#8a8a8a', roughness: 0.85 }),
    puffMat: new THREE.MeshStandardMaterial({ color: '#8a8a8a', roughness: 0.9 }),
  }), [])

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={assets.mainGeo} material={assets.mat} />
      <mesh position={[0, 0, 0.12]} geometry={assets.puffGeo} material={assets.puffMat} />
    </group>
  )
}

// Coffee table — consolidated
function CoffeeTable() {
  const assets = useMemo(() => ({
    legGeo: new THREE.CylinderGeometry(0.025, 0.035, 0.4, 6),
    legMat: new THREE.MeshStandardMaterial({ color: '#5a3f2a', roughness: 0.7, metalness: 0.1 }),
    glassMat: new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide }),
    edgeMat: new THREE.MeshStandardMaterial({ color: '#e0e0e0', transparent: true, opacity: 0.4, roughness: 0.1, metalness: 0.3 }),
    bookColors: ['#8b4513', '#2c4a6a', '#4a2a2a'],
    darkMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.3 }),
    coffeeMat: new THREE.MeshStandardMaterial({ color: '#3d2314', roughness: 0.1 }),
    candleMat: new THREE.MeshStandardMaterial({ color: '#f5e6d3', roughness: 0.7 }),
    wickMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a' }),
    flameMat: new THREE.MeshStandardMaterial({ color: '#ff6600', emissive: '#ff6600', emissiveIntensity: 1 }),
  }), [])

  const legPositions = [[-0.45, 0.2, -0.3], [0.45, 0.2, -0.3], [-0.45, 0.2, 0.3], [0.45, 0.2, 0.3]]

  return (
    <group position={[0, -1.25, 3.2]}>
      {/* Glass top */}
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.5, 1.1, 1]}>
        <cylinderGeometry args={[0.7, 0.7, 0.03, 16]} />
        <primitive object={assets.glassMat} attach="material" />
      </mesh>
      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={assets.legGeo} material={assets.legMat} />
      ))}
      {/* Coffee table books */}
      {[
        { pos: [0.3, 0.43, -0.2], rot: 0.3, size: [0.4, 0.05, 0.55], ci: 0 },
        { pos: [0.27, 0.48, -0.18], rot: 0.2, size: [0.37, 0.05, 0.5], ci: 1 },
        { pos: [0.25, 0.53, -0.15], rot: 0.4, size: [0.33, 0.04, 0.45], ci: 2 },
      ].map((b, i) => (
        <mesh key={i} position={b.pos} rotation={[0, b.rot, 0]}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={assets.bookColors[b.ci]} roughness={0.8} />
        </mesh>
      ))}
      {/* Small mug */}
      <group position={[-0.3, 0.43, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 8]} />
          <primitive object={assets.darkMat} attach="material" />
        </mesh>
        <mesh position={[0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.02, 0.008, 6, 12, Math.PI]} />
          <primitive object={assets.darkMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.01, 8]} />
          <primitive object={assets.coffeeMat} attach="material" />
        </mesh>
      </group>
      {/* Candle */}
      <group position={[0, 0.43, 0.1]} scale={1.5}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
          <primitive object={assets.candleMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.065, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.015, 4]} />
          <primitive object={assets.wickMat} attach="material" />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <primitive object={assets.flameMat} attach="material" />
        </mesh>
        <pointLight position={[0, 0.08, 0]} color="#ffaa55" intensity={0.4} distance={1.2} decay={2} />
      </group>
    </group>
  )
}

// Ceiling light
function CeilingLight() {
  const assets = useMemo(() => ({
    mountGeo: new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8),
    wireGeo: new THREE.CylinderGeometry(0.01, 0.01, 0.6, 4),
    shadeGeo: new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    bulbGeo: new THREE.SphereGeometry(0.12, 8, 8),
    mountMat: new THREE.MeshStandardMaterial({ color: '#f5f5f0', roughness: 0.3, metalness: 0.7 }),
    wireMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.4, metalness: 0.8 }),
    shadeMat: new THREE.MeshStandardMaterial({ color: '#f8f8f8', roughness: 0.2, metalness: 0.1, side: THREE.DoubleSide }),
    bulbMat: new THREE.MeshStandardMaterial({ color: '#fff8e1', emissive: '#fff8e1', emissiveIntensity: 1.5 }),
  }), [])

  return (
    <group position={[0, 3.5, 2]}>
      <mesh geometry={assets.mountGeo} material={assets.mountMat} />
      <mesh position={[0, -0.3, 0]} geometry={assets.wireGeo} material={assets.wireMat} />
      <mesh position={[0, -0.6, 0]} geometry={assets.shadeGeo} material={assets.shadeMat} />
      <mesh position={[0, -0.5, 0]} geometry={assets.bulbGeo} material={assets.bulbMat} />
      <pointLight position={[0, -0.5, 0]} color="#fff8e1" intensity={2.5} distance={12} decay={1.5} castShadow />
      <pointLight position={[0, -0.5, 0]} color="#ffffff" intensity={1} distance={8} decay={2} />
    </group>
  )
}

// Floor lamp
function FloorLamp() {
  const assets = useMemo(() => ({
    baseGeo: new THREE.CylinderGeometry(0.15, 0.18, 0.04, 8),
    poleGeo: new THREE.CylinderGeometry(0.02, 0.025, 1.8, 6),
    shadeGeo: new THREE.ConeGeometry(0.25, 0.35, 8, 1, true),
    bulbGeo: new THREE.SphereGeometry(0.05, 8, 8),
    baseMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4, metalness: 0.6 }),
    poleMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.5, metalness: 0.5 }),
    shadeMat: new THREE.MeshStandardMaterial({ color: '#f5f5f0', roughness: 0.7, side: THREE.DoubleSide }),
    bulbMat: new THREE.MeshStandardMaterial({ color: '#fff8e1', emissive: '#fff8e1', emissiveIntensity: 0.8 }),
  }), [])

  return (
    <group position={[2.3, -1.25, 5]} scale={1.8}>
      <mesh position={[0, 0.02, 0]} geometry={assets.baseGeo} material={assets.baseMat} />
      <mesh position={[0, 0.9, 0]} geometry={assets.poleGeo} material={assets.poleMat} />
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI, 0, 0]} geometry={assets.shadeGeo} material={assets.shadeMat} />
      <mesh position={[0, 1.65, 0]} geometry={assets.bulbGeo} material={assets.bulbMat} />
      <pointLight position={[0, 1.65, 0]} color="#fff8e1" intensity={1.2} distance={4} decay={2} />
    </group>
  )
}

// Carpets — merged stripes into 1 mesh
function Carpets() {
  const { carpetGeo, carpetMat, rugGeo, rugMat, stripeGeo, stripeMat } = useMemo(() => {
    const stripeBase = new THREE.PlaneGeometry(5, 0.15)
    const merged = mergeGeometries([-1.5, -0.75, 0, 0.75, 1.5].map(y =>
      transformedGeo(stripeBase, { position: [0, y, 0.001] })
    ))
    return {
      carpetGeo: new THREE.PlaneGeometry(3.5, 2.5),
      carpetMat: new THREE.MeshStandardMaterial({ color: '#9a8a7a', roughness: 0.95 }),
      rugGeo: new THREE.PlaneGeometry(5, 3.5),
      rugMat: new THREE.MeshStandardMaterial({ color: '#1a3a5a', roughness: 0.95 }),
      stripeGeo: merged,
      stripeMat: new THREE.MeshStandardMaterial({ color: '#f5f5f0', roughness: 0.95 }),
    }
  }, [])

  return (
    <>
      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={carpetGeo} material={carpetMat} />
      <group position={[0, -1.239, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={rugGeo} material={rugMat} />
        <mesh geometry={stripeGeo} material={stripeMat} />
      </group>
    </>
  )
}

// Bar cart — consolidated
function BarCart() {
  const assets = useMemo(() => ({
    shelfGeo: new THREE.BoxGeometry(0.6, 0.03, 0.4),
    topGeo: new THREE.BoxGeometry(0.64, 0.02, 0.44),
    legGeo: new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6),
    bottleGeo: new THREE.CylinderGeometry(0.03, 0.03, 0.15, 6),
    glassGeo: new THREE.CylinderGeometry(0.025, 0.02, 0.08, 6),
    woodMat: new THREE.MeshStandardMaterial({ color: '#3d2f1f', roughness: 0.7, metalness: 0.2 }),
    legMat: new THREE.MeshStandardMaterial({ color: '#2a1f14', roughness: 0.6, metalness: 0.2 }),
    glassMat: new THREE.MeshStandardMaterial({ color: '#e0e0e0', transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0.1 }),
    bottleColors: ['#2a4a2a', '#4a2a2a', '#2a3a4a'].map(c =>
      new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.7, roughness: 0.1 })
    ),
  }), [])

  const legPositions = [[-0.25, 0.45, -0.15], [0.25, 0.45, -0.15], [-0.25, 0.45, 0.15], [0.25, 0.45, 0.15]]

  return (
    <group position={[-2.5, -1.25, 5]} scale={1.5}>
      <mesh position={[0, 0.92, 0]} geometry={assets.topGeo} material={assets.woodMat} />
      <mesh position={[0, 0.6, 0]} geometry={assets.shelfGeo} material={assets.woodMat} />
      <mesh position={[0, 0.3, 0]} geometry={assets.shelfGeo} material={assets.woodMat} />
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={assets.legGeo} material={assets.legMat} />
      ))}
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.7, 0]} geometry={assets.bottleGeo} material={assets.bottleColors[i]} />
      ))}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]} geometry={assets.glassGeo} material={assets.glassMat} />
      ))}
    </group>
  )
}

// Lily bouquet — 3 flowers with 6 petals each, merged per material
function LilyBouquet() {
  const { vaseGeo, vaseMat, greenGeo, greenMat, petalGeo, petalMat, centerGeo, centerMat } = useMemo(() => {
    const vParts = [
      transformedGeo(new THREE.CylinderGeometry(0.08, 0.06, 0.3, 8), { position: [0, 0.15, 0] }),
      transformedGeo(new THREE.CylinderGeometry(0.06, 0.08, 0.05, 8), { position: [0, 0.3, 0] }),
    ]
    const stemGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.4, 4)
    const leafGeo = new THREE.BoxGeometry(0.015, 0.06, 0.001)
    const gParts = [
      transformedGeo(stemGeo, { position: [-0.03, 0.45, -0.015] }),
      transformedGeo(stemGeo, { position: [0, 0.45, 0] }),
      transformedGeo(stemGeo, { position: [0.03, 0.45, 0.015] }),
      transformedGeo(leafGeo, { position: [-0.02, 0.45, -0.006], rotation: [0, 0, Math.PI / 6] }),
      transformedGeo(leafGeo, { position: [0.02, 0.45, 0.006], rotation: [0, Math.PI, Math.PI / 6] }),
    ]

    const pGeo = new THREE.BoxGeometry(0.04, 0.08, 0.001)
    const cGeo = new THREE.SphereGeometry(0.015, 6, 6)

    // 3 flowers with 6 petals each
    const flowers = [
      { pos: [0, 0.65, 0], rot: [0, 0, 0], r: 0.02 },
      { pos: [-0.04, 0.62, -0.02], rot: [0.3, -0.5, 0], r: 0.018 },
      { pos: [0.04, 0.6, 0.02], rot: [-0.2, 0.4, 0], r: 0.018 },
    ]
    const pParts = []
    const cParts = []
    for (const flower of flowers) {
      cParts.push(transformedGeo(cGeo, { position: flower.pos }))
      const flowerQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(...flower.rot))
      for (const angle of [0, 60, 120, 180, 240, 300]) {
        const rad = (angle * Math.PI) / 180
        const localPos = new THREE.Vector3(Math.sin(rad) * flower.r, 0, Math.cos(rad) * flower.r)
        localPos.applyQuaternion(flowerQ).add(new THREE.Vector3(...flower.pos))
        const petalE = new THREE.Euler(Math.PI / 3, rad, 0)
        const petalQ = new THREE.Quaternion().setFromEuler(petalE).premultiply(flowerQ)
        const petalEuler = new THREE.Euler().setFromQuaternion(petalQ)
        pParts.push(transformedGeo(pGeo, {
          position: [localPos.x, localPos.y, localPos.z],
          rotation: [petalEuler.x, petalEuler.y, petalEuler.z],
        }))
      }
    }

    return {
      vaseGeo: mergeGeometries(vParts),
      vaseMat: new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.1, metalness: 0.9 }),
      greenGeo: mergeGeometries(gParts),
      greenMat: new THREE.MeshStandardMaterial({ color: '#4a7c4a', roughness: 0.7 }),
      petalGeo: mergeGeometries(pParts),
      petalMat: new THREE.MeshStandardMaterial({ color: '#ffc0cb', roughness: 0.6, side: THREE.DoubleSide }),
      centerGeo: mergeGeometries(cParts),
      centerMat: new THREE.MeshStandardMaterial({ color: '#f4a460', roughness: 0.7 }),
    }
  }, [])

  return (
    <group position={[-2.5, 0.13, 5]}>
      <mesh geometry={vaseGeo} material={vaseMat} />
      <mesh geometry={greenGeo} material={greenMat} />
      <mesh geometry={petalGeo} material={petalMat} />
      <mesh geometry={centerGeo} material={centerMat} />
    </group>
  )
}

// Desk chair — merged into 2 meshes (dark frame + seat cushion)
function DeskChair() {
  const { frameGeo, frameMat, seatGeo, seatMat } = useMemo(() => {
    const armGeo = new THREE.BoxGeometry(0.3, 0.05, 0.1)
    const wheelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 6)
    const colGeo = new THREE.CylinderGeometry(0.06, 0.09, 1.0, 6)

    const frameParts = [transformedGeo(colGeo, { position: [0, 0.5, 0] })]
    for (const angle of [0, 72, 144, 216, 288]) {
      const rad = (angle * Math.PI) / 180
      const cos = Math.cos(rad), sin = Math.sin(rad)
      frameParts.push(transformedGeo(armGeo, { position: [0.25 * cos, 0.03, 0.25 * sin], rotation: [0, rad, 0] }))
      frameParts.push(transformedGeo(wheelGeo, { position: [0.4 * cos, 0.03, 0.4 * sin], rotation: [Math.PI / 2, rad, 0] }))
    }

    const seatParts = [
      transformedGeo(new THREE.BoxGeometry(0.55, 0.1, 0.55), { position: [0, 1.05, 0] }),
      transformedGeo(new THREE.BoxGeometry(0.5, 0.03, 0.5), { position: [0, 1.1, 0] }),
      transformedGeo(new THREE.BoxGeometry(0.55, 0.7, 0.1), { position: [0, 1.45, -0.22], rotation: [-0.1, 0, 0] }),
      transformedGeo(new THREE.BoxGeometry(0.5, 0.65, 0.03), { position: [0, 1.45, -0.17], rotation: [-0.1, 0, 0] }),
    ]

    return {
      frameGeo: mergeGeometries(frameParts),
      frameMat: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.4, metalness: 0.5 }),
      seatGeo: mergeGeometries(seatParts),
      seatMat: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.6 }),
    }
  }, [])

  return (
    <group position={[0, -1.25, -1.3]}>
      <mesh geometry={frameGeo} material={frameMat} />
      <mesh geometry={seatGeo} material={seatMat} />
    </group>
  )
}

// Main scene content
function Scene({ onObjectClick, isNightMode = true }) {
  const [hoveredObject] = useState(null)

  // Floor with merged panel lines
  const floorAssets = useMemo(() => {
    const lineBase = new THREE.PlaneGeometry(0.02, 20)
    const mergedLines = mergeGeometries(
      Array.from({ length: 8 }).map((_, i) => transformedGeo(lineBase, { position: [-7 + i * 2, 0, 0.001] }))
    )
    return {
      floorGeo: new THREE.PlaneGeometry(20, 20),
      linesGeo: mergedLines,
      wallGeo: new THREE.PlaneGeometry(15, 8),
    }
  }, [])

  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isNightMode ? '#2a1f14' : '#4a3828', roughness: 0.7,
  }), [isNightMode])

  const lineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isNightMode ? '#1a1408' : '#3a2a18', roughness: 0.8,
  }), [isNightMode])

  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isNightMode ? '#252525' : '#e8e4dc', roughness: 0.95,
  }), [isNightMode])

  return (
    <>
      {/* Lighting */}
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
      <Environment preset={isNightMode ? 'city' : 'apartment'} />

      {/* Floor + merged panel lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]} receiveShadow geometry={floorAssets.floorGeo} material={floorMat} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.249, 0]} geometry={floorAssets.linesGeo} material={lineMat} />

      {/* Wall */}
      <mesh position={[0, 1, -3]} geometry={floorAssets.wallGeo} material={wallMat} />

      <Desk />

      {/* Interactive objects */}
      <InteractiveObject name="laptop" position={[0, 0.3, 0]} onClick={onObjectClick}>
        <Laptop hovered={hoveredObject === 'laptop'} />
      </InteractiveObject>

      <InteractiveObject name="postcard" position={[-0.8, 0.3, 0.2]} rotation={[0, 0, 0]} onClick={onObjectClick}>
        <Postcard hovered={hoveredObject === 'postcard'} />
      </InteractiveObject>

      <InteractiveObject name="notebook" position={[0.9, 0.3, 0.3]} rotation={[0, -0.2, 0]} onClick={onObjectClick}>
        <Notebook hovered={hoveredObject === 'notebook'} />
      </InteractiveObject>

      <InteractiveObject name="tablet" position={[-0.5, 0.3, -0.4]} rotation={[0, 0.3, 0]} onClick={onObjectClick}>
        <Tablet hovered={hoveredObject === 'tablet'} />
      </InteractiveObject>

      {/* Ambient objects */}
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
        floatAmount={0}
        labelOffset={[0, 1.5, 0]}
      >
        <Bookshelf hovered={hoveredObject === 'bookshelf'} />
      </InteractiveObject>

      <CloudCouch />
      <ThrowPillow position={[-0.7, 0.05, 4.9]} rotation={[0, 0.3, 0]} />
      <ThrowPillow position={[0.7, 0.05, 4.9]} rotation={[0, -0.2, 0]} />
      <CoffeeTable />
      <FloorLamp />
      <CeilingLight />
      <Carpets />
      <BarCart />
      <LilyBouquet />
    </>
  )
}

// Loading spinner
function LoadingSpinner({ onLoaded }) {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const hasFinished = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 30)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!active && progress >= 100 && !hasFinished.current) {
      hasFinished.current = true
      const t1 = setTimeout(() => {
        setFadeOut(true)
        onLoaded()
      }, 100)
      const t2 = setTimeout(() => setVisible(false), 600)
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
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </>
  )
}

// Main exported component
function DeskScene({ activeView, onCloseView, onProjectClick, isNightMode = true }) {
  const [showMacScreen, setShowMacScreen] = useState(false)
  const [showPostcard, setShowPostcard] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  const handleObjectClick = (name) => {
    if (name === 'bookshelf' || name === 'tablet' || name === 'notebook' || name === 'postcard') {
      if (onProjectClick) {
        onProjectClick(name)
      }
    } else if (name === 'laptop') {
      setShowMacScreen(true)
    }
  }

  const handleLoaded = useRef(() => setSceneReady(true)).current

  const shouldShowMacScreen = activeView === 'about' || showMacScreen
  const shouldShowPostcard = activeView === 'project' || showPostcard

  const handleClose = (type) => {
    if (onCloseView) onCloseView()
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
        top: 0, left: 0, right: 0, bottom: 0,
        transition: 'background 0.8s ease',
        margin: 0, padding: 0,
      }}>
        <LoadingSpinner onLoaded={handleLoaded} />
        <Canvas
          shadows
          camera={{ position: [0, 2.5, -4], fov: 45, near: 0.1, far: 100 }}
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
              autoRotate
              autoRotateSpeed={0.4}
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

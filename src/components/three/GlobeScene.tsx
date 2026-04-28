'use client'

import { useEffect, useRef } from 'react'
import {
  WebGLRenderer, PerspectiveCamera, Scene, Group, Mesh,
  MeshPhongMaterial, MeshBasicMaterial, SphereGeometry, TorusGeometry,
  BufferGeometry, BufferAttribute, LineBasicMaterial, Line, LineSegments,
  Points, PointsMaterial, Vector3, Color, AmbientLight, PointLight,
  AdditiveBlending, BackSide,
} from 'three'
import { gsap } from '@/lib/gsap'

// Uniform sphere point distribution via Fibonacci lattice
function spherePoints(n: number, r: number): Vector3[] {
  const pts: Vector3[] = []
  const gr = (1 + Math.sqrt(5)) / 2
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n)
    const phi   = (2 * Math.PI * i) / gr
    pts.push(new Vector3(
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.cos(theta),
      r * Math.sin(theta) * Math.sin(phi),
    ))
  }
  return pts
}

// Position of a point on a tilted torus in the parent group's local space.
// Three.js applies Euler XYZ order: first rx (around X), then rz (around Z).
function torusPoint(sr: number, rx: number, rz: number, t: number) {
  const cx = sr * Math.cos(t)
  const cy = sr * Math.sin(t)
  // Apply rotation.x
  const ry = cy * Math.cos(rx)
  const rz_ = cy * Math.sin(rx)
  // Apply rotation.z
  return {
    x:  cx * Math.cos(rz) - ry * Math.sin(rz),
    y:  cx * Math.sin(rz) + ry * Math.cos(rz),
    z:  rz_,
  }
}

export function GlobeScene() {
  const mountRef  = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount    = mountRef.current
    const canvasCt = canvasRef.current
    if (!mount || !canvasCt) return

    const W = mount.clientWidth  || window.innerWidth  * 0.5
    const H = mount.clientHeight || window.innerHeight

    // ── Renderer (transparent) ────────────────────────────────────────────────
    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    canvasCt.appendChild(renderer.domElement)

    const scene  = new Scene()
    const camera = new PerspectiveCamera(50, W / H, 0.1, 100)
    camera.position.z = 3.8

    const R = 1.0

    // scene → floatGroup (float + tilt) → spinGroup (drag + auto-spin)
    const floatGroup = new Group()
    const spinGroup  = new Group()
    floatGroup.add(spinGroup)
    scene.add(floatGroup)

    // ── Point-cloud globe shell ───────────────────────────────────────────────
    // Replaces the solid mesh entirely — zero z-fighting possible.
    const shellPts = spherePoints(1400, R)
    const shellPos = new Float32Array(shellPts.length * 3)
    shellPts.forEach((p, i) => shellPos.set([p.x, p.y, p.z], i * 3))
    const shellGeo = new BufferGeometry()
    shellGeo.setAttribute('position', new BufferAttribute(shellPos, 3))
    spinGroup.add(new Points(shellGeo, new PointsMaterial({
      color: '#5b21b6', size: 0.008, sizeAttenuation: true,
      transparent: true, opacity: 0.55, depthWrite: false,
    })))

    // ── Lat / Lon grid (faint overlay — no z-fighting without a solid mesh) ──
    const gridMat = new LineBasicMaterial({
      color: '#6d28d9', transparent: true, opacity: 0.18, depthWrite: false,
    })
    for (let i = 1; i < 10; i++) {
      const ph = (Math.PI * i) / 10
      const ry = R * Math.cos(ph), rh = R * Math.sin(ph)
      const pts = Array.from({ length: 65 }, (_, j) => {
        const t = (j / 64) * Math.PI * 2
        return new Vector3(rh * Math.cos(t), ry, rh * Math.sin(t))
      })
      spinGroup.add(new Line(new BufferGeometry().setFromPoints(pts), gridMat))
    }
    for (let i = 0; i < 14; i++) {
      const th = (Math.PI * 2 * i) / 14
      const pts = Array.from({ length: 65 }, (_, j) => {
        const ph = (Math.PI * j) / 64
        return new Vector3(
          R * Math.sin(ph) * Math.cos(th),
          R * Math.cos(ph),
          R * Math.sin(ph) * Math.sin(th),
        )
      })
      spinGroup.add(new Line(new BufferGeometry().setFromPoints(pts), gridMat))
    }

    // ── Network nodes ─────────────────────────────────────────────────────────
    const nodePts = spherePoints(64, R + 0.003)
    const nPos    = new Float32Array(nodePts.length * 3)
    const nCol    = new Float32Array(nodePts.length * 3)
    const pal = [
      new Color('#d2bbff'), // violet-light — most common
      new Color('#7c3aed'), // violet
      new Color('#4cd7f6'), // cyan-light
      new Color('#ffffff'), // white highlight
    ]
    nodePts.forEach((p, i) => {
      nPos.set([p.x, p.y, p.z], i * 3)
      const r = Math.random()
      const c = r > 0.93 ? pal[3] : r > 0.78 ? pal[2] : r > 0.48 ? pal[1] : pal[0]
      nCol.set([c.r, c.g, c.b], i * 3)
    })
    const nodeGeo = new BufferGeometry()
    nodeGeo.setAttribute('position', new BufferAttribute(nPos, 3))
    nodeGeo.setAttribute('color',    new BufferAttribute(nCol, 3))
    spinGroup.add(new Points(nodeGeo, new PointsMaterial({
      size: 0.038, vertexColors: true, sizeAttenuation: true,
      transparent: true, opacity: 1.0, depthWrite: false,
    })))

    // ── Connection lines ──────────────────────────────────────────────────────
    // depthWrite: false prevents transparency artifacts against other objects.
    const cPos: number[] = [], cCol: number[] = []
    const vc = new Color('#7c3aed'), cc = new Color('#06b6d4')
    for (let i = 0; i < nodePts.length; i++) {
      for (let j = i + 1; j < nodePts.length; j++) {
        if (nodePts[i].distanceTo(nodePts[j]) < 0.52) {
          cPos.push(nodePts[i].x, nodePts[i].y, nodePts[i].z,
                    nodePts[j].x, nodePts[j].y, nodePts[j].z)
          const c = Math.random() > 0.55 ? cc : vc
          cCol.push(c.r, c.g, c.b, c.r, c.g, c.b)
        }
      }
    }
    const connGeo = new BufferGeometry()
    connGeo.setAttribute('position', new BufferAttribute(new Float32Array(cPos), 3))
    connGeo.setAttribute('color',    new BufferAttribute(new Float32Array(cCol), 3))
    spinGroup.add(new LineSegments(connGeo, new LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.40, depthWrite: false,
    })))

    // ── Atmosphere (additive blending — cannot produce z-sort artifacts) ──────
    spinGroup.add(new Mesh(
      new SphereGeometry(R * 1.16, 32, 32),
      new MeshPhongMaterial({
        color: '#3d0070', emissive: '#5b21b6', emissiveIntensity: 1.0,
        transparent: true, opacity: 0.09,
        depthWrite: false, blending: AdditiveBlending, side: BackSide,
      }),
    ))
    spinGroup.add(new Mesh(
      new SphereGeometry(R * 1.06, 32, 32),
      new MeshBasicMaterial({
        color: '#7c3aed', transparent: true, opacity: 0.05,
        depthWrite: false, blending: AdditiveBlending, side: BackSide,
      }),
    ))

    // ── Orbit rings (ring rotations are accumulated per-frame, not time-based) ─
    const RING1_RX = Math.PI * 0.30
    const RING2_RX = Math.PI * 0.15

    const ring1 = new Mesh(
      new TorusGeometry(R * 1.24, 0.006, 8, 180),
      new MeshBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.55, depthWrite: false }),
    )
    ring1.rotation.x = RING1_RX

    const ring2 = new Mesh(
      new TorusGeometry(R * 1.38, 0.0025, 8, 180),
      new MeshBasicMaterial({ color: '#06b6d4', transparent: true, opacity: 0.38, depthWrite: false }),
    )
    ring2.rotation.x = RING2_RX
    ring2.rotation.z = Math.PI * 0.08  // initial offset, then accumulated below

    spinGroup.add(ring1, ring2)

    // ── Traveling sparks (one per ring) ───────────────────────────────────────
    const spark1Geo = new BufferGeometry()
    spark1Geo.setAttribute('position', new BufferAttribute(new Float32Array(3), 3))
    spinGroup.add(new Points(spark1Geo, new PointsMaterial({
      color: '#d2bbff', size: 0.08, transparent: true, opacity: 0.95, depthWrite: false,
    })))

    const spark2Geo = new BufferGeometry()
    spark2Geo.setAttribute('position', new BufferAttribute(new Float32Array(3), 3))
    spinGroup.add(new Points(spark2Geo, new PointsMaterial({
      color: '#4cd7f6', size: 0.055, transparent: true, opacity: 0.85, depthWrite: false,
    })))

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new AmbientLight('#ffffff', 0.2))
    const pv = new PointLight('#a855f7', 3.5, 10)
    pv.position.set(2.5, 2, 3)
    scene.add(pv)
    const pc = new PointLight('#06b6d4', 1.5, 8)
    pc.position.set(-2, -1, 2)
    scene.add(pc)

    // ── Entrance animation ────────────────────────────────────────────────────
    floatGroup.scale.setScalar(0.01)
    const entranceTween = gsap.to(floatGroup.scale, {
      x: 1, y: 1, z: 1, duration: 1.8, ease: 'power3.out', delay: 0.7,
    })

    // ── Mouse-hover interaction ───────────────────────────────────────────────
    // target.rotY / target.rotX are the desired rotations derived from mouse position.
    // baseAngle drives auto-rotation when the mouse is away; it syncs to the
    // current Y rotation on hover-start so there is no jump when switching modes.
    const target = { rotX: 0, rotY: 0 }
    let isHovering = false
    let baseAngle = 0

    const onMouseMove = (e: MouseEvent) => {
      // Map full viewport → ±range so the whole page acts as a soft controller
      target.rotY =  ((e.clientX / window.innerWidth)  - 0.5) * 1.4   // ±0.7 rad horizontal
      target.rotX = -((e.clientY / window.innerHeight) - 0.5) * 0.55  // ±0.275 rad vertical
    }
    const onMouseEnter = () => {
      isHovering = true
    }
    const onMouseLeave = () => {
      isHovering = false
      // Sync baseAngle to avoid a rotation jump when auto-spin resumes
      baseAngle = spinGroup.rotation.y
    }

    window.addEventListener('mousemove',  onMouseMove)
    mount.addEventListener('mouseenter',  onMouseEnter)
    mount.addEventListener('mouseleave',  onMouseLeave)

    // ── Render loop ───────────────────────────────────────────────────────────
    let frameId: number
    let sparkT1 = 0, sparkT2 = 0
    const LERP = 0.04

    const tick = () => {
      frameId = requestAnimationFrame(tick)

      if (isHovering) {
        // Smoothly follow mouse position
        spinGroup.rotation.y += (target.rotY - spinGroup.rotation.y) * LERP
        spinGroup.rotation.x += (target.rotX - spinGroup.rotation.x) * LERP
      } else {
        // Auto-rotate; drift X back to neutral
        baseAngle += 0.003
        spinGroup.rotation.y += (baseAngle - spinGroup.rotation.y) * LERP
        spinGroup.rotation.x += (0 - spinGroup.rotation.x) * LERP
      }

      // Gentle float (always active)
      floatGroup.position.y = Math.sin(performance.now() * 0.00065) * 0.06

      // Ring spin — accumulated per-frame, avoids floating-point drift from absolute time
      ring1.rotation.z += 0.004
      ring2.rotation.z -= 0.003

      // Spark 1 travels along ring1's orbit path
      sparkT1 += 0.018
      const s1 = torusPoint(R * 1.24, RING1_RX, ring1.rotation.z, sparkT1)
      const sp1 = spark1Geo.attributes.position.array as Float32Array
      sp1[0] = s1.x; sp1[1] = s1.y; sp1[2] = s1.z
      spark1Geo.attributes.position.needsUpdate = true

      // Spark 2 travels along ring2's orbit path in opposite direction
      sparkT2 -= 0.012
      const s2 = torusPoint(R * 1.38, RING2_RX, ring2.rotation.z, sparkT2)
      const sp2 = spark2Geo.attributes.position.array as Float32Array
      sp2[0] = s2.x; sp2[1] = s2.y; sp2[2] = s2.z
      spark2Geo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    frameId = requestAnimationFrame(tick)

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      entranceTween.kill()
      window.removeEventListener('mousemove',  onMouseMove)
      mount.removeEventListener('mouseenter',  onMouseEnter)
      mount.removeEventListener('mouseleave',  onMouseLeave)
      window.removeEventListener('resize',     onResize)
      renderer.dispose()
      if (canvasCt.contains(renderer.domElement)) canvasCt.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute right-0 top-0 w-1/2 h-full z-20 pointer-events-none"
      aria-hidden="true"
    >
      {/* Three.js canvas injected here */}
      <div ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  color: 'white' | 'violet' | 'cyan'
}

interface BgParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  phase: number
}

interface MouseState {
  x: number
  y: number
  isActive: boolean
}

// Reduced density caps to prevent excessive particles on large/HiDPI screens
const MAX_PARTICLES    = 120
const MAX_BG_PARTICLES = 60
const MOUSE_RADIUS     = 180
const RETURN_SPEED     = 0.08
const DAMPING          = 0.9
const REPULSION        = 1.2
const MAX_DPR          = 1.5   // cap canvas resolution — no need for 3× on Retina

const rand = (min: number, max: number) => Math.random() * (max - min) + min

export function HeroScene() {
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)
  const particlesRef  = useRef<Particle[]>([])
  const bgParticlesRef= useRef<BgParticle[]>([])
  const mouseRef      = useRef<MouseState>({ x: -1000, y: -1000, isActive: false })
  const frameIdRef    = useRef<number>(0)
  const dimsRef       = useRef({ width: 0, height: 0 })
  const frameCountRef = useRef(0)
  // Cached gradient objects — recreated only on resize
  const glowVRef      = useRef<CanvasGradient | null>(null)
  const glowCRef      = useRef<CanvasGradient | null>(null)

  const buildGradients = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gv = ctx.createRadialGradient(w * 0.35, h * 0.45, 0, w * 0.35, h * 0.45, Math.max(w, h) * 0.65)
    gv.addColorStop(0, 'rgba(124,58,237,1)')
    gv.addColorStop(1, 'rgba(0,0,0,0)')
    glowVRef.current = gv

    const gc = ctx.createRadialGradient(w * 0.72, h * 0.6, 0, w * 0.72, h * 0.6, Math.max(w, h) * 0.5)
    gc.addColorStop(0, 'rgba(6,182,212,1)')
    gc.addColorStop(1, 'rgba(0,0,0,0)')
    glowCRef.current = gc
  }, [])

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor(width * height * 0.00010), MAX_PARTICLES)
    const ps: Particle[] = []
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = Math.random()
      ps.push({
        x, y, originX: x, originY: y, vx: 0, vy: 0,
        size: rand(0.8, 2.2),
        color: r > 0.92 ? 'violet' : r > 0.84 ? 'cyan' : 'white',
      })
    }
    particlesRef.current = ps

    const bgCount = Math.min(Math.floor(width * height * 0.000035), MAX_BG_PARTICLES)
    const bgs: BgParticle[] = []
    for (let i = 0; i < bgCount; i++) {
      bgs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: rand(0.4, 1.4),
        alpha: rand(0.08, 0.35),
        phase: Math.random() * Math.PI * 2,
      })
    }
    bgParticlesRef.current = bgs
  }, [])

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = dimsRef.current
    frameCountRef.current++
    const frame = frameCountRef.current

    // Background fill
    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, 0, width, height)

    // Pulsating glows — use cached gradients, control intensity via globalAlpha
    if (glowVRef.current && glowCRef.current) {
      const pulseA = Math.sin(time * 0.0008) * 0.04 + 0.08
      const pulseB = Math.cos(time * 0.0006) * 0.02 + 0.05
      ctx.globalAlpha = pulseA
      ctx.fillStyle = glowVRef.current
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = pulseB
      ctx.fillStyle = glowCRef.current
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 1.0
    }

    // Drifting bg stars — update movement every frame, twinkle only every 2nd frame
    const bgs = bgParticlesRef.current
    for (let i = 0; i < bgs.length; i++) {
      const p = bgs[i]
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0
      const twinkle = frame % 2 === 0 ? Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5 : 0.5
      ctx.globalAlpha = p.alpha * (0.3 + 0.7 * twinkle)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1.0

    // Foreground physics particles
    const ps = particlesRef.current
    const mouse = mouseRef.current

    // Apply forces (spring return + mouse repulsion) — no O(n²) collision
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      if (mouse.isActive) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * REPULSION
          p.vx -= (dx / dist) * force * 5
          p.vy -= (dy / dist) * force * 5
        }
      }
      p.vx += (p.originX - p.x) * RETURN_SPEED
      p.vy += (p.originY - p.y) * RETURN_SPEED
    }

    // Integrate and draw
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      p.vx *= DAMPING; p.vy *= DAMPING
      p.x += p.vx; p.y += p.vy
      const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const opacity = Math.min(0.25 + vel * 0.12, 1)
      if (p.color === 'violet') {
        ctx.fillStyle = `rgba(124,58,237,${Math.min(opacity + 0.35, 1)})`
      } else if (p.color === 'cyan') {
        ctx.fillStyle = `rgba(6,182,212,${Math.min(opacity + 0.35, 1)})`
      } else {
        ctx.fillStyle = `rgba(255,255,255,${opacity})`
      }
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    frameIdRef.current = requestAnimationFrame(animate)
  }, [])

  // Resize + init
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current || !canvasRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      dimsRef.current = { width, height }
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvasRef.current.width  = width  * dpr
      canvasRef.current.height = height * dpr
      canvasRef.current.style.width  = `${width}px`
      canvasRef.current.style.height = `${height}px`
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        buildGradients(ctx, width, height)
      }
      initParticles(width, height)
    }
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [initParticles, buildGradients])

  // Start animation
  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameIdRef.current)
  }, [animate])

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive:
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top  && e.clientY <= rect.bottom,
      }
    }
    const onLeave = () => { mouseRef.current.isActive = false }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}

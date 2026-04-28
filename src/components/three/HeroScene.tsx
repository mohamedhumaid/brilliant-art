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

const PARTICLE_DENSITY = 0.00010
const BG_PARTICLE_DENSITY = 0.000035
const MOUSE_RADIUS = 180
const RETURN_SPEED = 0.08
const DAMPING = 0.9
const REPULSION = 1.2

const rand = (min: number, max: number) => Math.random() * (max - min) + min

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const bgParticlesRef = useRef<BgParticle[]>([])
  const mouseRef = useRef<MouseState>({ x: -1000, y: -1000, isActive: false })
  const frameIdRef = useRef<number>(0)
  const dimsRef = useRef({ width: 0, height: 0 })

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.floor(width * height * PARTICLE_DENSITY)
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

    const bgCount = Math.floor(width * height * BG_PARTICLE_DENSITY)
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

    // Background fill
    ctx.fillStyle = '#0a0a0c'
    ctx.fillRect(0, 0, width, height)

    // Pulsating dual-color glow (violet → cyan)
    const pulseA = Math.sin(time * 0.0008) * 0.04 + 0.08
    const pulseB = Math.cos(time * 0.0006) * 0.02 + 0.05
    const gv = ctx.createRadialGradient(width * 0.35, height * 0.45, 0, width * 0.35, height * 0.45, Math.max(width, height) * 0.65)
    gv.addColorStop(0, `rgba(124,58,237,${pulseA})`)
    gv.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gv
    ctx.fillRect(0, 0, width, height)

    const gc = ctx.createRadialGradient(width * 0.72, height * 0.6, 0, width * 0.72, height * 0.6, Math.max(width, height) * 0.5)
    gc.addColorStop(0, `rgba(6,182,212,${pulseB})`)
    gc.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gc
    ctx.fillRect(0, 0, width, height)

    // Drifting background stars
    const bgs = bgParticlesRef.current
    for (let i = 0; i < bgs.length; i++) {
      const p = bgs[i]
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0
      const twinkle = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5
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

    // Apply forces
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (mouse.isActive && dist < MOUSE_RADIUS && dist > 0.01) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * REPULSION
        p.vx -= (dx / dist) * force * 5
        p.vy -= (dy / dist) * force * 5
      }
      p.vx += (p.originX - p.x) * RETURN_SPEED
      p.vy += (p.originY - p.y) * RETURN_SPEED
    }

    // Collision resolution
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const distSq = dx * dx + dy * dy
        const minD = a.size + b.size
        if (distSq < minD * minD) {
          const dist = Math.sqrt(distSq)
          if (dist > 0.01) {
            const nx = dx / dist, ny = dy / dist
            const overlap = (minD - dist) * 0.5
            a.x -= nx * overlap; a.y -= ny * overlap
            b.x += nx * overlap; b.y += ny * overlap
            const vaN = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
            if (vaN > 0) {
              const imp = (-(1 + 0.8) * vaN) / (1 / a.size + 1 / b.size)
              a.vx += imp * nx / a.size; a.vy += imp * ny / a.size
              b.vx -= imp * nx / b.size; b.vy -= imp * ny / b.size
            }
          }
        }
      }
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
      const dpr = window.devicePixelRatio || 1
      canvasRef.current.width = width * dpr
      canvasRef.current.height = height * dpr
      canvasRef.current.style.width = `${width}px`
      canvasRef.current.style.height = `${height}px`
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles(width, height)
    }
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [initParticles])

  // Start animation
  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameIdRef.current)
  }, [animate])

  // Window-level mouse tracking so particles respond even when hovering text
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive:
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom,
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

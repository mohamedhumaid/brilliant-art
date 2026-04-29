'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { SectionLabel } from '@/components/ui/SectionLabel'

const LOGOS = [
  '1-1-300x300.webp',
  '2-300x300.webp',
  '3-300x300.webp',
  '4-300x300.webp',
  '5-300x300.webp',
  '6-300x300.webp',
  '7-300x300.webp',
  '8-300x300.webp',
  '9-300x300.webp',
  '10-300x300.webp',
  '11-300x300.webp',
  '12-300x300.webp',
  '13-300x300.webp',
  '14-300x300.webp',
  '15-300x300.webp',
  '16-300x300.webp',
  '17-300x300.webp',
  '18-300x300.webp',
  '19-300x300.webp',
  '20-300x300.webp',
]

const LOGO_SIZE   = 96   // px — rendered size of each logo square
const LOGO_GAP    = 48   // px — gap between logos
const ITEM_WIDTH  = LOGO_SIZE + LOGO_GAP
const TOTAL_WIDTH = LOGOS.length * ITEM_WIDTH
const SPEED       = 0.6  // px per frame at 60fps

export function PartnersMarquee() {
  const trackRef    = useRef<HTMLDivElement>(null)
  const frameRef    = useRef(0)
  const rafRef      = useRef<number>(0)
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const animStarted = useRef(false)

  // Continuous marquee scroll via rAF
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const step = () => {
      frameRef.current += SPEED
      const offset = -(frameRef.current % TOTAL_WIDTH)
      track.style.transform = `translateX(${offset}px)`
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Header fade-in on scroll (matches site pattern, no GSAP dep here)
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animStarted.current) {
          animStarted.current = true
          header.style.transition = 'opacity 0.85s ease, transform 0.85s ease'
          header.style.opacity    = '1'
          header.style.transform  = 'translateY(0)'
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // Triple the logos so the loop is seamless across any viewport width
  const rendered = [...LOGOS, ...LOGOS, ...LOGOS]

  return (
    <section
      ref={sectionRef}
      className="relative py-section overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] rounded-full bg-cyan/5 blur-[160px] pointer-events-none" />

      {/* Section header */}
      <div
        ref={headerRef}
        className="text-center mb-14 px-8"
        style={{ opacity: 0, transform: 'translateY(28px)' }}
      >
        <div className="mb-4 inline-block">
          <SectionLabel>Trusted By</SectionLabel>
        </div>
        <h2 className="text-[clamp(2rem,4vw,52px)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
          Partners in Digital Brilliance
        </h2>
      </div>

      {/* 3-D perspective stage */}
      <div
        style={{
          perspective: '1200px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            transform: 'rotateX(8deg) rotateY(-28deg)',
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Scrolling track */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              willChange: 'transform',
              gap: `${LOGO_GAP}px`,
            }}
          >
            {rendered.map((file, i) => {
              // Per-item depth-based blur + opacity (mirrors Remotion original)
              const posInSet   = (i % LOGOS.length) / LOGOS.length
              const norm       = (posInSet - 0.5) * 2          // -1 … 1
              const dist       = Math.min(1, Math.abs(norm))
              const blurPx     = dist * 5
              const opacity    = 1 - dist * 0.35

              return (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width:   LOGO_SIZE,
                    height:  LOGO_SIZE,
                    filter:  `blur(${blurPx}px)`,
                    opacity,
                    transition: 'filter 0.1s, opacity 0.1s',
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center p-3">
                    <Image
                      src={`/images/partners/${file}`}
                      alt="partner logo"
                      width={LOGO_SIZE - 24}
                      height={LOGO_SIZE - 24}
                      className="object-contain w-full h-full"
                      draggable={false}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Left & right fade masks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #0a0a0c 0%, transparent 18%, transparent 82%, #0a0a0c 100%)',
        }}
      />
      {/* Top & bottom fade masks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #0a0a0c 0%, transparent 25%, transparent 75%, #0a0a0c 100%)',
        }}
      />
    </section>
  )
}

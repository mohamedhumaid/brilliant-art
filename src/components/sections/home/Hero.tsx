'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { GradientButton } from '@/components/ui/GradientButton'
import { GhostButton } from '@/components/ui/GhostButton'

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })),
  { ssr: false },
)

const GlobeScene = dynamic(
  () => import('@/components/three/GlobeScene').then((m) => ({ default: m.GlobeScene })),
  { ssr: false },
)

const headline = ['Turning', 'Vision', 'Into', 'Creative', 'Power.']

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.from('[data-hero-word]', { y: '110%', duration: 1, stagger: 0.07, ease: 'power3.out' })
        .from('[data-hero-sub]', { autoAlpha: 0, y: 24, duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .from('[data-hero-ctas]', { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.3')
        .from('[data-hero-scroll]', { autoAlpha: 0, duration: 0.6 }, '-=0.2')
    },
    { scope: containerRef },
  )

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex items-center overflow-hidden bg-void cursor-crosshair"
    >
      {/* Particle canvas — fills entire background */}
      <HeroScene />

      {/* 3D globe — right side, above gradients */}
      <GlobeScene />

      {/* Subtle left-side gradient so headline text stays legible */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-void/75 via-void/25 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-void/40 via-transparent to-void/80 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-30 max-w-[1440px] mx-auto px-8 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-gradient-to-r from-violet to-cyan" />
            <span className="text-label-bold uppercase tracking-widest text-on-surface-variant">
              Creative Agency
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-8">
            <span className="sr-only">Turning Vision Into Creative Power.</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-5 gap-y-1">
              {headline.map((word, i) => (
                <span key={i} className="overflow-hidden inline-block leading-none pb-1">
                  <span
                    data-hero-word
                    className={`inline-block text-[clamp(3rem,7vw,80px)] font-bold leading-none tracking-[-0.04em] ${
                      i >= 2 ? 'text-gradient' : 'text-white'
                    }`}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <p data-hero-sub className="text-body-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
            We craft immersive brand experiences that connect, inspire, and endure — where
            precision meets imagination at every pixel.
          </p>

          {/* CTAs */}
          <div data-hero-ctas className="flex flex-wrap gap-4">
            <GradientButton href="/portfolio">View Our Work</GradientButton>
            <GhostButton href="/about">Our Story</GhostButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

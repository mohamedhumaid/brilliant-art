'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GhostButton } from '@/components/ui/GhostButton'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const stats = [
  { value: 10, suffix: '+', label: 'Years of Excellence' },
  { value: 200, suffix: '+', label: 'Projects Delivered' },
  { value: 45, suffix: '+', label: 'Brands Elevated' },
  { value: 3, suffix: '', label: 'Continents Reached' },
]

export function AboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-about-reveal]')
      items.forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-section px-8 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet/8 blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <div>
            <div data-about-reveal className="mb-6">
              <SectionLabel>About Us</SectionLabel>
            </div>
            <h2 data-about-reveal className="text-[clamp(2.5rem,5vw,64px)] font-bold leading-[1.05] tracking-[-0.03em] text-white mb-6">
              Where Art Meets{' '}
              <span className="text-gradient">High-End Technology</span>
            </h2>
            <p data-about-reveal className="text-body-lg text-on-surface-variant mb-4 leading-relaxed">
              Brilliant Art is a full-service digital and branding agency empowering ambitious businesses since 2016.
            </p>
            <p data-about-reveal className="text-body-md text-on-surface-variant mb-10 leading-relaxed">
              We help your business grow, stand out, and thrive in the digital world. We blend creativity, code, and content to deliver digital experiences that are bold, beautiful, and built for impact.
            </p>
            <div data-about-reveal>
              <GhostButton href="/about">Discover Our Story</GhostButton>
            </div>
          </div>

          {/* Right — stats */}
          <div data-about-reveal className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card p-8">
                <div className="text-[3.5rem] font-bold leading-none tracking-tight text-gradient mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-label-bold uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

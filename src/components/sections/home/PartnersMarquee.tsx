'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { InfiniteSlider } from '@/components/ui/InfiniteSlider'

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

export function PartnersMarquee() {
  const headerRef   = useRef<HTMLDivElement>(null)
  const animStarted = useRef(false)

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

  return (
    <section className="relative py-section overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-violet/5 blur-[160px] pointer-events-none" />

      {/* Header */}
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

      {/* Slider with left/right fade mask */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <InfiniteSlider gap={64} speed={40} speedOnHover={80}>
          {LOGOS.map((file) => (
            <div key={file} className="flex items-center justify-center w-20 h-20 shrink-0">
              <Image
                src={`/images/partners/${file}`}
                alt="partner logo"
                width={80}
                height={80}
                className="object-contain w-full h-full brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300 select-none pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  )
}

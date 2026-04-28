'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Palette, CreditCard, Package, Layers, Type, Clock } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GhostButton } from '@/components/ui/GhostButton'
import { ExpandingCards, type CardItem } from '@/components/ui/ExpandingCards'

const projects: CardItem[] = [
  {
    id: 1,
    title: 'Smart T-Shirt Artwork',
    description: 'A bold apparel identity built around expressive illustration and a sharp typographic system — wearable art that speaks before a word is read.',
    imgSrc: '/images/portfolio/smart-t-shirt-artwork.webp',
    accent: '#7c3aed',
    icon: <Palette size={26} />,
    linkHref: '/portfolio',
  },
  {
    id: 2,
    title: 'Crafted Payment Gateway',
    description: 'A fintech brand identity balancing trust with modernity — clean geometry, confident color, and a visual language built for digital-first audiences.',
    imgSrc: '/images/portfolio/crafted-payment-gateway.webp',
    accent: '#06b6d4',
    icon: <CreditCard size={26} />,
    linkHref: '/portfolio',
  },
  {
    id: 3,
    title: 'Wild Code Zem Boxes',
    description: 'Structural packaging design that transforms an unboxing moment into a brand statement — tactile, distinctive, and impossible to forget.',
    imgSrc: '/images/portfolio/wild-code-zem-boxes.webp',
    accent: '#a78bfa',
    icon: <Package size={26} />,
    linkHref: '/portfolio',
  },
  {
    id: 4,
    title: 'Floral Business Card',
    description: 'Premium stationery rooted in organic elegance — intricate botanical motifs paired with refined typography for a lasting first impression.',
    imgSrc: '/images/portfolio/floral-business-card.webp',
    accent: '#4cd7f6',
    icon: <Layers size={26} />,
    linkHref: '/portfolio',
  },
  {
    id: 5,
    title: 'Colyfate Font Design',
    description: 'An original typeface crafted from scratch — expressive letterforms with built-in personality, designed to anchor a full brand identity system.',
    accent: '#7c3aed',
    icon: <Type size={26} />,
    linkHref: '/portfolio',
  },
  {
    id: 6,
    title: 'Watch Mockup Design',
    description: 'Luxury product visualization for a timepiece brand — photorealistic mockups and scene composition that elevate the object and sell the lifestyle.',
    accent: '#06b6d4',
    icon: <Clock size={26} />,
    linkHref: '/portfolio',
  },
]

export default function PortfolioTeaser() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return

      const labelEl = headerRef.current?.querySelector('[data-pt-label]')
      const titleEl = headerRef.current?.querySelector('[data-pt-title]')
      const btnEl   = headerRef.current?.querySelector('[data-pt-btn]')

      gsap.set([labelEl, titleEl, btnEl].filter(Boolean), { autoAlpha: 0, y: 28 })

      gsap.to([labelEl, titleEl], {
        autoAlpha: 1, y: 0,
        duration: 0.85, stagger: 0.13, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })

      if (btnEl) {
        gsap.to(btnEl, {
          autoAlpha: 1, y: 0,
          duration: 0.75, ease: 'power2.out', delay: 0.22,
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        })
      }
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-section px-8 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-violet/5 blur-[180px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div data-pt-label className="mb-4 inline-block">
              <SectionLabel>Our Work</SectionLabel>
            </div>
            <h2 data-pt-title className="text-[clamp(2.2rem,4.5vw,56px)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
              Projects in Action
            </h2>
          </div>
          <div data-pt-btn className="inline-block">
            <GhostButton href="/portfolio">View All Work</GhostButton>
          </div>
        </div>

        {/* Expanding cards */}
        <ExpandingCards items={projects} defaultActiveIndex={0} />
      </div>
    </section>
  )
}

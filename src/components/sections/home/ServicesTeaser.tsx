'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GhostButton } from '@/components/ui/GhostButton'

const services = [
  { number: '01', title: 'Web Solutions', description: 'Websites, eCommerce platforms, mobile web apps, and SEO — engineered for performance, conversion, and growth at every scale.', icon: '◈', accent: 'violet' },
  { number: '02', title: 'Brand Development', description: 'Brand strategy, identity systems, logo creation, brand guidelines, and corporate stationery — built to define and differentiate your presence.', icon: '◉', accent: 'cyan' },
  { number: '03', title: 'Digital Marketing', description: 'Campaign planning, media strategy, Google Ads, social media, and content marketing — reaching the right audience at exactly the right moment.', icon: '◍', accent: 'violet' },
  { number: '04', title: 'Video Production', description: 'Short films, TV commercials, motion graphics, whiteboard animations, and storytelling — visuals that move minds and drive action.', icon: '◎', accent: 'cyan' },
  { number: '05', title: 'Photography', description: 'Product, personal, corporate, and lifestyle photography — images that communicate with precision, emotion, and lasting impact.', icon: '◐', accent: 'violet' },
  { number: '06', title: 'UX/UI Design', description: 'Intuitive interfaces, high-fidelity prototypes, UX research, and usability testing — design that serves both users and business goals.', icon: '◑', accent: 'cyan' },
  { number: '07', title: 'Content Writing', description: 'Content strategy, concept development, copywriting, website content, and SEO writing — words that work as hard as your product does.', icon: '◒', accent: 'violet' },
  { number: '08', title: 'Graphics Design', description: 'Art direction, visual identity, packaging, campaign design, and print — compelling visuals crafted for every brand touchpoint.', icon: '◓', accent: 'cyan' },
]

export function ServicesTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      // ── Header: label slides in first, then headline, then button ──
      const labelEl  = headerRef.current?.querySelector('[data-srv-label]')
      const titleEl  = headerRef.current?.querySelector('[data-srv-title]')
      const buttonEl = headerRef.current?.querySelector('[data-srv-btn]')

      gsap.set([labelEl, titleEl, buttonEl], { autoAlpha: 0, y: 28 })
      gsap.to([labelEl, titleEl], {
        autoAlpha: 1, y: 0,
        duration: 0.85, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })
      if (buttonEl) {
        gsap.to(buttonEl, {
          autoAlpha: 1, y: 0,
          duration: 0.75, ease: 'power2.out',
          delay: 0.22,
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        })
      }

      // ── Cards: set invisible up-front, then batch-reveal when grid scrolls in ──
      const cards = gsap.utils.toArray<HTMLElement>('[data-service-card]', section)
      gsap.set(cards, { autoAlpha: 0, y: 64, scale: 0.94 })

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1, y: 0, scale: 1,
            duration: 0.9, stagger: 0.10, ease: 'power3.out',
            overwrite: true,
          }),
        start: 'top 88%',
        once: true,
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-section px-8 overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/6 blur-[160px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div data-srv-label className="mb-4 inline-block">
              <SectionLabel>Our Services</SectionLabel>
            </div>
            <h2 data-srv-title className="text-[clamp(2.2rem,4.5vw,56px)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
              What We Create
            </h2>
          </div>
          <div data-srv-btn className="inline-block">
            <GhostButton href="/services">Explore Services</GhostButton>
          </div>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.number}
              data-service-card
              className="glass-card p-8 group cursor-pointer transition-all duration-300 hover:border-violet/30 hover:shadow-glow-violet-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[2.5rem] leading-none">{service.icon}</span>
                <span className={`text-label-sm font-bold ${service.accent === 'violet' ? 'text-violet-light' : 'text-cyan-light'}`}>
                  {service.number}
                </span>
              </div>
              <h3 className="text-headline-md font-semibold text-white mb-3 group-hover:text-gradient transition-all">
                {service.title}
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{service.description}</p>
              <div className={`mt-6 h-px w-0 group-hover:w-full transition-all duration-500 ${
                service.accent === 'violet'
                  ? 'bg-gradient-to-r from-violet to-violet/0'
                  : 'bg-gradient-to-r from-cyan to-cyan/0'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

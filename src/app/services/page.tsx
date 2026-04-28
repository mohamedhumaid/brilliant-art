'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GradientButton } from '@/components/ui/GradientButton'

const services = [
  {
    number: '01',
    title: 'Brand Identity',
    tagline: 'Visual languages that endure',
    description: '[Full description of Brand Identity services. Include logo design, brand systems, typography selection, color strategy, brand guidelines, and brand voice development. Content to be provided.]',
    deliverables: ['Logo & Mark System', 'Brand Guidelines', 'Color & Typography', 'Brand Voice', 'Stationery & Collateral'],
    accent: 'violet' as const,
  },
  {
    number: '02',
    title: 'Motion Design',
    tagline: 'Stories that move minds',
    description: '[Full description of Motion Design services. Include animation, video production, title sequences, social content, and broadcast graphics. Content to be provided.]',
    deliverables: ['Brand Animation', 'Video Production', 'Social Motion', 'Title Sequences', 'Explainer Videos'],
    accent: 'cyan' as const,
  },
  {
    number: '03',
    title: 'Web Experience',
    tagline: 'Digital ecosystems, engineered',
    description: '[Full description of Web Experience services. Include UX/UI design, development, performance optimization, and CMS integration. Content to be provided.]',
    deliverables: ['UX/UI Design', 'Web Development', 'E-commerce', 'CMS Integration', 'Performance Optimization'],
    accent: 'violet' as const,
  },
  {
    number: '04',
    title: '3D & Immersive',
    tagline: 'Depth beyond the screen',
    description: '[Full description of 3D and Immersive services. Include product visualization, interactive 3D, AR/VR experiences, and architectural visualization. Content to be provided.]',
    deliverables: ['Product Visualization', 'Interactive 3D', 'AR Experiences', 'Architectural Viz', 'NFT & Digital Art'],
    accent: 'cyan' as const,
  },
  {
    number: '05',
    title: 'Strategy',
    tagline: 'Direction with intention',
    description: '[Full description of Strategy services. Include brand positioning, market research, creative strategy, and campaign planning. Content to be provided.]',
    deliverables: ['Brand Positioning', 'Market Research', 'Creative Strategy', 'Campaign Planning', 'Competitive Analysis'],
    accent: 'violet' as const,
  },
  {
    number: '06',
    title: 'Creative Direction',
    tagline: 'Vision, unified and precise',
    description: '[Full description of Creative Direction services. Include art direction, campaign oversight, cross-channel consistency, and talent coordination. Content to be provided.]',
    deliverables: ['Art Direction', 'Campaign Oversight', 'Cross-channel Strategy', 'Talent Coordination', 'Brand Governance'],
    accent: 'cyan' as const,
  },
]

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-page-hero]',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3 },
      )

      const cards = gsap.utils.toArray<HTMLElement>('[data-service-item]')
      cards.forEach((card) => {
        gsap.fromTo(card, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        })
      })
    },
    { scope: pageRef },
  )

  return (
    <div ref={pageRef} className="bg-void text-on-surface min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-section px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan/8 blur-[160px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto">
          <div data-page-hero className="mb-6">
            <SectionLabel>What We Do</SectionLabel>
          </div>
          <h1 data-page-hero className="text-[clamp(3rem,7vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl mb-6">
            Services Built for <span className="text-gradient">Ambitious Brands</span>
          </h1>
          <p data-page-hero className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            We offer a full spectrum of creative and strategic services — each designed to work independently or as part of an integrated engagement.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-section px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
          {services.map((service) => (
            <div
              key={service.number}
              data-service-item
              className="glass-card p-8 md:p-12 group hover:border-violet/30 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`text-label-sm font-bold ${service.accent === 'violet' ? 'text-violet-light' : 'text-cyan-light'}`}>
                      {service.number}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-outline-variant to-transparent" />
                  </div>
                  <h2 className="text-headline font-bold text-white mb-2 group-hover:text-gradient transition-all">
                    {service.title}
                  </h2>
                  <p className={`text-label-bold italic ${service.accent === 'violet' ? 'text-violet-light' : 'text-cyan-light'}`}>
                    {service.tagline}
                  </p>
                </div>

                {/* Middle */}
                <div className="lg:col-span-1">
                  <p className="text-body-md text-on-surface-variant leading-relaxed">{service.description}</p>
                </div>

                {/* Right — deliverables */}
                <div>
                  <p className="text-label-bold uppercase tracking-widest text-on-surface-variant mb-4">Deliverables</p>
                  <ul className="flex flex-col gap-2">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-body-md text-on-surface">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${service.accent === 'violet' ? 'bg-violet-light' : 'bg-cyan-light'}`} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-section px-8 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[clamp(2rem,4vw,48px)] font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-8">
            Tell us about your project and we'll match you with the right services.
          </p>
          <GradientButton href="/contact">Start a Project</GradientButton>
        </div>
      </section>

      <Footer />
    </div>
  )
}

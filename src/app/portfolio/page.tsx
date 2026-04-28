'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GradientButton } from '@/components/ui/GradientButton'

const categories = ['All', 'Campaign', 'Identity', 'Web Experience', '3D / Motion', 'Strategy']

const projects = [
  { id: 1, title: 'Empower 2025', category: 'Campaign', year: '2025', description: 'A brand campaign that redefined the energy sector\'s visual language across 12 markets.', accent: '#7c3aed', bg: 'from-violet/50' },
  { id: 2, title: 'Brand Rebirth', category: 'Identity', year: '2024', description: 'Complete visual identity transformation for a heritage luxury house entering digital.', accent: '#06b6d4', bg: 'from-cyan/50' },
  { id: 3, title: 'Digital Realm', category: 'Web Experience', year: '2024', description: 'An award-winning interactive web experience with WebGL and spatial audio.', accent: '#a78bfa', bg: 'from-violet/40 via-cyan/30' },
  { id: 4, title: 'Matter & Light', category: '3D / Motion', year: '2024', description: 'A 3D product visualization campaign reaching 40M impressions in its first week.', accent: '#06b6d4', bg: 'from-cyan/50' },
  { id: 5, title: 'The Long Game', category: 'Strategy', year: '2023', description: 'A five-year brand strategy that repositioned a challenger brand as a category leader.', accent: '#7c3aed', bg: 'from-violet/40' },
  { id: 6, title: '[Project 6]', category: 'Campaign', year: '2023', description: '[Description to be provided]', accent: '#4cd7f6', bg: 'from-cyan/40' },
  { id: 7, title: '[Project 7]', category: 'Identity', year: '2023', description: '[Description to be provided]', accent: '#d2bbff', bg: 'from-violet/30' },
  { id: 8, title: '[Project 8]', category: 'Web Experience', year: '2022', description: '[Description to be provided]', accent: '#7c3aed', bg: 'from-violet/50' },
]

export default function PortfolioPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All' ? projects : projects.filter((p) => p.category === activeFilter)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-page-hero]',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3 },
      )
    },
    { scope: pageRef },
  )

  // Re-animate grid on filter change
  const gridRef = useRef<HTMLDivElement>(null)
  const handleFilter = (cat: string) => {
    setActiveFilter(cat)
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll('[data-project-card]'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      )
    }
  }

  return (
    <div ref={pageRef} className="bg-void text-on-surface min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-section px-8 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-violet/8 blur-[160px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto">
          <div data-page-hero className="mb-6">
            <SectionLabel>Our Work</SectionLabel>
          </div>
          <h1 data-page-hero className="text-[clamp(3rem,7vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl mb-6">
            Work That <span className="text-gradient">Speaks</span>
          </h1>
          <p data-page-hero className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            A curated selection of projects that represent the depth and breadth of what we create — from brand systems to immersive digital experiences.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="px-8 mb-12">
        <div className="max-w-[1440px] mx-auto flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-5 py-2 rounded-pill text-label-bold uppercase tracking-widest transition-all duration-300 ${
                activeFilter === cat
                  ? 'gradient-pill text-white shadow-glow-violet-sm'
                  : 'glass border border-white/10 text-on-surface-variant hover:border-violet/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="px-8 pb-section">
        <div ref={gridRef} className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              data-project-card
              className="glass-card overflow-hidden group cursor-pointer hover:border-violet/30 transition-all duration-300 hover:shadow-glow-violet-sm"
            >
              {/* Image placeholder */}
              <div
                className="h-60 relative overflow-hidden"
                style={{
                  background: `radial-gradient(ellipse at 60% 40%, ${project.accent}44 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, ${project.accent}22 0%, transparent 60%), #131315`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[6rem] font-black text-white/5">
                    {String(project.id).padStart(2, '0')}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-label-bold uppercase tracking-widest text-white border border-white/30 rounded-pill px-5 py-2">
                    View Case Study
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 glass rounded-pill border border-white/8 text-label-sm uppercase tracking-widest text-on-surface-variant">
                    {project.category}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">{project.year}</span>
                </div>
                <h3 className="text-headline-md font-semibold text-white mb-2 group-hover:text-gradient transition-all">
                  {project.title}
                </h3>
                <p className="text-body-md text-on-surface-variant line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 text-center border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <h2 className="text-[clamp(2rem,4vw,48px)] font-bold text-white mb-4">
            Like what you see?
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-8">Let's create something just as remarkable for your brand.</p>
          <GradientButton href="/contact">Start a Project</GradientButton>
        </div>
      </section>

      <Footer />
    </div>
  )
}

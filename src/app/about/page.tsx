'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { GradientButton } from '@/components/ui/GradientButton'

const stats = [
  { value: 8, suffix: '+', label: 'Years of Excellence' },
  { value: 200, suffix: '+', label: 'Projects Delivered' },
  { value: 45, suffix: '+', label: 'Brands Elevated' },
  { value: 3, suffix: '', label: 'Continents' },
]

const values = [
  { title: 'Craft First', description: 'We believe execution is strategy. The smallest detail carries the biggest message.' },
  { title: 'Radical Honesty', description: 'We tell clients what they need to hear, not what they want to hear. Truth builds better brands.' },
  { title: 'Creative Courage', description: 'The expected is forgettable. We push into uncomfortable creative territory — because that\'s where great work lives.' },
  { title: 'Long-Term Thinking', description: 'We optimize for legacy, not the news cycle. Great brands are built to outlast trends.' },
]

const team = [
  { name: 'Mohammed Al-Rashidi', role: 'Creative Director', gradient: 'from-violet to-violet/20' },
  { name: '[Team Member]', role: 'Brand Strategist', gradient: 'from-cyan to-cyan/20' },
  { name: '[Team Member]', role: 'Motion Designer', gradient: 'from-violet to-cyan/30' },
  { name: '[Team Member]', role: 'Web Developer', gradient: 'from-cyan/80 to-violet/20' },
]

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-about-hero-text]',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3,
          scrollTrigger: { trigger: '[data-about-hero-text]', start: 'top 90%' },
        },
      )

      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      reveals.forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
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
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-violet/8 blur-[160px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-6" data-about-hero-text>
            <SectionLabel>About Brilliant Art</SectionLabel>
          </div>
          <h1
            data-about-hero-text
            className="text-[clamp(3rem,7vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-5xl mb-8"
          >
            We turn vision into{' '}
            <span className="text-gradient">creative power</span>
          </h1>
          <p data-about-hero-text className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Brilliant Art is a full-service creative agency built for brands that refuse to be ordinary. We blend strategic thinking with exceptional craft to create work that connects, inspires, and endures.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-8 border-y border-white/5">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} data-reveal className="text-center">
              <div className="text-[4rem] font-black leading-none text-gradient mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-label-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-section px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div data-reveal>
            <SectionLabel className="mb-6">Our Story</SectionLabel>
            <h2 className="text-[clamp(2rem,4vw,48px)] font-bold leading-[1.1] tracking-[-0.025em] text-white mb-6">
              Built on belief, refined by experience
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-4 leading-relaxed">
              [Full story content to be provided. This section will tell the origin story of Brilliant Art, the founding vision, and the journey to where the agency stands today.]
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              [Additional narrative about the agency&apos;s growth, key milestones, and philosophy toward client work and creative excellence.]
            </p>
          </div>

          {/* Values */}
          <div data-reveal className="grid grid-cols-1 gap-4">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-6 group hover:border-violet/30 transition-all duration-300">
                <h3 className="text-headline-md font-semibold text-white mb-2 group-hover:text-gradient transition-all">
                  {value.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-section px-8 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto">
          <div data-reveal className="text-center mb-16">
            <SectionLabel className="mb-4">The Team</SectionLabel>
            <h2 className="text-[clamp(2rem,4vw,48px)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
              The minds behind the work
            </h2>
          </div>

          <div data-reveal className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass-card p-6 text-center group hover:border-violet/30 transition-all duration-300">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} mx-auto mb-4 opacity-60`} />
                <h3 className="text-body-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section px-8 text-center">
        <div data-reveal className="max-w-2xl mx-auto">
          <h2 className="text-[clamp(2rem,4vw,48px)] font-bold text-white mb-4">
            Ready to create something <span className="text-gradient">extraordinary?</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-8">Let&apos;s start a conversation about your next project.</p>
          <GradientButton href="/contact">Start a Project</GradientButton>
        </div>
      </section>

      <Footer />
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GhostButton } from '@/components/ui/GhostButton'

interface Service {
  number: string
  title: string
  icon: string
  items: string[]
  accent: 'violet' | 'cyan'
}

const services: Service[] = [
  {
    number: '01',
    title: 'Web Solutions',
    icon: '◈',
    items: [
      'Websites Design & Development',
      'eCommerce Solutions',
      'UI/UX Design',
      'Mobile Web-Apps',
      'SEO Services',
    ],
    accent: 'violet',
  },
  {
    number: '02',
    title: 'Brand Development',
    icon: '◉',
    items: [
      'Brand Strategy',
      'Brand Identity',
      'Logo Creation',
      'Brand Guidelines',
      'Corporate Stationary',
    ],
    accent: 'cyan',
  },
  {
    number: '03',
    title: 'Digital Marketing',
    icon: '◍',
    items: [
      'Campaign Planning',
      'Media Planning',
      'Google Ads',
      'Social Media Marketing',
      'Content Marketing',
    ],
    accent: 'violet',
  },
  {
    number: '04',
    title: 'Video Production',
    icon: '◎',
    items: [
      'Short Film Making',
      'TV Commercials',
      'Motion Graphics',
      'Whiteboard Animation',
      'Storytelling',
    ],
    accent: 'cyan',
  },
  {
    number: '05',
    title: 'Photography',
    icon: '◐',
    items: [
      'Product Photography',
      'Personal Photography',
      'Corporate Photography',
      'Lifestyle Photography',
    ],
    accent: 'violet',
  },
  {
    number: '06',
    title: 'UX/UI Design',
    icon: '◑',
    items: [
      'UX/UI Design',
      'Prototyping',
      'UX Research',
      'Usability Testing',
    ],
    accent: 'cyan',
  },
  {
    number: '07',
    title: 'Content Writing',
    icon: '◒',
    items: [
      'Content Strategy',
      'Concept Development',
      'Copywriting',
      'Website Content',
      'SEO Content Writing',
    ],
    accent: 'violet',
  },
  {
    number: '08',
    title: 'Graphics Design',
    icon: '◓',
    items: [
      'Art Direction',
      'Visual Identity',
      'Packaging',
      'Campaigns',
      'Print Design',
    ],
    accent: 'cyan',
  },
]

// Duplicate the strip once — translateX(-50%) snaps back seamlessly
const strip = [...services, ...services]

interface CardProps {
  service: Service
}

function ServiceCard({ service }: CardProps) {
  const accentClass = service.accent === 'violet' ? 'text-violet-light' : 'text-cyan-light'
  const lineClass   = service.accent === 'violet'
    ? 'bg-gradient-to-r from-violet to-violet/0'
    : 'bg-gradient-to-r from-cyan to-cyan/0'
  const hoverBorder = service.accent === 'violet'
    ? 'hover:border-violet/30 hover:shadow-glow-violet-sm'
    : 'hover:border-cyan/30 hover:shadow-glow-cyan-sm'

  return (
    <div
      className={`
        glass-card flex-shrink-0 w-[340px] md:w-[400px] p-8
        group cursor-pointer transition-all duration-300
        ${hoverBorder}
      `}
    >
      {/* Number + icon row */}
      <div className="flex items-start justify-between mb-5">
        <span className="text-[2.2rem] leading-none opacity-60">{service.icon}</span>
        <span className={`text-label-sm font-bold ${accentClass}`}>{service.number}</span>
      </div>

      {/* Title */}
      <h3 className="text-headline-md font-semibold text-white mb-4 group-hover:text-gradient transition-all duration-300">
        {service.title}
      </h3>

      {/* Checklist */}
      <ul className="flex flex-col gap-2">
        {service.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-body-md text-on-surface-variant">
            <span className={`font-bold flex-shrink-0 mt-px ${accentClass}`}>✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Bottom accent line — grows on hover */}
      <div className={`mt-6 h-px w-0 group-hover:w-full transition-all duration-500 ${lineClass}`} />
    </div>
  )
}

export function ServicesTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const labelEl  = headerRef.current?.querySelector('[data-srv-label]')
      const titleEl  = headerRef.current?.querySelector('[data-srv-title]')
      const subEl    = headerRef.current?.querySelector('[data-srv-sub]')
      const buttonEl = headerRef.current?.querySelector('[data-srv-btn]')

      gsap.set([labelEl, titleEl, subEl, buttonEl], { autoAlpha: 0, y: 28 })

      gsap.to([labelEl, titleEl, subEl], {
        autoAlpha: 1, y: 0,
        duration: 0.85, stagger: 0.13, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })

      if (buttonEl) {
        gsap.to(buttonEl, {
          autoAlpha: 1, y: 0,
          duration: 0.75, ease: 'power2.out', delay: 0.30,
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        })
      }
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-section overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/6 blur-[160px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/3 w-[400px] h-[400px] rounded-full bg-violet/5 blur-[140px] pointer-events-none" />

      {/* Header — constrained */}
      <div className="max-w-[1440px] mx-auto px-8 mb-14">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <div data-srv-label className="mb-4 inline-block">
              <SectionLabel>Our Services</SectionLabel>
            </div>
            <h2 data-srv-title className="text-[clamp(2.2rem,4.5vw,56px)] font-bold leading-[1.1] tracking-[-0.025em] text-white mb-4">
              What We Create
            </h2>
            <p data-srv-sub className="text-body-lg text-on-surface-variant leading-relaxed">
              Comprehensive digital solutions to strengthen your brand — from idea to reality.
            </p>
          </div>
          <div data-srv-btn className="inline-block flex-shrink-0">
            <GhostButton href="/services">Explore Services</GhostButton>
          </div>
        </div>
      </div>

      {/* ── Infinite card sliders — full bleed ── */}
      <div className="svc-scroll-mask overflow-hidden w-full flex flex-col gap-5">
        <div className="svc-scroll-left flex gap-5 w-max px-5">
          {strip.map((service, i) => (
            <ServiceCard key={`a-${service.number}-${i}`} service={service} />
          ))}
        </div>
        <div className="svc-scroll-right flex gap-5 w-max px-5">
          {strip.map((service, i) => (
            <ServiceCard key={`b-${service.number}-${i}`} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

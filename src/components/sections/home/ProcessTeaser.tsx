'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { SectionLabel } from '@/components/ui/SectionLabel'

const steps = [
  { number: '01', title: 'Strategy & Research', description: 'We immerse ourselves in your world — your market, your competitors, your ambitions. Deep research lays the foundation for every decision we make.', side: 'left' },
  { number: '02', title: 'Creative Definition', description: 'Insight becomes direction. We shape the creative brief, define the narrative, and establish the visual territories that will set you apart.', side: 'right' },
  { number: '03', title: 'Design & Production', description: 'The craft phase. Every pixel, every frame, every interaction is considered and refined until excellence is the only acceptable standard.', side: 'left' },
  { number: '04', title: 'Evaluation & Reach', description: 'We launch, measure, and grow together. Performance is tracked, results are evaluated, and every insight feeds the next iteration forward.', side: 'right' },
]

// Timeline positions where each step starts appearing.
// Chosen so each card begins revealing just as the spine tip reaches its dot.
const STEP_OFFSETS = [0.06, 0.30, 0.54, 0.78] as const
const CARD_DURATION  = 0.18
const DOT_DURATION   = 0.07
const LINE_DURATION  = 0.12

export function ProcessTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const stepsRef   = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      // ── Header: one-shot reveal (stays visible once seen) ─────────────────
      const labelEl   = headerRef.current?.querySelector('[data-ph-label]')
      const titleEl   = headerRef.current?.querySelector('[data-ph-title]')
      const subEl     = headerRef.current?.querySelector('[data-ph-sub]')

      gsap.set([labelEl, titleEl, subEl], { autoAlpha: 0, y: 30 })
      gsap.to([labelEl, titleEl, subEl], {
        autoAlpha: 1, y: 0,
        duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })

      // ── Collect elements ───────────────────────────────────────────────────
      const spine   = section.querySelector<HTMLElement>('[data-spine]')
      const spineTip = section.querySelector<HTMLElement>('[data-spine-tip]')
      const rows    = gsap.utils.toArray<HTMLElement>('[data-step-row]', section)

      if (!spine || !rows.length) return

      type StepEls = {
        card: Element | null
        dot:  Element | null
        num:  Element | null
        line: Element | null
        xDir: number           // -1 = slide from left, +1 = slide from right
      }
      const els: StepEls[] = rows.map(row => ({
        card: row.querySelector('[data-step-card]'),
        dot:  row.querySelector('[data-step-dot]'),
        num:  row.querySelector('[data-step-num]'),
        line: row.querySelector('[data-step-line]'),
        xDir: row.dataset.side === 'left' ? -1 : 1,
      }))

      // ── Set initial states ─────────────────────────────────────────────────
      gsap.set(spine,    { scaleY: 0, transformOrigin: 'top center' })

      // Spine tip starts at top of the container
      const containerH = stepsRef.current?.offsetHeight ?? 0
      if (spineTip) gsap.set(spineTip, { y: 0, autoAlpha: 0 })

      els.forEach(({ card, dot, num, line, xDir }) => {
        gsap.set(card, { autoAlpha: 0, x: xDir * -72, scale: 0.93 })
        gsap.set(dot,  { autoAlpha: 0, scale: 0 })
        gsap.set([num].filter(Boolean),  { autoAlpha: 0 })
        if (line) {
          gsap.set(line, { autoAlpha: 1, scaleX: 0, transformOrigin: 'left center' })
        }
      })

      // ── Master timeline ────────────────────────────────────────────────────
      const tl = gsap.timeline()

      // 1. Spine draws from top to bottom (linear, full duration)
      tl.to(spine, { scaleY: 1, ease: 'none', duration: 1 }, 0)

      // 2. Glowing tip travels with the spine's drawing edge
      if (spineTip) {
        tl.to(spineTip, { autoAlpha: 1, duration: 0.01 }, 0)
        tl.to(spineTip, { y: containerH - 10, ease: 'none', duration: 1 }, 0)
        // Tip fades out at the very end (line fully drawn)
        tl.to(spineTip, { autoAlpha: 0, duration: 0.04 }, 0.96)
      }

      // 3. Each step appears in sequence, keyed to the spine position
      els.forEach(({ card, dot, num, line }, i) => {
        const t = STEP_OFFSETS[i]

        // Dot pops in with a back-out bounce
        tl.to(dot, {
          autoAlpha: 1, scale: 1,
          ease: 'back.out(2.8)', duration: DOT_DURATION,
        }, t)

        // Card slides in from its side
        tl.to(card, {
          autoAlpha: 1, x: 0, scale: 1,
          ease: 'power3.out', duration: CARD_DURATION,
        }, t + 0.02)

        // Step number fades in
        tl.to(num ?? [], {
          autoAlpha: 1, ease: 'none', duration: 0.06,
        }, t + 0.04)

        // Separator line grows from left to right
        if (line) {
          tl.to(line, {
            scaleX: 1, ease: 'power2.out', duration: LINE_DURATION,
          }, t + 0.06)
        }
      })

      // ── Attach timeline to scroll ──────────────────────────────────────────
      ScrollTrigger.create({
        trigger: stepsRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.4,
        animation: tl,
        invalidateOnRefresh: true,
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-section px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container/20 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div data-ph-label className="flex justify-center mb-6">
            <SectionLabel>Our Process</SectionLabel>
          </div>
          <h2 data-ph-title className="text-[clamp(2.2rem,4.5vw,56px)] font-bold leading-[1.1] tracking-[-0.025em] text-white mb-4">
            How We Create
          </h2>
          <p data-ph-sub className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            A disciplined creative process that leaves nothing to chance and everything to craft.
          </p>
        </div>

        {/* Timeline */}
        <div ref={stepsRef} className="relative max-w-4xl mx-auto">

          {/* Spine line — scaleY animated by scroll */}
          <div
            data-spine
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #7c3aed, #06b6d4, #7c3aed)', willChange: 'transform' }}
          />

          {/* Glowing tip — travels with the drawing edge of the spine */}
          <div
            data-spine-tip
            className="absolute left-1/2 hidden md:block pointer-events-none z-20"
            style={{ top: 0, transform: 'translateX(-50%)' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: 'radial-gradient(circle at 40% 35%, #d2bbff, #7c3aed)',
                boxShadow: '0 0 10px 4px rgba(124,58,237,0.75), 0 0 4px 2px rgba(6,182,212,0.5)',
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-16">
            {steps.map((step) => (
              <div
                key={step.number}
                data-step-row
                data-side={step.side}
                className={`relative flex items-center gap-8 flex-col ${
                  step.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                {/* Card */}
                <div
                  data-step-card
                  className="flex-1 glass-card p-8 group hover:border-violet/30 transition-colors duration-300"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span data-step-num className="text-label-sm font-bold text-violet-light">
                      {step.number}
                    </span>
                    {/* Separator line — scaleX animated by scroll */}
                    <div
                      data-step-line
                      className="flex-1 h-px bg-gradient-to-r from-violet/50 to-transparent"
                    />
                  </div>
                  <h3 className="text-headline-md font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">{step.description}</p>
                </div>

                {/* Spine dot */}
                <div
                  data-step-dot
                  className="hidden md:flex items-center justify-center w-12 h-12 flex-shrink-0 rounded-full bg-[#131315] border border-violet/40 z-10 relative"
                  style={{ boxShadow: '0 0 20px 4px rgba(124,58,237,0.25)' }}
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet to-cyan" />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

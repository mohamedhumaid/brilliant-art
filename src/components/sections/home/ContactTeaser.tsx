'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { GradientButton } from '@/components/ui/GradientButton'
import { GhostButton } from '@/components/ui/GhostButton'

export function ContactTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const card    = cardRef.current
      if (!section || !card) return

      const labelEl   = card.querySelector('[data-ct-label]')
      const line1El   = card.querySelector('[data-ct-line1]')
      const line2El   = card.querySelector('[data-ct-line2]')
      const bodyEl    = card.querySelector('[data-ct-body]')
      const btnsEl    = card.querySelector('[data-ct-btns]')

      // Card lands from below with a slight scale-up
      gsap.set(card, { autoAlpha: 0, y: 80, scale: 0.93 })
      gsap.set([labelEl, line1El, line2El, bodyEl, btnsEl].filter(Boolean), { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
      })

      tl.to(card, {
          autoAlpha: 1, y: 0, scale: 1,
          duration: 1.1, ease: 'power3.out',
        })
        .to(labelEl ?? [], {
          autoAlpha: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
        }, '-=0.6')
        .to(line1El ?? [], {
          autoAlpha: 1, y: 0,
          duration: 0.75, ease: 'power3.out',
        }, '-=0.45')
        .to(line2El ?? [], {
          autoAlpha: 1, y: 0,
          duration: 0.75, ease: 'power3.out',
        }, '-=0.55')
        .to(bodyEl ?? [], {
          autoAlpha: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
        }, '-=0.45')
        .to(btnsEl ?? [], {
          autoAlpha: 1, y: 0,
          duration: 0.6, ease: 'back.out(1.4)',
        }, '-=0.35')
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-section px-8 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet/10 blur-[140px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto">
        <div
          ref={cardRef}
          className="glass-card p-12 md:p-20 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          {/* Inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-violet/15 blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <p data-ct-label className="text-label-bold uppercase tracking-widest text-violet-light mb-6">
              Let&apos;s Turn Ideas Into Results
            </p>

            <h2 className="text-[clamp(2.5rem,6vw,72px)] font-bold leading-[1.0] tracking-[-0.03em] text-white mb-6">
              <span data-ct-line1 className="block">Have a project in mind?</span>
              <span data-ct-line2 className="block text-gradient">Let&apos;s work together.</span>
            </h2>

            <p data-ct-body className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10">
              Whether you&apos;re building a brand, launching a product, or entering new markets — we
              blend creativity, code, and content to make it happen.
            </p>

            <div data-ct-btns className="flex flex-wrap items-center justify-center gap-4">
              <GradientButton href="/contact">Start a Project</GradientButton>
              <GhostButton href="mailto:hello@brilliantart.com">Say Hello</GhostButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

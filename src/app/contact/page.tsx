'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { GradientButton } from '@/components/ui/GradientButton'

const contactInfo = [
  {
    label: 'Email',
    value: 'hello@brilliantart.com',
    href: 'mailto:hello@brilliantart.com',
    icon: '✉',
  },
  {
    label: 'Phone',
    value: '+[Phone Number]',
    href: 'tel:+1234567890',
    icon: '☎',
  },
  {
    label: 'Location',
    value: '[City, Country]',
    href: '#',
    icon: '◎',
  },
]

const socials = [
  { label: 'Instagram', href: '#', handle: '@brilliantart' },
  { label: 'Behance', href: '#', handle: 'Brilliant Art' },
  { label: 'LinkedIn', href: '#', handle: 'Brilliant Art Agency' },
]

const services = [
  'Brand Identity',
  'Motion Design',
  'Web Experience',
  '3D & Immersive',
  'Strategy',
  'Creative Direction',
  'Other',
]

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({ name: '', email: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-page-hero]',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.3 },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: connect to backend / Formspree / email service
    setSubmitted(true)
  }

  return (
    <div ref={pageRef} className="bg-void text-on-surface min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet/8 blur-[160px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto">
          <div data-page-hero className="mb-6">
            <SectionLabel>Get In Touch</SectionLabel>
          </div>
          <h1 data-page-hero className="text-[clamp(3rem,7vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl mb-6">
            Let&apos;s Build Something <span className="text-gradient">Extraordinary</span>
          </h1>
          <p data-page-hero className="text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            Tell us about your vision. We typically respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-section px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Left — Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Contact details */}
            <div data-reveal className="glass-card p-8">
              <h2 className="text-headline-md font-semibold text-white mb-6">Contact Information</h2>
              <div className="flex flex-col gap-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 group"
                  >
                    <span className="text-2xl leading-none mt-1 opacity-70">{info.icon}</span>
                    <div>
                      <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">{info.label}</p>
                      <p className="text-body-md text-white group-hover:text-gradient transition-all">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div data-reveal className="glass-card p-8">
              <h2 className="text-headline-md font-semibold text-white mb-6">Follow Our Work</h2>
              <div className="flex flex-col gap-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group py-2 border-b border-white/5 last:border-0"
                  >
                    <span className="text-body-md text-white">{social.label}</span>
                    <span className="text-label-sm text-on-surface-variant group-hover:text-violet-light transition-colors">
                      {social.handle} →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div data-reveal className="lg:col-span-3">
            {submitted ? (
              <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-full gradient-pill flex items-center justify-center text-2xl">✓</div>
                <h2 className="text-headline-md font-semibold text-white">Message Sent!</h2>
                <p className="text-body-md text-on-surface-variant">
                  Thank you for reaching out. We&apos;ll be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-label-bold uppercase tracking-widest text-violet-light hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 flex flex-col gap-6">
                <h2 className="text-headline-md font-semibold text-white">Tell Us About Your Project</h2>

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-bold uppercase tracking-widest text-on-surface-variant">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-5 py-4 rounded-card bg-black/40 border border-white/10 text-body-md text-white placeholder-on-surface-variant outline-none focus:border-cyan transition-colors duration-200 focus:shadow-glow-cyan-sm"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-bold uppercase tracking-widest text-on-surface-variant">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="hello@yourcompany.com"
                    className="w-full px-5 py-4 rounded-card bg-black/40 border border-white/10 text-body-md text-white placeholder-on-surface-variant outline-none focus:border-cyan transition-colors duration-200 focus:shadow-glow-cyan-sm"
                  />
                </div>

                {/* Service */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-bold uppercase tracking-widest text-on-surface-variant">
                    Service Interest
                  </label>
                  <select
                    value={formState.service}
                    onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                    className="w-full px-5 py-4 rounded-card bg-black/40 border border-white/10 text-body-md text-white outline-none focus:border-cyan transition-colors duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-surface">Select a service...</option>
                    {services.map((s) => (
                      <option key={s} value={s} className="bg-surface">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-bold uppercase tracking-widest text-on-surface-variant">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="w-full px-5 py-4 rounded-card bg-black/40 border border-white/10 text-body-md text-white placeholder-on-surface-variant outline-none focus:border-cyan transition-colors duration-200 resize-none focus:shadow-glow-cyan-sm"
                  />
                </div>

                <GradientButton type="submit" className="w-full justify-center">
                  Send Message
                </GradientButton>

                <p className="text-label-sm text-on-surface-variant text-center">
                  We&apos;ll respond within 24 hours. Your information is kept confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

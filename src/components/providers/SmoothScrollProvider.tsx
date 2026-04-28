'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    // Drive Lenis from GSAP's ticker — one shared RAF loop, no jank
    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    // Tell ScrollTrigger to recalculate on every Lenis scroll tick.
    // Lenis updates window.scrollY natively, so no scrollerProxy needed —
    // GSAP reads the real scroll position and triggers fire correctly.
    lenis.on('scroll', ScrollTrigger.update)

    // Refresh trigger positions after the first paint
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      // DO NOT kill all ScrollTriggers here — each component cleans up its own
    }
  }, [])

  return <>{children}</>
}

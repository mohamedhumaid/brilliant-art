'use client'

import { useEffect, useRef } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { InfiniteSlider } from '@/components/ui/InfiniteSlider'

const LOGOS = [
  'Brilliant-Art-Clients-06-rdma5kki1fwesdl6ys8kh7dh7s0w6kkn5dq7k67gg4.webp',
  'Brilliant-Art-Clients-07-rdma5mg6f3yzflignt1tm6weejrmlys3tn16iq4o3o.webp',
  'Brilliant-Art-Clients-08-rdmad2c6iw5pcgpc7iuhutarpd38jpblugykal3guc.webp',
  'Brilliant-Art-Clients-13-rdma5p9ozm2uefed7c9pbo6s6pdq923au0zmyk0hl0.webp',
  'Brilliant-Art-Clients-16-rdmadcoem2juw6abj5be48ou8lo9wdgnjw4wkmo4xw.webp',
  'Brilliant-Art-Clients-18-rdmadek2zqmfje7l864n987rfdf0bro485fvj6lclg.webp',
  'Brilliant-Art-Clients-20-rdma5uwq4makc366aepgqmrjr0lxj8pouswju7s4jo.webp',
  'Brilliant-Art-Clients-22-rdma5wseiad4zb3fzfipvmagxscnymx5j27isrpc78.webp',
  'Brilliant-Art-Clients-24-rdmadj99xwsv5g0rgq5s3p12earue96rwspaxkedqc.webp',
]

export function PartnersMarquee() {
  const headerRef   = useRef<HTMLDivElement>(null)
  const animStarted = useRef(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animStarted.current) {
          animStarted.current = true
          header.style.transition = 'opacity 0.85s ease, transform 0.85s ease'
          header.style.opacity    = '1'
          header.style.transform  = 'translateY(0)'
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-section overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-violet/5 blur-[160px] pointer-events-none" />

      {/* Header */}
      <div
        ref={headerRef}
        className="text-center mb-14 px-8"
        style={{ opacity: 0, transform: 'translateY(28px)' }}
      >
        <div className="mb-4 inline-block">
          <SectionLabel>Trusted By</SectionLabel>
        </div>
        <h2 className="text-[clamp(2rem,4vw,52px)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
          Partners in Digital Brilliance
        </h2>
      </div>

      {/* Logo slider — single filter layer + fade mask on edges */}
      <div
        className="py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.75 }}
      >
        <InfiniteSlider gap={42} reverse speed={30}>
          {LOGOS.map((file) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={file}
              src={`/images/partners/${file}`}
              alt="partner logo"
              loading="lazy"
              draggable={false}
              className="pointer-events-none select-none h-12 md:h-16 w-auto"
            />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  )
}

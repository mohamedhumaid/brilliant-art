'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface InfiniteSliderProps {
  children: React.ReactNode
  gap?: number
  speed?: number
  speedOnHover?: number
  reverse?: boolean
  className?: string
}

export function InfiniteSlider({
  children,
  gap = 40,
  speed = 60,
  speedOnHover,
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const duration = `${speed}s`

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        ref={trackRef}
        className={cn(
          'flex w-max',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
        style={{ gap, animationDuration: duration }}
        onMouseEnter={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
        }}
        onMouseLeave={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
        }}
      >
        <div className="flex shrink-0 items-center" style={{ gap }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap }} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

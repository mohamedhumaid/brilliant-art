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

  const duration  = `${speed}s`
  const hoverDuration = speedOnHover ? `${speedOnHover}s` : undefined

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={
        hoverDuration
          ? ({ '--duration': duration, '--hover-duration': hoverDuration } as React.CSSProperties)
          : ({ '--duration': duration } as React.CSSProperties)
      }
    >
      <div
        ref={trackRef}
        className={cn(
          'flex w-max',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          hoverDuration && 'hover:[animation-duration:var(--hover-duration)]',
        )}
        style={{ gap, animationDuration: 'var(--duration)' }}
      >
        {/* Original + duplicate for seamless loop */}
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

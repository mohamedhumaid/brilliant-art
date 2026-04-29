'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardItem {
  id: string | number
  title: string
  description: string
  imgSrc?: string        // optional — falls back to accent gradient
  accent?: string        // brand accent color for gradient / icon tint
  icon: React.ReactNode
  linkHref?: string
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[]
  defaultActiveIndex?: number
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex)
    const [isDesktop, setIsDesktop] = React.useState(false)

    React.useEffect(() => {
      let timer: ReturnType<typeof setTimeout>
      const handleResize = () => {
        clearTimeout(timer)
        timer = setTimeout(() => setIsDesktop(window.innerWidth >= 768), 100)
      }
      setIsDesktop(window.innerWidth >= 768)
      window.addEventListener('resize', handleResize)
      return () => { window.removeEventListener('resize', handleResize); clearTimeout(timer) }
    }, [])

    const gridStyle = React.useMemo(() => {
      if (activeIndex === null) return {}
      if (isDesktop) {
        const columns = items.map((_, i) => (i === activeIndex ? '5fr' : '1fr')).join(' ')
        return { gridTemplateColumns: columns }
      } else {
        const rows = items.map((_, i) => (i === activeIndex ? '5fr' : '1fr')).join(' ')
        return { gridTemplateRows: rows }
      }
    }, [activeIndex, items.length, isDesktop])

    return (
      <ul
        className={cn(
          'w-full gap-2',
          'grid',
          'h-[680px] md:h-[540px]',
          'transition-[grid-template-columns,grid-template-rows] duration-300 ease-out',
          className,
        )}
        style={{
          ...gridStyle,
          ...(isDesktop ? { gridTemplateRows: '1fr' } : { gridTemplateColumns: '1fr' }),
          contain: 'layout paint',
        }}
        ref={ref}
        {...props}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-xl',
              'border border-white/10',
              'md:min-w-[72px] min-h-0 min-w-0',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet/60',
            )}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            tabIndex={0}
            data-active={activeIndex === index}
          >
            {/* Background: real image or accent gradient */}
            {item.imgSrc ? (
              <img
                src={item.imgSrc}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-data-[active=true]:scale-100 scale-110"
              />
            ) : (
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 40% 35%, ${item.accent ?? '#7c3aed'}55 0%, transparent 65%), #0e0e10`,
                }}
              />
            )}

            {/* Darkening gradient — stronger at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            <article className="absolute inset-0 flex flex-col justify-end gap-2 p-5">
              {/* Collapsed label — visible only on desktop when NOT active */}
              <h3 className="hidden origin-left rotate-90 text-[11px] font-medium uppercase tracking-[0.14em] text-white/55 opacity-100 transition-all duration-300 ease-out md:block group-data-[active=true]:opacity-0 whitespace-nowrap mb-2">
                {item.title}
              </h3>

              {/* Active: icon */}
              <div
                className="opacity-0 transition-all duration-300 delay-75 ease-out group-data-[active=true]:opacity-100"
                style={{ color: item.accent ?? '#d2bbff' }}
              >
                {item.icon}
              </div>

              {/* Active: title */}
              <h3 className="text-xl font-bold text-white opacity-0 transition-all duration-300 delay-150 ease-out group-data-[active=true]:opacity-100 leading-tight">
                {item.title}
              </h3>

              {/* Active: description */}
              <p className="w-full max-w-xs text-sm text-white/70 opacity-0 transition-all duration-300 delay-[225ms] ease-out group-data-[active=true]:opacity-100 leading-relaxed">
                {item.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    )
  },
)
ExpandingCards.displayName = 'ExpandingCards'

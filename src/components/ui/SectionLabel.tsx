import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-1.5',
        'glass rounded-pill border border-violet/30',
        'text-label-sm uppercase tracking-widest text-violet-light',
        className,
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-violet-light inline-block" />
      {children}
    </span>
  )
}

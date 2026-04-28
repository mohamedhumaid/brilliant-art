import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  glow?: 'violet' | 'cyan' | 'none'
  className?: string
}

export function GlassCard({ children, glow = 'none', className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card',
        glow === 'violet' && 'shadow-glow-violet',
        glow === 'cyan' && 'shadow-glow-cyan',
        className,
      )}
    >
      {children}
    </div>
  )
}

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface GhostButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

export function GhostButton({ children, href, onClick, className, type = 'button' }: GhostButtonProps) {
  const baseClass = cn(
    'inline-flex items-center justify-center gap-2',
    'border border-white/20 rounded-pill px-8 py-4',
    'bg-white/5 backdrop-blur-glass',
    'text-label-bold uppercase tracking-widest text-white/90',
    'transition-all duration-300 hover:bg-white/10 hover:border-white/30 active:scale-95',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={baseClass}>
      {children}
    </button>
  )
}

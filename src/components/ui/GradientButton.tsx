import Link from 'next/link'
import { cn } from '@/lib/utils'

interface GradientButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

export function GradientButton({ children, href, onClick, className, type = 'button' }: GradientButtonProps) {
  const baseClass = cn(
    'inline-flex items-center justify-center gap-2',
    'gradient-pill rounded-pill px-8 py-4',
    'text-label-bold uppercase tracking-widest text-white',
    'transition-all duration-300 hover:brightness-110 hover:shadow-glow-violet-sm active:scale-95',
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

import { cn } from '@/lib/utils'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'relative bg-[var(--color-bg-card)] rounded-2xl border border-[var(--color-border-primary)] shadow-[0_1px_2px_rgba(44,32,19,0.05),0_14px_34px_-22px_rgba(44,32,19,0.45)] transition-all duration-300',
        hover && 'hover:shadow-[0_22px_50px_-24px_rgba(47,125,91,0.5)] hover:border-primary-500/30 hover:-translate-y-1 cursor-pointer',
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-heading-md font-semibold text-slate-900 dark:text-slate-100', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-body-sm text-slate-500 dark:text-slate-400 mt-1', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2', className)}>{children}</div>
}
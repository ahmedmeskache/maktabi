import { cn } from '@/lib/utils'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  dot?: boolean
}

export function Badge({ children, variant = 'neutral', size = 'md', className, dot = false }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-body-xs gap-1',
    md: 'px-2.5 py-0.5 text-body-xs gap-1.5',
    lg: 'px-3 py-1 text-body-sm gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variants[variant].replace('bg-', 'bg-').replace('text-', 'bg-'))} />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, BadgeProps['variant']> = {
    active: 'success',
    returned: 'neutral',
    overdue: 'danger',
    lost: 'danger',
    pending: 'warning',
    ready: 'info',
    cancelled: 'neutral',
    completed: 'success',
    expired: 'danger',
    suspended: 'warning',
    available: 'success',
    borrowed: 'warning',
    reserved: 'info',
    maintenance: 'neutral',
  }

  return <Badge variant={statusMap[status] || 'neutral'} dot>{status}</Badge>
}
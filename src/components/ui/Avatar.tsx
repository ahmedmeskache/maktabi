import React from 'react'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

export interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  className?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  statusPosition?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left'
}

const sizes: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-body-xs',
  sm: 'w-8 h-8 text-body-sm',
  md: 'w-10 h-10 text-body-md',
  lg: 'w-12 h-12 text-body-lg',
  xl: 'w-16 h-16 text-heading-sm',
  '2xl': 'w-24 h-24 text-heading-md',
}

export function Avatar({ src, alt, name, size = 'md', shape = 'circle', className, status, statusPosition = 'bottom-right' }: AvatarProps) {
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  }

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  const statusPosClasses = {
    'bottom-right': 'bottom-0 right-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-left': 'top-0 left-0',
  }

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(sizes[size], shapeClass, 'object-cover ring-2 ring-white dark:ring-slate-800')}
        />
      ) : (
        <div
          className={cn(
            sizes[size],
            shapeClass,
            'bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center font-medium text-brand-700 dark:text-brand-400 ring-2 ring-white dark:ring-slate-800'
          )}
          aria-label={name || 'User avatar'}
        >
          {name ? getInitials(name.split(' ')[0], name.split(' ')[1] || '') : '?'}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-white dark:border-slate-800',
            statusColors[status],
            statusSizes[size],
            statusPosClasses[statusPosition]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}

export function AvatarGroup({ children, max = 5, className, size = 'md' }: { children: React.ReactNode; max?: number; className?: string; size?: AvatarProps['size'] }) {
  const kids = React.Children.toArray(children)
  const visible = kids.slice(0, max)
  const remaining = kids.length - max

  return (
    <div className={cn('flex -space-x-2', className)} aria-label={`${kids.length} people`}>
      {visible.map((child, index) =>
        React.cloneElement(child as React.ReactElement, {
          key: index,
          size,
          className: cn('ring-2 ring-white dark:ring-slate-800', (child as React.ReactElement).props.className),
        })
      )}
      {remaining > 0 && (
        <div
          className={cn(sizes[size], 'rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-medium text-slate-600 dark:text-slate-400 ring-2 ring-white dark:ring-slate-800')}
          aria-label={`${remaining} more people`}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
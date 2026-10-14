import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Bell, Clock, CheckCheck, Trash2, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n'

interface AppNotification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
}

export function Notifications() {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<AppNotification[]>(() => [
    { id: 1, title: t('misc.notifications.overdue.title'), message: t('misc.notifications.overdue.message', { title: 'Le Petit Prince' }), time: t('misc.notifications.overdue.time'), read: false },
    { id: 2, title: t('misc.notifications.member.title'), message: t('misc.notifications.member.message', { name: 'Marie Dubois' }), time: t('misc.notifications.member.time'), read: false },
    { id: 3, title: t('misc.notifications.reservation.title'), message: t('misc.notifications.reservation.message', { title: '1984', name: 'Jean Martin' }), time: t('misc.notifications.reservation.time'), read: true },
    { id: 4, title: t('misc.notifications.fine.title'), message: t('misc.notifications.fine.message', { name: 'Luc Bernard' }), time: t('misc.notifications.fine.time'), read: true },
  ])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unread = notifications.filter((n) => !n.read).length
  const visible = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success(t('misc.notifications.allRead'))
  }

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const remove = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('misc.notifications.title')}</h1>
          <p className="text-body-md text-[var(--color-text-secondary)] mt-1">
            {unread > 0
              ? (unread > 1 ? t('misc.notifications.unreadCountPlural', { count: unread }) : t('misc.notifications.unreadCount', { count: unread }))
              : t('misc.notifications.upToDate')}
          </p>
        </div>
        <Button variant="outline" onClick={markAllRead} disabled={unread === 0}>
          <CheckCheck className="w-4 h-4 ms-1" /> {t('misc.notifications.markAllRead')}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {([['all', t('misc.notifications.filterAll')], ['unread', t('misc.notifications.filterUnread')]] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              'px-4 py-2 rounded-xl text-body-sm font-medium transition-colors',
              filter === value
                ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card padding="none">
          {visible.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-10 h-12 mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-[var(--color-text-secondary)]">{t('misc.notifications.empty')}</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border-primary)]">
              {visible.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-[var(--color-bg-tertiary)]/60',
                    !n.read && 'bg-primary-500/5'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', n.read ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]' : 'bg-primary-500/10 text-primary-500')}>
                    {n.read ? <Check className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-[var(--color-text-primary)]', !n.read && 'font-semibold')}>{n.title}</p>
                    <p className="text-body-sm text-[var(--color-text-secondary)] mt-0.5">{n.message}</p>
                    <p className="text-body-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-primary-500 hover:bg-[var(--color-bg-tertiary)] transition-colors" aria-label={t('misc.notifications.markRead')}>
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => remove(n.id)} className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-red-500 hover:bg-[var(--color-bg-tertiary)] transition-colors" aria-label={t('common.delete')}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {notifications.length === 0 && (
        <p className="text-center text-body-sm text-[var(--color-text-muted)] flex items-center justify-center gap-2">
          <Bell className="w-4 h-4" /> {t('misc.notifications.emptyAll')}
        </p>
      )}
    </div>
  )
}

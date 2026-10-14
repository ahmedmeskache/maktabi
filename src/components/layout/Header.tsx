import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import { useAuthStore } from '@/store/auth'
import { useTranslation, LANGUAGES, type Language } from '@/i18n'
import { Button } from '@/components/ui/Button'
import { Dropdown, UserMenu } from '@/components/ui/Dropdown'
import { Search, Bell, Sun, Moon, Command, Languages, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export function Header() {
  const { theme, setTheme, language, setLanguage } = useUIStore()
  const { t } = useTranslation()
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<{ id: number; key: string; read: boolean }[]>([
    { id: 1, key: 'overdue', read: false },
    { id: 2, key: 'member', read: false },
    { id: 3, key: 'reservation', read: true },
  ])
  const [, setShowProfile] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape') {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    setShowProfile(false)
    logout()
    toast.success(t('layout.logoutSuccess'))
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 bg-white/55 dark:bg-[#221b12]/55 backdrop-blur-2xl border-b border-[var(--color-border-primary)]/60">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1 min-w-0">
            <form className="relative hidden sm:block w-80 max-w-md" onSubmit={(e) => { e.preventDefault(); const q = searchQuery.trim(); navigate(q ? `/books?q=${encodeURIComponent(q)}` : '/books') }}>
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                placeholder={t('layout.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-16 py-2.5 bg-white/60 dark:bg-[#221b12]/50 backdrop-blur-md border border-[var(--color-border-primary)] rounded-full text-body-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 focus:bg-white dark:focus:bg-[#221b12] transition-all shadow-sm"
                aria-label={t('layout.searchAria')}
              />
              <kbd className="absolute end-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 text-body-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-full">
                <Command className="w-3 h-3" />
                <span>K</span>
              </kbd>
            </form>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm" aria-label={t('layout.switchLanguage')}>
                <Languages className="w-5 h-5" />
              </Button>
            }
            items={LANGUAGES.map((l) => ({ label: l.label, value: l.value }))}
            onSelect={(value) => setLanguage(value as Language)}
            selectedValue={language}
            align="right"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? t('layout.light') : t('layout.dark')}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={t('layout.notifications')}
              aria-expanded={showNotifications}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute end-0 mt-2 w-80 sm:w-96 bg-white/90 dark:bg-[#221b12]/90 backdrop-blur-2xl rounded-xl border border-[var(--color-border-primary)] shadow-xl overflow-hidden"
                  role="region"
                  aria-label={t('layout.notifications')}
                >
                  <div className="p-4 border-b border-[var(--color-border-primary)] flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{t('layout.notifications')}</h3>
                    {notifications.length > 0 && (
                      <Button variant="ghost" size="sm" className="text-body-xs" onClick={() => { setNotifications([]); toast.success(t('layout.allRead')) }}>{t('layout.markAllRead')}</Button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 && (
                      <p className="p-8 text-center text-body-sm text-[var(--color-text-muted)]">{t('layout.allRead')}</p>
                    )}
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))}
                        className={cn(
                          'p-4 border-b border-[var(--color-border-primary)]/60 hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer',
                          !notification.read && 'bg-brand-50/50 dark:bg-brand-900/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('w-2 h-2 mt-2 rounded-full flex-shrink-0', !notification.read ? 'bg-brand-500' : 'bg-transparent') } />
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-medium text-slate-900 dark:text-white', !notification.read && 'font-semibold')}>
                              {t(`demo.notif.${notification.key}.title`)}
                            </p>
                            <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">{t(`demo.notif.${notification.key}.message`)}</p>
                            <p className="text-body-xs text-slate-400 mt-1">{t(`demo.notif.${notification.key}.time`)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[var(--color-border-primary)] text-center">
                    <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-body-sm text-brand-600 dark:text-brand-400 hover:underline">
                      {t('layout.viewAllNotifications')}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <UserMenu
              user={{
                name: currentUser?.name ?? 'Maktabi',
                email: currentUser?.email ?? '',
                avatar: undefined,
              }}
              labels={{
                profile: t('layout.profile'),
                notifications: t('layout.notifications'),
                contact: t('layout.contact'),
                settings: t('layout.settingsMenu'),
                logout: t('layout.logout'),
              }}
              onProfile={() => { setShowProfile(false); navigate('/profile') }}
              onNotifications={() => { setShowProfile(false); navigate('/notifications') }}
              onContact={() => { setShowProfile(false); navigate('/contact') }}
              onSettings={() => { setShowProfile(false); navigate('/settings') }}
              onLogout={handleLogout}
            />
          </div>

          {currentUser && (
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label={t('layout.logout')} title={t('layout.logout')}>
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/ui/Dropdown'
import { Search, Bell, Sun, Moon, Command } from 'lucide-react'

export function Header() {
  const { theme, setTheme, toggleCommandPalette } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [, setShowProfile] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        toggleCommandPalette()
      }
      if (event.key === 'Escape') {
        setShowNotifications(false)
        setShowProfile(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleCommandPalette])

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

  const notifications = [
    { id: 1, title: 'Retour en retard', message: 'Le livre "Le Petit Prince" est en retard de 3 jours', time: 'Il y a 5 min', read: false },
    { id: 2, title: 'Nouveau membre', message: 'Marie Dubois s\'est inscrite', time: 'Il y a 1 heure', read: false },
    { id: 3, title: 'Reservation prête', message: '"1984" est disponible pour Jean Martin', time: 'Il y a 2 heures', read: true },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative hidden sm:block w-80 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Rechercher livres, adhérents... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-body-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              aria-label="Recherche globale"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 text-body-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            className="lg:hidden"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">3</span>
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden"
                  role="region"
                  aria-label="Notifications"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-body-xs">Tout marquer lu</Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors',
                          !notification.read && 'bg-brand-50/50 dark:bg-brand-900/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('w-2 h-2 mt-2 rounded-full flex-shrink-0', !notification.read ? 'bg-brand-500' : 'bg-transparent') } />
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-medium text-slate-900 dark:text-white', !notification.read && 'font-semibold')}>
                              {notification.title}
                            </p>
                            <p className="text-body-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">{notification.message}</p>
                            <p className="text-body-xs text-slate-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-center">
                    <Link to="/notifications" className="text-body-sm text-brand-600 dark:text-brand-400 hover:underline">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            className="hidden lg:flex"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <div className="relative" ref={profileRef}>
            <UserMenu
              user={{
                name: 'Bibliothécaire',
                email: 'admin@maktabi.fr',
                avatar: undefined,
              }}
              onProfile={() => { setShowProfile(false) }}
              onSettings={() => { setShowProfile(false) }}
              onLogout={() => { setShowProfile(false) }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
import { useState } from 'react'
import { Link, useLocation, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
import { useAuthStore } from '@/store/auth'
import { useTranslation } from '@/i18n'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookMarked,
  Tags,
  History,
  LogOut,
} from 'lucide-react'

const navigation = [
  { nameKey: 'nav.dashboard', href: '/', icon: LayoutDashboard, adminOnly: false },
  { nameKey: 'nav.books', href: '/books', icon: BookOpen, adminOnly: false },
  { nameKey: 'nav.members', href: '/members', icon: Users, adminOnly: false },
  { nameKey: 'nav.loans', href: '/loans', icon: Repeat, adminOnly: false },
  { nameKey: 'nav.stats', href: '/stats', icon: BarChart3, adminOnly: false },
  { nameKey: 'nav.categories', href: '/categories', icon: Tags, adminOnly: true },
  { nameKey: 'nav.users', href: '/users', icon: Users, adminOnly: true },
  { nameKey: 'nav.history', href: '/history', icon: History, adminOnly: true },
  { nameKey: 'nav.settings', href: '/settings', icon: Settings, adminOnly: false },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore()
  const { t } = useTranslation()
  const { currentUser, logout } = useAuthStore()
  const isAdmin = currentUser?.role === 'admin'
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar()
    } else {
      setCollapsed(!collapsed)
    }
  }

  const items = navigation.filter((item) => !item.adminOnly || isAdmin)

  return (
    <>
      <button
        className="lg:hidden fixed top-4 start-4 z-50 p-2 rounded-xl bg-white/80 dark:bg-[#221b12]/80 backdrop-blur-xl border border-[var(--color-border-primary)]/60 shadow-lg"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? t('layout.closeMenu') : t('layout.openMenu')}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence mode="wait">
        {sidebarOpen || window.innerWidth >= 1024 ? (
          <motion.aside
            initial={{ x: window.innerWidth < 1024 ? '-100%' : 0 }}
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth < 1024 ? '-100%' : 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed lg:relative inset-y-0 start-0 z-40 bg-white/55 dark:bg-[#221b12]/55 backdrop-blur-2xl border-e border-[var(--color-border-primary)]/60 transition-all duration-300 flex flex-col',
              collapsed ? 'w-20' : 'w-64',
              window.innerWidth < 1024 && !sidebarOpen ? '-translate-x-full rtl:translate-x-full' : 'translate-x-0'
            )}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--color-border-primary)]/60">
              <Link to="/" className="group flex items-center gap-2.5" aria-label="Maktabi">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-600/30 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                {!collapsed && <span className="font-display font-bold text-heading-sm bg-gradient-to-br from-brand-600 to-accent-600 dark:from-brand-300 dark:to-accent-300 bg-clip-text text-transparent">Maktabi</span>}
              </Link>
              <button
                onClick={handleToggle}
                className={cn(
                  'p-1.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                  collapsed && 'hidden lg:flex'
                )}
                aria-label={collapsed ? t('layout.expandSidebar') : t('layout.collapseSidebar')}
                aria-expanded={!collapsed}
              >
                {collapsed ? <ChevronRight className="w-5 h-5 rtl:rotate-180" /> : <ChevronLeft className="w-5 h-5 rtl:rotate-180" />}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label={t('layout.mainNav')}>
              {items.map((item) => {
                const label = t(item.nameKey)
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive: active }) => cn(
                      'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                      active
                        ? 'bg-gradient-to-r from-brand-500/15 to-transparent text-brand-700 dark:text-brand-300 font-semibold shadow-sm before:absolute before:start-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-e-full before:bg-gradient-to-b before:from-brand-500 before:to-accent-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-0.5',
                      collapsed && 'justify-center'
                    )}
                    title={collapsed ? label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                      <item.icon className="w-5 h-5" />
                    </span>
                    {!collapsed && <span className="flex-1 truncate">{label}</span>}
                  </NavLink>
                )
              })}
            </nav>

            <div className="p-3 border-t border-[var(--color-border-primary)]/60">
              <div className={cn('px-3 py-2.5 rounded-xl text-body-sm bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]', collapsed && 'text-center')}>
                <p className="font-semibold text-slate-900 dark:text-white truncate">{t('layout.version')}</p>
                <p className="text-slate-500 dark:text-slate-400 truncate">{t('layout.description')}</p>
              </div>
              {currentUser && (
                <button
                  onClick={() => { logout(); navigate('/login') }}
                  className={cn(
                    'mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all',
                    collapsed && 'justify-center'
                  )}
                  aria-label={t('layout.logout')}
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                  {!collapsed && <span>{t('layout.logout')}</span>}
                </button>
              )}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-30 bg-[#17120c]/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

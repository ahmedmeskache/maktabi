import { useState } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'
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
} from 'lucide-react'

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Livres', href: '/books', icon: BookOpen, badge: 0 },
  { name: 'Adhérents', href: '/members', icon: Users, badge: 0 },
  { name: 'Emprunts', href: '/loans', icon: Repeat, badge: 0 },
  { name: 'Statistiques', href: '/stats', icon: BarChart3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar()
    } else {
      setCollapsed(!collapsed)
    }
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
              'fixed lg:relative inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col',
              collapsed ? 'w-20' : 'w-64',
              window.innerWidth < 1024 && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
            )}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
              <Link to="/" className="flex items-center gap-2" aria-label="Maktabi - Accueil">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                {!collapsed && <span className="font-display font-bold text-heading-sm text-slate-900 dark:text-white">Maktabi</span>}
              </Link>
              <button
                onClick={handleToggle}
                className={cn(
                  'p-1.5 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                  collapsed && 'hidden lg:flex'
                )}
                aria-label={collapsed ? 'Étendre la barre latérale' : 'Réduire la barre latérale'}
                aria-expanded={!collapsed}
              >
                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navigation principale">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href))
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive: active }) => cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                      active
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
                      collapsed && 'justify-center'
                    )}
                    title={collapsed ? item.name : undefined}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">
                      <item.icon className="w-5 h-5" />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-body-xs font-semibold bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <div className={cn('px-3 py-2.5 rounded-xl text-body-sm', collapsed && 'text-center')}>
                <p className="font-medium text-slate-900 dark:text-white truncate">Version 1.0.0</p>
                <p className="text-slate-500 dark:text-slate-400 truncate">Maktabi Library System</p>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
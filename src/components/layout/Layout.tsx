import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store'

export function Layout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      <Sidebar />
      <div className={cn('flex-1 flex flex-col min-w-0 lg:ml-64', sidebarOpen && 'lg:ml-64')}>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
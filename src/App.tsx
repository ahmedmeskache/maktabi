import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Books } from '@/pages/Books'
import { BookDetail } from '@/pages/BookDetail'
import { Members } from '@/pages/Members'
import { MemberDetail } from '@/pages/MemberDetail'
import { Loans } from '@/pages/Loans'
import { LoanCheckout } from '@/pages/LoanCheckout'
import { Stats } from '@/pages/Stats'
import { Settings } from '@/pages/Settings'
import { Profile } from '@/pages/Profile'
import { Notifications } from '@/pages/Notifications'
import { Contact } from '@/pages/Contact'
import { Users } from '@/pages/Users'
import { Categories } from '@/pages/Categories'
import { History } from '@/pages/History'
import { Login } from '@/pages/Login'
import { NotFound } from '@/pages/NotFound'
import { useUIStore } from '@/store'
import { useAuthStore } from '@/store/auth'
import { getLanguageDir } from '@/i18n'

function RequireAuth({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((state) => state.currentUser)
  const location = useLocation()
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((state) => state.currentUser)
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function App() {
  const theme = useUIStore((state) => state.theme)
  const language = useUIStore((state) => state.language)

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && media.matches)
      root.classList.toggle('dark', isDark)
    }
    apply()
    if (theme === 'system') {
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.lang = language
    root.dir = getLanguageDir(language)
  }, [language])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetail />} />
          <Route path="loans" element={<Loans />} />
          <Route path="loans/checkout" element={<LoanCheckout />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="contact" element={<Contact />} />
          <Route path="users" element={<RequireAdmin><Users /></RequireAdmin>} />
          <Route path="categories" element={<RequireAdmin><Categories /></RequireAdmin>} />
          <Route path="history" element={<RequireAdmin><History /></RequireAdmin>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

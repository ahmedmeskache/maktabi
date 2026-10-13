import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { NotFound } from '@/pages/NotFound'
import { useUIStore } from '@/store'

function App() {
  const theme = useUIStore((state) => state.theme)

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

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
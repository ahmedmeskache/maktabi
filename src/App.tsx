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
import { NotFound } from '@/pages/NotFound'

function App() {
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
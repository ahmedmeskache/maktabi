import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { Book, Member, Loan, Category } from '@/types'
import { seedBooks, seedMembers, seedLoans } from '@/lib/seed'
import { addDays, calculateFine, generateId } from '@/lib/utils'
import { useHistoryStore } from './history'

const nowISO = () => new Date().toISOString()

const log = (action: string, entityType: 'book' | 'member' | 'loan' | 'category', entityLabel: string, details?: string) =>
  useHistoryStore.getState().log(action, entityType, entityLabel, details)

const CATEGORY_COLORS = ['#2f7d5b', '#7a2e44', '#2f4a6b', '#6b4a26', '#4a3b57', '#2f7d74', '#7a5c1e', '#6b3f2b', '#3f6b2f']

export const seedCategories: Category[] = [
  'Littérature', 'Science-Fiction', 'Philosophie', 'Fantasy', 'Histoire',
  'Biographie', 'Jeunesse', 'Sciences', 'Arts',
].map((name, index) => ({
  id: `cat-${index + 1}`,
  name,
  description: '',
  color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  bookCount: 0,
  createdAt: nowISO(),
}))

function refreshLoanStatuses(loans: Loan[]): Loan[] {
  const now = nowISO()
  return loans.map((loan) => {
    if (loan.status === 'returned' || loan.status === 'lost') return loan
    const overdue = new Date(loan.dueDate).getTime() < new Date(now).getTime()
    const nextStatus: Loan['status'] = overdue ? 'overdue' : 'active'
    const fine = overdue ? calculateFine(loan.dueDate) : 0
    if (nextStatus !== loan.status || fine !== loan.fineAmount) {
      return { ...loan, status: nextStatus, fineAmount: fine }
    }
    return loan
  })
}

export type NewBook = Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'totalLoans'> & { totalLoans?: number }
export type NewMember = Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'totalLoans' | 'activeLoans' | 'totalFines'>

interface LibraryState {
  books: Book[]
  members: Member[]
  loans: Loan[]
  categories: Category[]
  addBook: (data: NewBook) => Book
  updateBook: (id: string, data: Partial<Book>) => void
  deleteBook: (id: string) => { ok: boolean; error?: string }
  archiveBook: (id: string, archived: boolean) => void
  addMember: (data: NewMember) => Member
  updateMember: (id: string, data: Partial<Member>) => void
  deleteMember: (id: string) => void
  addCategory: (data: { name: string; description?: string; color: string }) => { ok: boolean; error?: string }
  updateCategory: (id: string, data: Partial<Category>) => { ok: boolean; error?: string }
  deleteCategory: (id: string) => { ok: boolean; error?: string }
  createLoan: (bookId: string, memberId: string, days?: number) => { ok: boolean; error?: string }
  returnLoan: (loanId: string) => void
  renewLoan: (loanId: string, days?: number) => { ok: boolean; error?: string }
  payFine: (loanId: string) => void
  markLost: (loanId: string) => void
  getBook: (id: string) => Book | undefined
  getMember: (id: string) => Member | undefined
  resetData: () => void
}

const safeStorage: StateStorage = {
  getItem: (name) => {
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name, value) => {
    try { localStorage.setItem(name, value) } catch { /* ignore */ }
  },
  removeItem: (name) => {
    try { localStorage.removeItem(name) } catch { /* ignore */ }
  },
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      books: seedBooks,
      members: seedMembers,
      loans: refreshLoanStatuses(seedLoans),
      categories: seedCategories,

      getBook: (id) => get().books.find((b) => b.id === id),
      getMember: (id) => get().members.find((m) => m.id === id),

      addBook: (data) => {
        const book: Book = {
          ...data,
          id: generateId(),
          archived: false,
          totalLoans: data.totalLoans ?? 0,
          availableCopies: Math.min(data.availableCopies ?? data.totalCopies, data.totalCopies),
          createdAt: nowISO(),
          updatedAt: nowISO(),
        }
        set((s) => ({ books: [book, ...s.books] }))
        log('book.create', 'book', book.title, book.author)
        return book
      },

      updateBook: (id, data) => {
        let title = ''
        let author = ''
        set((s) => ({
          books: s.books.map((b) => {
            if (b.id !== id) return b
            title = b.title
            author = b.author
            return { ...b, ...data, updatedAt: nowISO() }
          }),
        }))
        if (title) log('book.update', 'book', title, author)
      },

      deleteBook: (id) => {
        const book = get().books.find((b) => b.id === id)
        const activeLoans = get().loans.filter(
          (l) => l.bookId === id && (l.status === 'active' || l.status === 'overdue')
        )
        if (activeLoans.length > 0) return { ok: false, error: 'activeLoans' }
        set((s) => ({ books: s.books.filter((b) => b.id !== id) }))
        log('book.delete', 'book', book?.title ?? id)
        return { ok: true }
      },

      archiveBook: (id, archived) => {
        let title = ''
        set((s) => ({
          books: s.books.map((b) => {
            if (b.id !== id) return b
            title = b.title
            return { ...b, archived, updatedAt: nowISO() }
          }),
        }))
        if (title) log(archived ? 'book.archive' : 'book.unarchive', 'book', title)
      },

      addMember: (data) => {
        const member: Member = {
          ...data,
          id: generateId(),
          memberNumber: data.memberNumber || `MBR-${String(get().members.length + 1).padStart(3, '0')}`,
          avatarUrl: data.avatarUrl ?? null,
          totalLoans: 0,
          activeLoans: 0,
          totalFines: 0,
          createdAt: nowISO(),
          updatedAt: nowISO(),
        }
        set((s) => ({ members: [member, ...s.members] }))
        log('member.create', 'member', `${member.firstName} ${member.lastName}`)
        return member
      },

      updateMember: (id, data) => {
        let label = ''
        set((s) => ({
          members: s.members.map((m) => {
            if (m.id !== id) return m
            label = `${m.firstName} ${m.lastName}`
            return { ...m, ...data, updatedAt: nowISO() }
          }),
        }))
        if (label) log('member.update', 'member', label)
      },

      deleteMember: (id) => {
        const member = get().members.find((m) => m.id === id)
        set((s) => ({
          members: s.members.filter((m) => m.id !== id),
          loans: s.loans.filter((l) => l.memberId !== id),
        }))
        if (member) log('member.delete', 'member', `${member.firstName} ${member.lastName}`)
      },

      addCategory: (data) => {
        const name = data.name.trim()
        if (!name) return { ok: false, error: 'empty' }
        if (get().categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return { ok: false, error: 'duplicate' }
        const category: Category = { id: generateId(), name, description: data.description ?? '', color: data.color, bookCount: 0, createdAt: nowISO() }
        set((s) => ({ categories: [...s.categories, category] }))
        log('category.create', 'category', name)
        return { ok: true }
      },

      updateCategory: (id, data) => {
        const name = data.name?.trim()
        if (name && get().categories.some((c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) return { ok: false, error: 'duplicate' }
        let label = ''
        set((s) => {
          const old = s.categories.find((c) => c.id === id)
          label = old?.name ?? ''
          return {
            categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
            books: name && old && name !== old.name
              ? s.books.map((b) => (b.category === old.name ? { ...b, category: name } : b))
              : s.books,
          }
        })
        if (label) log('category.update', 'category', label)
        return { ok: true }
      },

      deleteCategory: (id) => {
        const category = get().categories.find((c) => c.id === id)
        if (!category) return { ok: false, error: 'notFound' }
        if (get().books.some((b) => b.category === category.name)) return { ok: false, error: 'inUse' }
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
        log('category.delete', 'category', category.name)
        return { ok: true }
      },

      createLoan: (bookId, memberId, days = 30) => {
        const { books, members } = get()
        const book = books.find((b) => b.id === bookId)
        const member = members.find((m) => m.id === memberId)
        if (!book) return { ok: false, error: 'bookNotFound' }
        if (!member) return { ok: false, error: 'memberNotFound' }
        if (member.status !== 'active') return { ok: false, error: 'memberInactive' }
        if (book.availableCopies <= 0) return { ok: false, error: 'noCopies' }
        const activeCount = get().loans.filter((l) => l.memberId === memberId && (l.status === 'active' || l.status === 'overdue')).length
        const maxLoans = member.membershipType === 'premium' ? 8 : member.membershipType === 'staff' ? 12 : 5
        if (activeCount >= maxLoans) return { ok: false, error: 'limitReached' }

        const loan: Loan = {
          id: generateId(),
          bookId,
          memberId,
          loanDate: nowISO(),
          dueDate: addDays(new Date(), days),
          status: 'active',
          fineAmount: 0,
          finePaid: false,
          renewalCount: 0,
          createdAt: nowISO(),
          updatedAt: nowISO(),
        }

        set((s) => ({
          loans: [loan, ...s.loans],
          books: s.books.map((b) =>
            b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1, totalLoans: (b.totalLoans ?? 0) + 1, updatedAt: nowISO() } : b
          ),
          members: s.members.map((m) =>
            m.id === memberId ? { ...m, activeLoans: m.activeLoans + 1, totalLoans: m.totalLoans + 1, updatedAt: nowISO() } : m
          ),
        }))
        log('loan.create', 'loan', book.title, `${member.firstName} ${member.lastName}`)
        return { ok: true }
      },

      returnLoan: (loanId) => {
        const loan = get().loans.find((l) => l.id === loanId)
        if (!loan || loan.status === 'returned') return
        const fine = calculateFine(loan.dueDate)
        const bookTitle = get().books.find((b) => b.id === loan.bookId)?.title ?? loan.bookId
        set((s) => ({
          loans: s.loans.map((l) =>
            l.id === loanId
              ? { ...l, status: 'returned', returnDate: nowISO(), fineAmount: fine, updatedAt: nowISO() }
              : l
          ),
          books: s.books.map((b) =>
            b.id === loan.bookId ? { ...b, availableCopies: Math.min(b.availableCopies + 1, b.totalCopies), updatedAt: nowISO() } : b
          ),
          members: s.members.map((m) =>
            m.id === loan.memberId
              ? { ...m, activeLoans: Math.max(0, m.activeLoans - 1), totalFines: m.totalFines + fine, updatedAt: nowISO() }
              : m
          ),
        }))
        log('loan.return', 'loan', bookTitle)
      },

      renewLoan: (loanId, days = 30) => {
        const loan = get().loans.find((l) => l.id === loanId)
        if (!loan) return { ok: false, error: 'notFound' }
        if (loan.status === 'returned') return { ok: false, error: 'returned' }
        if (loan.renewalCount >= 2) return { ok: false, error: 'maxRenewals' }
        const base = new Date(loan.dueDate).getTime() > Date.now() ? loan.dueDate : nowISO()
        set((s) => ({
          loans: s.loans.map((l) =>
            l.id === loanId
              ? { ...l, dueDate: addDays(base, days), status: 'active', fineAmount: 0, renewalCount: l.renewalCount + 1, updatedAt: nowISO() }
              : l
          ),
        }))
        log('loan.renew', 'loan', get().books.find((b) => b.id === loan.bookId)?.title ?? loan.bookId)
        return { ok: true }
      },

      payFine: (loanId) => {
        const loan = get().loans.find((l) => l.id === loanId)
        if (!loan) return
        set((s) => ({
          loans: s.loans.map((l) => (l.id === loanId ? { ...l, finePaid: true, updatedAt: nowISO() } : l)),
          members: s.members.map((m) =>
            m.id === loan.memberId ? { ...m, totalFines: Math.max(0, m.totalFines - loan.fineAmount), updatedAt: nowISO() } : m
          ),
        }))
        log('loan.fine', 'loan', get().books.find((b) => b.id === loan.bookId)?.title ?? loan.bookId)
      },

      markLost: (loanId) => {
        const loan = get().loans.find((l) => l.id === loanId)
        if (!loan) return
        set((s) => ({
          loans: s.loans.map((l) => (l.id === loanId ? { ...l, status: 'lost', updatedAt: nowISO() } : l)),
          members: s.members.map((m) =>
            m.id === loan.memberId ? { ...m, activeLoans: Math.max(0, m.activeLoans - 1), updatedAt: nowISO() } : m
          ),
        }))
        log('loan.lost', 'loan', get().books.find((b) => b.id === loan.bookId)?.title ?? loan.bookId)
      },

      resetData: () => {
        set({ books: seedBooks, members: seedMembers, loans: refreshLoanStatuses(seedLoans), categories: seedCategories })
        useHistoryStore.getState().log('settings.reset', 'settings', '')
      },
    }),
    {
      name: 'maktabi-library-v2',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)

export const MAX_LOANS_BY_TYPE: Record<Member['membershipType'], number> = {
  student: 5,
  standard: 5,
  premium: 8,
  staff: 12,
}

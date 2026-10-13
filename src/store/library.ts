import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { Book, Member, Loan } from '@/types'
import { seedBooks, seedMembers, seedLoans } from '@/lib/seed'
import { addDays, calculateFine, generateId } from '@/lib/utils'

const nowISO = () => new Date().toISOString()

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
  addBook: (data: NewBook) => Book
  updateBook: (id: string, data: Partial<Book>) => void
  deleteBook: (id: string) => void
  addMember: (data: NewMember) => Member
  updateMember: (id: string, data: Partial<Member>) => void
  deleteMember: (id: string) => void
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

      getBook: (id) => get().books.find((b) => b.id === id),
      getMember: (id) => get().members.find((m) => m.id === id),

      addBook: (data) => {
        const book: Book = {
          ...data,
          id: generateId(),
          totalLoans: data.totalLoans ?? 0,
          availableCopies: Math.min(data.availableCopies ?? data.totalCopies, data.totalCopies),
          createdAt: nowISO(),
          updatedAt: nowISO(),
        }
        set((s) => ({ books: [book, ...s.books] }))
        return book
      },

      updateBook: (id, data) => {
        set((s) => ({
          books: s.books.map((b) =>
            b.id === id ? { ...b, ...data, updatedAt: nowISO() } : b
          ),
        }))
      },

      deleteBook: (id) => {
        set((s) => ({
          books: s.books.filter((b) => b.id !== id),
          loans: s.loans.filter((l) => l.bookId !== id),
        }))
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
        return member
      },

      updateMember: (id, data) => {
        set((s) => ({
          members: s.members.map((m) =>
            m.id === id ? { ...m, ...data, updatedAt: nowISO() } : m
          ),
        }))
      },

      deleteMember: (id) => {
        set((s) => ({
          members: s.members.filter((m) => m.id !== id),
          loans: s.loans.filter((l) => l.memberId !== id),
        }))
      },

      createLoan: (bookId, memberId, days = 30) => {
        const { books, members } = get()
        const book = books.find((b) => b.id === bookId)
        const member = members.find((m) => m.id === memberId)
        if (!book) return { ok: false, error: 'Livre introuvable' }
        if (!member) return { ok: false, error: 'Adhérent introuvable' }
        if (member.status !== 'active') return { ok: false, error: "L'adhérent n'est pas actif" }
        if (book.availableCopies <= 0) return { ok: false, error: 'Aucun exemplaire disponible' }
        const activeCount = get().loans.filter((l) => l.memberId === memberId && (l.status === 'active' || l.status === 'overdue')).length
        const maxLoans = member.membershipType === 'premium' ? 8 : member.membershipType === 'staff' ? 12 : 5
        if (activeCount >= maxLoans) return { ok: false, error: `Limite de ${maxLoans} emprunts atteinte` }

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
        return { ok: true }
      },

      returnLoan: (loanId) => {
        const loan = get().loans.find((l) => l.id === loanId)
        if (!loan || loan.status === 'returned') return
        const fine = calculateFine(loan.dueDate)
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
      },

      renewLoan: (loanId, days = 30) => {
        const loan = get().loans.find((l) => l.id === loanId)
        if (!loan) return { ok: false, error: 'Emprunt introuvable' }
        if (loan.status === 'returned') return { ok: false, error: 'Emprunt déjà retourné' }
        if (loan.renewalCount >= 2) return { ok: false, error: 'Nombre maximum de renouvellements atteint' }
        const base = new Date(loan.dueDate).getTime() > Date.now() ? loan.dueDate : nowISO()
        set((s) => ({
          loans: s.loans.map((l) =>
            l.id === loanId
              ? { ...l, dueDate: addDays(base, days), status: 'active', fineAmount: 0, renewalCount: l.renewalCount + 1, updatedAt: nowISO() }
              : l
          ),
        }))
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
      },

      resetData: () =>
        set({ books: seedBooks, members: seedMembers, loans: refreshLoanStatuses(seedLoans) }),
    }),
    {
      name: 'maktabi-library-v1',
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

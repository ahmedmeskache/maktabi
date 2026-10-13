export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  publisher?: string
  publishedYear?: number
  category: string
  subcategory?: string
  description?: string
  coverUrl?: string | null
  totalCopies: number
  availableCopies: number
  location?: string
  tags: string[]
  totalLoans?: number
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  memberNumber: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  membershipType: 'student' | 'standard' | 'premium' | 'staff'
  membershipStart: string
  membershipEnd: string
  status: 'active' | 'expired' | 'suspended' | 'pending'
  avatarUrl?: string | null
  qrCode?: string
  totalLoans: number
  activeLoans: number
  totalFines: number
  createdAt: string
  updatedAt: string
}

export interface Loan {
  id: string
  bookId: string
  memberId: string
  loanDate: string
  dueDate: string
  returnDate?: string
  status: 'active' | 'returned' | 'overdue' | 'lost'
  fineAmount: number
  finePaid: boolean
  renewalCount: number
  notes?: string
  createdAt: string
  updatedAt: string
  // Relations
  book?: Book
  member?: Member
}

export interface Reservation {
  id: string
  bookId: string
  memberId: string
  reservationDate: string
  expiryDate: string
  status: 'pending' | 'ready' | 'cancelled' | 'completed'
  position: number
  notifiedAt?: string
  createdAt: string
  updatedAt: string
  book?: Book
  member?: Member
}

export interface Category {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  bookCount: number
  createdAt: string
}

export interface StatsOverview {
  totalBooks: number
  totalMembers: number
  activeLoans: number
  overdueLoans: number
  totalFines: number
  booksAddedThisMonth: number
  membersJoinedThisMonth: number
  loansThisMonth: number
}

export interface ChartData {
  loansOverTime: { date: string; count: number }[]
  popularCategories: { category: string; count: number }[]
  popularBooks: { title: string; loans: number }[]
  memberActivity: { month: string; active: number; new: number }[]
  overdueTrend: { date: string; count: number }[]
}

export type ViewMode = 'grid' | 'list' | 'table'
export type SortOrder = 'asc' | 'desc'
export type Theme = 'light' | 'dark' | 'system'
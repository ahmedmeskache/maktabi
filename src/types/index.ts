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
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  id: string
  memberNumber: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: Date
  membershipType: 'student' | 'standard' | 'premium' | 'staff'
  membershipStart: Date
  membershipEnd: Date
  status: 'active' | 'expired' | 'suspended' | 'pending'
  avatarUrl?: string
  qrCode?: string
  totalLoans: number
  activeLoans: number
  totalFines: number
  createdAt: Date
  updatedAt: Date
}

export interface Loan {
  id: string
  bookId: string
  memberId: string
  loanDate: Date
  dueDate: Date
  returnDate?: Date
  status: 'active' | 'returned' | 'overdue' | 'lost'
  fineAmount: number
  finePaid: boolean
  renewalCount: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  // Relations
  book?: Book
  member?: Member
}

export interface Reservation {
  id: string
  bookId: string
  memberId: string
  reservationDate: Date
  expiryDate: Date
  status: 'pending' | 'ready' | 'cancelled' | 'completed'
  position: number
  notifiedAt?: Date
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
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
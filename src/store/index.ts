import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import type { Theme, ViewMode } from '@/types'
import type { Language } from '@/i18n'

const safeStorage: StateStorage = {
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // Ignore quota exceeded or private mode errors
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // Ignore errors
    }
  },
}

interface UIState {
  theme: Theme
  language: Language
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  viewMode: ViewMode
  notificationPrefs: Record<string, boolean>
  lastBackup: string | null
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  setViewMode: (mode: ViewMode) => void
  setNotificationPref: (key: string, value: boolean) => void
  setLastBackup: (date: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'fr',
      sidebarOpen: true,
      commandPaletteOpen: false,
      viewMode: 'grid',
      notificationPrefs: {
        loans: true,
        returns: true,
        reservations: true,
        members: true,
        reports: false,
      },
      lastBackup: null,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setViewMode: (mode) => set({ viewMode: mode }),
      setNotificationPref: (key, value) => set((state) => ({ notificationPrefs: { ...state.notificationPrefs, [key]: value } })),
      setLastBackup: (date) => set({ lastBackup: date }),
    }),
    {
      name: 'maktabi-ui',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)

interface FilterState {
  books: {
    search: string
    category: string
    status: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  members: {
    search: string
    status: string
    membershipType: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  loans: {
    search: string
    status: string
    dateRange: { from: Date | null; to: Date | null }
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  setBookFilter: (filter: Partial<FilterState['books']>) => void
  setMemberFilter: (filter: Partial<FilterState['members']>) => void
  setLoanFilter: (filter: Partial<FilterState['loans']>) => void
  resetFilters: (key: keyof FilterState) => void
}

const defaultBookFilter = {
  search: '',
  category: '',
  status: '',
  sortBy: 'title',
  sortOrder: 'asc' as const,
}

const defaultMemberFilter = {
  search: '',
  status: '',
  membershipType: '',
  sortBy: 'lastName',
  sortOrder: 'asc' as const,
}

const defaultLoanFilter = {
  search: '',
  status: '',
  dateRange: { from: null, to: null },
  sortBy: 'loanDate',
  sortOrder: 'desc' as const,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      books: defaultBookFilter,
      members: defaultMemberFilter,
      loans: defaultLoanFilter,
      setBookFilter: (filter) => set((state) => ({ books: { ...state.books, ...filter } })),
      setMemberFilter: (filter) => set((state) => ({ members: { ...state.members, ...filter } })),
      setLoanFilter: (filter) => set((state) => ({ loans: { ...state.loans, ...filter } })),
      resetFilters: (key) => set(() => ({
        [key]: key === 'books' ? defaultBookFilter : key === 'members' ? defaultMemberFilter : defaultLoanFilter
      })),
    }),
    {
      name: 'maktabi-filters',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)

interface NotificationState {
  unreadCount: number
  lastCheck: Date | null
  increment: () => void
  setCount: (count: number) => void
  setLastCheck: (date: Date) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      lastCheck: null,
      increment: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
      setCount: (count) => set({ unreadCount: count }),
      setLastCheck: (date) => set({ lastCheck: date }),
    }),
    {
      name: 'maktabi-notifications',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)
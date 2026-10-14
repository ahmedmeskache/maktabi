import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { AppUser, HistoryEntity } from '@/types'
import { generateId } from '@/lib/utils'
import { useHistoryStore } from './history'

const nowISO = () => new Date().toISOString()

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

const seedUsers: AppUser[] = [
  {
    id: 'user-admin',
    name: 'Bibliothécaire Principal',
    email: 'admin@maktabi.fr',
    password: 'admin123',
    phone: '+33 1 23 45 67 89',
    library: 'Bibliothèque Centrale',
    role: 'admin',
    isActive: true,
    twoFactor: false,
    createdAt: nowISO(),
  },
  {
    id: 'user-librarian',
    name: 'Amina Benali',
    email: 'amina@maktabi.fr',
    password: 'amina123',
    phone: '+213 660 12 34 56',
    library: 'Bibliothèque Centrale',
    role: 'admin',
    isActive: true,
    twoFactor: false,
    createdAt: nowISO(),
  },
  {
    id: 'user-reader',
    name: 'lecteur 1',
    email: 'lecteur@maktabi.fr',
    password: 'user123',
    phone: '+33 6 12 34 56 78',
    library: 'Bibliothèque Centrale',
    role: 'user',
    isActive: true,
    twoFactor: false,
    createdAt: nowISO(),
  },
]

interface AuthState {
  users: AppUser[]
  currentUser: AppUser | null
  login: (identifier: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
  addUser: (data: Omit<AppUser, 'id' | 'createdAt' | 'twoFactor'> & { twoFactor?: boolean }) => { ok: boolean; error?: string }
  updateUser: (id: string, data: Partial<Omit<AppUser, 'id'>>) => { ok: boolean; error?: string }
  deleteUser: (id: string) => { ok: boolean; error?: string }
  setUserActive: (id: string, active: boolean) => { ok: boolean; error?: string }
  updateProfile: (data: Partial<Pick<AppUser, 'name' | 'email' | 'phone' | 'library'>>) => void
  changePassword: (current: string, next: string) => { ok: boolean; error?: string }
  setTwoFactor: (enabled: boolean) => void
  resetUsers: () => void
  eraseLecteurs: () => void
  eraseAdmins: () => void
  eraseAllUsers: () => void
}

function log(action: string, entityType: HistoryEntity, entityLabel: string, details?: string) {
  useHistoryStore.getState().log(action, entityType, entityLabel, details)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      currentUser: null,

      login: (identifier, password) => {
        const value = identifier.trim().toLowerCase()
        const user = get().users.find(
          (u) => u.email.toLowerCase() === value || u.name.toLowerCase() === value
        )
        if (!user || user.password !== password) return { ok: false, error: 'invalid' }
        if (!user.isActive) return { ok: false, error: 'disabled' }
        set({ currentUser: user })
        log('user.login', 'auth', user.name)
        return { ok: true }
      },

      logout: () => {
        const name = get().currentUser?.name
        set({ currentUser: null })
        if (name) log('user.logout', 'auth', name)
      },

      addUser: (data) => {
        const emailTaken = get().users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())
        if (emailTaken) return { ok: false, error: 'emailTaken' }
        const user: AppUser = {
          ...data,
          id: generateId(),
          twoFactor: data.twoFactor ?? false,
          createdAt: nowISO(),
        }
        set((s) => ({ users: [user, ...s.users] }))
        log('user.create', 'user', user.name, user.email)
        return { ok: true }
      },

      updateUser: (id, data) => {
        const { users } = get()
        if (data.email) {
          const emailTaken = users.some((u) => u.id !== id && u.email.toLowerCase() === data.email!.toLowerCase())
          if (emailTaken) return { ok: false, error: 'emailTaken' }
        }
        let label = ''
        set((s) => ({
          users: s.users.map((u) => {
            if (u.id !== id) return u
            label = u.name
            return { ...u, ...data }
          }),
          currentUser: s.currentUser?.id === id ? { ...s.currentUser, ...data } : s.currentUser,
        }))
        log('user.update', 'user', label)
        return { ok: true }
      },

      deleteUser: (id) => {
        if (get().currentUser?.id === id) return { ok: false, error: 'self' }
        const user = get().users.find((u) => u.id === id)
        set((s) => ({ users: s.users.filter((u) => u.id !== id) }))
        log('user.delete', 'user', user?.name ?? id)
        return { ok: true }
      },

      setUserActive: (id, active) => {
        if (get().currentUser?.id === id && !active) return { ok: false, error: 'self' }
        let label = ''
        set((s) => ({
          users: s.users.map((u) => {
            if (u.id !== id) return u
            label = u.name
            return { ...u, isActive: active }
          }),
        }))
        log('user.status', 'user', label, active ? 'active' : 'inactive')
        return { ok: true }
      },

      updateProfile: (data) => {
        let label = ''
        set((s) => ({
          users: s.users.map((u) => {
            if (u.id !== s.currentUser?.id) return u
            label = u.name
            return { ...u, ...data }
          }),
          currentUser: s.currentUser ? { ...s.currentUser, ...data } : s.currentUser,
        }))
        log('user.update', 'user', label, 'profile')
      },

      changePassword: (current, next) => {
        const user = get().currentUser
        if (!user) return { ok: false, error: 'invalid' }
        if (user.password !== current) return { ok: false, error: 'wrongCurrent' }
        if (next.length < 6) return { ok: false, error: 'tooShort' }
        set((s) => ({
          users: s.users.map((u) => (u.id === user.id ? { ...u, password: next } : u)),
          currentUser: { ...user, password: next },
        }))
        log('settings.password', 'settings', user.name)
        return { ok: true }
      },

      setTwoFactor: (enabled) => {
        const user = get().currentUser
        if (!user) return
        set((s) => ({
          users: s.users.map((u) => (u.id === user.id ? { ...u, twoFactor: enabled } : u)),
          currentUser: { ...user, twoFactor: enabled },
        }))
        log('settings.2fa', 'settings', user.name, enabled ? 'enabled' : 'disabled')
      },

      resetUsers: () => set({ users: seedUsers }),
      eraseLecteurs: () => {
        set((s) => ({ users: s.users.filter((u) => u.role !== 'user') }))
      },
      eraseAdmins: () => {
        const currentId = get().currentUser?.id
        set((s) => ({ users: s.users.filter((u) => u.role !== 'admin' || u.id === currentId) }))
      },
      eraseAllUsers: () => {
        const currentId = get().currentUser?.id
        set((s) => ({ users: s.users.filter((u) => u.id === currentId) }))
      },
    }),
    {
      name: 'maktabi-auth-v2',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)

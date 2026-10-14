import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { HistoryEntry, HistoryEntity } from '@/types'
import { generateId } from '@/lib/utils'

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

interface HistoryState {
  entries: HistoryEntry[]
  log: (action: string, entityType: HistoryEntity, entityLabel: string, details?: string) => void
  clear: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      log: (action, entityType, entityLabel, details) => {
        let userName = 'Système'
        try {
          const raw = localStorage.getItem('maktabi-auth')
          if (raw) {
            const parsed = JSON.parse(raw)
            userName = parsed?.state?.currentUser?.name ?? 'Système'
          }
        } catch {
          // ignore
        }
        const entry: HistoryEntry = {
          id: generateId(),
          action,
          entityType,
          entityLabel,
          details,
          userName,
          createdAt: nowISO(),
        }
        set((s) => ({ entries: [entry, ...s.entries].slice(0, 500) }))
      },
      clear: () => set({ entries: [] }),
    }),
    {
      name: 'maktabi-history',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)

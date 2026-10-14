import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, History as HistoryIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useHistoryStore } from '@/store/history'
import { useTranslation } from '@/i18n'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ENTITY_TYPES = ['book', 'member', 'loan', 'user', 'category', 'auth', 'settings'] as const

const ENTITY_COLORS: Record<string, string> = {
  book: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
  member: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  loan: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  user: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  category: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  auth: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  settings: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
}

export function History() {
  const { t } = useTranslation()
  const entries = useHistoryStore((s) => s.entries)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter((entry) => {
      if (type && entry.entityType !== type) return false
      if (!q) return true
      return `${entry.entityLabel} ${entry.userName} ${t(`history.action.${entry.action}`)}`.toLowerCase().includes(q)
    })
  }, [entries, search, type, t])

  const handleExport = () => {
    const header = 'action,entity,label,user,date\n'
    const rows = filtered
      .map((e) => [e.action, e.entityType, e.entityLabel, e.userName, e.createdAt].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maktabi-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('history.exported'))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('history.title')}</h1>
          <p className="text-body-md text-[var(--color-text-muted)] mt-1">{t('history.subtitle')}</p>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4" />{t('history.export')}</Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input placeholder={t('history.searchPlaceholder')} icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border-primary)] bg-white dark:bg-slate-800 text-[var(--color-text-primary)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            aria-label={t('history.filterType')}
          >
            <option value="">{t('common.all')}</option>
            {ENTITY_TYPES.map((entity) => (
              <option key={entity} value={entity}>{t(`history.entity.${entity}`)}</option>
            ))}
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center text-[var(--color-text-muted)]">
          <HistoryIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
          {t('history.empty')}
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, index) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.02, 0.3) }}>
              <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className={cn('px-3 py-1 rounded-full text-body-xs font-semibold self-start', ENTITY_COLORS[entry.entityType] ?? ENTITY_COLORS.settings)}>
                  {t(`history.entity.${entry.entityType}`)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] truncate">
                    {t(`history.action.${entry.action}`)}
                    {entry.entityLabel && <span className="text-[var(--color-text-muted)]"> · {entry.entityLabel}</span>}
                  </p>
                  <p className="text-body-xs text-[var(--color-text-muted)]">
                    {entry.userName}
                    {entry.details ? ` · ${entry.details}` : ''}
                  </p>
                </div>
                <span className="text-body-xs text-[var(--color-text-muted)] whitespace-nowrap">{formatDate(entry.createdAt, 'relative')}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Tags } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { useLibraryStore } from '@/store/library'
import { useTranslation } from '@/i18n'
import type { Category } from '@/types'

const COLORS = ['#2f7d5b', '#7a2e44', '#2f4a6b', '#6b4a26', '#4a3b57', '#2f7d74', '#7a5c1e', '#6b3f2b', '#3f6b2f']

type FormState = { name: string; description: string; color: string }
const emptyForm: FormState = { name: '', description: '', color: COLORS[0] }

export function Categories() {
  const { t } = useTranslation()
  const { categories, books, addCategory, updateCategory, deleteCategory } = useLibraryStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const book of books) map[book.category] = (map[book.category] ?? 0) + 1
    return map
  }, [books])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setForm({ name: category.name, description: category.description ?? '', color: category.color })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setFormError(t('common.required'))
      return
    }
    const result = editing
      ? updateCategory(editing.id, { name: form.name.trim(), description: form.description.trim(), color: form.color })
      : addCategory({ name: form.name.trim(), description: form.description.trim(), color: form.color })
    if (!result.ok) {
      setFormError(result.error === 'duplicate' ? t('categories.duplicate') : t('common.error'))
      return
    }
    toast.success(editing ? t('categories.updated') : t('categories.created'))
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const result = deleteCategory(deleteTarget.id)
    if (!result.ok) {
      toast.error(result.error === 'inUse' ? t('categories.inUse') : t('common.error'))
    } else {
      toast.success(t('categories.deleted'))
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('categories.title')}</h1>
          <p className="text-body-md text-[var(--color-text-muted)] mt-1">{t('categories.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={openCreate}><Plus className="w-4 h-4" />{t('categories.add')}</Button>
      </div>

      {categories.length === 0 && (
        <Card className="p-10 text-center text-[var(--color-text-muted)]">{t('categories.empty')}</Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div key={category.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
            <Card className="p-5 h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${category.color}22`, color: category.color }}>
                    <Tags className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--color-text-primary)] truncate">{category.name}</p>
                    <p className="text-body-xs text-[var(--color-text-muted)]">{t('categories.bookCount', { count: counts[category.name] ?? 0 })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(category)} aria-label={t('common.edit')}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(category)} aria-label={t('common.delete')}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
              {category.description && <p className="text-body-sm text-[var(--color-text-secondary)] mt-3">{category.description}</p>}
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('categories.edit') : t('categories.add')}>
        <div className="space-y-4">
          <Input label={t('categories.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={formError || undefined} />
          <Input label={t('categories.description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('categories.color')}</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={'w-9 h-9 rounded-xl border-2 transition-transform ' + (form.color === color ? 'border-[var(--color-text-primary)] scale-110' : 'border-transparent')}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleSubmit}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={t('common.delete')}
        message={t('categories.deleteConfirm', { name: deleteTarget?.name ?? '' })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      />
    </div>
  )
}

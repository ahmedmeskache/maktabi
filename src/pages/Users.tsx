import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Pencil, Trash2, Power, Search, Shield, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { useAuthStore } from '@/store/auth'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'
import type { AppUser } from '@/types'

type FormState = {
  name: string
  email: string
  phone: string
  password: string
  role: 'admin' | 'user'
  isActive: boolean
}

const emptyForm: FormState = { name: '', email: '', phone: '', password: '', role: 'user', isActive: true }

export function Users() {
  const { t } = useTranslation()
  const { users, currentUser, addUser, updateUser, deleteUser, setUserActive } = useAuthStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AppUser | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q))
  }, [users, search])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (user: AppUser) => {
    setEditing(user)
    setForm({ name: user.name, email: user.email, phone: user.phone ?? '', password: user.password, role: user.role, isActive: user.isActive })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmit = () => {
    setFormError('')
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError(t('auth.login.required'))
      return
    }
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      role: form.role,
      isActive: form.isActive,
    }
    const result = editing ? updateUser(editing.id, payload) : addUser(payload)
    if (!result.ok) {
      setFormError(result.error === 'emailTaken' ? t('users.emailTaken') : t('common.error'))
      return
    }
    toast.success(editing ? t('users.updated') : t('users.created'))
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const result = deleteUser(deleteTarget.id)
    if (!result.ok) {
      toast.error(t('users.cannotSelfDelete'))
    } else {
      toast.success(t('users.deleted'))
    }
    setDeleteTarget(null)
  }

  const toggleActive = (user: AppUser) => {
    const result = setUserActive(user.id, !user.isActive)
    if (!result.ok) {
      toast.error(t('users.cannotSelfDeactivate'))
      return
    }
    toast.success(t('users.statusChanged'))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('users.title')}</h1>
          <p className="text-body-md text-[var(--color-text-muted)] mt-1">{t('users.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={openCreate}><UserPlus className="w-4 h-4" />{t('users.add')}</Button>
      </div>

      <Card className="p-4">
        <Input
          placeholder={t('users.searchPlaceholder')}
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-[var(--color-text-muted)]">{t('users.empty')}</Card>
        )}
        {filtered.map((user, index) => (
          <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
            <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', user.role === 'admin' ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]')}>
                  {user.role === 'admin' ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--color-text-primary)] truncate">
                    {user.name}
                    {currentUser?.id === user.id && <span className="ms-2 text-body-xs font-normal text-brand-600 dark:text-brand-400">({t('users.self')})</span>}
                  </p>
                  <p className="text-body-sm text-[var(--color-text-muted)] truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('px-3 py-1 rounded-full text-body-xs font-semibold', user.role === 'admin' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]')}>
                  {t(`role.${user.role}`)}
                </span>
                <span className={cn('px-3 py-1 rounded-full text-body-xs font-semibold', user.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400')}>
                  {user.isActive ? t('common.active') : t('common.inactive')}
                </span>
                <Button variant="ghost" size="sm" onClick={() => toggleActive(user)} aria-label={user.isActive ? t('users.deactivate') : t('users.activate')} title={user.isActive ? t('users.deactivate') : t('users.activate')}>
                  <Power className={cn('w-4 h-4', user.isActive ? 'text-red-500' : 'text-green-500')} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(user)} aria-label={t('common.edit')}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(user)} aria-label={t('common.delete')}><Trash2 className="w-4 h-4 text-red-500" /></Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t('users.edit') : t('users.add')}>
        <div className="space-y-4">
          <Input label={t('common.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label={t('common.email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={formError || undefined} />
          <Input label={t('common.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label={t('users.password')} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('common.role')}</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as 'admin' | 'user' })}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border-primary)] bg-white dark:bg-slate-800 text-[var(--color-text-primary)] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="user">{t('role.user')}</option>
              <option value="admin">{t('role.admin')}</option>
            </select>
          </div>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
            <span className="font-medium text-[var(--color-text-primary)]">{t('common.active')}</span>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          </label>
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
        message={t('users.deleteConfirm', { name: deleteTarget?.name ?? '' })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      />
    </div>
  )
}

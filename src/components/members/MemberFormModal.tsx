import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLibraryStore, type NewMember } from '@/store/library'
import { useTranslation } from '@/i18n'
import type { Member } from '@/types'
import { addDays } from '@/lib/utils'

const empty = (): NewMember => ({
  memberNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  membershipType: 'standard',
  membershipStart: new Date().toISOString(),
  membershipEnd: addDays(new Date(), 365),
  status: 'active',
  avatarUrl: null,
})

export function MemberFormModal({ isOpen, onClose, member }: { isOpen: boolean; onClose: () => void; member?: Member | null }) {
  const { t } = useTranslation()
  const { addMember, updateMember } = useLibraryStore()
  const [form, setForm] = useState<NewMember>(empty())
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) return
    if (member) {
      setForm({
        memberNumber: member.memberNumber,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone ?? '',
        address: member.address ?? '',
        dateOfBirth: member.dateOfBirth ?? '',
        membershipType: member.membershipType,
        membershipStart: member.membershipStart,
        membershipEnd: member.membershipEnd,
        status: member.status,
        avatarUrl: member.avatarUrl ?? null,
      })
    } else {
      setForm(empty())
    }
    setErrors({})
  }, [isOpen, member])

  const set = <K extends keyof NewMember>(key: K, value: NewMember[K]) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = t('members.firstNameRequired')
    if (!form.lastName.trim()) e.lastName = t('members.lastNameRequired')
    if (!form.email.trim()) e.email = t('members.emailRequired')
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t('members.emailInvalid')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (member) {
      updateMember(member.id, form)
      toast.success(t('members.updated'))
    } else {
      addMember(form)
      toast.success(t('members.created'))
    }
    onClose()
  }

  const dateValue = (iso: string) => (iso ? iso.slice(0, 10) : '')
  const toISO = (value: string) => (value ? new Date(value).toISOString() : '')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={member ? t('members.editTitle') : t('members.newMember')} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label={`${t('members.firstName')} *`} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} />
          <Input label={`${t('common.name')} *`} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} />
          <Input label={`${t('common.email')} *`} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
          <Input label={t('common.phone')} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <div className="sm:col-span-2">
            <Input label={t('members.address')} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <Input label={t('members.dateOfBirth')} type="date" value={dateValue(form.dateOfBirth ?? '')} onChange={(e) => set('dateOfBirth', toISO(e.target.value))} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('members.membershipType')}</label>
            <select
              value={form.membershipType}
              onChange={(e) => set('membershipType', e.target.value as Member['membershipType'])}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="student">{t('membership.student')} {t('members.loanLimit', { count: 5 })}</option>
              <option value="standard">{t('membership.standard')} {t('members.loanLimit', { count: 5 })}</option>
              <option value="premium">{t('membership.premium')} {t('members.loanLimit', { count: 8 })}</option>
              <option value="staff">{t('membership.staff')} {t('members.loanLimit', { count: 12 })}</option>
            </select>
          </div>
          <Input label={t('members.membershipStart')} type="date" value={dateValue(form.membershipStart)} onChange={(e) => set('membershipStart', toISO(e.target.value))} />
          <Input label={t('members.membershipEnd')} type="date" value={dateValue(form.membershipEnd)} onChange={(e) => set('membershipEnd', toISO(e.target.value))} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('common.status')}</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as Member['status'])}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="active">{t('common.active')}</option>
              <option value="pending">{t('status.pending')}</option>
              <option value="suspended">{t('status.suspended')}</option>
              <option value="expired">{t('status.expired')}</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="primary" onClick={handleSubmit}>{member ? t('common.save') : t('common.add')}</Button>
        </div>
      </div>
    </Modal>
  )
}

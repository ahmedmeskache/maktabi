import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLibraryStore, type NewMember } from '@/store/library'
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
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.email.trim()) e.email = 'Email requis'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email invalide'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (member) {
      updateMember(member.id, form)
      toast.success('Adhérent mis à jour')
    } else {
      addMember(form)
      toast.success('Adhérent ajouté')
    }
    onClose()
  }

  const dateValue = (iso: string) => (iso ? iso.slice(0, 10) : '')
  const toISO = (value: string) => (value ? new Date(value).toISOString() : '')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={member ? "Modifier l'adhérent" : 'Nouvel adhérent'} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Prénom *" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} />
          <Input label="Nom *" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} />
          <Input label="Email *" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
          <Input label="Téléphone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Adresse" value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <Input label="Date de naissance" type="date" value={dateValue(form.dateOfBirth ?? '')} onChange={(e) => set('dateOfBirth', toISO(e.target.value))} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Type d'adhésion</label>
            <select
              value={form.membershipType}
              onChange={(e) => set('membershipType', e.target.value as Member['membershipType'])}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="student">Étudiant (5 emprunts)</option>
              <option value="standard">Standard (5 emprunts)</option>
              <option value="premium">Premium (8 emprunts)</option>
              <option value="staff">Staff (12 emprunts)</option>
            </select>
          </div>
          <Input label="Début d'adhésion" type="date" value={dateValue(form.membershipStart)} onChange={(e) => set('membershipStart', toISO(e.target.value))} />
          <Input label="Fin d'adhésion" type="date" value={dateValue(form.membershipEnd)} onChange={(e) => set('membershipEnd', toISO(e.target.value))} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Statut</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as Member['status'])}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
              <option value="expired">Expiré</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={handleSubmit}>{member ? 'Enregistrer' : 'Ajouter'}</Button>
        </div>
      </div>
    </Modal>
  )
}

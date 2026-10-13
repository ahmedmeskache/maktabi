import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Search, Mail, Phone, Award, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { ConfirmModal } from '@/components/ui/Modal'
import { MemberFormModal } from '@/components/members/MemberFormModal'
import { useLibraryStore } from '@/store/library'
import { formatDate } from '@/lib/utils'
import type { Member } from '@/types'

const statuses = ['Tous', 'active', 'expired', 'suspended', 'pending']
const types = ['Tous', 'student', 'standard', 'premium', 'staff']

export function Members() {
  const members = useLibraryStore((s) => s.members)
  const deleteMember = useLibraryStore((s) => s.deleteMember)
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tous')
  const [type, setType] = useState('Tous')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [toDelete, setToDelete] = useState<Member | null>(null)

  useEffect(() => {
    if (searchParams.get('new')) {
      setEditing(null)
      setFormOpen(true)
      searchParams.delete('new')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return members.filter((m) => {
      const matchesSearch =
        !q ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.memberNumber.toLowerCase().includes(q)
      const matchesStatus = status === 'Tous' || m.status === status
      const matchesType = type === 'Tous' || m.membershipType === type
      return matchesSearch && matchesStatus && matchesType
    })
  }, [members, search, status, type])

  const confirmDelete = () => {
    if (toDelete) {
      deleteMember(toDelete.id)
      toast.success('Adhérent supprimé')
      setToDelete(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Gestion des Adhérents</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">{filtered.length} adhérent{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="w-4 h-4 mr-1" /> Nouvel adhérent</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="search"
                placeholder="Rechercher par nom, email, numéro..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-body-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Dropdown trigger={<Button variant="outline" className="w-full sm:w-40 justify-between"><span>{status}</span></Button>} items={statuses.map((s) => ({ label: s, value: s }))} onSelect={setStatus} selectedValue={status} />
              <Dropdown trigger={<Button variant="outline" className="w-full sm:w-40 justify-between"><span>{type}</span></Button>} items={types.map((t) => ({ label: t, value: t }))} onSelect={setType} selectedValue={type} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 px-6">Adhérent</th>
                  <th className="pb-3 px-6 hidden md:table-cell">Contact</th>
                  <th className="pb-3 px-6 hidden lg:table-cell">Type</th>
                  <th className="pb-3 px-6">Statut</th>
                  <th className="pb-3 px-6 hidden xl:table-cell">Emprunts</th>
                  <th className="pb-3 px-6 hidden xl:table-cell">Adhésion</th>
                  <th className="pb-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-6">
                      <Link to={`/members/${member.id}`} className="flex items-center gap-3 group">
                        <Avatar name={`${member.firstName} ${member.lastName}`} size="md" src={member.avatarUrl} />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white group-hover:text-brand-600">{member.firstName} {member.lastName}</p>
                          <p className="text-body-xs text-slate-400">{member.memberNumber}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell text-body-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{member.email}</div>
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{member.phone || '—'}</div>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell">
                      <Badge variant={member.membershipType === 'premium' ? 'success' : member.membershipType === 'student' ? 'info' : 'neutral'} size="sm">
                        <Award className="w-3 h-3 mr-1" />
                        {member.membershipType}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={member.status === 'active' ? 'success' : member.status === 'expired' ? 'danger' : 'warning'} size="sm" dot>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 hidden xl:table-cell text-slate-600 dark:text-slate-400">{member.activeLoans} / {member.totalLoans}</td>
                    <td className="py-4 px-6 hidden xl:table-cell text-slate-600 dark:text-slate-400 text-body-sm">{formatDate(member.membershipEnd)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Link to={`/members/${member.id}`} className="text-brand-600 hover:underline text-body-sm px-2">Voir</Link>
                        <button onClick={() => { setEditing(member); setFormOpen(true) }} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500" aria-label="Modifier"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setToDelete(member)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500" aria-label="Supprimer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500 dark:text-slate-400">Aucun adhérent trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <MemberFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} member={editing} />
      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'adhérent"
        message={`Voulez-vous vraiment supprimer ${toDelete?.firstName ?? ''} ${toDelete?.lastName ?? ''} ?`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  )
}

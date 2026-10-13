import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Mail, Phone, Calendar, Award, BookOpen, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ConfirmModal } from '@/components/ui/Modal'
import { MemberFormModal } from '@/components/members/MemberFormModal'
import { useLibraryStore } from '@/store/library'
import { formatDate, formatCurrency } from '@/lib/utils'

export function MemberDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const members = useLibraryStore((s) => s.members)
  const loans = useLibraryStore((s) => s.loans)
  const books = useLibraryStore((s) => s.books)
  const deleteMember = useLibraryStore((s) => s.deleteMember)

  const member = members.find((m) => m.id === id)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!member) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
        <h2 className="text-heading-lg font-semibold text-slate-900 dark:text-white mb-3">Adhérent introuvable</h2>
        <Link to="/members"><Button variant="primary">Retour aux adhérents</Button></Link>
      </div>
    )
  }

  const memberLoans = loans.filter((l) => l.memberId === member.id).sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
  const activeLoans = memberLoans.filter((l) => l.status === 'active' || l.status === 'overdue')
  const history = memberLoans.filter((l) => l.status === 'returned' || l.status === 'lost')

  const bookTitle = (bookId: string) => books.find((b) => b.id === bookId)?.title ?? 'Ouvrage supprimé'

  const handleDelete = () => {
    deleteMember(member.id)
    toast.success('Adhérent supprimé')
    navigate('/members')
  }

  const statusVariant = (status: string) =>
    status === 'active' ? 'success' : status === 'expired' ? 'danger' : status === 'returned' ? 'neutral' : status === 'overdue' ? 'danger' : 'info'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/members" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm text-brand-600 dark:text-brand-400 font-medium uppercase">{member.membershipType}</p>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">{member.firstName} {member.lastName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}><Edit className="w-4 h-4 mr-1" /> Modifier</Button>
          <Button variant="outline" size="sm" className="text-red-500" onClick={() => setDeleteOpen(true)}><Trash2 className="w-4 h-4 mr-1" /> Supprimer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <Avatar name={`${member.firstName} ${member.lastName}`} size="2xl" src={member.avatarUrl} className="mx-auto mb-4" />
                <h3 className="text-heading-md font-semibold text-slate-900 dark:text-white">{member.firstName} {member.lastName}</h3>
                <p className="text-body-sm text-slate-500 dark:text-slate-400">{member.memberNumber}</p>
              </div>
              <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Statut</span>
                  <Badge variant={member.status === 'active' ? 'success' : member.status === 'expired' ? 'danger' : 'warning'} size="sm" dot>{member.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Type</span>
                  <Badge variant="success" size="sm"><Award className="w-3 h-3 mr-1" />{member.membershipType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Membre depuis</span>
                  <span className="font-medium text-slate-900 dark:text-white text-body-sm">{formatDate(member.membershipStart)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Expire le</span>
                  <span className="font-medium text-slate-900 dark:text-white text-body-sm">{formatDate(member.membershipEnd)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Amendes</span>
                  <span className={member.totalFines > 0 ? 'text-red-500 font-medium text-body-sm' : 'text-emerald-500 font-medium text-body-sm'}>{formatCurrency(member.totalFines)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeLoans.length}</p>
                  <p className="text-body-xs text-slate-500 dark:text-slate-400">En cours</p>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{member.totalLoans}</p>
                  <p className="text-body-xs text-slate-500 dark:text-slate-400">Total</p>
                </div>
              </div>
              <Button variant="primary" className="w-full" disabled={member.status !== 'active'} onClick={() => navigate(`/loans/checkout?memberId=${member.id}`)}>
                <BookOpen className="w-4 h-4 mr-1" /> Emprunter un livre
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Email</p><p className="font-medium text-slate-900 dark:text-white flex items-center gap-2"><Mail className="w-4 h-4" />{member.email}</p></div>
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Téléphone</p><p className="font-medium text-slate-900 dark:text-white flex items-center gap-2"><Phone className="w-4 h-4" />{member.phone || '—'}</p></div>
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Date de naissance</p><p className="font-medium text-slate-900 dark:text-white flex items-center gap-2"><Calendar className="w-4 h-4" />{member.dateOfBirth ? formatDate(member.dateOfBirth) : '—'}</p></div>
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Adresse</p><p className="font-medium text-slate-900 dark:text-white">{member.address || '—'}</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <CardTitle>Emprunts en cours</CardTitle>
              <Link to={`/loans/checkout?memberId=${member.id}`}><Button variant="outline" size="sm" disabled={member.status !== 'active'}><BookOpen className="w-4 h-4 mr-1" /> Nouvel emprunt</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              {activeLoans.length === 0 ? (
                <p className="p-8 text-center text-slate-500 dark:text-slate-400">Aucun emprunt en cours.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-3 px-6">Livre</th>
                      <th className="pb-3 px-6 hidden md:table-cell">Date emprunt</th>
                      <th className="pb-3 px-6">Date retour prévue</th>
                      <th className="pb-3 px-6">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{bookTitle(loan.bookId)}</td>
                        <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{formatDate(loan.loanDate)}</td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{formatDate(loan.dueDate)}</td>
                        <td className="py-4 px-6"><Badge variant={loan.status === 'overdue' ? 'danger' : 'info'} size="sm">{loan.status === 'overdue' ? 'En retard' : 'En cours'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-200 dark:border-slate-700">
              <CardTitle>Historique des emprunts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {history.length === 0 ? (
                <p className="p-8 text-center text-slate-500 dark:text-slate-400">Aucun historique disponible.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-3 px-6">Livre</th>
                      <th className="pb-3 px-6 hidden md:table-cell">Date emprunt</th>
                      <th className="pb-3 px-6">Date retour</th>
                      <th className="pb-3 px-6">Amende</th>
                      <th className="pb-3 px-6">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {history.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{bookTitle(loan.bookId)}</td>
                        <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{formatDate(loan.loanDate)}</td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{loan.returnDate ? formatDate(loan.returnDate) : '—'}</td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{loan.fineAmount > 0 ? formatCurrency(loan.fineAmount) : '—'}</td>
                        <td className="py-4 px-6"><Badge variant={statusVariant(loan.status)} size="sm">{loan.status === 'lost' ? 'Perdu' : 'Retourné'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <MemberFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} member={member} />
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'adhérent"
        message={`Voulez-vous vraiment supprimer ${member.firstName} ${member.lastName} ? Ses emprunts seront également supprimés.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  )
}

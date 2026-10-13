import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Repeat, AlertTriangle, Clock, Plus, Award, Sparkles, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useLibraryStore } from '@/store/library'
import { getBookCover, fallbackCover, formatCurrency, formatDate } from '@/lib/utils'

const colorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-brand-500/10', text: 'text-brand-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  accent: { bg: 'bg-accent-500/10', text: 'text-accent-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
}

export function Dashboard() {
  const books = useLibraryStore((s) => s.books)
  const members = useLibraryStore((s) => s.members)
  const loans = useLibraryStore((s) => s.loans)

  const isActiveLoan = (status: string) => status === 'active' || status === 'overdue'

  const data = useMemo(() => {
    const activeLoans = loans.filter((l) => isActiveLoan(l.status))
    const overdueLoans = activeLoans.filter((l) => new Date(l.dueDate).getTime() < Date.now())
    const activeMembers = members.filter((m) => m.status === 'active')
    const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0)
    const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0)

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const loansThisMonth = loans.filter((l) => new Date(l.loanDate).getTime() >= monthStart.getTime()).length
    const returnsThisMonth = loans.filter((l) => l.returnDate && new Date(l.returnDate).getTime() >= monthStart.getTime()).length
    const newMembersThisMonth = members.filter((m) => new Date(m.membershipStart).getTime() >= monthStart.getTime()).length
    const unpaidFines = loans.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fineAmount), 0)

    const recent = [...loans].sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime()).slice(0, 5).map((loan) => ({
      id: loan.id,
      type: loan.status === 'returned' ? 'return' : loan.status === 'overdue' ? 'overdue' : 'loan',
      bookId: loan.bookId,
      memberId: loan.memberId,
      date: loan.loanDate,
    }))

    const counts = new Map<string, number>()
    loans.forEach((l) => counts.set(l.bookId, (counts.get(l.bookId) ?? 0) + 1))
    const popular = [...counts.entries()]
      .map(([bookId, count]) => ({ book: books.find((b) => b.id === bookId), count }))
      .filter((x) => x.book)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const expiringMembers = members.filter((m) => {
      const end = new Date(m.membershipEnd).getTime()
      return end >= Date.now() && end <= Date.now() + 30 * 24 * 60 * 60 * 1000
    }).length

    return { activeLoans, overdueLoans, activeMembers, totalCopies, availableCopies, loansThisMonth, returnsThisMonth, newMembersThisMonth, unpaidFines, recent, popular, expiringMembers }
  }, [books, members, loans])

  const bookTitle = (bookId: string) => books.find((b) => b.id === bookId)?.title ?? 'Ouvrage supprimé'
  const memberName = (memberId: string) => {
    const m = members.find((x) => x.id === memberId)
    return m ? `${m.firstName} ${m.lastName}` : 'Adhérent supprimé'
  }

  const stats = [
    { name: 'Total Livres', value: books.length.toLocaleString('fr-FR'), sub: `${data.availableCopies} disponibles`, icon: BookOpen, color: 'primary', href: '/books' },
    { name: 'Adhérents Actifs', value: data.activeMembers.length.toLocaleString('fr-FR'), sub: `${members.length} au total`, icon: Users, color: 'emerald', href: '/members' },
    { name: 'Emprunts en Cours', value: data.activeLoans.length.toLocaleString('fr-FR'), sub: `${data.loansThisMonth} ce mois`, icon: Repeat, color: 'accent', href: '/loans' },
    { name: 'En Retard', value: data.overdueLoans.length.toLocaleString('fr-FR'), sub: 'à relancer', icon: AlertTriangle, color: 'red', href: '/loans' },
  ]

  const quickStats = [
    { label: 'Nouveaux adhérents', value: data.newMembersThisMonth, icon: Users, color: 'primary', href: '/members' },
    { label: 'Emprunts ce mois', value: data.loansThisMonth, icon: Repeat, color: 'emerald', href: '/loans' },
    { label: 'Retours ce mois', value: data.returnsThisMonth, icon: BookOpen, color: 'amber', href: '/loans' },
    { label: 'Amendes impayées', value: formatCurrency(data.unpaidFines), icon: Sparkles, color: 'accent', href: '/loans' },
  ]

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Tableau de bord</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">Vue d'ensemble de votre bibliothèque Maktabi</p>
        </div>
        <Link to="/loans/checkout"><Button variant="primary" className="gap-2"><Plus className="w-4 h-4" /> Nouvel emprunt</Button></Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colors = colorMap[stat.color] || colorMap.primary
          return (
            <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}>
              <Link to={stat.href} className="block">
                <Card className="h-full card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-body-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                        <p className="text-display-sm font-bold text-slate-900 dark:text-white mt-1 tabular-nums">{stat.value}</p>
                      </div>
                      <div className={'w-14 h-14 rounded-2xl flex items-center justify-center ' + colors.bg}>
                        <stat.icon className={'w-7 h-7 ' + colors.text} />
                      </div>
                    </div>
                    <p className="mt-5 text-body-sm text-slate-500 dark:text-slate-400">{stat.sub}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {quickStats.map((stat, index) => {
                const colors = colorMap[stat.color] || colorMap.primary
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 + 0.2 }}>
                    <Link to={stat.href} className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                      <div className="flex items-center justify-between mb-3">
                        <div className={'w-10 h-10 rounded-xl flex items-center justify-center ' + colors.bg + ' ' + colors.text}><stat.icon className="w-5 h-5" /></div>
                      </div>
                      <p className="text-heading-md font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-body-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{stat.label}</p>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-500" /> Activité Récente</CardTitle>
              <Link to="/loans" className="text-body-sm text-brand-500 hover:underline flex items-center gap-1">Voir tout <ArrowUpRight className="w-3 h-3" /></Link>
            </CardHeader>
            <CardContent className="p-0">
              {data.recent.length === 0 ? (
                <p className="p-8 text-center text-slate-500 dark:text-slate-400">Aucune activité récente.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recent.map((activity, index) => {
                    const color = activity.type === 'return' ? 'emerald' : activity.type === 'overdue' ? 'red' : 'primary'
                    const colors = colorMap[color]
                    const Icon = activity.type === 'return' ? BookOpen : activity.type === 'overdue' ? AlertTriangle : Repeat
                    return (
                      <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className={'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ' + colors.bg + ' ' + colors.text}><Icon className="w-5 h-5" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{bookTitle(activity.bookId)} — {memberName(activity.memberId)}</p>
                          <p className="text-body-sm text-slate-500 dark:text-slate-400">{activity.type === 'overdue' ? 'En retard' : activity.type === 'return' ? 'Retour' : 'Emprunt'}</p>
                        </div>
                        <span className="text-body-xs text-slate-400 whitespace-nowrap">{formatDate(activity.date)}</span>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Livres Populaires</CardTitle>
              <Link to="/books" className="text-body-sm text-brand-500 hover:underline">Voir tout</Link>
            </CardHeader>
            <CardContent className="p-0">
              {data.popular.length === 0 ? (
                <p className="p-8 text-center text-slate-500 dark:text-slate-400">Pas encore de prêts.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.popular.map((entry, index) => (
                    <motion.div key={entry.book!.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <Link to={`/books/${entry.book!.id}`} className="relative w-12 h-18 flex-shrink-0 rounded-lg overflow-hidden">
                        <img src={getBookCover(entry.book!)} alt={entry.book!.title} onError={(e) => { e.currentTarget.src = fallbackCover(entry.book!.title) }} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-brand-500 transition-colors">{entry.book!.title}</p>
                        <p className="text-body-sm text-slate-500 dark:text-slate-400 truncate">{entry.book!.author}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white">{entry.count}</span>
                        <span className="text-body-xs text-slate-400 ml-1">prêts</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-brand-500" /> Actions Rapides</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link to="/books?new=1" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-brand-300 dark:group-hover:border-brand-700 group-hover:bg-brand-500/5 group-hover:text-brand-500 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 bg-brand-500/10 text-brand-500"><Plus className="w-6 h-6" /></div>
                  <span className="font-medium text-center">Ajouter un livre</span>
                </Button>
              </Link>
              <Link to="/members?new=1" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 group-hover:bg-emerald-500/5 group-hover:text-emerald-500 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 bg-emerald-500/10 text-emerald-500"><Users className="w-6 h-6" /></div>
                  <span className="font-medium text-center">Nouvel adhérent</span>
                </Button>
              </Link>
              <Link to="/loans/checkout" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-accent-300 dark:group-hover:border-accent-700 group-hover:bg-accent-500/5 group-hover:text-accent-500 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 bg-accent-500/10 text-accent-500"><Repeat className="w-6 h-6" /></div>
                  <span className="font-medium text-center">Nouvel emprunt</span>
                </Button>
              </Link>
              <Link to="/loans" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-red-300 dark:group-hover:border-red-700 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 bg-red-500/10 text-red-500"><Clock className="w-6 h-6" /></div>
                  <span className="font-medium text-center">Retours en retard</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Alertes & Rappels</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Link to="/loans" className="block p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0"><AlertTriangle className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 dark:text-amber-100">{data.overdueLoans.length} emprunt{data.overdueLoans.length > 1 ? 's' : ''} en retard</p>
                    <p className="text-body-sm text-amber-700 dark:text-amber-300 mt-1">Relancez les adhérents concernés</p>
                  </div>
                </div>
              </Link>
              <Link to="/books" className="block p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl hover:bg-primary-500/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500 flex-shrink-0"><BookOpen className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-primary-900 dark:text-primary-100">{books.filter((b) => b.availableCopies === 0).length} livre{books.filter((b) => b.availableCopies === 0).length > 1 ? 's' : ''} indisponible{books.filter((b) => b.availableCopies === 0).length > 1 ? 's' : ''}</p>
                    <p className="text-body-sm text-primary-700 dark:text-primary-300 mt-1">Tous les exemplaires sont empruntés</p>
                  </div>
                </div>
              </Link>
              <Link to="/members" className="block p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0"><Award className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">Adhésions à renouveler</p>
                    <p className="text-body-sm text-emerald-700 dark:text-emerald-300 mt-1">{data.expiringMembers} adhérent{data.expiringMembers > 1 ? 's' : ''} expire{data.expiringMembers > 1 ? 'nt' : ''} dans les 30 jours</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-3 text-body-sm text-slate-400">
          <Avatar name="Maktabi" size="sm" />
          {data.totalCopies} exemplaires au total dans la collection
        </div>
      </div>
    </div>
  )
}

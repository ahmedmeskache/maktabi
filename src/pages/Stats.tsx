import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download, BookOpen, Repeat, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { toast } from 'sonner'
import { useLibraryStore } from '@/store/library'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
const COLORS = ['#2f7d5b', '#22c55e', '#d4a02a', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#a16207', '#6366f1']

const periods = [
  { label: 'Ce mois', value: 'month' },
  { label: 'Ce trimestre', value: 'quarter' },
  { label: 'Cette année', value: 'year' },
]

export function Stats() {
  const books = useLibraryStore((s) => s.books)
  const members = useLibraryStore((s) => s.members)
  const loans = useLibraryStore((s) => s.loans)
  const [period, setPeriod] = useState('month')

  const periodStart = useMemo(() => {
    const d = new Date()
    if (period === 'month') d.setMonth(d.getMonth() - 1)
    else if (period === 'quarter') d.setMonth(d.getMonth() - 3)
    else d.setFullYear(d.getFullYear() - 1)
    return d.getTime()
  }, [period])

  const periodLoans = useMemo(() => loans.filter((l) => new Date(l.loanDate).getTime() >= periodStart), [loans, periodStart])

  const summary = useMemo(() => {
    const total = periodLoans.length
    const uniqueBooks = new Set(periodLoans.map((l) => l.bookId)).size
    const activeMembers = members.filter((m) => m.status === 'active').length
    const returned = loans.filter((l) => l.status === 'returned').length
    const finished = loans.filter((l) => l.status === 'returned' || l.status === 'lost').length
    const returnRate = finished > 0 ? (returned / finished) * 100 : 100
    return { total, uniqueBooks, activeMembers, returnRate }
  }, [periodLoans, members, loans])

  const monthlyData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const start = d.getTime()
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime()
      return {
        month: MONTH_LABELS[d.getMonth()],
        loans: loans.filter((l) => new Date(l.loanDate).getTime() >= start && new Date(l.loanDate).getTime() < end).length,
        returns: loans.filter((l) => l.returnDate && new Date(l.returnDate).getTime() >= start && new Date(l.returnDate).getTime() < end).length,
        newMembers: members.filter((m) => new Date(m.membershipStart).getTime() >= start && new Date(m.membershipStart).getTime() < end).length,
      }
    })
  }, [loans, members])

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>()
    loans.forEach((l) => {
      const book = books.find((b) => b.id === l.bookId)
      if (!book) return
      counts.set(book.category, (counts.get(book.category) ?? 0) + 1)
    })
    return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [loans, books])

  const popularBooks = useMemo(() => {
    const counts = new Map<string, number>()
    loans.forEach((l) => counts.set(l.bookId, (counts.get(l.bookId) ?? 0) + 1))
    return [...counts.entries()]
      .map(([bookId, count]) => ({ book: books.find((b) => b.id === bookId), count }))
      .filter((x) => x.book)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [loans, books])

  const downloadReport = (name: string) => {
    let csv = ''
    if (name === 'Prêts par période') {
      csv = 'Mois,Emprunts,Retours,Nouveaux adhérents\n' + monthlyData.map((r) => `${r.month},${r.loans},${r.returns},${r.newMembers}`).join('\n')
    } else if (name === 'Adhérents actifs') {
      csv = 'Nom,Email,Type,Statut,Emprunts\n' + members.map((m) => `"${m.firstName} ${m.lastName}",${m.email},${m.membershipType},${m.status},${m.totalLoans}`).join('\n')
    } else if (name === 'Livres populaires') {
      csv = 'Titre,Auteur,Prêts\n' + popularBooks.map((p) => `"${p.book!.title}","${p.book!.author}",${p.count}`).join('\n')
    } else {
      const fines = loans.filter((l) => l.fineAmount > 0)
      csv = 'Livre,Amende,Payée\n' + fines.map((l) => `"${books.find((b) => b.id === l.bookId)?.title ?? ''}",${l.fineAmount},${l.finePaid}`).join('\n')
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Rapport « ${name} » téléchargé`)
  }

  const cards = [
    { label: 'Total prêts', value: summary.total, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-100 dark:bg-brand-900/30', icon: Repeat },
    { label: 'Livres empruntés', value: summary.uniqueBooks, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-100 dark:bg-accent-900/30', icon: BookOpen },
    { label: 'Adhérents actifs', value: summary.activeMembers, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: Users },
    { label: 'Taux de retour', value: `${summary.returnRate.toFixed(1)}%`, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Statistiques</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">Analyse de l'activité de la bibliothèque</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => downloadReport('Prêts par période')}><Download className="w-4 h-4 mr-1" /> Exporter</Button>
          <Dropdown trigger={<Button variant="outline" className="justify-between"><Calendar className="w-4 h-4 mr-1" />{periods.find((p) => p.value === period)?.label}</Button>} items={periods} onSelect={setPeriod} selectedValue={period} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="h-full"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-body-sm text-slate-500 dark:text-slate-400">{stat.label}</p><p className="text-display-md font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p></div><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div></div></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardHeader><CardTitle>Évolution des prêts (6 mois)</CardTitle></CardHeader><CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyData}><defs><linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2f7d5b" stopOpacity={0.3}/><stop offset="95%" stopColor="#2f7d5b" stopOpacity={0}/></linearGradient><linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} /><XAxis dataKey="month" stroke="#a2937a" fontSize={12} /><YAxis stroke="#a2937a" fontSize={12} allowDecimals={false} /><Tooltip contentStyle={{ backgroundColor: '#221b12', border: 'none', borderRadius: '12px' }} labelStyle={{ color: '#fff' }} /><Legend /><Area type="monotone" dataKey="loans" name="Emprunts" stroke="#2f7d5b" strokeWidth={2} fillOpacity={1} fill="url(#colorLoans)" /><Area type="monotone" dataKey="returns" name="Retours" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorReturns)" /></AreaChart></ResponsiveContainer>
          </CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card><CardHeader><CardTitle>Répartition par catégorie</CardTitle></CardHeader><CardContent className="h-80">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>{categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ backgroundColor: '#221b12', border: 'none', borderRadius: '12px' }} formatter={(value) => [`${value} prêts`, '']} /></PieChart></ResponsiveContainer>
            )}
          </CardContent></Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card><CardHeader><CardTitle>Livres les plus empruntés</CardTitle></CardHeader><CardContent>
            {popularBooks.length === 0 ? (
              <p className="py-8 text-center text-slate-500 dark:text-slate-400">Aucune donnée</p>
            ) : (
              <div className="space-y-3">{popularBooks.map((entry, index) => (<motion.div key={entry.book!.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl"><span className="w-8 text-center font-bold text-slate-400 dark:text-slate-500">{index + 1}</span><div className="flex-1 min-w-0"><p className="font-medium text-slate-900 dark:text-white truncate">{entry.book!.title}</p><p className="text-body-sm text-slate-500 dark:text-slate-400 truncate">{entry.book!.author}</p></div><div className="text-right"><span className="font-semibold text-slate-900 dark:text-white">{entry.count}</span><span className="text-body-xs text-slate-400 ml-1">prêts</span></div></motion.div>))}</div>
            )}
          </CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card><CardHeader><CardTitle>Activité mensuelle</CardTitle></CardHeader><CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} /><XAxis type="number" stroke="#a2937a" fontSize={12} allowDecimals={false} /><YAxis type="category" dataKey="month" stroke="#a2937a" fontSize={12} width={50} /><Tooltip contentStyle={{ backgroundColor: '#221b12', border: 'none', borderRadius: '12px' }} /><Legend /><Bar dataKey="loans" name="Emprunts" fill="#2f7d5b" radius={[0, 4, 4, 0]} /><Bar dataKey="returns" name="Retours" fill="#22c55e" radius={[0, 4, 4, 0]} /><Bar dataKey="newMembers" name="Adhérents" fill="#f59e0b" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
          </CardContent></Card>
        </motion.div>
      </div>

      <Card><CardHeader><CardTitle>Rapports disponibles</CardTitle></CardHeader><CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Prêts par période', 'Adhérents actifs', 'Livres populaires', 'Amendes & retards'].map((report, index) => (
          <motion.button key={report} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => downloadReport(report)} className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-left hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"><p className="font-medium text-slate-900 dark:text-white">{report}</p><p className="text-body-sm text-slate-500 dark:text-slate-400 mt-1">Télécharger (CSV)</p></motion.button>
        ))}
      </CardContent></Card>
    </div>
  )
}

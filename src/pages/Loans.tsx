import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Clock, AlertTriangle, RotateCcw, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dropdown } from '@/components/ui/Dropdown'
import { formatDate } from '@/lib/utils'

const mockLoans = [
  { id: '1', book: 'Le Petit Prince', member: 'Marie Dubois', loanDate: '2024-01-10', dueDate: '2024-02-10', returnDate: null, status: 'active', fine: 0 },
  { id: '2', book: '1984', member: 'Jean Martin', loanDate: '2024-01-15', dueDate: '2024-02-15', returnDate: null, status: 'active', fine: 0 },
  { id: '3', book: 'L\'Étranger', member: 'Sophie Bernard', loanDate: '2024-01-05', dueDate: '2024-02-05', returnDate: null, status: 'overdue', fine: 5.50 },
  { id: '4', book: 'Le Rouge et le Noir', member: 'Pierre Durand', loanDate: '2023-12-01', dueDate: '2023-12-31', returnDate: '2023-12-28', status: 'returned', fine: 0 },
  { id: '5', book: 'Harry Potter', member: 'Lucie Petit', loanDate: '2023-11-15', dueDate: '2023-12-15', returnDate: '2023-12-20', status: 'returned', fine: 3.00 },
]

const statuses = ['Tous', 'active', 'overdue', 'returned', 'lost']

export function Loans() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tous')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Gestion des Emprunts</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">{mockLoans.filter(l => l.status === 'active').length} emprunts en cours • {mockLoans.filter(l => l.status === 'overdue').length} en retard</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filtres</Button>
          <Link to="/loans/checkout">
            <Button variant="primary"><Plus className="w-4 h-4 mr-1" /> Nouvel emprunt</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
            <div><p className="text-body-sm text-slate-500 dark:text-slate-400">En cours</p><p className="text-heading-md font-bold text-slate-900 dark:text-white">{mockLoans.filter(l => l.status === 'active').length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
            <div><p className="text-body-sm text-slate-500 dark:text-slate-400">En retard</p><p className="text-heading-md font-bold text-slate-900 dark:text-white">{mockLoans.filter(l => l.status === 'overdue').length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><RotateCcw className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
            <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Retournés ce mois</p><p className="text-heading-md font-bold text-slate-900 dark:text-white">23</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="search" placeholder="Rechercher livre, adhérent..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-body-sm" />
            </div>
            <Dropdown trigger={<Button variant="outline" className="w-full sm:w-40 justify-between"><span>{status}</span></Button>} items={statuses.map(s => ({ label: s, value: s }))} onSelect={setStatus} selectedValue={status} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 px-6">Livre</th>
                  <th className="pb-3 px-6">Adhérent</th>
                  <th className="pb-3 px-6 hidden md:table-cell">Date emprunt</th>
                  <th className="pb-3 px-6">Date retour prévue</th>
                  <th className="pb-3 px-6">Retour effectif</th>
                  <th className="pb-3 px-6">Statut</th>
                  <th className="pb-3 px-6">Amende</th>
                  <th className="pb-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockLoans.map((loan, index) => (
                  <motion.tr key={loan.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={loan.status === 'overdue' ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}>
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{loan.book}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{loan.member}</td>
                    <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{formatDate(loan.loanDate)}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{formatDate(loan.dueDate)}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{loan.returnDate ? formatDate(loan.returnDate) : <span className="text-slate-400">—</span>}</td>
                    <td className="py-4 px-6">
                      <Badge variant={loan.status === 'active' ? 'info' : loan.status === 'overdue' ? 'danger' : loan.status === 'returned' ? 'success' : 'danger'} size="sm">
                        {loan.status === 'active' ? 'En cours' : loan.status === 'overdue' ? 'En retard' : loan.status === 'returned' ? 'Retourné' : 'Perdu'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className={loan.fine > 0 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-green-600 dark:text-green-400'}>
                        {loan.fine > 0 ? `${loan.fine.toFixed(2)}€` : '0€'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {loan.status === 'active' && <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Retour"><RotateCcw className="w-4 h-4" /></Button>}
                        {loan.status === 'overdue' && <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" aria-label="Relancer"><AlertTriangle className="w-4 h-4" /></Button>}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Détails"><Calendar className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
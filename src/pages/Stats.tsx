import { motion } from 'framer-motion'
import { Calendar, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const loansData = [
  { month: 'Jan', loans: 120, returns: 110, newMembers: 15 },
  { month: 'Fév', loans: 135, returns: 125, newMembers: 12 },
  { month: 'Mar', loans: 150, returns: 140, newMembers: 18 },
  { month: 'Avr', loans: 145, returns: 138, newMembers: 14 },
  { month: 'Mai', loans: 160, returns: 155, newMembers: 20 },
  { month: 'Juin', loans: 180, returns: 170, newMembers: 22 },
]

const categoryData = [
  { name: 'Littérature', value: 420 },
  { name: 'Science-Fiction', value: 280 },
  { name: 'Philosophie', value: 190 },
  { name: 'Fantasy', value: 310 },
  { name: 'Histoire', value: 150 },
  { name: 'Biographie', value: 120 },
  { name: 'Jeunesse', value: 230 },
]

const popularBooks = [
  { title: 'Le Petit Prince', loans: 142 },
  { title: '1984', loans: 128 },
  { title: "L'Étranger", loans: 115 },
  { title: 'Harry Potter', loans: 98 },
  { title: 'Seigneur des Anneaux', loans: 87 },
  { title: 'Le Rouge et le Noir', loans: 76 },
]

export function Stats() {
  const [period, setPeriod] = useState('month')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Statistiques</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">Analyse de l'activité de la bibliothèque</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exporter</Button>
          <Dropdown trigger={<Button variant="outline" className="w-full sm:w-40 justify-between"><Calendar className="w-4 h-4 mr-1" />{period === 'month' ? 'Ce mois' : period === 'quarter' ? 'Ce trimestre' : 'Cette année'}</Button>} items={[{ label: 'Ce mois', value: 'month' }, { label: 'Ce trimestre', value: 'quarter' }, { label: 'Cette année', value: 'year' }]} onSelect={setPeriod} selectedValue={period} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total prêts', value: '1,247', change: '+12%', color: 'brand', icon: Calendar },
          { label: 'Livres uniques', value: '892', change: '+8%', color: 'green', icon: Calendar },
          { label: 'Adhérents actifs', value: '456', change: '+5%', color: 'blue', icon: Calendar },
          { label: 'Taux de retour', value: '94.2%', change: '+1.2%', color: 'purple', icon: Calendar },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="h-full"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-body-sm text-slate-500 dark:text-slate-400">{stat.label}</p><p className="text-display-md font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p></div><div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center"><stat.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" /></div></div><div className="mt-4"><span className="text-body-sm font-medium text-green-600">{stat.change}</span><span className="text-body-sm text-slate-500 dark:text-slate-400 ml-2">vs période précédente</span></div></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Évolution des prêts</CardTitle></CardHeader><CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={loansData}><defs><linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient><linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} labelStyle={{ color: '#fff' }} itemStyle={{ fontWeight: 600 }} /><Legend /><Area type="monotone" dataKey="loans" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorLoans)" /><Area type="monotone" dataKey="returns" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorReturns)" /></AreaChart></ResponsiveContainer>
          </CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Répartition par catégorie</CardTitle></CardHeader><CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}><Cell fill="#0ea5e9" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /><Cell fill="#8b5cf6" /><Cell fill="#ec4899" /><Cell fill="#06b6d4" /></Pie><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} formatter={(value) => [`${value} livres`, '']} /></PieChart></ResponsiveContainer>
          </CardContent></Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Livres les plus empruntés</CardTitle></CardHeader><CardContent>
            <div className="space-y-3">{popularBooks.map((book, index) => (<motion.div key={book.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl"><span className="w-8 text-center font-bold text-slate-400 dark:text-slate-500">{index + 1}</span><div className="flex-1 min-w-0"><p className="font-medium text-slate-900 dark:text-white truncate">{book.title}</p></div><div className="text-right"><span className="font-semibold text-slate-900 dark:text-white">{book.loans}</span><span className="text-body-xs text-slate-400 ml-1">prêts</span></div></motion.div>))}</div>
          </CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Activité mensuelle</CardTitle></CardHeader><CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={loansData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis type="number" stroke="#94a3b8" fontSize={12} /><YAxis type="category" dataKey="month" stroke="#94a3b8" fontSize={12} width={80} /><Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} /><Legend /><Bar dataKey="loans" fill="#0ea5e9" radius={[0, 4, 4, 0]} /><Bar dataKey="returns" fill="#22c55e" radius={[0, 4, 4, 0]} /><Bar dataKey="newMembers" fill="#f59e0b" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
          </CardContent></Card>
        </motion.div>
      </div>

      <Card><CardHeader><CardTitle>Rapports disponibles</CardTitle></CardHeader><CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Prêts par période', 'Adhérents actifs', 'Livres populaires', 'Amendes & retards'].map((report, index) => (
          <motion.button key={report} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-left hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"><p className="font-medium text-slate-900 dark:text-white">{report}</p><p className="text-body-sm text-slate-500 dark:text-slate-400 mt-1">Générer le rapport PDF/Excel</p></motion.button>
        ))}
      </CardContent></Card>
    </div>
  )
}

import { useState } from 'react'
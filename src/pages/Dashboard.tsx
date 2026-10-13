import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Users,
  Repeat,
  AlertTriangle,
  Clock,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Sparkles,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: 'bg-primary-500/10', text: 'text-primary-500', border: 'border-primary-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
}

const stats = [
  {
    name: 'Total Livres',
    value: '12,847',
    change: '+12%',
    trend: 'up',
    icon: BookOpen,
    color: 'primary',
    href: '/books',
    bgGradient: 'from-primary-500/10 to-primary-400/10',
  },
  {
    name: 'Adhérents Actifs',
    value: '3,241',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'emerald',
    href: '/members',
    bgGradient: 'from-emerald-500/10 to-emerald-400/10',
  },
  {
    name: 'Emprunts en Cours',
    value: '1,156',
    change: '-3%',
    trend: 'down',
    icon: Repeat,
    color: 'blue',
    href: '/loans',
    bgGradient: 'from-blue-500/10 to-blue-400/10',
  },
  {
    name: 'En Retard',
    value: '47',
    change: '+5',
    trend: 'up',
    icon: AlertTriangle,
    color: 'red',
    href: '/loans?status=overdue',
    bgGradient: 'from-red-500/10 to-red-400/10',
  },
]

const recentActivity = [
  { id: 1, type: 'loan', book: 'Le Petit Prince', member: 'Marie Dubois', time: 'Il y a 5 min', icon: Repeat, color: 'primary' },
  { id: 2, type: 'return', book: '1984', member: 'Jean Martin', time: 'Il y a 12 min', icon: BookOpen, color: 'emerald' },
  { id: 3, type: 'member', book: '', member: 'Sophie Bernard', time: 'Il y a 28 min', icon: Users, color: 'purple' },
  { id: 4, type: 'loan', book: "L'Étranger", member: 'Pierre Durand', time: 'Il y a 45 min', icon: Repeat, color: 'primary' },
  { id: 5, type: 'overdue', book: 'Le Rouge et le Noir', member: 'Lucie Petit', time: 'Il y a 1 heure', icon: AlertTriangle, color: 'red' },
]

const popularBooks = [
  { rank: 1, title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', loans: 142, category: 'Littérature', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop' },
  { rank: 2, title: '1984', author: 'George Orwell', loans: 128, category: 'Science-Fiction', cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop' },
  { rank: 3, title: "L'Étranger", author: 'Albert Camus', loans: 115, category: 'Philosophie', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=150&fit=crop' },
  { rank: 4, title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', loans: 98, category: 'Fantasy', cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=100&h=150&fit=crop' },
  { rank: 5, title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', loans: 87, category: 'Fantasy', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop' },
]

const quickStats = [
  { label: 'Nouveaux adhérents', value: '23', icon: User, color: 'primary' },
  { label: 'Livres ajoutés', value: '12', icon: BookOpen, color: 'emerald' },
  { label: 'Réservations', value: '8', icon: Award, color: 'amber' },
  { label: 'Amendes payées', value: '342€', icon: Sparkles, color: 'blue' },
]

export function Dashboard() {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] gradient-text">Tableau de bord</h1>
          <p className="text-body-md text-[var(--color-text-secondary)] mt-1">Vue d'ensemble de votre bibliothèque Maktabi</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filtres</Button>
          <Button variant="primary" className="gap-2"><Plus className="w-4 h-4" /> Nouveau</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          return (
            <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }}>
              <Link to={stat.href} className="block">
                <Card className="h-full card-hover relative overflow-hidden">
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-100 transition-opacity duration-300', stat.bgGradient)} />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-body-sm font-medium text-[var(--color-text-secondary)]">{stat.name}</p>
                        <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1 tabular-nums">{stat.value}</p>
                      </div>
                      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', stat.bgGradient.replace('from-', 'bg-').replace('to-', 'to-'))}>
                        <stat.icon className={cn('w-7 h-7', colorMap[stat.color]?.text || colorMap.primary.text)} />
                      </div>
                    </div>
                  <div className="mt-5 flex items-center gap-2">
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className={cn('flex items-center gap-1 text-body-sm font-semibold', stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}
                    >
                      {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </motion.span>
                    <span className="text-body-sm text-[var(--color-text-muted)]">vs mois dernier</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )})}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-4">
                {quickStats.map((stat, index) => {
                  const colors = colorMap[stat.color] || colorMap.primary
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 + 0.2 }}>
                      <Link to="#" className="block p-4 rounded-xl bg-[var(--color-bg-tertiary)]/50 hover:bg-[var(--color-bg-tertiary)] transition-colors group">
                        <div className="flex items-center justify-between mb-3">
                          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg, colors.text)}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <span className={cn('text-body-xs font-semibold', colors.text)}>+{stat.value}</span>
                        </div>
                        <p className="text-body-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">{stat.label}</p>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-500" />
                Activité Récente
              </CardTitle>
              <Link to="/loans" className="text-body-sm text-primary-500 hover:underline flex items-center gap-1">Voir tout <ArrowUpRight className="w-3 h-3" /></Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border-primary)]">
                {recentActivity.map((activity, index) => {
                  const colors = colorMap[activity.color] || colorMap.primary
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group"
                    >
                      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colors.bg, colors.text)}>
                        <activity.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-text-primary)] truncate group-hover:text-primary-500 transition-colors">
                          {activity.type === 'member' ? `Nouveau membre : ${activity.member}` : `${activity.book} — ${activity.member}`}
                        </p>
                        <p className="text-body-sm text-[var(--color-text-muted)] capitalize">{activity.type === 'overdue' ? 'En retard' : activity.type === 'return' ? 'Retour' : 'Emprunt'}</p>
                      </div>
                      <span className="text-body-xs text-[var(--color-text-muted)] whitespace-nowrap">{activity.time}</span>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Livres Populaires
              </CardTitle>
              <Link to="/books?sort=popular" className="text-body-sm text-primary-500 hover:underline">Voir tout</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border-primary)]">
                {popularBooks.map((book, index) => {
                  return (
                    <motion.div
                      key={book.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors group"
                    >
                      <Link to={`/books/1`} className="relative w-12 h-18 flex-shrink-0 rounded-lg overflow-hidden group">
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-text-primary)] truncate group-hover:text-primary-500 transition-colors">{book.title}</p>
                        <p className="text-body-sm text-[var(--color-text-muted)] truncate">{book.author}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[var(--color-text-primary)]">{book.loans}</span>
                        <span className="text-body-xs text-[var(--color-text-muted)] ml-1">prêts</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-500" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link to="/books/new" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-primary-300 dark:group-hover:border-primary-700 group-hover:bg-primary-500/5 group-hover:text-primary-500 transition-all">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110', 'bg-primary-500/10 text-primary-500')}>
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-center">Ajouter un livre</span>
                </Button>
              </Link>
              <Link to="/members/new" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-emerald-300 dark:group-hover:border-emerald-700 group-hover:bg-emerald-500/5 group-hover:text-emerald-500 transition-all">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110', 'bg-emerald-500/10 text-emerald-500')}>
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-center">Nouvel adhérent</span>
                </Button>
              </Link>
              <Link to="/loans/checkout" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-blue-300 dark:group-hover:border-blue-700 group-hover:bg-blue-500/5 group-hover:text-blue-500 transition-all">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110', 'bg-blue-500/10 text-blue-500')}>
                    <Repeat className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-center">Nouvel emprunt</span>
                </Button>
              </Link>
              <Link to="/loans?status=overdue" className="group">
                <Button variant="outline" className="w-full h-24 flex-col gap-3 p-5 group-hover:border-red-300 dark:group-hover:border-red-700 group-hover:bg-red-500/5 group-hover:text-red-500 transition-all">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110', 'bg-red-500/10 text-red-500')}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-center">Retours en retard</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Alertes & Rappels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 dark:text-amber-100">47 emprunts en retard</p>
                    <p className="text-body-sm text-amber-700 dark:text-amber-300 mt-1">Relancez les adhérents concernés cette semaine</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">12 livres en maintenance</p>
                    <p className="text-body-sm text-blue-700 dark:text-blue-300 mt-1">Vérifiez leur état avant remise en rayon</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">Adhésions à renouveler</p>
                    <p className="text-body-sm text-emerald-700 dark:text-emerald-300 mt-1">23 adhérents expirent dans les 30 jours</p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
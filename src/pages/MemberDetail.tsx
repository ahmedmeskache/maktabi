import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Award, BookOpen, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

const member = {
  id: '1',
  memberNumber: 'MBR-001',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@email.fr',
  phone: '01 23 45 67 89',
  address: '123 Rue de la Bibliothèque, 75001 Paris',
  dateOfBirth: '1990-05-15',
  membershipType: 'premium',
  membershipStart: '2023-01-15',
  membershipEnd: '2025-01-15',
  status: 'active',
  avatarUrl: null,
  activeLoans: 2,
  totalLoans: 15,
  totalFines: 0,
}

const activeLoans = [
  { id: '1', book: 'Le Petit Prince', author: 'A. de Saint-Exupéry', loanDate: '2024-01-10', dueDate: '2024-02-10', status: 'active' },
  { id: '2', book: '1984', author: 'G. Orwell', loanDate: '2024-01-15', dueDate: '2024-02-15', status: 'active' },
]

const loanHistory = [
  { id: '3', book: 'L\'Étranger', author: 'A. Camus', loanDate: '2023-12-01', returnDate: '2023-12-20', status: 'returned' },
  { id: '4', book: 'Le Rouge et le Noir', author: 'Stendhal', loanDate: '2023-11-01', returnDate: '2023-11-25', status: 'returned' },
]

export function MemberDetail() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/members" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-body-sm text-brand-600 dark:text-brand-400 font-medium">ADHÉRENT PREMIUM</p>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">{member.firstName} {member.lastName}</h1>
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
                  <Badge variant={member.status === 'active' ? 'success' : 'danger'} size="sm" dot>{member.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Type</span>
                  <Badge variant="success" size="sm"><Award className="w-3 h-3 mr-1" />{member.membershipType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Membre depuis</span>
                  <span className="font-medium text-slate-900 dark:text-white text-body-sm">{member.membershipStart}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-body-sm">Expire le</span>
                  <span className="font-medium text-slate-900 dark:text-white text-body-sm">{member.membershipEnd}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{member.activeLoans}</p>
                  <p className="text-body-xs text-slate-500 dark:text-slate-400">En cours</p>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{member.totalLoans}</p>
                  <p className="text-body-xs text-slate-500 dark:text-slate-400">Total</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/loans/checkout"><Button variant="primary" className="flex-1"><BookOpen className="w-4 h-4 mr-1" /> Emprunter</Button></Link>
                <Button variant="outline"><Edit className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <CardTitle>Informations personnelles</CardTitle>
              <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-1" /> Modifier</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Email</p><p className="font-medium text-slate-900 dark:text-white flex items-center gap-2"><Mail className="w-4 h-4" />{member.email}</p></div>
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Téléphone</p><p className="font-medium text-slate-900 dark:text-white flex items-center gap-2"><Phone className="w-4 h-4" />{member.phone}</p></div>
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Date de naissance</p><p className="font-medium text-slate-900 dark:text-white flex items-center gap-2"><Calendar className="w-4 h-4" />{member.dateOfBirth}</p></div>
                <div><p className="text-body-sm text-slate-500 dark:text-slate-400">Adresse</p><p className="font-medium text-slate-900 dark:text-white">{member.address}</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <CardTitle>Emprunts en cours</CardTitle>
              <Link to="/loans/checkout"><Button variant="outline" size="sm"><BookOpen className="w-4 h-4 mr-1" /> Nouvel emprunt</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 px-6">Livre</th>
                    <th className="pb-3 px-6 hidden md:table-cell">Auteur</th>
                    <th className="pb-3 px-6 hidden md:table-cell">Date emprunt</th>
                    <th className="pb-3 px-6">Date retour prévue</th>
                    <th className="pb-3 px-6">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeLoans.map((loan, index) => (
                    <motion.tr key={loan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{loan.book}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{loan.author}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{loan.loanDate}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{loan.dueDate}</td>
                      <td className="py-4 px-6"><Badge variant="info" size="sm">En cours</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-200 dark:border-slate-700">
              <CardTitle>Historique des emprunts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-3 px-6">Livre</th>
                    <th className="pb-3 px-6 hidden md:table-cell">Auteur</th>
                    <th className="pb-3 px-6 hidden md:table-cell">Date emprunt</th>
                    <th className="pb-3 px-6">Date retour</th>
                    <th className="pb-3 px-6">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loanHistory.map((loan, index) => (
                    <motion.tr key={loan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{loan.book}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{loan.author}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{loan.loanDate}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{loan.returnDate}</td>
                      <td className="py-4 px-6"><Badge variant="success" size="sm">Retourné</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
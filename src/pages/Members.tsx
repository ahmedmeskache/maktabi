import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Mail, Phone, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dropdown } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'

const mockMembers = [
  { id: '1', memberNumber: 'MBR-001', firstName: 'Marie', lastName: 'Dubois', email: 'marie.dubois@email.fr', phone: '01 23 45 67 89', membershipType: 'premium', status: 'active', avatarUrl: null, activeLoans: 2, totalLoans: 15, totalFines: 0 },
  { id: '2', memberNumber: 'MBR-002', firstName: 'Jean', lastName: 'Martin', email: 'jean.martin@email.fr', phone: '01 23 45 67 90', membershipType: 'standard', status: 'active', avatarUrl: null, activeLoans: 1, totalLoans: 8, totalFines: 5.50 },
  { id: '3', memberNumber: 'MBR-003', firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.fr', phone: '01 23 45 67 91', membershipType: 'student', status: 'active', avatarUrl: null, activeLoans: 3, totalLoans: 22, totalFines: 0 },
  { id: '4', memberNumber: 'MBR-004', firstName: 'Pierre', lastName: 'Durand', email: 'pierre.durand@email.fr', phone: '01 23 45 67 92', membershipType: 'standard', status: 'expired', avatarUrl: null, activeLoans: 0, totalLoans: 5, totalFines: 12.00 },
  { id: '5', memberNumber: 'MBR-005', firstName: 'Lucie', lastName: 'Petit', email: 'lucie.petit@email.fr', phone: '01 23 45 67 93', membershipType: 'premium', status: 'active', avatarUrl: null, activeLoans: 1, totalLoans: 12, totalFines: 0 },
]

const statuses = ['Tous', 'active', 'expired', 'suspended', 'pending']
const types = ['Tous', 'student', 'standard', 'premium', 'staff']

export function Members() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tous')
  const [type, setType] = useState('Tous')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Gestion des Adhérents</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">{mockMembers.length} adhérents inscrits</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filtres</Button>
          <Link to="/members/new">
            <Button variant="primary"><Plus className="w-4 h-4 mr-1" /> Nouvel adhérent</Button>
          </Link>
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
              <Dropdown trigger={<Button variant="outline" className="w-full sm:w-40 justify-between"><span>{status}</span></Button>} items={statuses.map(s => ({ label: s, value: s }))} onSelect={setStatus} selectedValue={status} />
              <Dropdown trigger={<Button variant="outline" className="w-full sm:w-40 justify-between"><span>{type}</span></Button>} items={types.map(t => ({ label: t, value: t }))} onSelect={setType} selectedValue={type} />
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
                  <th className="pb-3 px-6">Amendes</th>
                  <th className="pb-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockMembers.map((member, index) => (
                  <motion.tr key={member.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{member.phone}</div>
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
                    <td className="py-4 px-6">
                      <span className={member.totalFines > 0 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-green-600 dark:text-green-400'}>
                        {member.totalFines > 0 ? `${member.totalFines.toFixed(2)}€` : '0€'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link to={`/members/${member.id}`} className="text-brand-600 hover:underline text-body-sm">Voir</Link>
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
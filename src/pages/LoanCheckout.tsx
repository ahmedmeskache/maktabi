import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, BookOpen, Check, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const mockBooks = [
  { id: '1', title: 'Le Petit Prince', author: 'A. de Saint-Exupéry', available: true },
  { id: '2', title: '1984', author: 'G. Orwell', available: true },
  { id: '3', title: 'L\'Étranger', author: 'A. Camus', available: false },
  { id: '4', title: 'Le Rouge et le Noir', author: 'Stendhal', available: true },
]

const mockMembers = [
  { id: '1', name: 'Marie Dubois', email: 'marie@email.fr', activeLoans: 2, maxLoans: 5, status: 'active' },
  { id: '2', name: 'Jean Martin', email: 'jean@email.fr', activeLoans: 1, maxLoans: 5, status: 'active' },
  { id: '3', name: 'Sophie Bernard', email: 'sophie@email.fr', activeLoans: 3, maxLoans: 5, status: 'active' },
]

export function LoanCheckout() {
  const [step, setStep] = useState(1)
  const [selectedBook, setSelectedBook] = useState<typeof mockBooks[number] | null>(null)
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[number] | null>(null)
  const [bookSearch, setBookSearch] = useState('')
  const [memberSearch, setMemberSearch] = useState('')

  const filteredBooks = mockBooks.filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) && b.available)
  const filteredMembers = mockMembers.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) && m.status === 'active')

  const prevStep = () => setStep(step - 1)

  const confirmLoan = () => {
    setStep(4)
    setTimeout(() => setStep(1), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/loans" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Nouvel Emprunt</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">Processus en 3 étapes simples</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-medium', step >= s ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500')}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && <div className={cn('w-16 h-1', step > s ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700')} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle>Étape 1 : Choisir un livre</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input label="Rechercher un livre" placeholder="Titre, auteur, ISBN..." value={bookSearch} onChange={e => setBookSearch(e.target.value)} icon={<Search className="w-5 h-5" />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredBooks.map(book => (
                    <button key={book.id} onClick={() => setSelectedBook(book)} className={cn('p-4 border-2 rounded-xl text-left transition-all', selectedBook?.id === book.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300')}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30 rounded-lg flex items-center justify-center"><BookOpen className="w-6 h-6 text-brand-400" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{book.title}</p>
                          <p className="text-body-sm text-slate-500 dark:text-slate-400 truncate">{book.author}</p>
                        </div>
                        {selectedBook?.id === book.id && <Check className="w-5 h-5 text-brand-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Étape 2 : Choisir l'adhérent</CardTitle><Button variant="ghost" size="sm" onClick={prevStep}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Button></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl">
                  <p className="text-body-sm font-medium text-brand-700 dark:text-brand-400">Livre sélectionné</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedBook?.title}</p>
                </div>
                <Input label="Rechercher un adhérent" placeholder="Nom, email, numéro..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} icon={<Search className="w-5 h-5" />} />
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {filteredMembers.map(member => (
                    <button key={member.id} onClick={() => setSelectedMember(member)} className={cn('p-4 border-2 rounded-xl transition-all', selectedMember?.id === member.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300')}>
                      <div className="flex items-center gap-4">
                        <Avatar name={member.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{member.name}</p>
                          <p className="text-body-sm text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={member.activeLoans < member.maxLoans ? 'success' : 'danger'} size="sm">
                            {member.activeLoans}/{member.maxLoans} emprunts
                          </Badge>
                        </div>
                        {selectedMember?.id === member.id && <Check className="w-5 h-5 text-brand-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Étape 3 : Confirmation</CardTitle><Button variant="ghost" size="sm" onClick={prevStep}><ArrowLeft className="w-4 h-4 mr-1" /> Retour</Button></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-body-sm text-slate-500 dark:text-slate-400 mb-2">Livre</p>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/30 rounded-lg flex items-center justify-center"><BookOpen className="w-7 h-7 text-brand-400" /></div>
                      <div><p className="font-medium text-slate-900 dark:text-white">{selectedBook?.title}</p><p className="text-body-sm text-slate-500 dark:text-slate-400">{selectedBook?.author}</p></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-body-sm text-slate-500 dark:text-slate-400 mb-2">Adhérent</p>
                    <div className="flex items-center gap-3">
                      <Avatar name={selectedMember?.name} size="lg" />
                      <div><p className="font-medium text-slate-900 dark:text-white">{selectedMember?.name}</p><p className="text-body-sm text-slate-500 dark:text-slate-400">{selectedMember?.email}</p></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-amber-900 dark:text-amber-100">Date de retour prévue</p><p className="text-body-sm text-amber-700 dark:text-amber-300 mt-1">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</p></div></div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="outline" onClick={prevStep}>Annuler</Button>
                  <Button variant="primary" onClick={confirmLoan} className="w-full md:w-auto"><Check className="w-4 h-4 mr-1" /> Confirmer l'emprunt</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><Check className="w-10 h-10 text-green-600 dark:text-green-400" /></div>
            <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white mb-2">Emprunt confirmé !</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{selectedBook?.title} prêté à {selectedMember?.name}</p>
            <Button variant="primary" onClick={() => { setStep(1); setSelectedBook(null); setSelectedMember(null); }}>Nouvel emprunt</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
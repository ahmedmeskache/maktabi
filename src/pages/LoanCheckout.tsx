import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Check, AlertTriangle, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useLibraryStore, MAX_LOANS_BY_TYPE } from '@/store/library'
import { useTranslation } from '@/i18n'
import { addDays, formatDate, getBookCover } from '@/lib/utils'

const DURATIONS = [
  { value: 14 },
  { value: 30 },
  { value: 60 },
]

export function LoanCheckout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const books = useLibraryStore((s) => s.books)
  const members = useLibraryStore((s) => s.members)
  const loans = useLibraryStore((s) => s.loans)
  const createLoan = useLibraryStore((s) => s.createLoan)

  const initialBook = books.find((b) => b.id === searchParams.get('bookId') && b.availableCopies > 0) ?? null
  const initialMember = members.find((m) => m.id === searchParams.get('memberId') && m.status === 'active') ?? null

  const [step, setStep] = useState(initialBook && initialMember ? 3 : initialBook ? 2 : 1)
  const [selectedBook, setSelectedBook] = useState(initialBook)
  const [selectedMember, setSelectedMember] = useState(initialMember)
  const [duration, setDuration] = useState(30)
  const [bookSearch, setBookSearch] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [done, setDone] = useState(false)

  const activeCountFor = (memberId: string) =>
    loans.filter((l) => l.memberId === memberId && (l.status === 'active' || l.status === 'overdue')).length

  const filteredBooks = useMemo(
    () => books.filter((b) => b.availableCopies > 0 && (b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()) || b.isbn.includes(bookSearch))),
    [books, bookSearch]
  )

  const filteredMembers = useMemo(
    () => members.filter((m) => m.status === 'active' && `${m.firstName} ${m.lastName} ${m.email} ${m.memberNumber}`.toLowerCase().includes(memberSearch.toLowerCase())),
    [members, memberSearch]
  )

  const memberAtLimit = (memberId: string) => {
    const m = members.find((x) => x.id === memberId)
    if (!m) return true
    return activeCountFor(memberId) >= MAX_LOANS_BY_TYPE[m.membershipType]
  }

  const dueDate = addDays(new Date(), duration)

  const confirmLoan = () => {
    if (!selectedBook || !selectedMember) return
    const res = createLoan(selectedBook.id, selectedMember.id, duration)
    if (res.ok) {
      setDone(true)
    } else {
      toast.error(res.error ? t('loans.error.' + res.error) : t('loans.checkout.createFailed'))
    }
  }

  const reset = () => {
    setSelectedBook(null)
    setSelectedMember(null)
    setDuration(30)
    setStep(1)
    setDone(false)
    setBookSearch('')
    setMemberSearch('')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/loans')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">{t('loans.checkout.title')}</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">{t('loans.checkout.subtitle')}</p>
        </div>
      </div>

      {!done && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={'w-10 h-10 rounded-full flex items-center justify-center font-medium ' + (step >= s ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500')}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={'w-16 h-1 ' + (step > s ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700')} />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {done && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"><Check className="w-10 h-10 text-green-600 dark:text-green-400" /></div>
            <h2 className="text-heading-lg font-bold text-slate-900 dark:text-white mb-2">{t('loans.checkout.successTitle')}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2">{t('loans.checkout.successMessage', { book: selectedBook?.title ?? '', member: `${selectedMember?.firstName ?? ''} ${selectedMember?.lastName ?? ''}` })}</p>
            <p className="text-body-sm text-slate-500 dark:text-slate-400 mb-8">{t('loans.checkout.successDueDate', { date: formatDate(dueDate) })}</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={reset}>{t('loans.newLoan')}</Button>
              <Button variant="primary" onClick={() => navigate('/loans')}>{t('loans.checkout.viewLoans')}</Button>
            </div>
          </motion.div>
        )}

        {!done && step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle>{t('loans.checkout.step1')}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input label={t('loans.checkout.searchBook')} placeholder={t('loans.checkout.searchBookPlaceholder')} value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} icon={<Search className="w-5 h-5" />} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <button key={book.id} onClick={() => setSelectedBook(book)} className={'p-4 border-2 rounded-xl text-start transition-all ' + (selectedBook?.id === book.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300')}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0"><img src={getBookCover(book)} alt={book.title} className="w-full h-full object-cover" loading="lazy" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{book.title}</p>
                          <p className="text-body-sm text-slate-500 dark:text-slate-400 truncate">{book.author}</p>
                          <p className="text-body-xs text-emerald-500 mt-1">{t(book.availableCopies > 1 ? 'loans.checkout.copiesMany' : 'loans.checkout.copiesOne', { count: book.availableCopies })}</p>
                        </div>
                        {selectedBook?.id === book.id && <Check className="w-5 h-5 text-brand-500" />}
                      </div>
                    </button>
                  ))}
                  {filteredBooks.length === 0 && <p className="col-span-full text-center py-8 text-slate-500 dark:text-slate-400">{t('loans.checkout.emptyBooks')}</p>}
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="primary" disabled={!selectedBook} onClick={() => setStep(2)}>{t('loans.checkout.next')}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!done && step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('loans.checkout.step2')}</CardTitle><Button variant="ghost" size="sm" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 me-1 rtl:rotate-180" /> {t('common.back')}</Button></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl">
                  <p className="text-body-sm font-medium text-brand-700 dark:text-brand-400">{t('loans.checkout.selectedBook')}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedBook?.title}</p>
                </div>
                <Input label={t('loans.checkout.searchMember')} placeholder={t('loans.checkout.searchMemberPlaceholder')} value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} icon={<Search className="w-5 h-5" />} />
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {filteredMembers.map((member) => {
                    const limitReached = memberAtLimit(member.id)
                    const max = MAX_LOANS_BY_TYPE[member.membershipType]
                    const active = activeCountFor(member.id)
                    return (
                      <button key={member.id} disabled={limitReached} onClick={() => setSelectedMember(member)} className={'p-4 border-2 rounded-xl transition-all text-start ' + (limitReached ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-700' : selectedMember?.id === member.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300')}>
                        <div className="flex items-center gap-4">
                          <Avatar name={`${member.firstName} ${member.lastName}`} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">{member.firstName} {member.lastName}</p>
                            <p className="text-body-sm text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                          </div>
                          <Badge variant={limitReached ? 'danger' : 'success'} size="sm">{t('loans.checkout.loanCount', { active, max })}</Badge>
                          {selectedMember?.id === member.id && <Check className="w-5 h-5 text-brand-500" />}
                        </div>
                      </button>
                    )
                  })}
                  {filteredMembers.length === 0 && <p className="text-center py-8 text-slate-500 dark:text-slate-400">{t('loans.checkout.emptyMembers')}</p>}
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="primary" disabled={!selectedMember} onClick={() => setStep(3)}>{t('loans.checkout.next')}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!done && step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>{t('loans.checkout.step3')}</CardTitle><Button variant="ghost" size="sm" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4 me-1 rtl:rotate-180" /> {t('common.back')}</Button></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-body-sm text-slate-500 dark:text-slate-400 mb-2">{t('loans.book')}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0"><img src={selectedBook ? getBookCover(selectedBook) : ''} alt={selectedBook?.title ?? ''} className="w-full h-full object-cover" /></div>
                      <div><p className="font-medium text-slate-900 dark:text-white">{selectedBook?.title}</p><p className="text-body-sm text-slate-500 dark:text-slate-400">{selectedBook?.author}</p></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-body-sm text-slate-500 dark:text-slate-400 mb-2">{t('loans.member')}</p>
                    <div className="flex items-center gap-3">
                      <Avatar name={`${selectedMember?.firstName ?? ''} ${selectedMember?.lastName ?? ''}`} size="lg" />
                      <div><p className="font-medium text-slate-900 dark:text-white">{selectedMember?.firstName} {selectedMember?.lastName}</p><p className="text-body-sm text-slate-500 dark:text-slate-400">{selectedMember?.email}</p></div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> {t('loans.checkout.duration')}</p>
                  <div className="flex gap-3">
                    {DURATIONS.map((d) => (
                      <button key={d.value} onClick={() => setDuration(d.value)} className={'flex-1 py-3 rounded-xl border-2 font-medium text-body-sm transition-all ' + (duration === d.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300')}>
                        {t('loans.days', { count: d.value })}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" /><div><p className="font-medium text-amber-900 dark:text-amber-100">{t('loans.checkout.expectedReturnDate')}</p><p className="text-body-sm text-amber-700 dark:text-amber-300 mt-1">{formatDate(dueDate)}</p></div></div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="outline" onClick={() => setStep(2)}>{t('common.cancel')}</Button>
                  <Button variant="primary" onClick={confirmLoan}><Check className="w-4 h-4 me-1" /> {t('loans.checkout.confirm')}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <Link to="/books" className="text-body-sm text-slate-500 dark:text-slate-400 hover:underline">{t('loans.checkout.backToCatalog')}</Link>
      </div>
    </div>
  )
}

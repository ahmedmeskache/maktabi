import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Search, Clock, AlertTriangle, RotateCcw, CalendarPlus, BadgeEuro, PackageX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dropdown } from '@/components/ui/Dropdown'
import { useLibraryStore } from '@/store/library'
import { useTranslation } from '@/i18n'
import { calculateFine, formatCurrency, formatDate } from '@/lib/utils'
import type { Loan } from '@/types'

export function Loans() {
  const { t } = useTranslation()
  const loans = useLibraryStore((s) => s.loans)
  const books = useLibraryStore((s) => s.books)
  const members = useLibraryStore((s) => s.members)
  const returnLoan = useLibraryStore((s) => s.returnLoan)
  const renewLoan = useLibraryStore((s) => s.renewLoan)
  const payFine = useLibraryStore((s) => s.payFine)
  const markLost = useLibraryStore((s) => s.markLost)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const statuses = [
    { label: t('common.all'), value: 'all' },
    { label: t('loans.filter.active'), value: 'active' },
    { label: t('loans.filter.overdue'), value: 'overdue' },
    { label: t('loans.filter.returned'), value: 'returned' },
    { label: t('loans.filter.lost'), value: 'lost' },
  ]

  const bookTitle = (bookId: string) => books.find((b) => b.id === bookId)?.title ?? t('books.deleted')
  const memberName = (memberId: string) => {
    const m = members.find((x) => x.id === memberId)
    return m ? `${m.firstName} ${m.lastName}` : t('loans.deletedMember')
  }

  const effective = (loan: Loan): { status: Loan['status']; fine: number } => {
    if (loan.status === 'returned' || loan.status === 'lost') return { status: loan.status, fine: loan.fineAmount }
    const overdue = new Date(loan.dueDate).getTime() < Date.now()
    return overdue ? { status: 'overdue', fine: calculateFine(loan.dueDate) } : { status: 'active', fine: 0 }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return loans
      .filter((loan) => {
        const matchesSearch =
          !q ||
          bookTitle(loan.bookId).toLowerCase().includes(q) ||
          memberName(loan.memberId).toLowerCase().includes(q)
        const matchesStatus = status === 'all' || effective(loan).status === status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
  }, [loans, search, status, books, members])

  const activeCount = loans.filter((l) => effective(l).status === 'active').length
  const overdueCount = loans.filter((l) => effective(l).status === 'overdue').length
  const returnedCount = loans.filter((l) => l.status === 'returned').length

  const handleReturn = (loan: Loan) => {
    const fine = calculateFine(loan.dueDate)
    returnLoan(loan.id)
    toast.success(fine > 0 ? t('loans.returnedWithFine', { amount: formatCurrency(fine) }) : t('loans.returned'))
  }

  const handleRenew = (loan: Loan) => {
    const res = renewLoan(loan.id)
    if (res.ok) toast.success(t('loans.renewed'))
    else toast.error(res.error ? t('loans.error.' + res.error) : t('loans.renewFailed'))
  }

  const handleRemind = (loan: Loan) => toast.info(t('loans.reminderSent', { name: memberName(loan.memberId) }))

  const handleLost = (loan: Loan) => {
    markLost(loan.id)
    toast.success(t('loans.markedLost'))
  }

  const handlePayFine = (loan: Loan) => {
    payFine(loan.id)
    toast.success(t('loans.fineCollected'))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">{t('loans.title')}</h1>
          <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">{t('loans.subtitle', { active: activeCount, overdue: overdueCount })}</p>
        </div>
        <Link to="/loans/checkout">
          <Button variant="primary"><Plus className="w-4 h-4 me-1" /> {t('loans.newLoan')}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"><Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" /></div>
            <div><p className="text-body-sm text-slate-500 dark:text-slate-400">{t('loans.filter.active')}</p><p className="text-heading-md font-bold text-slate-900 dark:text-white">{activeCount}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
            <div><p className="text-body-sm text-slate-500 dark:text-slate-400">{t('loans.filter.overdue')}</p><p className="text-heading-md font-bold text-slate-900 dark:text-white">{overdueCount}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><RotateCcw className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
            <div><p className="text-body-sm text-slate-500 dark:text-slate-400">{t('loans.filter.returned')}</p><p className="text-heading-md font-bold text-slate-900 dark:text-white">{returnedCount}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="search" placeholder={t('loans.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full ps-10 pe-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-body-sm" />
            </div>
            <Dropdown trigger={<Button variant="outline" className="w-full sm:w-44 justify-between"><span>{statuses.find((s) => s.value === status)?.label}</span></Button>} items={statuses} onSelect={setStatus} selectedValue={status} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-start text-body-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 px-6">{t('loans.book')}</th>
                  <th className="pb-3 px-6">{t('loans.member')}</th>
                  <th className="pb-3 px-6 hidden md:table-cell">{t('loans.loanDate')}</th>
                  <th className="pb-3 px-6">{t('loans.dueDate')}</th>
                  <th className="pb-3 px-6">{t('common.status')}</th>
                  <th className="pb-3 px-6">{t('loans.fine')}</th>
                  <th className="pb-3 px-6">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((loan) => {
                  const { status: st, fine } = effective(loan)
                  return (
                    <tr key={loan.id} className={st === 'overdue' ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}>
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">{bookTitle(loan.bookId)}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{memberName(loan.memberId)}</td>
                      <td className="py-4 px-6 hidden md:table-cell text-slate-600 dark:text-slate-400">{formatDate(loan.loanDate)}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{formatDate(loan.dueDate)}</td>
                      <td className="py-4 px-6">
                        <Badge variant={st === 'active' ? 'info' : st === 'overdue' ? 'danger' : st === 'returned' ? 'success' : 'warning'} size="sm">
                          {t('status.' + st)}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        {fine > 0 ? (
                          <button onClick={() => !loan.finePaid && handlePayFine(loan)} className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium text-body-sm">
                            {formatCurrency(fine)}
                            {loan.finePaid && <span className="text-emerald-500">{t('loans.finePaid')}</span>}
                          </button>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {(st === 'active' || st === 'overdue') && (
                            <>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={t('loans.action.return')} title={t('loans.action.returnTitle')} onClick={() => handleReturn(loan)}><RotateCcw className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={t('loans.action.renew')} title={t('loans.action.renewTitle')} onClick={() => handleRenew(loan)}><CalendarPlus className="w-4 h-4" /></Button>
                            </>
                          )}
                          {st === 'overdue' && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" aria-label={t('loans.action.remind')} title={t('loans.action.remindTitle')} onClick={() => handleRemind(loan)}><AlertTriangle className="w-4 h-4" /></Button>
                          )}
                          {fine > 0 && !loan.finePaid && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-600" aria-label={t('loans.action.payFine')} title={t('loans.action.payFineTitle')} onClick={() => handlePayFine(loan)}><BadgeEuro className="w-4 h-4" /></Button>
                          )}
                          {(st === 'active' || st === 'overdue') && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400" aria-label={t('loans.action.markLost')} title={t('loans.action.markLostTitle')} onClick={() => handleLost(loan)}><PackageX className="w-4 h-4" /></Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500 dark:text-slate-400">{t('loans.empty')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, AlertTriangle, Clock, Share2, Heart, Download, Star, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { ConfirmModal } from '@/components/ui/Modal'
import { BookFormModal } from '@/components/books/BookFormModal'
import { useLibraryStore } from '@/store/library'
import { useTranslation } from '@/i18n'
import { cn, formatDate, getBookCover, fallbackCover } from '@/lib/utils'

export function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const books = useLibraryStore((s) => s.books)
  const loans = useLibraryStore((s) => s.loans)
  const members = useLibraryStore((s) => s.members)
  const deleteBook = useLibraryStore((s) => s.deleteBook)

  const book = books.find((b) => b.id === id)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [favorite, setFavorite] = useState(false)

  if (!book) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-14 h-14 text-amber-500 mx-auto mb-4" />
        <h2 className="text-heading-lg font-semibold text-[var(--color-text-primary)] mb-3">{t('books.notFound')}</h2>
        <Link to="/books"><Button variant="primary">{t('books.backToCatalogue')}</Button></Link>
      </div>
    )
  }

  const coverUrl = getBookCover(book, 'L')
  const bookLoans = loans.filter((l) => l.bookId === book.id).sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
  const rating = (4 + Math.min(1, (book.totalLoans ?? 0) / 200)).toFixed(1)

  const handleFavorite = () => {
    setFavorite((f) => !f)
    toast.success(favorite ? t('books.removedFav') : t('books.addedFav'))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${book.title} — ${book.author}`)
      toast.success(t('books.refCopied'))
    } catch {
      toast.error(t('books.copyFailed'))
    }
  }

  const handleDownload = () => {
    const content = [`${t('books.fTitle')}: ${book.title}`, `${t('books.fAuthor')}: ${book.author}`, `${t('books.fIsbn')}: ${book.isbn}`, `${t('books.fPublisher')}: ${book.publisher ?? '—'}`, `${t('books.fYear')}: ${book.publishedYear ?? '—'}`, `${t('books.fCategory')}: ${book.category}`, `${t('books.copiesLabel')}: ${book.availableCopies}/${book.totalCopies}`, '', book.description ?? ''].join('\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${book.title.replace(/[^\w]+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = () => {
    deleteBook(book.id)
    toast.success(t('books.deleted'))
    navigate('/books')
  }

  const handleBorrow = () => {
    if (book.availableCopies <= 0) {
      toast.error(t('books.reportUnavailable'))
      return
    }
    navigate(`/loans/checkout?bookId=${book.id}`)
  }

  return (
    <div className="space-y-6 page-transition">
      <div className="flex items-center gap-4">
        <Link to="/books" className="p-2.5 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-body-xs font-semibold text-primary-500 uppercase tracking-wider">{book.category}</p>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{book.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}><Pencil className="w-4 h-4 mr-1" /> {t('common.edit')}</Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)} className="text-red-500"><Trash2 className="w-4 h-4 mr-1" /> {t('common.delete')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sticky top-24">
            <Card className="overflow-hidden relative">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = fallbackCover(book.title) }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFavorite}
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                    aria-label={t('books.favoriteAria')}
                  >
                    <Heart className={cn('w-5 h-5', favorite && 'fill-current text-red-400')} />
                  </motion.button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Badge variant="info" className="text-sm px-3 py-1.5">{book.category}</Badge>
                  <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'} className="text-sm px-3 py-1.5 flex items-center gap-1.5">
                    {book.availableCopies > 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> {t('books.availableCount', { count: book.availableCopies })}
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-400" /> {t('books.unavailable')}
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between p-4 bg-[var(--color-bg-tertiary)] rounded-xl">
                  <div>
                    <p className="text-body-xs text-[var(--color-text-muted)] uppercase tracking-wider">{t('books.avgRating')}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-2xl font-bold text-[var(--color-text-primary)]">{rating}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn('w-4 h-4', i < Math.floor(Number(rating)) ? 'text-amber-400 fill-current' : 'text-[var(--color-text-muted)]')} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-xs text-[var(--color-text-muted)] uppercase tracking-wider">{t('books.totalLoansLabel')}</p>
                    <p className="text-xl font-bold text-[var(--color-text-primary)] mt-1">{book.totalLoans ?? 0}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">{t('books.isbnLabel')}</span>
                    <span className="font-mono text-body-sm text-[var(--color-text-primary)]">{book.isbn}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">{t('books.publisher')}</span>
                    <span className="text-[var(--color-text-primary)]">{book.publisher || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">{t('books.yearLabel')}</span>
                    <span className="text-[var(--color-text-primary)]">{book.publishedYear || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">{t('books.locationLabel')}</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{book.location || '—'}</span>
                  </div>
                  <div className="flex items-start justify-between py-2">
                    <span className="text-[var(--color-text-secondary)]">{t('books.copiesLabel')}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('font-bold', book.availableCopies > 0 ? 'text-emerald-400' : 'text-red-400')}>{book.availableCopies}</span>
                      <span className="text-[var(--color-text-muted)]">/</span>
                      <span className="text-[var(--color-text-secondary)]">{book.totalCopies}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button variant="primary" className="w-full py-3" disabled={book.availableCopies === 0} onClick={handleBorrow}>
                    <BookOpen className="w-5 h-5 mr-2" />
                    {book.availableCopies > 0 ? t('books.borrow') : t('books.notAvailableNow')}
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="py-2.5" aria-label={t('books.shareAria')} onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="py-2.5" aria-label={t('books.downloadAria')} onClick={handleDownload}>
                      <Download className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="py-2.5" aria-label={t('books.reportAria')} onClick={() => toast.info(t('books.reportSent'))}>
                      <AlertTriangle className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-[var(--color-border-primary)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{t('books.about')}</CardTitle>
                    <p className="text-[var(--color-text-secondary)] mt-1">{t('books.byAuthor', { author: book.author })} • {book.publisher || '—'} ({book.publishedYear || '—'})</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {book.subcategory && <span className="px-3 py-1 text-body-xs font-medium bg-[var(--color-bg-tertiary)] rounded-full text-[var(--color-text-secondary)]">{book.subcategory}</span>}
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="neutral" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{book.description || t('books.noDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-border-primary)]">
                <CardTitle>{t('books.loanHistory')}</CardTitle>
                <Button variant="outline" size="sm" disabled={book.availableCopies === 0} onClick={handleBorrow}><BookOpen className="w-4 h-4 mr-1" /> {t('books.newLoan')}</Button>
              </CardHeader>
              <CardContent className="p-0">
                {bookLoans.length === 0 ? (
                  <p className="p-8 text-center text-[var(--color-text-muted)]">{t('books.noLoansForBook')}</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-body-sm font-medium text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                        <th className="pb-3 px-6">{t('books.member')}</th>
                        <th className="pb-3 px-6 hidden md:table-cell">{t('books.loanDate')}</th>
                        <th className="pb-3 px-6 hidden md:table-cell">{t('books.dueDate')}</th>
                        <th className="pb-3 px-6">{t('books.statusCol')}</th>
                        <th className="pb-3 px-6 w-32">{t('books.returnCol')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-primary)]">
                      {bookLoans.map((loan, index) => {
                        const member = members.find((m) => m.id === loan.memberId)
                        const memberName = member ? `${member.firstName} ${member.lastName}` : t('books.memberDeleted')
                        return (
                          <motion.tr key={loan.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-[var(--color-bg-tertiary)]/50">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <Avatar name={memberName} size="md" />
                                <span className="font-medium text-[var(--color-text-primary)]">{memberName}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 hidden md:table-cell text-[var(--color-text-secondary)]">{formatDate(loan.loanDate)}</td>
                            <td className="py-4 px-6 hidden md:table-cell text-[var(--color-text-secondary)]">{formatDate(loan.dueDate)}</td>
                            <td className="py-4 px-6">
                              <Badge variant={loan.status === 'active' ? 'info' : loan.status === 'returned' ? 'success' : 'danger'} className="text-xs">
                                {loan.status === 'active' ? t('status.active') : loan.status === 'returned' ? t('status.returned') : loan.status === 'overdue' ? t('status.overdue') : t('status.lost')}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              {loan.returnDate ? <span className="text-body-sm text-[var(--color-text-muted)]">{formatDate(loan.returnDate)}</span> : <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />}
                            </td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <BookFormModal isOpen={editOpen} onClose={() => setEditOpen(false)} book={book} />
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title={t('books.deleteTitle')}
        message={t('books.deleteMessage', { title: book.title })}
        confirmText={t('common.delete')}
        variant="danger"
      />
    </div>
  )
}

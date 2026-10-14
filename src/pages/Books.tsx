import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Search, BookOpen, List, Grid, ChevronDown, Archive } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { ConfirmModal } from '@/components/ui/Modal'
import { BookCard } from '@/components/books/BookCard'
import { BookFormModal } from '@/components/books/BookFormModal'
import { useLibraryStore } from '@/store/library'
import { useTranslation } from '@/i18n'
import type { Book } from '@/types'

type SortKey = 'title' | 'author' | 'popularity' | 'date'

export function Books() {
  const { t } = useTranslation()
  const books = useLibraryStore((s) => s.books)
  const deleteBook = useLibraryStore((s) => s.deleteBook)
  const archiveBook = useLibraryStore((s) => s.archiveBook)
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState('Tous')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortKey>('title')
  const [showArchived, setShowArchived] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [toDelete, setToDelete] = useState<Book | null>(null)

  useEffect(() => {
    if (searchParams.get('new')) {
      setEditing(null)
      setFormOpen(true)
      searchParams.delete('new')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setSearch(q)
  }, [searchParams])

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(books.map((b) => b.category)))],
    [books]
  )

  const filteredBooks = useMemo(() => {
    const q = search.toLowerCase()
    return books
      .filter((book) => (showArchived ? book.archived : !book.archived))
      .filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.isbn.includes(search)
      )
      .filter((book) => category === 'Tous' || book.category === category)
      .sort((a, b) => {
        switch (sortBy) {
          case 'title': return a.title.localeCompare(b.title)
          case 'author': return a.author.localeCompare(b.author)
          case 'popularity': return (b.totalLoans ?? 0) - (a.totalLoans ?? 0)
          case 'date': return (b.publishedYear ?? 0) - (a.publishedYear ?? 0)
          default: return 0
        }
      })
  }, [books, search, category, sortBy, showArchived])

  const openNew = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (book: Book) => { setEditing(book); setFormOpen(true) }

  const confirmDelete = () => {
    if (toDelete) {
      const result = deleteBook(toDelete.id)
      if (!result.ok) {
        toast.error(t('books.delete.blocked'))
      } else {
        toast.success(t('books.deleted'))
      }
      setToDelete(null)
    }
  }

  const handleArchive = (book: Book) => {
    archiveBook(book.id, !book.archived)
    toast.success(book.archived ? t('books.unarchived') : t('books.archived'))
  }

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] gradient-text">{t('books.title')}</h1>
          <p className="text-body-md text-[var(--color-text-secondary)] mt-1">
            {t('books.foundCount', { count: filteredBooks.length })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant={showArchived ? 'primary' : 'outline'} className="gap-2" onClick={() => setShowArchived((v) => !v)}>
            <Archive className="w-4 h-4" /> {t('books.showArchived')}
          </Button>
          <Button variant="primary" className="gap-2" onClick={openNew}><Plus className="w-4 h-4" /> {t('books.newBook')}</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-[var(--color-border-primary)] flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                type="search"
                placeholder={t('books.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border-0 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-primary-500/20 focus:bg-[var(--color-bg-card)] transition-all"
                aria-label={t('books.searchAria')}
              />
            </div>

            <Dropdown
              trigger={
                <Button variant="outline" className="w-full sm:w-40 justify-between gap-2">
                  <span className="truncate">{category === 'Tous' ? t('common.all') : category}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                </Button>
              }
              items={categories.map((c) => ({ label: c === 'Tous' ? t('common.all') : c, value: c }))}
              onSelect={setCategory}
              selectedValue={category}
              align="right"
            />

            <Dropdown
              trigger={
                <Button variant="outline" className="w-full sm:w-44 justify-between gap-2">
                  <span className="truncate">{sortBy === 'popularity' ? t('books.sortPopularity') : sortBy === 'author' ? t('books.sortAuthor') : sortBy === 'date' ? t('books.sortYear') : t('books.sortTitle')}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                </Button>
              }
              items={[
                { label: t('books.sortTitle'), value: 'title' },
                { label: t('books.sortAuthor'), value: 'author' },
                { label: t('books.sortPopularity'), value: 'popularity' },
                { label: t('books.sortYear'), value: 'date' },
              ]}
              onSelect={(value) => setSortBy(value as SortKey)}
              selectedValue={sortBy}
              align="right"
            />

            <div className="flex items-center gap-1 bg-[var(--color-bg-tertiary)] rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                className="h-10 w-10"
                onClick={() => setViewMode('grid')}
                aria-label={t('books.viewGrid')}
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                className="h-10 w-10"
                onClick={() => setViewMode('list')}
                aria-label={t('books.viewList')}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} variant="grid" index={index} onEdit={openEdit} onDelete={setToDelete} onArchive={handleArchive} />
              ))}
              {filteredBooks.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--color-text-secondary)]">{t('books.emptyTitle')}</p>
                  <p className="text-body-sm text-[var(--color-text-muted)] mt-1">{t('books.emptyHint')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-body-sm font-medium text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                    <th className="pb-3 px-6 w-20">{t('books.tableCover')}</th>
                    <th className="pb-3 px-6">{t('books.tableTitle')}</th>
                    <th className="pb-3 px-6 hidden lg:table-cell">{t('books.tableCategory')}</th>
                    <th className="pb-3 px-6 hidden xl:table-cell">{t('books.tableYear')}</th>
                    <th className="pb-3 px-6">{t('books.tableAvailability')}</th>
                    <th className="pb-3 px-6 w-32">{t('books.tableActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-primary)]">
                  {filteredBooks.map((book, index) => (
                    <BookCard key={book.id} book={book} variant="list" index={index} onEdit={openEdit} onDelete={setToDelete} onArchive={handleArchive} />
                  ))}
                  {filteredBooks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                        <p className="text-[var(--color-text-secondary)]">{t('books.emptyTitle')}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Link to="/loans/checkout" className="text-body-sm text-primary-500 hover:underline">{t('books.goToCheckout')}</Link>
      </div>

      <BookFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} book={editing} />
      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title={t('books.deleteTitle')}
        message={t('books.deleteMessage', { title: toDelete?.title ?? '' })}
        confirmText={t('common.delete')}
        variant="danger"
      />
    </div>
  )
}

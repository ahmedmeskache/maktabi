import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Search, BookOpen, List, Grid, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { ConfirmModal } from '@/components/ui/Modal'
import { BookCard } from '@/components/books/BookCard'
import { BookFormModal } from '@/components/books/BookFormModal'
import { useLibraryStore } from '@/store/library'
import type { Book } from '@/types'

type SortKey = 'title' | 'author' | 'popularity' | 'date'

export function Books() {
  const books = useLibraryStore((s) => s.books)
  const deleteBook = useLibraryStore((s) => s.deleteBook)
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState('Tous')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortKey>('title')

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
  }, [books, search, category, sortBy])

  const openNew = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (book: Book) => { setEditing(book); setFormOpen(true) }

  const confirmDelete = () => {
    if (toDelete) {
      deleteBook(toDelete.id)
      toast.success(`« ${toDelete.title} » supprimé`)
      setToDelete(null)
    }
  }

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] gradient-text">Catalogue des Livres</h1>
          <p className="text-body-md text-[var(--color-text-secondary)] mt-1">
            {filteredBooks.length} ouvrage{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="primary" className="gap-2" onClick={openNew}><Plus className="w-4 h-4" /> Nouvel ouvrage</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-[var(--color-border-primary)] flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Rechercher par titre, auteur, ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border-0 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-primary-500/20 focus:bg-[var(--color-bg-card)] transition-all"
                aria-label="Recherche globale"
              />
            </div>

            <Dropdown
              trigger={
                <Button variant="outline" className="w-full sm:w-40 justify-between gap-2">
                  <span className="truncate">{category}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                </Button>
              }
              items={categories.map((c) => ({ label: c, value: c }))}
              onSelect={setCategory}
              selectedValue={category}
              align="right"
            />

            <Dropdown
              trigger={
                <Button variant="outline" className="w-full sm:w-44 justify-between gap-2">
                  <span className="truncate">{sortBy === 'popularity' ? 'Popularité' : sortBy === 'author' ? 'Auteur A-Z' : sortBy === 'date' ? 'Année' : 'Titre A-Z'}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                </Button>
              }
              items={[
                { label: 'Titre A-Z', value: 'title' },
                { label: 'Auteur A-Z', value: 'author' },
                { label: 'Popularité', value: 'popularity' },
                { label: 'Année', value: 'date' },
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
                aria-label="Vue grille"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                className="h-10 w-10"
                onClick={() => setViewMode('list')}
                aria-label="Vue liste"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredBooks.map((book, index) => (
                <BookCard key={book.id} book={book} variant="grid" index={index} onEdit={openEdit} onDelete={setToDelete} />
              ))}
              {filteredBooks.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--color-text-secondary)]">Aucun livre ne correspond à votre recherche</p>
                  <p className="text-body-sm text-[var(--color-text-muted)] mt-1">Essayez de modifier vos filtres</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-body-sm font-medium text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                    <th className="pb-3 px-6 w-20">Couverture</th>
                    <th className="pb-3 px-6">Titre</th>
                    <th className="pb-3 px-6 hidden lg:table-cell">Catégorie</th>
                    <th className="pb-3 px-6 hidden xl:table-cell">Année</th>
                    <th className="pb-3 px-6">Disponibilité</th>
                    <th className="pb-3 px-6 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-primary)]">
                  {filteredBooks.map((book, index) => (
                    <BookCard key={book.id} book={book} variant="list" index={index} onEdit={openEdit} onDelete={setToDelete} />
                  ))}
                  {filteredBooks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                        <p className="text-[var(--color-text-secondary)]">Aucun livre ne correspond à votre recherche</p>
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
        <Link to="/loans/checkout" className="text-body-sm text-primary-500 hover:underline">Aller au guichet d'emprunt →</Link>
      </div>

      <BookFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} book={editing} />
      <ConfirmModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer l'ouvrage"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.title ?? ''} » ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  )
}

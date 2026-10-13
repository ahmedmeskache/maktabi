import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, BookOpen, List, Grid, ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { BookCard } from '@/components/books/BookCard'

const mockBooks = [
  { id: '1', isbn: '9782070360024', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', publisher: 'Gallimard', publishedYear: 1943, category: 'Littérature', subcategory: 'Classique', description: 'Un pilote d\'avion fait une rencontre extraordinaire au milieu du désert : un petit bonhomme blond aux cheveux bouclés, qui lui demande de lui dessiner un mouton...', coverUrl: null, totalCopies: 5, availableCopies: 3, location: 'Rayon A - Étagère 3', tags: ['Classique', 'Jeunesse', 'Philosophique'], totalLoans: 142, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', isbn: '9782070368228', title: '1984', author: 'George Orwell', publisher: 'Seuil', publishedYear: 1949, category: 'Science-Fiction', subcategory: 'Dystopie', description: 'Dans un monde totalitaire où la pensée est contrôlée, Winston Smith tente de préserver son humanité.', coverUrl: null, totalCopies: 4, availableCopies: 4, location: 'Rayon B - Étagère 1', tags: ['Dystopie', 'Politique', 'Classique'], totalLoans: 128, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', isbn: '9782070360025', title: "L'Étranger", author: 'Albert Camus', publisher: 'Gallimard', publishedYear: 1942, category: 'Philosophie', subcategory: 'Existentialisme', description: 'Meursault, un homme ordinaire, commet un meurtre absurde sous le soleil algérien.', coverUrl: null, totalCopies: 3, availableCopies: 1, location: 'Rayon C - Étagère 2', tags: ['Philosophie', 'Absurde', 'Classique'], totalLoans: 115, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', isbn: '9782070643028', title: 'Harry Potter à l\'école des sorciers', author: 'J.K. Rowling', publisher: 'Gallimard Jeunesse', publishedYear: 1997, category: 'Fantasy', subcategory: 'Jeunesse', description: 'Le jeune Harry Potter découvre qu\'il est un sorcier et intègre Poudlard.', coverUrl: null, totalCopies: 6, availableCopies: 0, location: 'Rayon D - Étagère 1', tags: ['Magie', 'Aventure', 'Bestseller'], totalLoans: 98, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', isbn: '9782266154218', title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', publisher: 'Pocket', publishedYear: 1954, category: 'Fantasy', subcategory: 'Epic Fantasy', description: 'La quête de Frodon pour détruire l\'Anneau Unique au cœur du Mordor.', coverUrl: null, totalCopies: 4, availableCopies: 2, location: 'Rayon D - Étagère 3', tags: ['Epic', 'Aventure', 'Classique'], totalLoans: 87, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', isbn: '9782070360026', title: 'Le Rouge et le Noir', author: 'Stendhal', publisher: 'Gallimard', publishedYear: 1830, category: 'Littérature', subcategory: 'Roman réaliste', description: 'Julien Sorel, fils de charpentier, rêve de gloire dans la France de la Restauration.', coverUrl: null, totalCopies: 2, availableCopies: 2, location: 'Rayon A - Étagère 5', tags: ['Réalisme', 'Amour', 'Société'], totalLoans: 76, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', isbn: '9782070360027', title: 'Cent ans de solitude', author: 'Gabriel García Márquez', publisher: 'Seuil', publishedYear: 1967, category: 'Littérature', subcategory: 'Réalisme magique', description: 'L\'histoire de la famille Buendía sur sept générations à Macondo.', coverUrl: null, totalCopies: 3, availableCopies: 3, location: 'Rayon A - Étagère 7', tags: ['Réalisme magique', 'Famille', 'Amérique latine'], totalLoans: 65, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', isbn: '9782070360028', title: 'Le Nom de la rose', author: 'Umberto Eco', publisher: 'Grasset', publishedYear: 1980, category: 'Littérature', subcategory: 'Historique', description: 'Une enquête policière dans une abbaye bénédictine au XIVème siècle.', coverUrl: null, totalCopies: 2, availableCopies: 1, location: 'Rayon A - Étagère 9', tags: ['Mystère', 'Histoire', 'Médiéval'], totalLoans: 54, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', isbn: '9782070360029', title: 'Dune', author: 'Frank Herbert', publisher: 'Presses de la Cité', publishedYear: 1965, category: 'Science-Fiction', subcategory: 'Space Opera', description: 'Sur la planète Arrakis, Paul Atréides découvre son destin messianique.', coverUrl: null, totalCopies: 4, availableCopies: 4, location: 'Rayon B - Étagère 5', tags: ['Space Opera', 'Politique', 'Écologie'], totalLoans: 89, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', isbn: '9782070360030', title: 'Fondation', author: 'Isaac Asimov', publisher: 'Denoël', publishedYear: 1951, category: 'Science-Fiction', subcategory: 'Space Opera', description: 'Hari Seldon fonde la Fondation pour préserver le savoir de l\'humanité.', coverUrl: null, totalCopies: 3, availableCopies: 2, location: 'Rayon B - Étagère 7', tags: ['Science', 'Empire', 'Prévision'], totalLoans: 72, createdAt: new Date(), updatedAt: new Date() },
  { id: '11', isbn: '9782070360031', title: 'Le Meilleur des mondes', author: 'Aldous Huxley', publisher: 'Gallimard', publishedYear: 1932, category: 'Science-Fiction', subcategory: 'Dystopie', description: 'Une société future où le bonheur est obligatoire et la liberté interdite.', coverUrl: null, totalCopies: 3, availableCopies: 3, location: 'Rayon B - Étagère 9', tags: ['Dystopie', 'Sociologie', 'Classique'], totalLoans: 58, createdAt: new Date(), updatedAt: new Date() },
  { id: '12', isbn: '9782070360032', title: 'Sapiens', author: 'Yuval Noah Harari', publisher: 'Albin Michel', publishedYear: 2015, category: 'Histoire', subcategory: 'Anthropologie', description: 'Une brève histoire de l\'humanité, de la préhistoire à nos jours.', coverUrl: null, totalCopies: 5, availableCopies: 4, location: 'Rayon E - Étagère 1', tags: ['Histoire', 'Science', 'Bestseller'], totalLoans: 103, createdAt: new Date(), updatedAt: new Date() },
]

const categories = ['Tous', 'Littérature', 'Science-Fiction', 'Philosophie', 'Fantasy', 'Histoire', 'Biographie', 'Jeunesse']

export function Books() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'popularity' | 'date'>('title')

  const filteredBooks = mockBooks
    .filter(book => 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.includes(search)
    )
    .filter(book => category === 'Tous' || book.category === category)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title)
        case 'author': return a.author.localeCompare(b.author)
        case 'popularity': return (b.totalLoans || 0) - (a.totalLoans || 0)
        case 'date': return (b.publishedYear || 0) - (a.publishedYear || 0)
        default: return 0
      }
    })

  return (
    <div className="space-y-6 page-transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] gradient-text">Catalogue des Livres</h1>
          <p className="text-body-md text-[var(--color-text-secondary)] mt-1">{filteredBooks.length} ouvrage{filteredBooks.length > 1 ? 's' : ''} trouvé{filteredBooks.length > 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filtres avancés</Button>
          <Link to="/books/new">
            <Button variant="primary" className="gap-2"><Plus className="w-4 h-4" /> Nouvel ouvrage</Button>
          </Link>
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
              items={categories.map(c => ({ label: c, value: c }))}
              onSelect={setCategory}
              selectedValue={category}
              align="right"
            />
            
            <Dropdown
              trigger={
                <Button variant="outline" className="w-full sm:w-44 justify-between gap-2">
                  <span className="truncate capitalize">{sortBy === 'popularity' ? 'Popularité' : sortBy}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                </Button>
              }
              items={[
                { label: 'Titre A-Z', value: 'title' },
                { label: 'Auteur A-Z', value: 'author' },
                { label: 'Popularité', value: 'popularity' },
                { label: 'Année', value: 'date' },
              ]}
              onSelect={(value) => setSortBy(value as typeof sortBy)}
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
                <BookCard key={book.id} book={book} variant="grid" index={index} />
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
                    <th className="pb-3 px-6 hidden md:table-cell">Auteur</th>
                    <th className="pb-3 px-6 hidden lg:table-cell">Catégorie</th>
                    <th className="pb-3 px-6 hidden xl:table-cell">Année</th>
                    <th className="pb-3 px-6">Disponibilité</th>
                    <th className="pb-3 px-6 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-primary)]">
                  {filteredBooks.map((book, index) => (
                    <BookCard key={book.id} book={book} variant="list" index={index} />
                  ))}
                  {filteredBooks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
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
    </div>
  )
}
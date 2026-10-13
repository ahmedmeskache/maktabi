import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, AlertTriangle, Clock, Share2, Heart, Download, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const book = {
  id: '1',
  isbn: '9782070360024',
  title: 'Le Petit Prince',
  author: 'Antoine de Saint-Exupéry',
  publisher: 'Gallimard',
  publishedYear: 1943,
  category: 'Littérature',
  subcategory: 'Classique',
  description: 'Un pilote d\'avion fait une rencontre extraordinaire au milieu du désert : un petit bonhomme blond aux cheveux bouclés, qui lui demande de lui dessiner un mouton. À travers ce conte philosophique, Saint-Exupéry explore les thèmes de l\'amitié, de l\'amour, de la solitude et de l\'essentiel qui est invisible pour les yeux.',
  coverUrl: null,
  totalCopies: 5,
  availableCopies: 3,
  location: 'Rayon A - Étagère 3',
  tags: ['Classique', 'Jeunesse', 'Philosophique'],
  totalLoans: 142,
  rating: 4.8,
}

const loans = [
  { id: '1', member: 'Marie Dubois', loanDate: '2024-01-15', dueDate: '2024-02-15', status: 'active' },
  { id: '2', member: 'Jean Martin', loanDate: '2023-12-01', dueDate: '2023-12-31', status: 'returned' },
  { id: '3', member: 'Sophie Bernard', loanDate: '2023-11-10', dueDate: '2023-12-10', status: 'overdue' },
]

const coverUrl = `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=entropy&auto=format&q=80&sig=${book.isbn}`

export function BookDetail() {
  return (
    <div className="space-y-6 page-transition">
      <div className="flex items-center gap-4">
        <Link to="/books" className="p-2.5 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-body-xs font-semibold text-primary-500 uppercase tracking-wider">LITTÉRATURE</p>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{book.title}</h1>
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Badge variant="info" className="text-sm px-3 py-1.5">{book.category}</Badge>
                  <Badge variant={book.availableCopies > 0 ? 'success' : 'danger'} className="text-sm px-3 py-1.5 flex items-center gap-1.5">
                    {book.availableCopies > 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> {book.availableCopies} disponible{book.availableCopies > 1 ? 's' : ''}
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-400" /> Indisponible
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between p-4 bg-[var(--color-bg-tertiary)] rounded-xl">
                  <div>
                    <p className="text-body-xs text-[var(--color-text-muted)] uppercase tracking-wider">Note moyenne</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-2xl font-bold text-[var(--color-text-primary)]">{book.rating}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn('w-4 h-4', i < Math.floor(book.rating) ? 'text-amber-400 fill-current' : 'text-[var(--color-text-muted)]')} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-xs text-[var(--color-text-muted)] uppercase tracking-wider">Total emprunts</p>
                    <p className="text-xl font-bold text-[var(--color-text-primary)] mt-1">{book.totalLoans}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">ISBN</span>
                    <span className="font-mono text-body-sm text-[var(--color-text-primary)]">{book.isbn}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">Éditeur</span>
                    <span className="text-[var(--color-text-primary)]">{book.publisher}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">Année</span>
                    <span className="text-[var(--color-text-primary)]">{book.publishedYear}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-primary)]">
                    <span className="text-[var(--color-text-secondary)]">Localisation</span>
                    <span className="font-medium text-[var(--color-text-primary)]">{book.location}</span>
                  </div>
                  <div className="flex items-start justify-between py-2">
                    <span className="text-[var(--color-text-secondary)]">Exemplaires</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('font-bold', book.availableCopies > 0 ? 'text-emerald-400' : 'text-red-400')}>{book.availableCopies}</span>
                      <span className="text-[var(--color-text-muted)]">/</span>
                      <span className="text-[var(--color-text-secondary)]">{book.totalCopies}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Link to="/loans/checkout">
                    <Button variant="primary" className="w-full py-3" disabled={book.availableCopies === 0}>
                      <BookOpen className="w-5 h-5 mr-2" />
                      {book.availableCopies > 0 ? 'Emprunter cet ouvrage' : 'Indisponible pour le moment'}
                    </Button>
                  </Link>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="py-2.5" aria-label="Partager">
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="py-2.5" aria-label="Télécharger la fiche">
                      <Download className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" className="py-2.5" aria-label="Signaler un problème">
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
                    <CardTitle className="text-xl">À propos de cet ouvrage</CardTitle>
                    <p className="text-[var(--color-text-secondary)] mt-1">Par {book.author} • {book.publisher} ({book.publishedYear})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-body-xs font-medium bg-[var(--color-bg-tertiary)] rounded-full text-[var(--color-text-secondary)]">{book.subcategory}</span>
                    {book.tags.map(tag => (
                      <Badge key={tag} variant="neutral" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{book.description}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-border-primary)]">
                <CardTitle>Historique des emprunts récents</CardTitle>
                <Link to="/loans/checkout">
                  <Button variant="outline" size="sm"><BookOpen className="w-4 h-4 mr-1" /> Nouvel emprunt</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-body-sm font-medium text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                      <th className="pb-3 px-6">Adhérent</th>
                      <th className="pb-3 px-6 hidden md:table-cell">Date emprunt</th>
                      <th className="pb-3 px-6 hidden md:table-cell">Date retour prévue</th>
                      <th className="pb-3 px-6">Statut</th>
                      <th className="pb-3 px-6 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-primary)]">
                    {loans.map((loan, index) => (
                      <motion.tr key={loan.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-[var(--color-bg-tertiary)]/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar name={loan.member} size="md" />
                            <span className="font-medium text-[var(--color-text-primary)]">{loan.member}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell text-[var(--color-text-secondary)]">{loan.loanDate}</td>
                        <td className="py-4 px-6 hidden md:table-cell text-[var(--color-text-secondary)]">{loan.dueDate}</td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant={loan.status === 'active' ? 'info' : loan.status === 'returned' ? 'success' : 'danger'} 
                            className="text-xs"
                          >
                            {loan.status === 'active' ? 'En cours' : loan.status === 'returned' ? 'Retourné' : 'En retard'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Détails"><Clock className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
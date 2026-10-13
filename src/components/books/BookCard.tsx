import { motion } from 'framer-motion'
import type { SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Check, AlertTriangle, TrendingUp, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getBookCover, fallbackCover } from '@/lib/utils'
import type { Book } from '@/types'

interface BookCardProps {
  book: Book
  variant?: 'grid' | 'list'
  index?: number
  onEdit?: (book: Book) => void
  onDelete?: (book: Book) => void
}

export function BookCard({ book, variant = 'grid', index = 0, onEdit, onDelete }: BookCardProps) {
  const coverUrl = getBookCover(book)

  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.dataset.fallback) return
    img.dataset.fallback = '1'
    img.src = fallbackCover(book.title)
  }

  const isAvailable = book.availableCopies > 0

  if (variant === 'list') {
    return (
      <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        className="hover:bg-[var(--color-bg-tertiary)]/50 transition-colors"
      >
        <td className="py-4 px-6">
          <Link to={`/books/${book.id}`} className="block">
            <div className="w-16 h-24 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-xl relative overflow-hidden flex items-center justify-center">
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover opacity-90"
                loading="lazy"
                onError={handleImgError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="danger" className="text-xs">Indisponible</Badge>
                </div>
              )}
            </div>
          </Link>
        </td>
        <td className="py-4 px-6">
          <Link to={`/books/${book.id}`} className="group">
            <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-primary-500 transition-colors truncate max-w-xs">{book.title}</h3>
            <p className="text-body-sm text-[var(--color-text-secondary)] truncate max-w-xs">{book.author}</p>
          </Link>
        </td>
        <td className="py-4 px-6 hidden md:table-cell">
          <Badge variant="info" className="text-xs">{book.category}</Badge>
        </td>
        <td className="py-4 px-6 hidden lg:table-cell">
          <span className="text-body-sm text-[var(--color-text-secondary)]">{book.publishedYear || '—'}</span>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <Badge variant={isAvailable ? 'success' : 'danger'} className="text-xs">
              {isAvailable ? (
                <>
                  <Check className="w-3 h-3 mr-1" /> {book.availableCopies}/{book.totalCopies}
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" /> Rupture
                </>
              )}
            </Badge>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-1">
            <Link to={`/books/${book.id}`} className="p-2 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-primary-500" aria-label="Voir détails">
              <BookOpen className="w-4 h-4" />
            </Link>
            {onEdit && (
              <button onClick={() => onEdit(book)} className="p-2 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-primary-500" aria-label="Modifier">
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(book)} className="p-2 rounded-xl hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-red-500" aria-label="Supprimer">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </motion.tr>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link to={`/books/${book.id}`} className="block h-full">
        <Card className="h-full card-hover group relative overflow-hidden">
          <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-primary-500/5 to-accent-500/5">
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
              onError={handleImgError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
              <Badge variant={isAvailable ? 'success' : 'danger'} className="text-xs px-2 py-1">
                {isAvailable ? (
                  <>
                    <Check className="w-3 h-3 mr-1" /> {book.availableCopies} dispo
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" /> Rupture
                  </>
                )}
              </Badge>
            </div>

            {(onEdit || onDelete) && (
              <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                {onEdit && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(book) }}
                    className="p-1.5 rounded-lg bg-white/90 dark:bg-[#17120c]/90 text-[var(--color-text-secondary)] hover:text-primary-500 shadow"
                    aria-label="Modifier"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(book) }}
                    className="p-1.5 rounded-lg bg-white/90 dark:bg-[#17120c]/90 text-[var(--color-text-secondary)] hover:text-red-500 shadow"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 flex justify-between">
              <Badge variant="info" className="text-xs px-2 py-1">{book.category}</Badge>
              {book.totalLoans && book.totalLoans > 50 && (
                <Badge variant="warning" className="text-xs px-2 py-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Populaire
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-5">
            <p className="text-body-xs font-medium text-primary-500 uppercase tracking-wider mb-1">{book.category}</p>
            <h3 className="font-bold text-[var(--color-text-primary)] line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">{book.title}</h3>
            <p className="text-body-sm text-[var(--color-text-secondary)] line-clamp-1 mb-3">{book.author}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-primary)]">
              <div className="flex items-center gap-1.5 text-body-xs text-[var(--color-text-muted)]">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-mono">{book.isbn.slice(-8)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-body-xs font-medium">
                {isAvailable ? (
                  <>
                    <span className="text-emerald-400">{book.availableCopies}</span>
                    <span className="text-[var(--color-text-muted)]">/</span>
                    <span className="text-[var(--color-text-secondary)]">{book.totalCopies}</span>
                  </>
                ) : (
                  <span className="text-red-400">0/{book.totalCopies}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.article>
  )
}
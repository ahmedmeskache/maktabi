import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLibraryStore, type NewBook } from '@/store/library'
import { useTranslation } from '@/i18n'
import type { Book } from '@/types'

export const BOOK_CATEGORIES = ['Littérature', 'Science-Fiction', 'Philosophie', 'Fantasy', 'Histoire', 'Biographie', 'Jeunesse', 'Sciences', 'Arts']

const empty: NewBook = {
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  publishedYear: new Date().getFullYear(),
  category: BOOK_CATEGORIES[0],
  subcategory: '',
  description: '',
  coverUrl: null,
  totalCopies: 1,
  availableCopies: 1,
  location: '',
  tags: [],
}

export function BookFormModal({ isOpen, onClose, book }: { isOpen: boolean; onClose: () => void; book?: Book | null }) {
  const { t } = useTranslation()
  const { addBook, updateBook, categories } = useLibraryStore()
  const categoryNames = categories.length > 0 ? categories.map((c) => c.name) : BOOK_CATEGORIES
  const [form, setForm] = useState<NewBook>(empty)
  const [tagsText, setTagsText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) return
    if (book) {
      setForm({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher ?? '',
        publishedYear: book.publishedYear ?? new Date().getFullYear(),
        category: book.category,
        subcategory: book.subcategory ?? '',
        description: book.description ?? '',
        coverUrl: book.coverUrl ?? null,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        location: book.location ?? '',
        tags: book.tags,
      })
      setTagsText(book.tags.join(', '))
    } else {
      setForm(empty)
      setTagsText('')
    }
    setErrors({})
  }, [isOpen, book])

  const set = <K extends keyof NewBook>(key: K, value: NewBook[K]) => setForm((f) => ({ ...f, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = t('books.reqTitle')
    if (!form.author.trim()) e.author = t('books.reqAuthor')
    if (!form.isbn.trim()) e.isbn = t('books.reqIsbn')
    if (form.totalCopies < 1) e.totalCopies = t('books.minCopies')
    if (form.availableCopies > form.totalCopies) e.availableCopies = t('books.exceedTotal')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload: NewBook = {
      ...form,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      publishedYear: Number(form.publishedYear) || undefined,
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
    }
    if (book) {
      updateBook(book.id, payload)
      toast.success(t('books.updated'))
    } else {
      addBook(payload)
      toast.success(t('books.added'))
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book ? t('books.modalEdit') : t('books.modalNew')} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label={`${t('books.fTitle')} *`} value={form.title} onChange={(e) => set('title', e.target.value)} error={errors.title} />
          <Input label={`${t('books.fAuthor')} *`} value={form.author} onChange={(e) => set('author', e.target.value)} error={errors.author} />
          <Input label={`${t('books.fIsbn')} *`} value={form.isbn} onChange={(e) => set('isbn', e.target.value)} error={errors.isbn} />
          <Input label={t('books.fPublisher')} value={form.publisher} onChange={(e) => set('publisher', e.target.value)} />
          <Input label={t('books.fYear')} type="number" value={form.publishedYear ?? ''} onChange={(e) => set('publishedYear', Number(e.target.value))} />
          <div>
            <label className="block text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('books.fCategory')}</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label={t('books.fSubcategory')} value={form.subcategory} onChange={(e) => set('subcategory', e.target.value)} />
          <Input label={t('books.fLocation')} value={form.location} onChange={(e) => set('location', e.target.value)} />
          <Input label={t('books.fTotalCopies')} type="number" min={1} value={form.totalCopies} onChange={(e) => set('totalCopies', Number(e.target.value))} error={errors.totalCopies} />
          <Input label={t('books.fAvailCopies')} type="number" min={0} value={form.availableCopies} onChange={(e) => set('availableCopies', Number(e.target.value))} error={errors.availableCopies} />
          <Input label={t('books.fTags')} value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          <Input label={t('books.fCover')} value={form.coverUrl ?? ''} onChange={(e) => set('coverUrl', e.target.value || null)} />
        </div>
        <Textarea label={t('books.fDescription')} value={form.description} onChange={(e) => set('description', e.target.value)} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button variant="primary" onClick={handleSubmit}>{book ? t('common.save') : t('common.add')}</Button>
        </div>
      </div>
    </Modal>
  )
}

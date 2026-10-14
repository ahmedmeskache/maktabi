import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useUIStore } from '@/store'
import { translate, LOCALE_BY_LANG } from '@/i18n'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function currentLocale(): string {
  try {
    return LOCALE_BY_LANG[useUIStore.getState().language] ?? 'fr-FR'
  } catch {
    return 'fr-FR'
  }
}

function currentLanguage() {
  try {
    return useUIStore.getState().language
  } catch {
    return 'fr' as const
  }
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const locale = currentLocale()

  if (format === 'relative') {
    const lang = currentLanguage()
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 7) return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    if (diffDays > 0) return translate(lang, diffDays > 1 ? 'time.daysAgo' : 'time.dayAgo', { count: diffDays })
    if (diffHours > 0) return translate(lang, diffHours > 1 ? 'time.hoursAgo' : 'time.hourAgo', { count: diffHours })
    if (diffMinutes > 0) return translate(lang, diffMinutes > 1 ? 'time.minutesAgo' : 'time.minuteAgo', { count: diffMinutes })
    return translate(lang, 'time.now')
  }

  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' }

  return d.toLocaleDateString(locale, options)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(currentLocale(), {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function addDays(date: Date | string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function daysBetween(from: Date | string, to: Date | string): number {
  const a = new Date(from)
  const b = new Date(to)
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export const FINE_PER_DAY = 50

export function calculateFine(dueDate: Date | string, reference: Date | string = new Date()): number {
  const overdue = daysBetween(dueDate, reference)
  if (overdue <= 0) return 0
  return Math.round(overdue * FINE_PER_DAY * 100) / 100
}

export function getBookCover(book: { title?: string; author?: string; category?: string; isbn?: string; coverUrl?: string | null; id?: string }, size: 'S' | 'M' | 'L' = 'L'): string {
  if (book.coverUrl) return book.coverUrl
  if (book.isbn) return `https://covers.openlibrary.org/b/isbn/${book.isbn}-${size}.jpg?default=false`
  return generateCover({
    title: book.title || 'Sans titre',
    author: book.author,
    category: book.category,
    seed: book.id || book.isbn || book.title,
  })
}

export function fallbackCover(seed?: string): string {
  return generateCover({ title: seed || 'Sans titre' })
}

const COVER_PALETTES: [string, string, string][] = [
  ['#1d3b2a', '#2f7d5b', '#e8c874'],
  ['#3b1f28', '#7a2e44', '#e8c874'],
  ['#1f2c3f', '#2f4a6b', '#e8c874'],
  ['#3d2c1a', '#6b4a26', '#f0d9a0'],
  ['#2c2333', '#4a3b57', '#dcb3ff'],
  ['#173d3a', '#2f7d74', '#e8c874'],
  ['#3a2f16', '#7a5c1e', '#f5e3ad'],
  ['#33241d', '#6b3f2b', '#f0c8a0'],
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) | 0
  return Math.abs(hash)
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrapTitle(title: string, maxChars: number, maxLines: number): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length <= maxChars || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
      if (lines.length >= maxLines) break
    }
  }
  if (lines.length < maxLines && current) lines.push(current)
  const result = lines.slice(0, maxLines)
  if (words.join(' ').length > result.join(' ').length && result.length > 0) {
    const last = result[result.length - 1]
    result[result.length - 1] = `${last.length > maxChars - 1 ? last.slice(0, maxChars - 1) : last}…`
  }
  return result
}

export function generateCover(book: { title: string; author?: string; category?: string; seed?: string }): string {
  const key = book.seed ? book.seed : `${book.title}${book.author ?? ''}`
  const [from, to, accent] = COVER_PALETTES[hashString(key) % COVER_PALETTES.length]
  const titleLines = wrapTitle(book.title, 16, 4)
  const lineHeight = 30
  const blockHeight = titleLines.length * lineHeight
  const titleTop = 210 - blockHeight / 2 + 12

  const titleText = titleLines
    .map((line, i) => `<text x="150" y="${(titleTop + i * lineHeight).toFixed(0)}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="25" font-weight="700" fill="#fdf6e3">${escapeXml(line)}</text>`)
    .join('')

  const categoryText = book.category
    ? `<text x="150" y="120" text-anchor="middle" font-family="Georgia, serif" font-size="12" letter-spacing="2" fill="${accent}">${escapeXml(book.category.toUpperCase())}</text>`
    : ''

  const authorText = book.author
    ? `<text x="150" y="${(titleTop + titleLines.length * lineHeight + 26).toFixed(0)}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="14" fill="rgba(253,246,227,0.85)">${escapeXml(book.author)}</text>`
    : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="${from}"/>
<stop offset="100%" stop-color="${to}"/>
</linearGradient>
<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="rgba(255,255,255,0.16)"/>
<stop offset="45%" stop-color="rgba(255,255,255,0.03)"/>
<stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
</linearGradient>
</defs>
<rect width="300" height="450" fill="url(#bg)"/>
<rect width="300" height="450" fill="url(#gloss)"/>
<rect x="0" y="0" width="16" height="450" fill="rgba(0,0,0,0.35)"/>
<rect x="14" y="0" width="3" height="450" fill="rgba(255,255,255,0.12)"/>
<rect x="30" y="30" width="240" height="390" fill="none" stroke="${accent}" stroke-opacity="0.55" stroke-width="1.5"/>
<rect x="38" y="38" width="224" height="374" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="1"/>
<line x1="70" y1="134" x2="230" y2="134" stroke="${accent}" stroke-opacity="0.7" stroke-width="1"/>
<circle cx="150" cy="134" r="3.5" fill="${accent}"/>
${categoryText}
${titleText}
${authorText}
<text x="150" y="418" text-anchor="middle" font-family="Georgia, serif" font-size="10" letter-spacing="3" fill="rgba(253,246,227,0.5)">MAKTABI</text>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'badge-success',
    returned: 'badge-neutral',
    overdue: 'badge-danger',
    lost: 'badge-danger',
    pending: 'badge-warning',
    ready: 'badge-info',
    cancelled: 'badge-neutral',
    completed: 'badge-success',
    expired: 'badge-danger',
    suspended: 'badge-warning',
  }
  return colors[status] || 'badge-neutral'
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
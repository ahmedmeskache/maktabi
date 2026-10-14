import { useUIStore } from '@/store'
import frApp from './locales/fr/app'
import enApp from './locales/en/app'
import arApp from './locales/ar/app'
import frDashboard from './locales/fr/dashboard'
import enDashboard from './locales/en/dashboard'
import arDashboard from './locales/ar/dashboard'
import frBooks from './locales/fr/books'
import enBooks from './locales/en/books'
import arBooks from './locales/ar/books'
import frMembers from './locales/fr/members'
import enMembers from './locales/en/members'
import arMembers from './locales/ar/members'
import frLoans from './locales/fr/loans'
import enLoans from './locales/en/loans'
import arLoans from './locales/ar/loans'
import frStats from './locales/fr/stats'
import enStats from './locales/en/stats'
import arStats from './locales/ar/stats'
import frMisc from './locales/fr/misc'
import enMisc from './locales/en/misc'
import arMisc from './locales/ar/misc'

export type Language = 'fr' | 'en' | 'ar'

export const LANGUAGES: { value: Language; label: string; dir: 'ltr' | 'rtl' }[] = [
  { value: 'fr', label: 'Français', dir: 'ltr' },
  { value: 'en', label: 'English', dir: 'ltr' },
  { value: 'ar', label: 'العربية', dir: 'rtl' },
]

export const LOCALE_BY_LANG: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-DZ',
}

type Dictionary = Record<string, string>

const fr: Dictionary = { ...frApp, ...frDashboard, ...frBooks, ...frMembers, ...frLoans, ...frStats, ...frMisc }
const en: Dictionary = { ...enApp, ...enDashboard, ...enBooks, ...enMembers, ...enLoans, ...enStats, ...enMisc }
const ar: Dictionary = { ...arApp, ...arDashboard, ...arBooks, ...arMembers, ...arLoans, ...arStats, ...arMisc }

const dictionaries: Record<Language, Dictionary> = { fr, en, ar }

export function translate(language: Language, key: string, vars?: Record<string, string | number>): string {
  const dict = dictionaries[language] ?? dictionaries.fr
  let s = dict[key] ?? dictionaries.fr[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.split(`{{${k}}}`).join(String(v))
    }
  }
  return s
}

export function getLanguageDir(language: Language): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr'
}

export function useTranslation() {
  const language = useUIStore((s) => s.language)
  const setLanguage = useUIStore((s) => s.setLanguage)
  const t = (key: string, vars?: Record<string, string | number>) => translate(language, key, vars)
  return { t, language, setLanguage }
}

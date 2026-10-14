import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookMarked, Mail, Lock, LogIn, Languages } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/auth'
import { useTranslation, LANGUAGES } from '@/i18n'

export function Login() {
  const { t, language, setLanguage } = useTranslation()
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password.trim()) {
      setError(t('auth.login.required'))
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = login(identifier, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error === 'disabled' ? t('auth.login.disabled') : t('auth.login.invalid'))
      return
    }
    toast.success(t('auth.login.welcome', { name: identifier }))
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[var(--color-bg-secondary)]">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
            <Languages className="w-4 h-4 mx-2 text-[var(--color-text-muted)]" aria-hidden="true" />
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={
                  'px-3 py-1.5 rounded-lg text-body-xs font-medium transition-colors ' +
                  (language === lang.value
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border-primary)]/50')
                }
                aria-pressed={language === lang.value}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#221b12] rounded-3xl border border-[var(--color-border-primary)] shadow-xl p-8"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-600/30 mb-4">
              <BookMarked className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">Maktabi</h1>
            <p className="text-body-md font-medium text-[var(--color-text-primary)] mt-2">{t('auth.login.title')}</p>
            <p className="text-body-sm text-[var(--color-text-muted)]">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.login.identifier')}
              placeholder={t('auth.login.identifierPlaceholder')}
              icon={<Mail className="w-4 h-4" />}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />
            <Input
              label={t('auth.login.password')}
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error || undefined}
            />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              {!loading && <LogIn className="w-4 h-4" />}
              {loading ? t('auth.login.submitting') : t('auth.login.submit')}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-2xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
            <p className="text-body-xs font-semibold text-[var(--color-text-secondary)] mb-2">{t('auth.login.demoTitle')}</p>
            <p className="text-body-xs text-[var(--color-text-muted)]">{t('auth.login.demoAdmin')}</p>
            <p className="text-body-xs text-[var(--color-text-muted)]">{t('auth.login.demoUser')}</p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-body-sm text-brand-600 dark:text-brand-400 hover:underline">
              {t('auth.login.backHome')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

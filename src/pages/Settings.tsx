import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Palette, Bell, Shield, Database, Save, Download, Moon, Sun, Monitor, Languages, KeyRound, ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Dropdown } from '@/components/ui/Dropdown'
import { useUIStore } from '@/store'
import { useAuthStore } from '@/store/auth'
import { useLibraryStore } from '@/store/library'
import { useHistoryStore } from '@/store/history'
import { useTranslation, LANGUAGES, type Language } from '@/i18n'
import { cn, formatDate } from '@/lib/utils'

type Section = 'general' | 'appearance' | 'notifications' | 'security' | 'data'

const SECTIONS: { id: Section; icon: typeof User; labelKey: string }[] = [
  { id: 'general', icon: User, labelKey: 'settings.section.general' },
  { id: 'appearance', icon: Palette, labelKey: 'settings.section.appearance' },
  { id: 'notifications', icon: Bell, labelKey: 'settings.section.notifications' },
  { id: 'security', icon: Shield, labelKey: 'settings.section.security' },
  { id: 'data', icon: Database, labelKey: 'settings.section.data' },
]

const NOTIFICATION_KEYS = ['loans', 'returns', 'reservations', 'members', 'reports'] as const

export function Settings() {
  const { t, language, setLanguage } = useTranslation()
  const { theme, setTheme, notificationPrefs, setNotificationPref, lastBackup, setLastBackup } = useUIStore()
  const { currentUser, updateProfile, changePassword, setTwoFactor } = useAuthStore()
  const { books, resetData } = useLibraryStore()
  const log = useHistoryStore((s) => s.log)

  const [section, setSection] = useState<Section>('general')
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    library: currentUser?.library ?? '',
  })
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [pwdError, setPwdError] = useState('')

  const currentLanguage = useMemo(() => LANGUAGES.find((l) => l.value === language), [language])

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    updateProfile(profile)
    setSaving(false)
    toast.success(t('settings.saved'))
  }

  const handleChangePassword = () => {
    setPwdError('')
    if (pwd.next !== pwd.confirm) {
      setPwdError(t('settings.security.mismatch'))
      return
    }
    const result = changePassword(pwd.current, pwd.next)
    if (!result.ok) {
      setPwdError(result.error === 'tooShort' ? t('settings.security.tooShort') : t('settings.security.wrongCurrent'))
      return
    }
    toast.success(t('settings.security.updated'))
    setPwd({ current: '', next: '', confirm: '' })
    setPasswordOpen(false)
  }

  const handleBackup = () => {
    const data: Record<string, unknown> = {}
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('maktabi-')) {
        try { data[key] = JSON.parse(localStorage.getItem(key) ?? 'null') } catch { data[key] = localStorage.getItem(key) }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maktabi-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setLastBackup(new Date().toISOString())
    log('settings.backup', 'settings', '')
    toast.success(t('settings.data.backupDone'))
  }

  const handleExportBooks = () => {
    const header = 'title,author,isbn,category,totalCopies,availableCopies\n'
    const rows = books
      .map((b) => [b.title, b.author, b.isbn, b.category, b.totalCopies, b.availableCopies].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maktabi-books-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    log('settings.export', 'settings', '')
    toast.success(t('settings.data.exportDone'))
  }

  const handleReset = () => {
    resetData()
    setResetOpen(false)
    toast.success(t('settings.data.resetDone'))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('settings.title')}</h1>
        <p className="text-body-md text-[var(--color-text-muted)] mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <nav className="space-y-1" aria-label={t('settings.title')}>
            {SECTIONS.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSection(item.id)}
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-left text-body-sm font-medium transition-all flex items-center gap-3',
                  section === item.id
                    ? 'bg-gradient-to-r from-brand-500/15 to-transparent text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                aria-current={section === item.id ? 'page' : undefined}
              >
                <item.icon className="w-4 h-4" />
                <span>{t(item.labelKey)}</span>
              </motion.button>
            ))}
          </nav>
        </motion.aside>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-6">
          {section === 'general' && (
            <Card><CardHeader><CardTitle>{t('settings.profile.title')}</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center"><User className="w-8 h-8 text-white" /></div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">{profile.name || currentUser?.name}</p>
                  <p className="text-body-sm text-[var(--color-text-muted)]">{profile.email || currentUser?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label={t('settings.profile.fullName')} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                <Input label={t('settings.profile.email')} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                <Input label={t('settings.profile.phone')} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                <Input label={t('settings.profile.library')} value={profile.library} onChange={(e) => setProfile({ ...profile, library: e.target.value })} />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSaveProfile} loading={saving}>
                  {!saving && <Save className="w-4 h-4" />}
                  {saving ? t('settings.saving') : t('settings.save')}
                </Button>
              </div>
            </CardContent></Card>
          )}

          {section === 'appearance' && (
            <Card><CardHeader><CardTitle>{t('settings.section.appearance')}</CardTitle></CardHeader><CardContent className="space-y-6">
              <div>
                <p className="text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-4">{t('layout.theme')}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: t('layout.light'), icon: Sun },
                    { id: 'dark', label: t('layout.dark'), icon: Moon },
                    { id: 'system', label: t('layout.system'), icon: Monitor },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id as 'light' | 'dark' | 'system')}
                      className={cn('p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all', theme === item.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300')}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="font-medium text-body-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-4">{t('layout.language')}</p>
                <Dropdown
                  trigger={<Button variant="outline" className="w-full sm:w-56 justify-between"><span className="flex items-center gap-2"><Languages className="w-4 h-4" />{currentLanguage?.label}</span></Button>}
                  items={LANGUAGES.map((l) => ({ label: l.label, value: l.value }))}
                  onSelect={(value) => setLanguage(value as Language)}
                  selectedValue={language}
                  className="w-full sm:w-56"
                />
              </div>
            </CardContent></Card>
          )}

          {section === 'notifications' && (
            <Card><CardHeader><CardTitle>{t('settings.section.notifications')}</CardTitle></CardHeader><CardContent className="space-y-4">
              {NOTIFICATION_KEYS.map((key) => (
                <label key={key} className="flex items-center justify-between">
                  <span className="font-medium text-[var(--color-text-primary)]">{t(`settings.notifications.${key}`)}</span>
                  <input
                    type="checkbox"
                    checked={notificationPrefs[key] ?? false}
                    onChange={(e) => setNotificationPref(key, e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </label>
              ))}
            </CardContent></Card>
          )}

          {section === 'security' && (
            <Card><CardHeader><CardTitle>{t('settings.section.security')}</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={() => { setPwd({ current: '', next: '', confirm: '' }); setPwdError(''); setPasswordOpen(true) }}>
                  <KeyRound className="w-4 h-4" /> {t('settings.security.changePassword')}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { setTwoFactor(!currentUser?.twoFactor); toast.success(t('settings.saved')) }}>
                  <ShieldCheck className={cn('w-4 h-4', currentUser?.twoFactor && 'text-green-500')} />
                  {currentUser?.twoFactor ? t('settings.security.disable2fa') : t('settings.security.enable2fa')}
                </Button>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                {currentUser?.twoFactor ? t('settings.security.twoFactorOn') : t('settings.security.twoFactorOff')}
              </p>
            </CardContent></Card>
          )}

          {section === 'data' && (
            <Card><CardHeader><CardTitle>{t('settings.section.data')}</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full" onClick={handleBackup}><Database className="w-4 h-4" /> {t('settings.data.backup')}</Button>
                <Button variant="outline" className="w-full" onClick={handleExportBooks}><Download className="w-4 h-4" /> {t('settings.data.exportCsv')}</Button>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                {t('settings.data.lastBackup', { date: lastBackup ? formatDate(lastBackup, 'long') : t('settings.data.never') })}
              </p>
              <div className="pt-2 border-t border-[var(--color-border-primary)]">
                <Button variant="danger" onClick={() => setResetOpen(true)}>{t('settings.data.reset')}</Button>
              </div>
            </CardContent></Card>
          )}
        </motion.div>
      </div>

      <Modal isOpen={passwordOpen} onClose={() => setPasswordOpen(false)} title={t('settings.security.passwordTitle')} size="sm">
        <div className="space-y-4">
          <Input label={t('settings.security.current')} type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} />
          <Input label={t('settings.security.new')} type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} />
          <Input label={t('settings.security.confirm')} type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} error={pwdError || undefined} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setPasswordOpen(false)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleChangePassword}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)} title={t('settings.data.resetTitle')} size="sm">
        <p className="text-body-md text-[var(--color-text-secondary)] mb-6">{t('settings.data.resetMessage')}</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setResetOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={handleReset}>{t('common.confirm')}</Button>
        </div>
      </Modal>
    </div>
  )
}

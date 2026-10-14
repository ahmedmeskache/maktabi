import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building2, ShieldCheck, LogOut, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/store/auth'
import { useTranslation } from '@/i18n'

export function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentUser, updateProfile, logout } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    library: currentUser?.library ?? '',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    updateProfile(form)
    setSaving(false)
    toast.success(t('profile.updated'))
  }

  const handleLogout = () => {
    logout()
    toast.success(t('layout.logoutSuccess'))
    navigate('/login', { replace: true })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('profile.title')}</h1>
        <p className="text-body-md text-[var(--color-text-secondary)] mt-1">{t('profile.subtitle')}</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar name={form.name} size="2xl" />
            <div className="text-center sm:text-left flex-1">
              <p className="text-heading-md font-semibold text-[var(--color-text-primary)]">{form.name}</p>
              <p className="text-body-sm text-[var(--color-text-secondary)]">{form.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 badge bg-primary-500/10 text-primary-500 border border-primary-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> {t(`role.${currentUser?.role ?? 'user'}`)}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader><CardTitle>{t('profile.info')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label={t('settings.profile.fullName')} value={form.name} icon={<User className="w-4 h-4" />} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label={t('settings.profile.email')} type="email" value={form.email} icon={<Mail className="w-4 h-4" />} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label={t('settings.profile.phone')} value={form.phone} icon={<Phone className="w-4 h-4" />} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label={t('settings.profile.library')} value={form.library} icon={<Building2 className="w-4 h-4" />} onChange={(e) => setForm({ ...form, library: e.target.value })} />
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary" loading={saving} onClick={handleSave}>
                {!saving && <Save className="w-4 h-4" />} {t('common.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle>{t('profile.session')}</CardTitle></CardHeader>
          <CardContent>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> {t('profile.logout')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

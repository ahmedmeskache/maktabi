import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useTranslation } from '@/i18n'

export function Contact() {
  const { t } = useTranslation()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const channels = [
    { icon: Mail, label: t('common.email'), value: 'contact@maktabi.fr', color: 'text-primary-500 bg-primary-500/10' },
    { icon: Phone, label: t('common.phone'), value: '+33 1 23 45 67 89', color: 'text-accent-500 bg-accent-500/10' },
    { icon: MapPin, label: t('misc.contact.address'), value: '12 rue des Livres, 75000 Paris', color: 'text-emerald-500 bg-emerald-500/10' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setForm({ name: '', email: '', subject: '', message: '' })
    toast.success(t('misc.contact.sent'))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">{t('misc.contact.title')}</h1>
        <p className="text-body-md text-[var(--color-text-secondary)] mt-1">{t('misc.contact.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="h-full">
              <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.color}`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-body-sm font-medium text-[var(--color-text-primary)]">{c.label}</p>
                  <p className="text-body-sm text-[var(--color-text-secondary)]">{c.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-500" /> {t('misc.contact.formTitle')}</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label={t('common.name')} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label={t('common.email')} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <Input label={t('misc.contact.subject')} required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <Textarea label={t('misc.contact.message')} required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" loading={saving}>
                  <Send className="w-4 h-4 ms-1 rtl:rotate-180" /> {t('common.send')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

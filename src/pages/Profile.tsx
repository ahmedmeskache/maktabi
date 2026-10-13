import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building2, ShieldCheck, LogOut, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'

export function Profile() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: 'Bibliothécaire Principal',
    email: 'admin@maktabi.fr',
    phone: '+33 1 23 45 67 89',
    library: 'Bibliothèque Centrale',
    role: 'Administrateur',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    toast.success('Profil enregistré avec succès')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display-sm font-bold text-[var(--color-text-primary)]">Mon Profil</h1>
        <p className="text-body-md text-[var(--color-text-secondary)] mt-1">Gérez vos informations personnelles</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar name={form.name} size="2xl" />
            <div className="text-center sm:text-left flex-1">
              <p className="text-heading-md font-semibold text-[var(--color-text-primary)]">{form.name}</p>
              <p className="text-body-sm text-[var(--color-text-secondary)]">{form.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 badge bg-primary-500/10 text-primary-500 border border-primary-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> {form.role}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nom complet" value={form.name} icon={<User className="w-4 h-4" />} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" value={form.email} icon={<Mail className="w-4 h-4" />} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Téléphone" value={form.phone} icon={<Phone className="w-4 h-4" />} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Bibliothèque" value={form.library} icon={<Building2 className="w-4 h-4" />} onChange={(e) => setForm({ ...form, library: e.target.value })} />
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary" loading={saving} onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" /> Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle>Session</CardTitle></CardHeader>
          <CardContent>
            <Button variant="danger" onClick={() => { toast.success('Vous avez été déconnecté'); navigate('/') }}>
              <LogOut className="w-4 h-4 mr-1" /> Déconnexion
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

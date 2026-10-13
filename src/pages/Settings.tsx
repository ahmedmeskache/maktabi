import { motion } from 'framer-motion'
import { User, Shield, Database, Moon, Sun, Monitor, Save, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dropdown } from '@/components/ui/Dropdown'
import { useUIStore } from '@/store'
import { useState } from 'react'

export function Settings() {
  const { theme, setTheme } = useUIStore()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-display-sm font-bold text-slate-900 dark:text-white">Paramètres</h1>
        <p className="text-body-md text-slate-500 dark:text-slate-400 mt-1">Configurez votre bibliothèque</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <nav className="space-y-1" aria-label="Paramètres">
            {['Général', 'Apparence', 'Notifications', 'Sécurité', 'Données', 'Intégrations'].map((item, index) => (
              <motion.button key={item} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="w-full px-4 py-3 rounded-xl text-left text-body-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"><span>{item}</span></motion.button>
            ))}
          </nav>
        </motion.aside>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-6">
          <Card><CardHeader><CardTitle>Profil</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center gap-4"><div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center"><User className="w-8 h-8 text-white" /></div><div><p className="font-semibold text-slate-900 dark:text-white">Bibliothécaire Principal</p><p className="text-body-sm text-slate-500 dark:text-slate-400">admin@maktabi.fr</p></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Nom complet" defaultValue="Bibliothécaire Principal" /><Input label="Email" type="email" defaultValue="admin@maktabi.fr" /><Input label="Téléphone" defaultValue="+33 1 23 45 67 89" /><Input label="Bibliothèque" defaultValue="Bibliothèque Centrale" /></div>
          </CardContent></Card>

          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Apparence</CardTitle></CardHeader><CardContent className="space-y-6">
            <div><p className="text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Thème</p><div className="grid grid-cols-3 gap-3">{[ { id: 'light', label: 'Clair', icon: Sun }, { id: 'dark', label: 'Sombre', icon: Moon }, { id: 'system', label: 'Système', icon: Monitor } ].map(t => (<button key={t.id} onClick={() => setTheme(t.id as any)} className={cn('p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all', theme === t.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300') }><t.icon className="w-6 h-6" /><span className="font-medium text-body-sm">{t.label}</span></button>))}</div></div>
            <div><p className="text-body-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Langue</p><Dropdown trigger={<Button variant="outline" className="w-full sm:w-48 justify-between"><span>Français</span></Button>} items={[{ label: 'Français', value: 'fr' }, { label: 'English', value: 'en' }, { label: 'Español', value: 'es' }]} onSelect={() => {}} selectedValue="fr" /></div>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent className="space-y-4">
            {['Nouveaux emprunts', 'Retours en retard', 'Réservations prêtes', 'Nouveaux adhérents', 'Rapports quotidiens'].map(n => (<label key={n} className="flex items-center justify-between"><span className="font-medium text-slate-900 dark:text-white">{n}</span><input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" /></label>))}
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Sécurité</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Button variant="outline" className="w-full"><Shield className="w-4 h-4 mr-1" /> Changer le mot de passe</Button><Button variant="outline" className="w-full"><Shield className="w-4 h-4 mr-1" /> Activer 2FA</Button></div><p className="text-body-sm text-slate-500 dark:text-slate-400">La 2FA n'est pas activée. Activez-la pour plus de sécurité.</p>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>Données</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Button variant="outline" className="w-full"><Database className="w-4 h-4 mr-1" /> Sauvegarder maintenant</Button><Button variant="outline" className="w-full"><Download className="w-4 h-4 mr-1" /> Exporter les données</Button></div><p className="text-body-sm text-slate-500 dark:text-slate-400">Dernière sauvegarde : il y a 2 heures</p>
          </CardContent></Card>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700"><Button variant="primary" onClick={handleSave} loading={saving}><Save className="w-4 h-4 mr-1" />{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</Button></div>
        </motion.div>
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'
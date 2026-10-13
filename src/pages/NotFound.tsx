import { Link } from 'react-router-dom'
import { Home, Search, BookOpen, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="w-24 h-24 mx-auto mb-6 text-primary-500/20">
          <BookOpen className="w-full h-full" />
        </motion.div>
        <motion.h1 initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-9xl font-bold text-primary-500/30 mb-4">404</motion.h1>
        <h2 className="text-heading-xl font-bold text-[var(--color-text-primary)] mb-3">Page introuvable</h2>
        <p className="text-body-lg text-[var(--color-text-secondary)] mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/"><Button variant="primary" className="w-full sm:w-auto"><Home className="w-4 h-4 mr-1" /> Retour à l'accueil</Button></Link>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto"><RotateCcw className="w-4 h-4 mr-1" /> Page précédente</Button>
        </div>
        <div className="mt-10 p-6 bg-[var(--color-bg-tertiary)] rounded-2xl">
          <p className="text-body-sm text-[var(--color-text-muted)] mb-4">Besoin d'aide ?</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="ghost" size="sm"><Search className="w-4 h-4 mr-1" /> Rechercher</Button>
            <Button variant="ghost" size="sm"><BookOpen className="w-4 h-4 mr-1" /> Catalogue</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
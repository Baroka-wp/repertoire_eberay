'use client'

import { useState, useEffect } from 'react'
import { X, Search, MapPin, BookOpen, GraduationCap, Filter } from 'lucide-react'

const NIVEAUX = [
  { id: 'primaire', label: 'Primaire' },
  { id: 'secondaire_inf', label: 'Collège' },
  { id: 'secondaire_sup', label: 'Lycée' },
]

const MATIERES_LISTE = [
  "Français", "Mathématiques", "Physique-Chimie (PC)", "SVT",
  "Anglais", "Histoire-Géo", "Philosophie", "Espagnol", "Allemand",
  "Arabe", "Comptabilité", "Économie", "Informatique",
  "Toutes matières (Primaire)"
]

const DEPARTEMENTS = ["Niamey", "Dosso", "Maradi", "Tahoua", "Zinder", "Agadez", "Diffa", "Tillabéri"]

const VILLES_PAR_REGION: Record<string, string[]> = {
  "Niamey": ["Niamey"],
  "Dosso": ["Dosso", "Gaya", "Doutchi", "Loga"],
  "Maradi": ["Maradi", "Tessaoua", "Dakoro", "Mayahi"],
  "Tahoua": ["Tahoua", "Abalak", "Birni-N'Konni", "Madaoua"],
  "Zinder": ["Zinder", "Magaria", "Gouré", "Mirriah"],
  "Agadez": ["Agadez", "Arlit", "Bilma", "Tchirozérine"],
  "Diffa": ["Diffa", "N'Guigmi", "Maïné-Soroa"],
  "Tillabéri": ["Tillabéri", "Tera", "Filingué", "Say", "Kollo"],
}

interface FiltresModalProps {
  isOpen: boolean
  onClose: () => void
  initialValues: {
    q: string
    region: string
    ville: string
    matiere: string
    niveau: string
  }
}

export default function FiltresModal({ isOpen, onClose, initialValues }: FiltresModalProps) {
  const [formData, setFormData] = useState(initialValues)

  useEffect(() => {
    setFormData(initialValues)
  }, [initialValues])

  const handleRegionChange = (region: string) => {
    setFormData({ ...formData, region, ville: '' })
  }

  const villesDisponibles = formData.region ? VILLES_PAR_REGION[formData.region] || [] : []

  const handleReset = () => {
    setFormData({ q: '', region: '', ville: '', matiere: '', niveau: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    form.submit()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 text-white">
                <Filter size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Filtres de recherche</h2>
                <p className="text-sm text-slate-500">Affinez votre recherche de répétiteurs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-neutral-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form method="GET" action="/repertoire" onSubmit={handleSubmit}>
            <div className="px-6 py-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Recherche textuelle */}
              <div>
                <label htmlFor="modal-search" className="block text-sm font-semibold text-slate-700 mb-2">
                  Recherche par nom ou prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-slate-400" />
                  </div>
                  <input
                    id="modal-search"
                    name="q"
                    type="text"
                    value={formData.q}
                    onChange={(e) => setFormData({ ...formData, q: e.target.value })}
                    placeholder="Entrez un nom ou prénom..."
                    className="block w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all text-base"
                  />
                </div>
              </div>

              {/* Filtres avancés */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Localisation et compétences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Région */}
                  <div>
                    <label htmlFor="modal-region" className="block text-sm font-semibold text-slate-700 mb-2">
                      Région
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-slate-400" />
                      </div>
                      <select
                        id="modal-region"
                        name="region"
                        value={formData.region}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-base cursor-pointer"
                      >
                        <option value="">Toutes les régions</option>
                        {DEPARTEMENTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ville */}
                  <div>
                    <label htmlFor="modal-ville" className="block text-sm font-semibold text-slate-700 mb-2">
                      Ville
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-slate-400" />
                      </div>
                      <select
                        id="modal-ville"
                        name="ville"
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                        disabled={!formData.region}
                        className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-base cursor-pointer disabled:bg-neutral-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                      >
                        <option value="">Toutes les villes</option>
                        {villesDisponibles.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Matière */}
                  <div>
                    <label htmlFor="modal-matiere" className="block text-sm font-semibold text-slate-700 mb-2">
                      Matière
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen size={18} className="text-slate-400" />
                      </div>
                      <select
                        id="modal-matiere"
                        name="matiere"
                        value={formData.matiere}
                        onChange={(e) => setFormData({ ...formData, matiere: e.target.value })}
                        className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-base cursor-pointer"
                      >
                        <option value="">Toutes les matières</option>
                        {MATIERES_LISTE.map(matiere => (
                          <option key={matiere} value={matiere}>{matiere}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Niveau */}
                  <div>
                    <label htmlFor="modal-niveau" className="block text-sm font-semibold text-slate-700 mb-2">
                      Niveau
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap size={18} className="text-slate-400" />
                      </div>
                      <select
                        id="modal-niveau"
                        name="niveau"
                        value={formData.niveau}
                        onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                        className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-base cursor-pointer"
                      >
                        <option value="">Tous les niveaux</option>
                        {NIVEAUX.map(niveau => (
                          <option key={niveau.id} value={niveau.id}>{niveau.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Réinitialiser
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


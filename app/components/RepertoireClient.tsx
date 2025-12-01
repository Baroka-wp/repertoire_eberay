'use client'

import { useState, Suspense } from 'react'
import { Search, MapPin, BookOpen, GraduationCap, X, ChevronDown, ChevronUp, Map, List } from 'lucide-react'
import dynamic from 'next/dynamic'

// Import dynamique du composant Map pour éviter les erreurs SSR
const RepetiteurMap = dynamic(() => import('./RepetiteurMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-neutral-100 flex items-center justify-center">
      <p className="text-slate-500">Chargement de la carte...</p>
    </div>
  )
})

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

interface RepertoireClientProps {
  query: string
  regionFilter: string
  villeFilter: string
  matiereFilter: string
  niveauFilter: string
  villesDisponibles: string[]
  filtresActifs: number
  repetiteurs: any[]
  children: React.ReactNode
}

export default function RepertoireClient({
  query,
  regionFilter,
  villeFilter,
  matiereFilter,
  niveauFilter,
  villesDisponibles,
  filtresActifs,
  repetiteurs,
  children
}: RepertoireClientProps) {
  const [showFilters, setShowFilters] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  return (
    <>
      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-8">
        <form method="GET" action="/repertoire" className="p-6">
          <div className="space-y-6">
            {/* Recherche principale avec toggle */}
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-semibold text-slate-700 mb-2">
                  Recherche par nom ou prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-slate-400" />
                  </div>
                  <input
                    id="search"
                    name="q"
                    type="text"
                    defaultValue={query}
                    placeholder="Entrez un nom ou prénom..."
                    className="block w-full pl-12 pr-4 py-3.5 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all text-base"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="mt-8 flex items-center gap-2 px-4 py-3.5 border border-neutral-300 rounded-lg text-slate-700 hover:bg-neutral-50 transition-colors"
              >
                {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span className="text-sm font-medium">Filtres</span>
              </button>
            </div>

            {/* Filtres avancés (rétractables) */}
            {showFilters && (
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Filtres avancés
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Région */}
                  <div>
                    <label htmlFor="region" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Région
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={16} className="text-slate-400" />
                      </div>
                      <select
                        id="region"
                        name="region"
                        defaultValue={regionFilter}
                        className="block w-full pl-9 pr-10 py-2.5 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
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
                    <label htmlFor="ville" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Ville
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={16} className="text-slate-400" />
                      </div>
                      <select
                        id="ville"
                        name="ville"
                        defaultValue={villeFilter}
                        disabled={!regionFilter}
                        className="block w-full pl-9 pr-10 py-2.5 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-sm cursor-pointer disabled:bg-neutral-100 disabled:text-slate-400 disabled:cursor-not-allowed"
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
                    <label htmlFor="matiere" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Matière
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen size={16} className="text-slate-400" />
                      </div>
                      <select
                        id="matiere"
                        name="matiere"
                        defaultValue={matiereFilter}
                        className="block w-full pl-9 pr-10 py-2.5 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
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
                    <label htmlFor="niveau" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      Niveau
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap size={16} className="text-slate-400" />
                      </div>
                      <select
                        id="niveau"
                        name="niveau"
                        defaultValue={niveauFilter}
                        className="block w-full pl-9 pr-10 py-2.5 border border-neutral-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent appearance-none bg-white text-sm cursor-pointer"
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
            )}

            {/* Boutons d'action */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Rechercher
              </button>
              {filtresActifs > 0 && (
                <a
                  href="/repertoire"
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Réinitialiser
                </a>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Toggle Vue Liste/Carte */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-white rounded-lg border border-neutral-200 shadow-sm p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-neutral-100'
            }`}
          >
            <List size={18} />
            <span>Liste</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-neutral-100'
            }`}
          >
            <Map size={18} />
            <span>Carte</span>
          </button>
        </div>
      </div>

      {/* Contenu selon le mode de vue */}
      {viewMode === 'list' ? (
        children
      ) : (
        <Suspense fallback={
          <div className="w-full h-[600px] rounded-lg bg-neutral-100 flex items-center justify-center">
            <p className="text-slate-500">Chargement de la carte...</p>
          </div>
        }>
          <RepetiteurMap repetiteurs={repetiteurs} />
        </Suspense>
      )}
    </>
  )
}


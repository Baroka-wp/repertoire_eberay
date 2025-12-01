'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, BookOpen, GraduationCap, X, Filter } from 'lucide-react'

const DEPARTEMENTS = ["Niamey", "Dosso", "Maradi", "Tahoua", "Zinder", "Agadez", "Diffa", "Tillabéri"]

const VILLES_PAR_REGION: Record<string, string[]> = {
  "Niamey": ["Niamey", "Kollo", "Say", "Torodi"],
  "Dosso": ["Dosso", "Gaya", "Dogondoutchi", "Loga", "Boboye"],
  "Maradi": ["Maradi", "Tessaoua", "Madarounfa", "Guidan Roumdji", "Aguié"],
  "Tahoua": ["Tahoua", "Birni-N'Konni", "Madaoua", "Illéla", "Keita"],
  "Zinder": ["Zinder", "Mirriah", "Tanout", "Gouré", "Magaria"],
  "Agadez": ["Agadez", "Arlit", "Tchirozérine", "Ingall", "Dirkou"],
  "Diffa": ["Diffa", "N'Guigmi", "Maine-Soroa", "Goudoumaria", "N'Gourti"],
  "Tillabéri": ["Tillabéri", "Ayorou", "Ouallam", "Téra", "Filingué"]
}

const MATIERES_LISTE = [
  "Français", "Mathématiques", "Physique-Chimie (PC)", "SVT",
  "Anglais", "Histoire-Géo", "Philosophie", "Espagnol", "Allemand",
  "Arabe", "Comptabilité", "Économie", "Informatique",
  "Toutes matières (Primaire)"
]

const NIVEAUX = [
  { id: 'primaire', label: 'Primaire' },
  { id: 'secondaire_inf', label: 'Collège' },
  { id: 'secondaire_sup', label: 'Lycée' },
]

interface FiltresProps {
  initialQuery?: string
  initialRegion?: string
  initialVille?: string
  initialMatiere?: string
  initialNiveau?: string
}

export function FiltresInteractifs({ 
  initialQuery = '', 
  initialRegion = '', 
  initialVille = '', 
  initialMatiere = '', 
  initialNiveau = '' 
}: FiltresProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [regionSelectionnee, setRegionSelectionnee] = useState(initialRegion)
  const [villeSelectionnee, setVilleSelectionnee] = useState(initialVille)
  const [matiereSelectionnee, setMatiereSelectionnee] = useState(initialMatiere)
  const [niveauSelectionne, setNiveauSelectionne] = useState(initialNiveau)
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = regionSelectionnee || villeSelectionnee || matiereSelectionnee || niveauSelectionne || searchQuery

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (regionSelectionnee) params.set('region', regionSelectionnee)
    if (villeSelectionnee) params.set('ville', villeSelectionnee)
    if (matiereSelectionnee) params.set('matiere', matiereSelectionnee)
    if (niveauSelectionne) params.set('niveau', niveauSelectionne)
    
    router.push(`/?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setRegionSelectionnee('')
    setVilleSelectionnee('')
    setMatiereSelectionnee('')
    setNiveauSelectionne('')
    router.push('/')
  }

  const removeFilter = (filterName: string) => {
    const filters: Record<string, () => void> = {
      q: () => setSearchQuery(''),
      region: () => {
        setRegionSelectionnee('')
        setVilleSelectionnee('')
      },
      ville: () => setVilleSelectionnee(''),
      matiere: () => setMatiereSelectionnee(''),
      niveau: () => setNiveauSelectionne(''),
    }
    filters[filterName]?.()
    
    // Appliquer immédiatement
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(filterName)
      if (filterName === 'region') params.delete('ville')
      router.push(`/?${params.toString()}`)
    }, 0)
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-8">
      <div className="p-6">
        
        {/* BARRE DE RECHERCHE PRINCIPALE */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={22} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyFilters())}
              placeholder="Rechercher un enseignant par nom ou prénom..."
              className="block w-full pl-12 pr-32 py-4 border-2 border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all text-base"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-slate-800 text-white'
                    : 'bg-neutral-100 text-slate-700 hover:bg-neutral-200'
                }`}
              >
                <Filter size={16} />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* FILTRES ACTIFS (BADGES) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase">Filtres actifs :</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => removeFilter('q')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
              >
                <Search size={14} />
                {searchQuery}
                <X size={14} className="ml-1" />
              </button>
            )}
            {regionSelectionnee && (
              <button
                type="button"
                onClick={() => removeFilter('region')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
              >
                <MapPin size={14} />
                {regionSelectionnee}
                <X size={14} className="ml-1" />
              </button>
            )}
            {villeSelectionnee && (
              <button
                type="button"
                onClick={() => removeFilter('ville')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
              >
                <MapPin size={14} />
                {villeSelectionnee}
                <X size={14} className="ml-1" />
              </button>
            )}
            {matiereSelectionnee && (
              <button
                type="button"
                onClick={() => removeFilter('matiere')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
              >
                <BookOpen size={14} />
                {matiereSelectionnee}
                <X size={14} className="ml-1" />
              </button>
            )}
            {niveauSelectionne && (
              <button
                type="button"
                onClick={() => removeFilter('niveau')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
              >
                <GraduationCap size={14} />
                {NIVEAUX.find(n => n.id === niveauSelectionne)?.label}
                <X size={14} className="ml-1" />
              </button>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline ml-2"
            >
              Réinitialiser tout
            </button>
          </div>
        )}

        {/* PANNEAU DE FILTRES DÉTAILLÉS */}
        {showFilters && (
          <div className="border-t border-neutral-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Région */}
              <div>
                <label htmlFor="region" className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Région
                </label>
                <select
                  id="region"
                  value={regionSelectionnee}
                  onChange={(e) => {
                    setRegionSelectionnee(e.target.value)
                    setVilleSelectionnee('') // Reset ville
                  }}
                  className="block w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                >
                  <option value="">Toutes</option>
                  {DEPARTEMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Ville */}
              <div>
                <label htmlFor="ville" className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Ville
                </label>
                <select
                  id="ville"
                  value={villeSelectionnee}
                  onChange={(e) => setVilleSelectionnee(e.target.value)}
                  disabled={!regionSelectionnee}
                  className="block w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white disabled:bg-neutral-50 disabled:cursor-not-allowed"
                >
                  <option value="">Toutes</option>
                  {regionSelectionnee && VILLES_PAR_REGION[regionSelectionnee]?.map(ville => (
                    <option key={ville} value={ville}>{ville}</option>
                  ))}
                </select>
              </div>

              {/* Matière */}
              <div>
                <label htmlFor="matiere" className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Matière
                </label>
                <select
                  id="matiere"
                  value={matiereSelectionnee}
                  onChange={(e) => setMatiereSelectionnee(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                >
                  <option value="">Toutes</option>
                  {MATIERES_LISTE.map(matiere => (
                    <option key={matiere} value={matiere}>{matiere}</option>
                  ))}
                </select>
              </div>

              {/* Niveau */}
              <div>
                <label htmlFor="niveau" className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Niveau
                </label>
                <select
                  id="niveau"
                  value={niveauSelectionne}
                  onChange={(e) => setNiveauSelectionne(e.target.value)}
                  className="block w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                >
                  <option value="">Tous</option>
                  {NIVEAUX.map(niveau => (
                    <option key={niveau.id} value={niveau.id}>{niveau.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Filter size={16} />
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}


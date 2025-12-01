'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Search, Filter, Map, List } from 'lucide-react'
import FiltresModal from './FiltresModal'

interface RepertoireHeaderProps {
  initialFilters: {
    q: string
    region: string
    ville: string
    matiere: string
    niveau: string
  }
  filtresActifs: number
  viewMode: 'list' | 'map'
  onViewModeChange: (mode: 'list' | 'map') => void
}

export default function RepertoireHeader({ 
  initialFilters, 
  filtresActifs, 
  viewMode, 
  onViewModeChange 
}: RepertoireHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo et titre */}
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-100"
              >
                <ArrowLeft size={18} />
              </Link>
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="flex items-center gap-3">
                <Image 
                  src="/logp_eberay.png" 
                  alt="Logo E-Beyray" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
                <h1 className="text-lg font-bold text-slate-900 hidden sm:block">Répertoire E-Beyray</h1>
              </div>
            </div>

            {/* Center: Recherche */}
            <div className="flex-1 max-w-2xl mx-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  readOnly
                  value={initialFilters.q || ''}
                  onClick={() => setIsModalOpen(true)}
                  placeholder="Rechercher un répétiteur..."
                  className="block w-full pl-10 pr-12 py-2.5 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 bg-white cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 text-white text-xs font-medium">
                    <Filter size={14} />
                    {filtresActifs > 0 && (
                      <span className="bg-white text-slate-800 px-1.5 rounded-full">{filtresActifs}</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Toggle Vue */}
              <div className="hidden md:flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List size={16} />
                  <span className="hidden lg:inline">Liste</span>
                </button>
                <button
                  onClick={() => onViewModeChange('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Map size={16} />
                  <span className="hidden lg:inline">Carte</span>
                </button>
              </div>

              {/* Bouton Ajouter */}
              <Link
                href="/ajouter"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Ajouter</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de filtrage */}
      <FiltresModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialValues={initialFilters}
      />
    </>
  )
}


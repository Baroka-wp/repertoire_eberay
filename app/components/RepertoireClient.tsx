'use client'

import { useState, Suspense } from 'react'
import { Map, List } from 'lucide-react'
import dynamic from 'next/dynamic'
import RepertoireHeader from './RepertoireHeader'

// Import dynamique du composant Map pour éviter les erreurs SSR
const RepetiteurMap = dynamic(() => import('./RepetiteurMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-74px)] rounded-lg bg-neutral-100 flex items-center justify-center">
      <p className="text-slate-500">Chargement de la carte...</p>
    </div>
  )
})

interface RepertoireClientProps {
  initialFilters: {
    q: string
    region: string
    ville: string
    matiere: string
    niveau: string
  }
  filtresActifs: number
  repetiteurs: any[]
  children: React.ReactNode
}

export default function RepertoireClient({
  initialFilters,
  filtresActifs,
  repetiteurs,
  children
}: RepertoireClientProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  return (
    <>
      <RepertoireHeader
        initialFilters={initialFilters}
        filtresActifs={filtresActifs}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-2">
        {/* Toggle Vue Mobile */}
        <div className="flex md:hidden items-center gap-2 bg-white rounded-lg border border-neutral-200 shadow-sm p-1 mb-6">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
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
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-neutral-100'
            }`}
          >
            <Map size={18} />
            <span>Carte</span>
          </button>
        </div>

        {/* Contenu selon le mode de vue */}
        {viewMode === 'list' ? (
          children
        ) : (
          <Suspense fallback={
            <div className="w-full h-[calc(100vh-74px)] rounded-lg bg-neutral-100 flex items-center justify-center">
              <p className="text-slate-500">Chargement de la carte...</p>
            </div>
          }>
            <RepetiteurMap repetiteurs={repetiteurs} />
          </Suspense>
        )}
      </main>
    </>
  )
}

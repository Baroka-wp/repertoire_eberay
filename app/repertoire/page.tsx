import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Users, Search, Plus, X } from 'lucide-react'
import { TableRow } from '../components/TableRow'
import RepertoireClient from '../components/RepertoireClient'

export default async function RepertoirePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    q?: string
    region?: string
    ville?: string
    matiere?: string
    niveau?: string
  }> 
}) {
  const params = await searchParams
  const query = params.q || ""
  const regionFilter = params.region || ""
  const villeFilter = params.ville || ""
  const matiereFilter = params.matiere || ""
  const niveauFilter = params.niveau || ""

  // Construction des filtres Prisma côté backend
  const whereConditions = {
    AND: [
      { statut: 'Actif' }
    ] as Array<Record<string, unknown>>
  }

  // Filtre de recherche textuelle
  if (query) {
    whereConditions.AND.push({
      OR: [
        { nom: { contains: query, mode: 'insensitive' } },
        { prenom: { contains: query, mode: 'insensitive' } },
      ]
    })
  }

  // Filtre par région
  if (regionFilter) {
    whereConditions.AND.push({
      departement: { equals: regionFilter }
    })
  }

  // Filtre par ville
  if (villeFilter) {
    whereConditions.AND.push({
      ville: { equals: villeFilter }
    })
  }

  // Filtre par matière
  if (matiereFilter) {
    whereConditions.AND.push({
      matieres: { contains: matiereFilter, mode: 'insensitive' }
    })
  }

  // Filtre par niveau
  if (niveauFilter) {
    const niveauLabel = niveauFilter === 'primaire' ? 'Primaire' : 
                       niveauFilter === 'secondaire_inf' ? 'Collège' : 
                       niveauFilter === 'secondaire_sup' ? 'Lycée' : 
                       niveauFilter
    whereConditions.AND.push({
      matieres: { contains: niveauLabel, mode: 'insensitive' }
    })
  }

  // Requête Prisma optimisée
  const repetiteurs = await prisma.repetiteur.findMany({
    where: whereConditions,
    orderBy: { id: 'desc' },
    select: {
      id: true,
      nom: true,
      prenom: true,
      telephone: true,
      email: true,
      ville: true,
      departement: true,
      matieres: true,
      diplome: true,
      statut: true,
    }
  })

  const totalEnseignants = repetiteurs.length

  // Compter les filtres actifs
  const filtresActifs = [query, regionFilter, villeFilter, matiereFilter, niveauFilter].filter(f => f).length

  const initialFilters = {
    q: query,
    region: regionFilter,
    ville: villeFilter,
    matiere: matiereFilter,
    niveau: niveauFilter
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <RepertoireClient
        initialFilters={initialFilters}
        filtresActifs={filtresActifs}
        repetiteurs={repetiteurs}
      >
        {/* STATISTIQUES ET FILTRES ACTIFS */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Users size={16} className="text-slate-400" />
              <span className="font-medium text-slate-600">{totalEnseignants}</span>
              <span>répétiteur{totalEnseignants > 1 ? 's' : ''}</span>
            </div>
            {filtresActifs > 0 && (
              <Link
                href="/repertoire"
                className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                <X size={16} />
                <span>Réinitialiser ({filtresActifs})</span>
              </Link>
            )}
          </div>

          {/* Badges des filtres actifs */}
          {filtresActifs > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {query && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-sm text-slate-700">
                  <Search size={14} />
                  <span className="font-medium">&ldquo;{query}&rdquo;</span>
                </span>
              )}
              {regionFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-sm text-slate-700">
                  <span className="text-slate-500">Région:</span>
                  <span className="font-medium">{regionFilter}</span>
                </span>
              )}
              {villeFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-sm text-slate-700">
                  <span className="text-slate-500">Ville:</span>
                  <span className="font-medium">{villeFilter}</span>
                </span>
              )}
              {matiereFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-sm text-slate-700">
                  <span className="text-slate-500">Matière:</span>
                  <span className="font-medium">{matiereFilter}</span>
                </span>
              )}
              {niveauFilter && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-sm text-slate-700">
                  <span className="text-slate-500">Niveau:</span>
                  <span className="font-medium">
                    {niveauFilter === 'primaire' ? 'Primaire' : 
                     niveauFilter === 'secondaire_inf' ? 'Collège' : 
                     niveauFilter === 'secondaire_sup' ? 'Lycée' : niveauFilter}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* TABLEAU DES RÉSULTATS */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          {repetiteurs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Répétiteur
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Compétences
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {repetiteurs.map((repetiteur: {
                    id: number
                    nom: string
                    prenom: string
                    telephone: string
                    email: string | null
                    ville: string
                    departement: string
                    matieres: string
                    diplome: string
                    statut: string
                  }) => (
                    <TableRow key={repetiteur.id} repetiteur={repetiteur} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucun répétiteur trouvé
              </h3>
              <p className="text-slate-500 mb-6">
                {filtresActifs > 0 
                  ? "Essayez de modifier vos critères de recherche."
                  : "Commencez par inscrire un répétiteur dans l'organisation."}
              </p>
              {filtresActifs > 0 ? (
                <Link
                  href="/repertoire"
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium px-4 py-2 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <X size={16} />
                  Réinitialiser les filtres
                </Link>
              ) : (
                <Link
                  href="/ajouter"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus size={18} />
                  Ajouter un répétiteur
                </Link>
              )}
            </div>
          )}
        </div>
      </RepertoireClient>
    </div>
  )
}

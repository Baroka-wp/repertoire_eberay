import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, Plus, Users } from 'lucide-react'
import { TableRow } from './components/TableRow'
import { FiltresInteractifs } from './components/FiltresInteractifs'
import { Suspense } from 'react'

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

export default async function Home({ searchParams }: {
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

  // Construction de la requête de filtrage
  const whereConditions: any[] = [
    { statut: 'Actif' }
  ]

  // Filtre par recherche textuelle (nom, prénom)
  if (query) {
    whereConditions.push({
      OR: [
        { nom: { contains: query, mode: 'insensitive' } },
        { prenom: { contains: query, mode: 'insensitive' } },
      ],
    })
  }

  // Filtre par région
  if (regionFilter) {
    whereConditions.push({ departement: { contains: regionFilter, mode: 'insensitive' } })
  }

  // Filtre par ville
  if (villeFilter) {
    whereConditions.push({ ville: { contains: villeFilter, mode: 'insensitive' } })
  }

  // Filtre par matière
  if (matiereFilter) {
    whereConditions.push({ matieres: { contains: matiereFilter, mode: 'insensitive' } })
  }

  // Filtre par niveau (dans le format stocké: "[niveau : ...]")
  if (niveauFilter) {
    whereConditions.push({ matieres: { contains: niveauFilter, mode: 'insensitive' } })
  }

  const repetiteurs = await prisma.repetiteur.findMany({
    where: {
      AND: whereConditions
    },
    orderBy: { id: 'desc' }
  })

  const totalEnseignants = repetiteurs.length

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* HEADER INSTITUTIONNEL */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-800 rounded-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">EBERAY</h1>
                <p className="text-sm text-slate-600 font-medium">Répertoire National des Enseignants</p>
              </div>
            </div>

            <Link
              href="/ajouter"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span>Nouveau Dossier</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* STATISTIQUES */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} className="text-slate-400" />
            <span className="font-medium text-slate-600">{totalEnseignants}</span>
            <span>enseignants trouvés</span>
          </div>
        </div>

        {/* FILTRES INTERACTIFS */}
        <Suspense fallback={
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-8 p-6">
            <div className="h-14 bg-neutral-100 rounded-lg animate-pulse" />
          </div>
        }>
          <FiltresInteractifs
            initialQuery={query}
            initialRegion={regionFilter}
            initialVille={villeFilter}
            initialMatiere={matiereFilter}
            initialNiveau={niveauFilter}
          />
        </Suspense>

        {/* TABLEAU PROFESSIONNEL */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Enseignant
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
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {repetiteurs.map((rep) => (
                  <TableRow key={rep.id} repetiteur={rep} />
                ))}

                {repetiteurs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="text-slate-500 text-base">
                        <p className="font-medium mb-1">Aucun résultat trouvé</p>
                        <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, BookOpen, Plus, Users, Search, MapPin, GraduationCap, X } from 'lucide-react'
import { TableRow } from '../components/TableRow'
import Image from 'next/image'
import RegionVilleScript from '../components/RegionVilleScript'

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
  const whereConditions: any = {
    AND: [
      { statut: 'Actif' }
    ]
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

  // Déterminer les villes disponibles selon la région sélectionnée
  const villesDisponibles = regionFilter ? VILLES_PAR_REGION[regionFilter] || [] : []

  // Compter les filtres actifs
  const filtresActifs = [query, regionFilter, villeFilter, matiereFilter, niveauFilter].filter(f => f).length

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-neutral-100"
              >
                <ArrowLeft size={18} />
                <span className="font-medium text-sm">Accueil</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="flex items-center gap-3">
                <Image 
                  src="/logp_eberay.png" 
                  alt="Logo E-Beyray" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
                <h1 className="text-xl font-bold text-slate-900">Répertoire E-Beyray</h1>
              </div>
            </div>
            <Link
              href="/ajouter"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Ajouter un répétiteur</span>
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
            <span>répétiteur{totalEnseignants > 1 ? 's' : ''} trouvé{totalEnseignants > 1 ? 's' : ''}</span>
          </div>
          {filtresActifs > 0 && (
            <Link
              href="/repertoire"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
            >
              <X size={16} />
              Réinitialiser les filtres
            </Link>
          )}
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-8">
          <form method="GET" action="/repertoire" className="p-6">
            <div className="space-y-6">
              {/* Recherche principale */}
              <div>
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

              {/* Filtres avancés */}
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

              {/* Boutons d'action */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Rechercher
                </button>
                {filtresActifs > 0 && (
                  <Link
                    href="/repertoire"
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  >
                    Réinitialiser
                  </Link>
                )}
              </div>
            </div>
          </form>
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
                  {repetiteurs.map((repetiteur) => (
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
                  className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium"
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
      </main>
      
      <RegionVilleScript />
    </div>
  )
}


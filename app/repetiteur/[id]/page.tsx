import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  Briefcase,
  CheckCircle2,
  XCircle,
  BookOpen
} from 'lucide-react'
import ModifierButton from '@/app/components/ModifierButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RepetiteurPage({ params }: PageProps) {
  const { id } = await params
  const repetiteurId = parseInt(id)

  if (isNaN(repetiteurId)) {
    notFound()
  }

  const repetiteur = await prisma.repetiteur.findUnique({
    where: { id: repetiteurId }
  })

  if (!repetiteur) {
    notFound()
  }

  // Parsing des matières et classes depuis le format stocké
  const matieresList = repetiteur.matieres.split(' - ')[0]?.split(',').map(m => m.trim()).filter(m => m) || []
  let competencesInfo = repetiteur.matieres.includes('[')
    ? repetiteur.matieres.split('[')[1]?.replace(']', '') || ''
    : ''

  // Formater l'affichage du niveau pour le rendre plus lisible
  if (competencesInfo) {
    competencesInfo = competencesInfo
      .replace(/primaire/gi, 'Primaire')
      .replace(/secondaire_inf/gi, 'Collège')
      .replace(/secondaire_sup/gi, 'Lycée')
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <Link
                href="/repertoire"
                className="flex items-center gap-1 md:gap-2 text-slate-700 hover:text-slate-900 transition-colors px-2 md:px-3 py-2 rounded-lg hover:bg-neutral-100 flex-shrink-0"
              >
                <ArrowLeft size={18} />
                <span className="font-medium text-xs md:text-sm hidden sm:inline">Retour</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300 hidden sm:block"></div>
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <Image
                  src="/logo_eberay.png"
                  alt="Logo Groupe SP"
                  width={32}
                  height={32}
                  className="object-contain w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                />
                <h1 className="text-base md:text-xl font-bold text-slate-900 truncate">Fiche Répétiteur</h1>
              </div>
            </div>
            <ModifierButton repetiteurId={repetiteur.id} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">

        {/* CARD PRINCIPALE */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">

          {/* EN-TÊTE PROFESSIONNELLE */}
          <div className="bg-white px-4 md:px-8 py-6 md:py-8 border-b-2 border-neutral-300">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4 md:gap-6 w-full">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg md:text-xl border-2 border-neutral-200 flex-shrink-0">
                  {repetiteur.prenom[0]}{repetiteur.nom[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
                      {repetiteur.prenom} {repetiteur.nom.toUpperCase()}
                    </h1>
                    {repetiteur.statut === 'Actif' ? (
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold border border-green-200 w-fit">
                        <CheckCircle2 size={12} />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-red-50 text-red-700 text-xs font-semibold border border-red-200 w-fit">
                        <XCircle size={12} />
                        Suspendu
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" />
                    <span className="truncate">{repetiteur.diplome}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENU STRUCTURÉ */}
          <div className="p-4 md:p-8">

            {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 md:mb-4 pb-2 border-b border-neutral-200">
                Informations Personnelles
              </h2>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start flex-col sm:flex-row">
                    <div className="w-full sm:w-40 text-sm text-slate-500 font-medium mb-1 sm:mb-0">Année d&apos;adhésion</div>
                    <div className="flex-1 text-sm text-slate-900">{repetiteur.anneeEntree}</div>
                  </div>
                  <div className="flex items-start flex-col sm:flex-row">
                    <div className="w-full sm:w-40 text-sm text-slate-500 font-medium mb-1 sm:mb-0">Membre depuis</div>
                    <div className="flex-1 text-sm text-slate-900">
                      {new Date(repetiteur.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2 : COORDONNÉES */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 md:mb-4 pb-2 border-b border-neutral-200">
                Coordonnées
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start flex-col sm:flex-row">
                    <div className="w-full sm:w-40 text-sm text-slate-500 font-medium flex items-center gap-2 mb-1 sm:mb-0">
                      <Phone size={14} className="text-slate-400" />
                      Téléphone
                    </div>
                    <div className="flex-1 text-sm text-slate-900 font-medium">{repetiteur.telephone}</div>
                  </div>
                  {repetiteur.email && (
                    <div className="flex items-start flex-col sm:flex-row">
                      <div className="w-full sm:w-40 text-sm text-slate-500 font-medium flex items-center gap-2 mb-1 sm:mb-0">
                        <Mail size={14} className="text-slate-400" />
                        Email
                      </div>
                      <div className="flex-1 text-sm text-slate-900 font-medium break-all">{repetiteur.email}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start flex-col sm:flex-row">
                    <div className="w-full sm:w-40 text-sm text-slate-500 font-medium flex items-center gap-2 mb-1 sm:mb-0">
                      <MapPin size={14} className="text-slate-400" />
                      Commune
                    </div>
                    <div className="flex-1 text-sm text-slate-900">{repetiteur.commune}</div>
                  </div>
                  <div className="flex items-start flex-col sm:flex-row">
                    <div className="w-full sm:w-40 text-sm text-slate-500 font-medium mb-1 sm:mb-0">Région</div>
                    <div className="flex-1 text-sm text-slate-900">{repetiteur.departement}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3 : COMPÉTENCES PÉDAGOGIQUES */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 md:mb-4 pb-2 border-b border-neutral-200">
                Compétences Pédagogiques
              </h2>
              <div className="space-y-4 md:space-y-6">
                {/* Matières */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-2 md:mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-500" />
                    Matières enseignées
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matieresList.length > 0 ? (
                      matieresList.map((matiere, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 md:px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs md:text-sm font-medium border border-slate-200"
                        >
                          {matiere}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 italic">Aucune matière spécifiée</span>
                    )}
                  </div>
                </div>

                {/* Niveau et Classes */}
                {competencesInfo && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-2 md:mb-3 flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-500" />
                      Niveau et classes
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-3 md:p-4 border border-neutral-200">
                      <p className="text-sm text-slate-900">{competencesInfo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}

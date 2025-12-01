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
  Calendar,
  Briefcase,
  CheckCircle2,
  XCircle,
  Edit,
  BookOpen
} from 'lucide-react'

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link
                href="/repertoire"
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-neutral-100"
              >
                <ArrowLeft size={18} />
                <span className="font-medium text-sm">Retour au répertoire</span>
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
                <h1 className="text-xl font-bold text-slate-900">Fiche Répétiteur</h1>
              </div>
            </div>
            <Link
              href={`/modifier/${repetiteur.id}`}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Edit size={18} />
              <span>Modifier</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-10">

        {/* CARD PRINCIPALE */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">

          {/* EN-TÊTE PROFESSIONNELLE */}
          <div className="bg-white px-8 py-8 border-b-2 border-neutral-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xl border-2 border-neutral-200">
                  {repetiteur.prenom[0]}{repetiteur.nom[0]}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {repetiteur.prenom} {repetiteur.nom.toUpperCase()}
                    </h1>
                    {repetiteur.statut === 'Actif' ? (
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                        <CheckCircle2 size={12} />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                        <XCircle size={12} />
                        Suspendu
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-2">
                    <GraduationCap size={16} className="text-slate-400" />
                    <span>{repetiteur.diplome}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENU STRUCTURÉ */}
          <div className="p-8">

            {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
                Informations Personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-32 text-sm text-slate-500 font-medium">Année d'adhésion</div>
                    <div className="flex-1 text-sm text-slate-900">{repetiteur.anneeEntree}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 text-sm text-slate-500 font-medium">Membre depuis</div>
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
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
                Coordonnées
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-32 text-sm text-slate-500 font-medium flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      Téléphone
                    </div>
                    <div className="flex-1 text-sm text-slate-900 font-medium">{repetiteur.telephone}</div>
                  </div>
                  {repetiteur.email && (
                    <div className="flex items-start">
                      <div className="w-32 text-sm text-slate-500 font-medium flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        Email
                      </div>
                      <div className="flex-1 text-sm text-slate-900 font-medium">{repetiteur.email}</div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-32 text-sm text-slate-500 font-medium flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      Ville
                    </div>
                    <div className="flex-1 text-sm text-slate-900">{repetiteur.ville}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-32 text-sm text-slate-500 font-medium">Région</div>
                    <div className="flex-1 text-sm text-slate-900">{repetiteur.departement}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3 : COMPÉTENCES PÉDAGOGIQUES */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200">
                Compétences Pédagogiques
              </h2>
              <div className="space-y-6">
                {/* Matières */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-500" />
                    Matières enseignées
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matieresList.length > 0 ? (
                      matieresList.map((matiere, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200"
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
                    <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-500" />
                      Niveau et classes
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
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

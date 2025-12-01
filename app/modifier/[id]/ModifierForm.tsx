'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { updateRepetiteur } from '../../actions'
import Image from 'next/image'
import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  Briefcase,
  BookOpen,
  GraduationCap,
  Backpack,
  CheckCircle2,
  School,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react'

const NIVEAUX = [
  { id: 'primaire', label: 'Primaire', icon: BookOpen, desc: 'CP, CE1, CM2...' },
  { id: 'secondaire_inf', label: 'Collège', icon: Backpack, desc: '6ème à 3ème' },
  { id: 'secondaire_sup', label: 'Lycée', icon: GraduationCap, desc: '2nde à Terminale' },
]

const CLASSES_PAR_NIVEAU: Record<string, string[]> = {
  primaire: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'],
  secondaire_inf: ['6ème', '5ème', '4ème', '3ème'],
  secondaire_sup: ['2nde', '1ère', 'Terminale'],
}

const MATIERES_LISTE = [
  "Français", "Mathématiques", "Physique-Chimie (PC)", "SVT",
  "Anglais", "Histoire-Géo", "Philosophie", "Espagnol", "Allemand",
  "Arabe", "Comptabilité", "Économie", "Informatique",
  "Toutes matières (Primaire)"
]

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

const STEPS = [
  { id: 1, label: 'Identité', icon: User },
  { id: 2, label: 'Localisation', icon: MapPin },
  { id: 3, label: 'Compétences', icon: Briefcase },
]

interface ModifierFormProps {
  repetiteur: {
    id: number
    nom: string
    prenom: string
    telephone: string
    ville: string
    departement: string
    diplome: string
    anneeEntree: number
    statut: string
  }
  matieresInitiales: string[]
  niveauInitial: string
  classesInitiales: string[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px] justify-center ${pending ? 'opacity-70' : ''}`}
    >
      {pending ? (
        <>
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Enregistrement...
        </>
      ) : (
        <>
          <Save size={18} />
          Enregistrer
        </>
      )}
    </button>
  )
}

export function ModifierForm({ repetiteur, matieresInitiales, niveauInitial, classesInitiales }: ModifierFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [niveauSelectionne, setNiveauSelectionne] = useState<string>(niveauInitial)
  const [classesSelectionnees, setClassesSelectionnees] = useState<string[]>(classesInitiales)
  const [matieresSelectionnees, setMatieresSelectionnees] = useState<string[]>(matieresInitiales)

  const [formData, setFormData] = useState({
    nom: repetiteur.nom,
    prenom: repetiteur.prenom,
    anneeEntree: repetiteur.anneeEntree.toString(),
    departement: repetiteur.departement,
    ville: repetiteur.ville,
    telephone: repetiteur.telephone,
    diplome: repetiteur.diplome,
    statut: repetiteur.statut,
  })

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceedToStep2 = formData.nom.trim() !== '' && formData.prenom.trim() !== ''
  const canProceedToStep3 = formData.departement !== '' && formData.ville.trim() !== '' && formData.telephone.trim() !== ''

  const toggleClasse = (classe: string) => {
    setClassesSelectionnees(prev =>
      prev.includes(classe) ? prev.filter(c => c !== classe) : [...prev, classe]
    )
  }

  const toggleMatiere = (matiere: string) => {
    setMatieresSelectionnees(prev =>
      prev.includes(matiere) ? prev.filter(m => m !== matiere) : [...prev, matiere]
    )
  }

  const nextStep = () => {
    if (currentStep === 1 && canProceedToStep2) {
      setCurrentStep(2)
    } else if (currentStep === 2 && canProceedToStep3) {
      setCurrentStep(3)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  async function handleSubmit(formData: FormData) {
    await updateRepetiteur(repetiteur.id, formData)
  }

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href={`/repetiteur/${repetiteur.id}`} className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-neutral-100">
                <ArrowLeft size={18} />
                <span className="font-medium text-sm">Retour à la fiche</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="flex items-center gap-3">
                <Image 
                  src="/logp_eberay.png" 
                  alt="Logo Eberay" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
                <h1 className="text-xl font-bold text-slate-900">Modifier le Dossier Répétiteur</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-10">

        {/* PROGRESS STEPS */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : isActive
                        ? 'bg-slate-800 border-slate-800 text-white shadow-md'
                        : 'bg-white border-neutral-300 text-neutral-400'
                    }`}>
                      {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                    </div>
                    <span className={`mt-2 text-sm font-semibold ${
                      isActive ? 'text-slate-900' : isCompleted ? 'text-slate-700' : 'text-neutral-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all ${
                      isCompleted ? 'bg-slate-800' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <form action={handleSubmit} className="space-y-6">

          {/* Hidden inputs */}
          {currentStep > 1 && (
            <>
              <input type="hidden" name="nom" value={formData.nom} />
              <input type="hidden" name="prenom" value={formData.prenom} />
              <input type="hidden" name="anneeEntree" value={formData.anneeEntree} />
            </>
          )}
          {currentStep > 2 && (
            <>
              <input type="hidden" name="departement" value={formData.departement} />
              <input type="hidden" name="ville" value={formData.ville} />
              <input type="hidden" name="telephone" value={formData.telephone} />
              <input type="hidden" name="statut" value={formData.statut} />
            </>
          )}

          {/* ÉTAPE 1 : IDENTITÉ */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 bg-slate-50 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Informations Personnelles</h2>
                    <p className="text-sm text-slate-600 mt-1">Renseignez les informations de base</p>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={(e) => updateFormData('nom', e.target.value)}
                    placeholder="Ex: MOUNKAILA"
                    className="w-full text-base text-slate-900 placeholder:text-slate-400 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={(e) => updateFormData('prenom', e.target.value)}
                    placeholder="Ex: Abdoulaye"
                    className="w-full text-base text-slate-900 placeholder:text-slate-400 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Année d'adhésion</label>
                  <input
                    type="number"
                    name="anneeEntree"
                    value={formData.anneeEntree}
                    onChange={(e) => updateFormData('anneeEntree', e.target.value)}
                    className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Statut</label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={(e) => updateFormData('statut', e.target.value)}
                    className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-200 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToStep2}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : LOCALISATION */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 bg-slate-50 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Coordonnées & Localisation</h2>
                    <p className="text-sm text-slate-600 mt-1">Informations de contact et localisation</p>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Région *</label>
                  <select
                    name="departement"
                    value={formData.departement}
                    onChange={(e) => {
                      updateFormData('departement', e.target.value)
                      // Si la ville actuelle n'est pas dans la nouvelle région, réinitialiser
                      if (e.target.value && VILLES_PAR_REGION[e.target.value] && !VILLES_PAR_REGION[e.target.value].includes(formData.ville)) {
                        updateFormData('ville', '')
                      }
                    }}
                    required
                    className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                  >
                    <option value="">-- Choisir une région --</option>
                    {DEPARTEMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ville *</label>
                  <select
                    name="ville"
                    value={formData.ville}
                    onChange={(e) => updateFormData('ville', e.target.value)}
                    required
                    disabled={!formData.departement}
                    className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white disabled:bg-neutral-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Choisir une ville --</option>
                    {formData.departement && (() => {
                      const villesDisponibles = VILLES_PAR_REGION[formData.departement] || []
                      // Si la ville actuelle n'est pas dans la liste, l'ajouter
                      const villesAffichees = villesDisponibles.includes(formData.ville) 
                        ? villesDisponibles 
                        : [...villesDisponibles, formData.ville].filter(Boolean)
                      return villesAffichees.map(ville => (
                        <option key={ville} value={ville}>{ville}</option>
                      ))
                    })()}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Numéro de Téléphone *</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={(e) => updateFormData('telephone', e.target.value)}
                    placeholder="+227 00 00 00 00"
                    required
                    className="w-full text-base text-slate-900 placeholder:text-slate-400 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-200 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-slate-700 px-8 py-3 rounded-lg text-base font-semibold transition-colors"
                >
                  <ChevronLeft size={18} />
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedToStep3}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : COMPÉTENCES */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-8 py-6 bg-slate-50 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-white">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Compétences Pédagogiques</h2>
                    <p className="text-sm text-slate-600 mt-1">Niveau, classes et matières enseignées</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">

                {/* DIPLÔME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Diplôme le plus élevé</label>
                  <div className="relative">
                    <School className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <select
                      name="diplome"
                      value={formData.diplome}
                      onChange={(e) => updateFormData('diplome', e.target.value)}
                      className="pl-12 w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                    >
                      <option value="">-- Choisir un diplôme --</option>
                      <option>BAC</option>
                      <option>Licence</option>
                      <option>Master</option>
                      <option>Doctorat</option>
                      <option>BTS / DUT</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>

                {/* CYCLE */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Cycle d'enseignement</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {NIVEAUX.map((niv) => {
                      const Icon = niv.icon
                      const isSelected = niveauSelectionne === niv.id
                      return (
                        <label
                          key={niv.id}
                          className={`relative flex flex-col items-center p-5 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-slate-800 bg-slate-50 shadow-md'
                              : 'border-neutral-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="niveau"
                            value={niv.id}
                            checked={isSelected}
                            onChange={(e) => {
                              setNiveauSelectionne(e.target.value)
                              setClassesSelectionnees([])
                            }}
                            className="sr-only"
                          />
                          <div className={`p-3 rounded-lg mb-3 ${isSelected ? 'bg-slate-800 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                            <Icon size={24} />
                          </div>
                          <span className={`font-semibold text-base ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{niv.label}</span>
                          <span className="text-xs text-slate-500 mt-1">{niv.desc}</span>
                          {isSelected && (
                            <div className="absolute top-3 right-3 text-slate-800">
                              <CheckCircle2 size={18} />
                            </div>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* CLASSES */}
                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Classes prises en charge <span className="text-slate-500 font-normal">(Sélection multiple)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES_PAR_NIVEAU[niveauSelectionne].map((classe) => {
                      const isChecked = classesSelectionnees.includes(classe)
                      return (
                        <label
                          key={classe}
                          className={`px-4 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium ${
                            isChecked
                              ? 'bg-slate-800 border-slate-800 text-white'
                              : 'bg-white border-neutral-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="classes"
                            value={classe}
                            checked={isChecked}
                            onChange={() => toggleClasse(classe)}
                            className="sr-only"
                          />
                          <span>{classe}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* MATIÈRES */}
                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">
                    Matières enseignées <span className="text-slate-500 font-normal">(Sélection multiple)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {MATIERES_LISTE.map((matiere) => {
                      const isChecked = matieresSelectionnees.includes(matiere)
                      return (
                        <label
                          key={matiere}
                          className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium text-center ${
                            isChecked
                              ? 'bg-slate-800 border-slate-800 text-white'
                              : 'bg-white border-neutral-300 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="matieres"
                            value={matiere}
                            checked={isChecked}
                            onChange={() => toggleMatiere(matiere)}
                            className="sr-only"
                          />
                          <span>{matiere}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

              </div>

              <div className="px-8 py-6 bg-neutral-50 border-t border-neutral-200 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 bg-neutral-200 hover:bg-neutral-300 text-slate-700 px-8 py-3 rounded-lg text-base font-semibold transition-colors"
                >
                  <ChevronLeft size={18} />
                  Précédent
                </button>
                <div className="flex gap-4">
                  <Link
                    href={`/repetiteur/${repetiteur.id}`}
                    className="px-8 py-3 text-base font-semibold text-slate-700 bg-white border-2 border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Annuler
                  </Link>
                  <SubmitButton />
                </div>
              </div>
            </div>
          )}

        </form>
      </main>
    </div>
  )
}


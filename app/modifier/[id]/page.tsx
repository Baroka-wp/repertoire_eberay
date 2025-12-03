import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ModifierForm } from './ModifierForm'
import { requirePermission } from '@/lib/permissions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierPage({ params }: PageProps) {
  // Vérifier que l'utilisateur a la permission de modifier
  await requirePermission('canEdit')

  const { id } = await params
  const repetiteurId = parseInt(id)

  if (isNaN(repetiteurId)) {
    notFound()
  }

  const repetiteur = await prisma.repetiteur.findUnique({
    where: { id: repetiteurId },
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      telephone: true,
      commune: true,
      departement: true,
      matieres: true,
      diplome: true,
      anneeEntree: true,
      statut: true,
      age: true,
      genre: true,
      nationalite: true,
      moyenTransport: true,
    }
  })

  if (!repetiteur) {
    notFound()
  }

  // Parsing des données existantes
  const matieresList = repetiteur.matieres.split(' - ')[0]?.split(',').map((m: string) => m.trim()).filter((m: string) => m && m !== 'Non spécifié') || []
  const competencesInfo = repetiteur.matieres.includes('[')
    ? repetiteur.matieres.split('[')[1]?.replace(']', '') || ''
    : ''

  // Extraire les cycles et les classes
  let niveauxInitiaux: string[] = ['primaire'] // Valeur par défaut
  let classesInitiales: string[] = []

  if (competencesInfo) {
    // Le format est "[Primaire: CI, CP; Collège: 6ème, 5ème...]"
    // Extraire les différents cycles et leurs classes
    
    // D'abord séparer les différents cycles (séparés par ";")
    const cycles = competencesInfo.split(';').map(cycle => cycle.trim())
    
    if (cycles.length > 0) {
      niveauxInitiaux = [] // Réinitialiser la liste des niveaux
      for (const cycle of cycles) {
        // Extraire le nom du cycle
        const niveauMatch = cycle.match(/^([^:]+):/)
        if (niveauMatch) {
          const niveauStr = niveauMatch[1].trim()
          
          // Convertir le libellé en ID de niveau
          let niveauId = 'primaire' // valeur par défaut
          if (niveauStr.toLowerCase().includes('primaire')) niveauId = 'primaire'
          else if (niveauStr.toLowerCase().includes('collège') || niveauStr.toLowerCase().includes('secondaire_inf')) niveauId = 'secondaire_inf'
          else if (niveauStr.toLowerCase().includes('lycée') || niveauStr.toLowerCase().includes('secondaire_sup')) niveauId = 'secondaire_sup'
          
          niveauxInitiaux.push(niveauId)
          
          // Extraire les classes pour ce cycle
          const classesMatch = cycle.match(/:\s*(.+)/)
          if (classesMatch) {
            const classesDuCycle = classesMatch[1].split(',').map((c: string) => c.trim()).filter((c: string) => c && c !== 'Aucune')
            classesInitiales = [...new Set([...classesInitiales, ...classesDuCycle])] // Éviter les doublons
          }
        }
      }
    }
  }

  return <ModifierForm repetiteur={repetiteur} matieresInitiales={matieresList} niveauxInitiaux={niveauxInitiaux} classesInitiales={classesInitiales} />
}


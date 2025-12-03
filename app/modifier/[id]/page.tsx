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
    where: { id: repetiteurId }
  })

  if (!repetiteur) {
    notFound()
  }

  // Parsing des données existantes
  const matieresList = repetiteur.matieres.split(' - ')[0]?.split(',').map((m: string) => m.trim()).filter((m: string) => m && m !== 'Non spécifié') || []
  const competencesInfo = repetiteur.matieres.includes('[')
    ? repetiteur.matieres.split('[')[1]?.replace(']', '') || ''
    : ''

  // Extraire le niveau et les classes
  let niveauInitial = 'primaire'
  let classesInitiales: string[] = []

  if (competencesInfo) {
    // Le format est "[primaire : CP, CE1]" ou "[secondaire_inf : 6ème, 5ème]"
    // Le niveau est stocké comme ID (primaire, secondaire_inf, secondaire_sup)
    const niveauMatch = competencesInfo.match(/^([^:]+):/)
    if (niveauMatch) {
      const niveauStr = niveauMatch[1].trim()
      if (niveauStr === 'primaire' || niveauStr === 'secondaire_inf' || niveauStr === 'secondaire_sup') {
        niveauInitial = niveauStr
      } else {
        // Fallback: essayer de deviner depuis le texte
        if (niveauStr.toLowerCase().includes('primaire')) niveauInitial = 'primaire'
        else if (niveauStr.toLowerCase().includes('collège') || niveauStr.toLowerCase().includes('secondaire_inf')) niveauInitial = 'secondaire_inf'
        else if (niveauStr.toLowerCase().includes('lycée') || niveauStr.toLowerCase().includes('secondaire_sup')) niveauInitial = 'secondaire_sup'
      }
    }

    // Extraire les classes après ":"
    const classesMatch = competencesInfo.match(/:\s*(.+)/)
    if (classesMatch) {
      classesInitiales = classesMatch[1].split(',').map((c: string) => c.trim()).filter((c: string) => c && c !== 'Aucune')
    }
  }

  return <ModifierForm repetiteur={repetiteur} matieresInitiales={matieresList} niveauInitial={niveauInitial} classesInitiales={classesInitiales} />
}


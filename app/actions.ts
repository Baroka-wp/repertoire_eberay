'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createRepetiteur(formData: FormData) {
  
  // Récupération des champs simples
  const nom = formData.get('nom') as string
  const prenom = formData.get('prenom') as string
  const telephone = formData.get('telephone') as string
  const ville = formData.get('ville') as string
  const departement = formData.get('departement') as string
  const diplome = formData.get('diplome') as string
  const anneeEntree = Number(formData.get('anneeEntree'))
  
  // --- GESTION DES MULTIPLES ---
  
  // 1. Récupérer le niveau (ex: "Lycée")
  const niveau = formData.get('niveau') as string
  
  // 2. Récupérer TOUTES les classes cochées (ex: ["2nde", "1ère"])
  const classes = formData.getAll('classes') as string[]
  
  // 3. Récupérer TOUTES les matières cochées (ex: ["Maths", "PC"])
  const matieresList = formData.getAll('matieres') as string[]

  // --- FORMATAGE POUR LA BASE DE DONNÉES ---
  // Format : "Maths, PC - [Lycée : 2nde, 1ère]"
  
  const matieresStr = matieresList.length > 0 ? matieresList.join(', ') : 'Non spécifié'
  const classesStr = classes.length > 0 ? classes.join(', ') : 'Aucune'
  
  const competenceString = `${matieresStr} - [${niveau} : ${classesStr}]`

  await prisma.repetiteur.create({
    data: {
      nom,
      prenom,
      telephone,
      ville,
      departement,
      diplome,
      anneeEntree,
      matieres: competenceString, // On sauvegarde la chaîne formatée
      statut: 'Actif',
    },
  })

  revalidatePath('/repertoire')
  redirect('/repertoire?toast=success&message=Répétiteur inscrit avec succès')
}

export async function updateRepetiteur(id: number, formData: FormData) {
  
  // Récupération des champs simples
  const nom = formData.get('nom') as string
  const prenom = formData.get('prenom') as string
  const telephone = formData.get('telephone') as string
  const ville = formData.get('ville') as string
  const departement = formData.get('departement') as string
  const diplome = formData.get('diplome') as string
  const anneeEntree = Number(formData.get('anneeEntree'))
  const statut = formData.get('statut') as string || 'Actif'
  
  // --- GESTION DES MULTIPLES ---
  
  // 1. Récupérer le niveau (ex: "Lycée")
  const niveau = formData.get('niveau') as string
  
  // 2. Récupérer TOUTES les classes cochées (ex: ["2nde", "1ère"])
  const classes = formData.getAll('classes') as string[]
  
  // 3. Récupérer TOUTES les matières cochées (ex: ["Maths", "PC"])
  const matieresList = formData.getAll('matieres') as string[]

  // --- FORMATAGE POUR LA BASE DE DONNÉES ---
  // Format : "Maths, PC - [Lycée : 2nde, 1ère]"
  
  const matieresStr = matieresList.length > 0 ? matieresList.join(', ') : 'Non spécifié'
  const classesStr = classes.length > 0 ? classes.join(', ') : 'Aucune'
  
  const competenceString = `${matieresStr} - [${niveau} : ${classesStr}]`

  await prisma.repetiteur.update({
    where: { id },
    data: {
      nom,
      prenom,
      telephone,
      ville,
      departement,
      diplome,
      anneeEntree,
      matieres: competenceString,
      statut,
    },
  })

  revalidatePath('/repertoire')
  revalidatePath(`/repetiteur/${id}`)
  redirect(`/repetiteur/${id}?toast=success&message=Dossier répétiteur modifié avec succès`)
}

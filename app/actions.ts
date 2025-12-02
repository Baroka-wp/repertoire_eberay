'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/lib/permissions'
import bcrypt from 'bcryptjs'

export async function createRepetiteur(formData: FormData) {
  // Vérifier les permissions
  const user = await requirePermission('canCreate')

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
      createdById: user.id,
    },
  })

  revalidatePath('/repertoire')
  const message = encodeURIComponent('Répétiteur inscrit avec succès')
  redirect(`/repertoire?toast=success&message=${message}`)
}

export async function updateRepetiteur(id: number, formData: FormData) {
  // Vérifier les permissions
  const user = await requirePermission('canEdit')

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
      updatedById: user.id,
    },
  })

  revalidatePath('/repertoire')
  revalidatePath(`/repetiteur/${id}`)
  const message = encodeURIComponent('Dossier répétiteur modifié avec succès')
  redirect(`/repetiteur/${id}?toast=success&message=${message}`)
}

// Action publique pour l'auto-inscription des répétiteurs (sans authentification)
export async function inscriptionRepetiteur(formData: FormData) {
  // Récupération des champs simples
  const nom = formData.get('nom') as string
  const prenom = formData.get('prenom') as string
  const telephone = formData.get('telephone') as string
  const ville = formData.get('ville') as string
  const departement = formData.get('departement') as string
  const diplome = formData.get('diplome') as string
  const anneeEntree = Number(formData.get('anneeEntree'))
  const email = formData.get('email') as string | null

  // Récupération des multiples
  const niveau = formData.get('niveau') as string
  const classes = formData.getAll('classes') as string[]
  const matieresList = formData.getAll('matieres') as string[]

  // Formatage
  const matieresStr = matieresList.length > 0 ? matieresList.join(', ') : 'Non spécifié'
  const classesStr = classes.length > 0 ? classes.join(', ') : 'Aucune'
  const competenceString = `${matieresStr} - [${niveau} : ${classesStr}]`

  await prisma.repetiteur.create({
    data: {
      nom,
      prenom,
      email,
      telephone,
      ville,
      departement,
      diplome,
      anneeEntree,
      matieres: competenceString,
      statut: 'Actif',
      // Pas de createdById pour les auto-inscriptions
    },
  })

  revalidatePath('/repertoire')
  const message = encodeURIComponent('Inscription réussie ! Votre dossier sera vérifié par un administrateur.')
  redirect(`/inscription/merci?message=${message}`)
}

// ==========================
// GESTION DES UTILISATEURS
// ==========================

export async function createUser(formData: FormData) {
  // Vérifier que l'utilisateur est admin
  await requirePermission('canManageUsers')

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  // Hasher le mot de passe
  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  })

  revalidatePath('/admin/utilisateurs')
  const message = encodeURIComponent('Utilisateur créé avec succès')
  redirect(`/admin/utilisateurs?toast=success&message=${message}`)
}

export async function updateUser(id: string, formData: FormData) {
  // Vérifier que l'utilisateur est admin
  await requirePermission('canManageUsers')

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  const password = formData.get('password') as string | null

  // Préparer les données à mettre à jour
  const data: Record<string, string> = {
    name,
    email,
    role,
  }

  // Si un nouveau mot de passe est fourni, le hasher et l'ajouter
  if (password && password.trim() !== '') {
    data.password = await bcrypt.hash(password, 10)
  }

  await prisma.user.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/utilisateurs')
  const message = encodeURIComponent('Utilisateur modifié avec succès')
  redirect(`/admin/utilisateurs?toast=success&message=${message}`)
}

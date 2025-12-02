import { requirePermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ModifierUtilisateurForm from './ModifierUtilisateurForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierUtilisateurPage({ params }: PageProps) {
  // Vérifier que l'utilisateur est admin
  await requirePermission('canManageUsers')
  
  // Await params (Next.js 16 requirement)
  const { id } = await params
  
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  })
  
  if (!user) {
    notFound()
  }
  
  return <ModifierUtilisateurForm user={user} />
}


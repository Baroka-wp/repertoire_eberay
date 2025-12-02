import { requirePermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ModifierUtilisateurForm from './ModifierUtilisateurForm'

interface PageProps {
  params: { id: string }
}

export default async function ModifierUtilisateurPage({ params }: PageProps) {
  // Vérifier que l'utilisateur est admin
  await requirePermission('canManageUsers')
  
  const user = await prisma.user.findUnique({
    where: { id: params.id },
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


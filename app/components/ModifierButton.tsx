'use client'

import Link from 'next/link'
import { Edit } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { hasPermission } from '@/lib/permissions-client'

interface ModifierButtonProps {
  repetiteurId: number
}

export default function ModifierButton({ repetiteurId }: ModifierButtonProps) {
  const { data: session } = useSession()
  const canModify = hasPermission(session?.user?.role, 'modify')

  if (!canModify) {
    return null // Ne pas afficher le bouton si pas de permission
  }

  return (
    <Link
      href={`/modifier/${repetiteurId}`}
      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
    >
      <Edit size={18} />
      <span>Modifier</span>
    </Link>
  )
}


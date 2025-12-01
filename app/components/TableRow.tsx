'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Phone, GraduationCap, Pencil } from 'lucide-react'

interface TableRowProps {
  repetiteur: {
    id: number
    nom: string
    prenom: string
    telephone: string
    email: string | null
    ville: string
    departement: string
    matieres: string
    diplome: string
    statut: string
  }
}

export function TableRow({ repetiteur }: TableRowProps) {
  const router = useRouter()

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }
    router.push(`/repetiteur/${repetiteur.id}`)
  }

  return (
    <tr 
      onClick={handleRowClick}
      className="hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      {/* Colonne : Nom + Avatar */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm border-2 border-slate-200">
            {repetiteur.prenom[0]}{repetiteur.nom[0]}
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-slate-900">
              {repetiteur.prenom} {repetiteur.nom.toUpperCase()}
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
              <GraduationCap size={12} className="text-slate-400" />
              <span>{repetiteur.diplome}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Colonne : Contact */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900 font-medium">
          {repetiteur.telephone}
        </div>
        {repetiteur.email && (
          <div className="text-xs text-slate-500 mt-1">{repetiteur.email}</div>
        )}
      </td>

      {/* Colonne : Localisation */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-slate-900 font-medium">{repetiteur.ville}</div>
        <div className="text-xs text-slate-600">{repetiteur.departement}</div>
      </td>

      {/* Colonne : Compétences */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {(() => {
            const matieresStr = repetiteur.matieres.split(' - ')[0] || repetiteur.matieres
            const matieresList = matieresStr.split(',').map(m => m.trim()).filter(m => m)
            return (
              <>
                {matieresList.slice(0, 2).map((m, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200"
                  >
                    {m}
                  </span>
                ))}
                {matieresList.length > 2 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200">
                    +{matieresList.length - 2}
                  </span>
                )}
              </>
            )
          })()}
        </div>
      </td>

      {/* Colonne : Statut */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
          repetiteur.statut === 'Actif' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {repetiteur.statut}
        </span>
      </td>

      {/* Colonne : Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link 
          href={`/modifier/${repetiteur.id}`} 
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium transition-colors"
        >
          <Pencil size={16} />
          <span className="hidden lg:inline">Modifier</span>
        </Link>
      </td>
    </tr>
  )
}

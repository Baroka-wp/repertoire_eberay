'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Pencil, MapPin, Phone, Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { hasPermission } from '@/lib/permissions-client'

interface RepetiteurCardProps {
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

export function RepetiteurCard({ repetiteur }: RepetiteurCardProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const canModify = hasPermission(session?.user?.role, 'modify')

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('a') || target.closest('button')) {
            return
        }
        router.push(`/repetiteur/${repetiteur.id}`)
    }

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-4 active:scale-[0.98] transition-transform cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg border-2 border-slate-200">
                        {repetiteur.prenom[0]}{repetiteur.nom[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">
                            {repetiteur.prenom} {repetiteur.nom.toUpperCase()}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                            <GraduationCap size={14} />
                            <span>{repetiteur.diplome}</span>
                        </div>
                    </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${repetiteur.statut === 'Actif'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {repetiteur.statut}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{repetiteur.ville}, {repetiteur.departement}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{repetiteur.telephone}</span>
                </div>
                {repetiteur.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={16} className="text-slate-400" />
                        <span className="truncate">{repetiteur.email}</span>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="flex flex-wrap gap-1.5">
                    {(() => {
                        const matieresStr = repetiteur.matieres.split(' - ')[0] || repetiteur.matieres
                        const matieresList = matieresStr.split(',').map(m => m.trim()).filter(m => m)
                        return matieresList.slice(0, 4).map((m, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200"
                            >
                                {m}
                            </span>
                        ))
                    })()}
                    {(() => {
                        const matieresStr = repetiteur.matieres.split(' - ')[0] || repetiteur.matieres
                        const matieresList = matieresStr.split(',').map(m => m.trim()).filter(m => m)
                        return matieresList.length > 4 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 text-xs font-medium text-slate-500 border border-slate-200">
                                +{matieresList.length - 4}
                            </span>
                        )
                    })()}
                </div>
            </div>

            {canModify && (
                <div className="pt-3 border-t border-neutral-100 flex justify-end">
                    <Link
                        href={`/modifier/${repetiteur.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium text-sm bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200"
                    >
                        <Pencil size={14} />
                        <span>Modifier</span>
                    </Link>
                </div>
            )}
        </div>
    )
}

import { requirePermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Users, Shield, Edit2 } from 'lucide-react'
import AdminHeader from '@/app/components/AdminHeader'

export default async function UtilisateursPage() {
  // Vérifier que l'utilisateur est admin
  await requirePermission('canManageUsers')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          repetiteursCreated: true,
          repetiteursUpdated: true,
        }
      }
    }
  })

  const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    editor: 'Éditeur',
    creator: 'Créateur',
    viewer: 'Lecteur',
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700 ring-purple-600/20',
    editor: 'bg-blue-100 text-blue-700 ring-blue-600/20',
    creator: 'bg-green-100 text-green-700 ring-green-600/20',
    viewer: 'bg-neutral-100 text-neutral-700 ring-neutral-600/20',
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader
        title="Gestion des Utilisateurs"
        subtitle="Administration E-Beyray"
        rightAction={
          <Link
            href="/admin/utilisateurs/ajouter"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Ajouter</span>
          </Link>
        }
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} className="text-slate-400" />
            <span className="font-medium text-slate-600">{users.length}</span>
            <span>utilisateur{users.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Statistiques
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold text-slate-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${roleColors[user.role]}`}>
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-green-600">
                            {user._count.repetiteursCreated} créés
                          </span>
                          <span className="text-blue-600">
                            {user._count.repetiteursUpdated} modifiés
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                        <Link
                          href={`/admin/utilisateurs/${user.id}/modifier`}
                          className="text-slate-600 hover:text-slate-900 flex items-center justify-end gap-1"
                        >
                          <Edit2 size={16} />
                          <span className="hidden lg:inline">Modifier</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
                <Shield size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Aucun utilisateur
              </h3>
              <Link
                href="/admin/utilisateurs/ajouter"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <Plus size={18} />
                Ajouter un utilisateur
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


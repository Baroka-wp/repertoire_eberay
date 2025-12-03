'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save, X, Eye, EyeOff } from 'lucide-react'
import AdminHeader from '@/app/components/AdminHeader'
import SubmitButton from '@/app/components/SubmitButton'
import { updateUser } from '@/app/actions'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface ModifierUtilisateurFormProps {
  user: User
}

export default function ModifierUtilisateurForm({ user }: ModifierUtilisateurFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader
        title="Modifier un utilisateur"
        subtitle="Administration E-Beyray"
      />

      <main className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 md:p-8">
          <form action={updateUser.bind(null, user.id)} className="space-y-4 md:space-y-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user.name}
                required
                className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user.email}
                required
                className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
              />
            </div>

            {/* Rôle */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                Rôle *
              </label>
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                required
                className="w-full text-base text-slate-900 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
              >
                <option value="viewer">Viewer (Lecture seule)</option>
                <option value="creator">Creator (Ajouter)</option>
                <option value="editor">Editor (Ajouter & Modifier)</option>
                <option value="admin">Admin (Tous les droits)</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                <strong>Viewer</strong> : Consulter uniquement • <strong>Creator</strong> : Ajouter des répétiteurs • <strong>Editor</strong> : Ajouter et modifier • <strong>Admin</strong> : Accès complet
              </p>
            </div>

            {/* Changer le mot de passe */}
            <div className="pt-4 border-t border-neutral-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="w-4 h-4 text-slate-800 border-neutral-300 rounded focus:ring-2 focus:ring-slate-800"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Modifier le mot de passe
                </span>
              </label>
            </div>

            {/* Nouveau mot de passe (conditionnel) */}
            {changePassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    minLength={8}
                    placeholder="Minimum 8 caractères"
                    className="w-full text-base text-slate-900 px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Laissez vide pour conserver le mot de passe actuel
                </p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Link
                href="/admin/utilisateurs"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 rounded-lg text-base font-semibold text-slate-700 hover:bg-neutral-50 transition-colors order-2 sm:order-1"
              >
                <X size={20} />
                <span className="hidden sm:inline">Annuler</span>
              </Link>
              <SubmitButton
                loadingText="Enregistrement..."
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <Save size={20} />
                <span>Enregistrer</span>
              </SubmitButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}


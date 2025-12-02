'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, Shield, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ROLES = [
  { value: 'admin', label: 'Administrateur', desc: 'Tous les droits (gestion utilisateurs incluse)' },
  { value: 'editor', label: 'Éditeur', desc: 'Peut ajouter et modifier les répétiteurs' },
  { value: 'creator', label: 'Créateur', desc: 'Peut uniquement ajouter des répétiteurs' },
  { value: 'viewer', label: 'Lecteur', desc: 'Consultation uniquement' },
]

export default function AjouterUtilisateurPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      const message = encodeURIComponent('Utilisateur créé avec succès')
      router.push(`/admin/utilisateurs?toast=success&message=${message}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HEADER */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/utilisateurs"
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-100"
              >
                <ArrowLeft size={18} />
                <span className="font-medium text-sm">Retour</span>
              </Link>
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="flex items-center gap-3">
                <Image 
                  src="/logp_eberay.png" 
                  alt="Logo E-Beyray" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
                <h1 className="text-lg font-bold text-slate-900">Nouvel Utilisateur</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 text-white">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Informations de l&apos;utilisateur</h2>
                  <p className="text-sm text-slate-600">Créez un nouveau compte administrateur</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom complet *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  placeholder="email@exemple.com"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Mot de passe *
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  placeholder="Minimum 8 caractères"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  placeholder="Répétez le mot de passe"
                />
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Rôle et permissions *
                </label>
                <div className="space-y-3">
                  {ROLES.map((role) => (
                    <label
                      key={role.value}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === role.value
                          ? 'border-slate-800 bg-slate-50'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 mb-1">{role.label}</div>
                        <div className="text-sm text-slate-600">{role.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
              <Link
                href="/admin/utilisateurs"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Créer l&apos;utilisateur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}


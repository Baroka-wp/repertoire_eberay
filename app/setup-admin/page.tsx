'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Shield, CheckCircle2 } from 'lucide-react'

export default function SetupAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const createAdmin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-neutral-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Administrateur créé !
            </h2>
            <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-slate-700 mb-2">Identifiants :</p>
              <p className="text-sm text-slate-600 mb-1">
                <span className="font-medium">Email :</span> admin@eberay.ne
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Mot de passe :</span> Admin123!
              </p>
            </div>
            <p className="text-sm text-amber-600 mb-6">
              ⚠️ Veuillez changer ce mot de passe après la première connexion
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-neutral-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <Image 
              src="/logp_eberay.png" 
              alt="Logo E-Beyray" 
              width={100} 
              height={100}
              className="drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Configuration Initiale
          </h1>
          <p className="text-slate-600">
            Créer le compte administrateur
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex items-start gap-4 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0">
              <Shield size={24} className="text-slate-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Compte Administrateur</h3>
              <p className="text-sm text-slate-600">
                Cette action créera le premier compte administrateur avec tous les droits.
              </p>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-2">Identifiants par défaut :</p>
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-medium">Email :</span> admin@eberay.ne
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-medium">Mot de passe :</span> Admin123!
            </p>
          </div>

          <button
            onClick={createAdmin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Création en cours...</span>
              </>
            ) : (
              <span>Créer l&apos;administrateur</span>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Cette page sera accessible uniquement si aucun admin n&apos;existe
          </p>
        </div>
      </div>
    </div>
  )
}


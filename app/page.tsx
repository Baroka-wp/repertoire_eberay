import Link from 'next/link'
import { BookOpen, UserPlus } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-neutral-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <Image 
              src="/logp_eberay.png" 
              alt="Logo E-BEYRAY" 
              width={180} 
              height={180}
              className="drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            E-BEYRAY
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Répertoire des Répétiteurs de l'Organisation Eberay
          </p>
        </div>

        {/* CARDS D'ACTION */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* CONSULTER LE RÉPERTOIRE */}
          <Link
            href="/repertoire"
            className="group relative bg-white rounded-2xl border-2 border-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-slate-800 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={32} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Consulter le répertoire
              </h2>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                Accédez à la base de données des répétiteurs Eberay. Recherchez par région, matière, niveau ou nom.
              </p>

              <div className="inline-flex items-center text-slate-800 font-semibold group-hover:gap-3 gap-2 transition-all">
                <span>Voir le répertoire</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* AJOUTER UN RÉPÉTITEUR */}
          <Link
            href="/ajouter"
            className="group relative bg-white rounded-2xl border-2 border-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-slate-800 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus size={32} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Ajouter un répétiteur
              </h2>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                Inscrivez un nouveau répétiteur dans l'organisation Eberay avec ses informations et compétences.
              </p>

              <div className="inline-flex items-center text-slate-800 font-semibold group-hover:gap-3 gap-2 transition-all">
                <span>Ajouter un profil</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* FOOTER INFO */}
        <div className="text-center text-sm text-slate-500">
          <p>Plateforme de gestion des membres Eberay</p>
        </div>
      </div>
    </div>
  )
}

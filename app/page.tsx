import Link from 'next/link'
import { BookOpen, UserPlus } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-neutral-50 to-slate-100 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-5xl w-full">
        {/* HEADER */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center mb-4 md:mb-6">
            <Image
              src="/logo_eberay.png"
              alt="Logo E-BEYRAY"
              width={180}
              height={180}
              className="drop-shadow-lg w-32 h-32 md:w-[180px] md:h-[180px]"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2 md:mb-4">
            E-BEYRAY
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
            Répertoire des Répétiteurs de l&apos;Organisation E-Beyray
          </p>
        </div>

        {/* CARDS D'ACTION */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-8">
          {/* CONSULTER LE RÉPERTOIRE */}
          <Link
            href="/repertoire"
            className="group relative bg-white rounded-2xl border-2 border-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6 md:p-10">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-800 text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={24} className="md:w-8 md:h-8" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3">
                Consulter le répertoire
              </h2>

              <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">
                Accédez à la base de données des répétiteurs E-Beyray. Recherchez par région, matière, niveau ou nom.
              </p>

              <div className="inline-flex items-center text-slate-800 font-semibold group-hover:gap-3 gap-2 transition-all text-sm md:text-base">
                <span>Voir le répertoire</span>
                <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* AJOUTER UN RÉPÉTITEUR */}
          <Link
            href="/ajouter"
            className="group relative bg-white rounded-2xl border-2 border-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6 md:p-10">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-800 text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus size={24} className="md:w-8 md:h-8" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3">
                Ajouter un répétiteur
              </h2>

              <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 leading-relaxed">
                Inscrivez un nouveau répétiteur dans l&apos;organisation E-Beyray avec ses informations et compétences.
              </p>

              <div className="inline-flex items-center text-slate-800 font-semibold group-hover:gap-3 gap-2 transition-all text-sm md:text-base">
                <span>Ajouter un profil</span>
                <span className="text-lg md:text-xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* FOOTER INFO */}
        <div className="text-center text-xs md:text-sm text-slate-500">
          <p>Plateforme de gestion des membres E-Beyray</p>
        </div>
      </div>
    </div>
  )
}

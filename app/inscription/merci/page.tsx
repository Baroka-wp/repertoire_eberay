import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

export default function MerciPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-neutral-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-12">
          <div className="inline-flex items-center justify-center mb-6">
            <Image
              src="/logo_eberay.png"
              alt="Logo E-Beyray"
              width={100}
              height={100}
              className="drop-shadow-lg"
              priority
            />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Inscription réussie !
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            Merci de votre inscription au répertoire E-Beyray.
          </p>

          <div className="bg-neutral-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-slate-900 mb-3">Prochaines étapes :</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                <span>Votre dossier a été enregistré dans notre système</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 font-bold flex-shrink-0">→</span>
                <span>Un administrateur va vérifier vos informations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 font-bold flex-shrink-0">→</span>
                <span>Vous serez contacté par téléphone pour confirmation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-slate-400 font-bold flex-shrink-0">→</span>
                <span>Votre profil apparaîtra dans le répertoire après validation</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-slate-500">
            Pour toute question, contactez l&apos;organisation E-Beyray
          </p>
        </div>
      </div>
    </div>
  )
}


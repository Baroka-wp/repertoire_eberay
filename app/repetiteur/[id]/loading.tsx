import Image from 'next/image'

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-40 h-9 bg-neutral-200 rounded-lg animate-pulse" />
              <div className="h-6 w-px bg-neutral-300"></div>
              <div className="w-40 h-6 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="w-24 h-9 bg-neutral-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo_eberay.png"
              alt="Logo E-Beyray"
              width={80}
              height={80}
              className="animate-pulse"
              priority
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-48 h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-slate-800 animate-[loading_1.5s_ease-in-out_infinite]" />
              </div>
              <p className="text-sm font-medium text-slate-600">Chargement de la fiche...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


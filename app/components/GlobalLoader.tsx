'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function GlobalLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Écouter les changements de navigation
    window.addEventListener('beforeunload', handleStart)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image 
          src="/logp_eberay.png" 
          alt="Logo E-Beyray" 
          width={80} 
          height={80}
          className="animate-pulse"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-48 h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-800 animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm font-medium text-slate-600">Chargement en cours...</p>
        </div>
      </div>
    </div>
  )
}


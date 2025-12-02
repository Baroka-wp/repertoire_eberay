'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

export function ToastProvider() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const toastType = searchParams.get('toast')
    const messageParam = searchParams.get('message')
    
    if (toastType && messageParam) {
      // Décoder le message pour gérer correctement les caractères accentués
      const message = decodeURIComponent(messageParam)
      
      if (toastType === 'success') {
        toast.success(message)
      } else if (toastType === 'error') {
        toast.error(message)
      }
      
      // Nettoyer l'URL en supprimant les paramètres de toast
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('toast')
      newSearchParams.delete('message')
      const newUrl = newSearchParams.toString() 
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname
      router.replace(newUrl, { scroll: false })
    }
  }, [searchParams, router, pathname])

  return null
}


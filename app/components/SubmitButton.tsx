'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface SubmitButtonProps {
  children: ReactNode
  loadingText?: string
  className?: string
  disabled?: boolean
}

export default function SubmitButton({ 
  children, 
  loadingText = 'En cours...', 
  className = '',
  disabled = false
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${className} ${pending || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}


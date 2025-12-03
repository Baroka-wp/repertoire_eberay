'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'

interface CloudinaryUploadProps {
  onPhotoUpload: (photoUrl: string) => void
  initialPhotoUrl?: string | null
  className?: string
}

export default function CloudinaryUpload({ onPhotoUpload, initialPhotoUrl, className = '' }: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when initial photo URL changes
  useEffect(() => {
    setPreviewUrl(initialPhotoUrl || null)
  }, [initialPhotoUrl])

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return 'Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP)'
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'L\'image est trop lourde. Taille maximale : 5 Mo'
    }

    return null
  }

  const handleUpload = async (file: File) => {
    if (!file) return

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setTimeout(() => setError(null), 5000)
      return
    }

    setError(null)
    setSuccess(false)
    setLoading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Generate a unique public ID
      const timestamp = Date.now()
      const publicId = `repetiteur_${timestamp}`

      // Create form data for Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
      formData.append('public_id', publicId)
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!)

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error('Échec du téléchargement de l\'image')
      }

      const data = await response.json()
      const uploadedPhotoUrl = data.secure_url

      setUploadProgress(100)
      setPreviewUrl(uploadedPhotoUrl)
      onPhotoUpload(uploadedPhotoUrl)
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Upload error:', error)
      setError('Erreur lors du téléchargement. Veuillez réessayer.')
      setTimeout(() => setError(null), 5000)
      setUploadProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the selected file
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Actually upload the file
      handleUpload(file)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      handleUpload(file)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const removePhoto = () => {
    setPreviewUrl(null)
    onPhotoUpload('')
    setError(null)
    setSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      {/* Preview Area */}
      <div className="relative">
        <div
          className={`relative flex items-center justify-center w-full transition-all duration-300 ${previewUrl ? 'h-48 sm:h-56 md:h-64' : 'h-40 sm:h-48'
            }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            /* Image Preview */
            <div className="relative group w-full h-full">
              <img
                src={previewUrl}
                alt="Aperçu de la photo"
                className="w-full h-full object-cover rounded-2xl border-2 border-slate-200 shadow-md transition-all duration-300 group-hover:shadow-lg"
              />

              {/* Overlay avec boutons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2"
                  aria-label="Changer la photo"
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Changer</span>
                </button>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2"
                  aria-label="Supprimer la photo"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>

              {/* Badge de succès */}
              {success && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 size={14} />
                  Téléchargé !
                </div>
              )}
            </div>
          ) : (
            /* Drop Zone */
            <div
              onClick={triggerFileSelect}
              className={`w-full h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging
                ? 'border-slate-600 bg-slate-100 scale-105 shadow-lg'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 hover:shadow-md'
                }`}
            >
              <div className={`transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
                <div className="bg-slate-800 p-4 rounded-full mb-4 mx-auto w-fit">
                  <ImageIcon size={32} className="text-white" />
                </div>
                <p className="text-slate-700 font-medium text-sm sm:text-base mb-1 text-center px-4">
                  {isDragging ? 'Déposez l\'image ici' : 'Cliquez ou glissez une image'}
                </p>
                <p className="text-slate-500 text-xs sm:text-sm text-center px-4">
                  JPG, PNG ou WEBP (max 5 Mo)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Téléchargement en cours...</span>
              <span className="font-semibold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-slate-600 to-slate-800 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm flex-1">{error}</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Action Button (Mobile) */}
      {!previewUrl && (
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={loading}
          className="mt-4 w-full sm:hidden flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <Upload size={18} />
          Sélectionner une photo
        </button>
      )}
    </div>
  )
}
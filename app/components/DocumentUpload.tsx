'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, FileText, CheckCircle2, AlertCircle, FileImage, File } from 'lucide-react'

interface DocumentUploadProps {
  onDocumentUpload: (documentUrl: string) => void
  initialDocumentUrl?: string | null
  documentType: 'casier' | 'id_card' | 'passport'
  className?: string
}

export default function DocumentUpload({
  onDocumentUpload,
  initialDocumentUrl,
  documentType,
  className = ''
}: DocumentUploadProps) {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when initial document URL changes
  useEffect(() => {
    setPreviewUrl(initialDocumentUrl || null)
  }, [initialDocumentUrl])

  const validateFile = (file: File): string | null => {
    // Validate file type (PDF, JPG, PNG)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      return 'Veuillez sélectionner un fichier PDF, JPEG ou PNG valide'
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'Le document est trop lourd. Taille maximale : 10 Mo'
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

      // Determine document type for naming
      let documentTypeStr = ''
      switch (documentType) {
        case 'casier':
          documentTypeStr = 'casier_judiciaire'
          break
        case 'id_card':
          documentTypeStr = 'carte_identite'
          break
        case 'passport':
          documentTypeStr = 'passeport'
          break
        default:
          documentTypeStr = 'document'
      }

      // Generate a unique public ID
      const timestamp = Date.now()
      const publicId = `documents/repetiteur_${timestamp}_${documentTypeStr}`

      // Use auto upload for all file types to let Cloudinary handle resource type detection
      const uploadPath = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`

      // Create form data for Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
      formData.append('public_id', publicId)
      // Remove explicit access_mode as it might conflict with preset settings

      // Upload to Cloudinary
      const response = await fetch(uploadPath, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Cloudinary error details:', errorData)
        throw new Error(errorData.error?.message || 'Échec du téléchargement du document')
      }

      const data = await response.json()
      const uploadedDocumentUrl = data.secure_url

      setUploadProgress(100)
      setPreviewUrl(uploadedDocumentUrl)
      onDocumentUpload(uploadedDocumentUrl)
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

  const removeDocument = () => {
    setPreviewUrl(null)
    onDocumentUpload('')
    setError(null)
    setSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Determine icon based on file type
  const getDocumentIcon = () => {
    if (previewUrl) {
      if (previewUrl.toLowerCase().endsWith('.pdf')) {
        return <File size={32} className="text-red-600" />
      } else {
        return <FileImage size={32} className="text-blue-600" />
      }
    }
    return <FileText size={32} className="text-slate-600" />
  }

  // Get document type label for UI
  const getDocumentLabel = () => {
    switch (documentType) {
      case 'casier':
        return 'Casier judiciaire'
      case 'id_card':
        return 'Carte d\'identité'
      case 'passport':
        return 'Passeport'
      default:
        return 'Document'
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Preview Area */}
      <div className="relative">
        <div
          className={`relative flex items-center justify-center w-full transition-all duration-300 ${previewUrl ? 'h-40 sm:h-48' : 'h-32 sm:h-40'
            }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            /* Document Preview */
            <div className="relative group w-full h-full">
              <div
                className="w-full h-full flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 shadow-md transition-all duration-300 group-hover:shadow-lg cursor-pointer"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <div className="bg-slate-100 p-3 rounded-full mb-2">
                  {getDocumentIcon()}
                </div>
                <p className="text-slate-700 font-medium text-sm truncate max-w-full px-2">
                  {previewUrl.split('/').pop()}
                </p>
                <p className="text-slate-500 text-xs">
                  {getDocumentLabel()}
                </p>
              </div>

              {/* Overlay avec boutons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="bg-white text-slate-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2"
                  aria-label="Changer le document"
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Changer</span>
                </button>
                <button
                  type="button"
                  onClick={removeDocument}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2"
                  aria-label="Supprimer le document"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </div>

              {/* Badge de succès */}
              {success && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 size={12} />
                </div>
              )}
            </div>
          ) : (
            /* Drop Zone */
            <div
              onClick={triggerFileSelect}
              className={`w-full h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging
                ? 'border-slate-600 bg-slate-100 scale-105 shadow-lg'
                : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 hover:shadow-md'
                }`}
            >
              <div className={`transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
                <div className="bg-slate-800 p-3 rounded-full mb-3 mx-auto w-fit">
                  {getDocumentIcon()}
                </div>
                <p className="text-slate-700 font-medium text-sm mb-1 text-center px-4">
                  {isDragging ? 'Déposez le document ici' : 'Cliquez ou glissez un document'}
                </p>
                <p className="text-slate-500 text-xs text-center px-4">
                  PDF, JPG ou PNG (max 10 Mo)
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
        accept=".pdf,.jpg,.jpeg,.png"
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
          Sélectionner un document
        </button>
      )}
    </div>
  )
}
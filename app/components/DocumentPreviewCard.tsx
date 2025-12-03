'use client'

import { File, Eye, CheckCircle2 } from 'lucide-react'

interface DocumentPreviewCardProps {
  title: string
  url: string
  verified: boolean
}

export default function DocumentPreviewCard({ 
  title, 
  url, 
  verified 
}: DocumentPreviewCardProps) {
  // Extraire le publicId à partir de l'URL Cloudinary
  // Format: https://res.cloudinary.com/.../folder/publicId.ext
  const publicId = url.split('/').pop()?.split('.')[0] || 'document'; // Enlever l'extension

  const getDocumentIcon = () => {
    return <File size={32} className="text-slate-600" />
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-slate-50 p-2 rounded-lg">
          {getDocumentIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-800 truncate">{title}</h3>
          <p className="text-xs text-slate-500 truncate mt-1">{publicId}</p>
          
          {verified && (
            <div className="inline-flex items-center gap-1 mt-2 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              <CheckCircle2 size={12} />
              Vérifié
            </div>
          )}
        </div>
      </div>
      
      <a
        href={`/api/documents/${publicId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Eye size={16} />
        Voir le document
      </a>
    </div>
  )
}
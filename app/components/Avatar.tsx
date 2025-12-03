'use client'

interface AvatarProps {
    src: string | null
    alt: string
    initials: string
    className?: string
}

export function Avatar({ src, alt, initials, className = '' }: AvatarProps) {
    if (!src) {
        return (
            <div className={`rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold ${className}`}>
                {initials}
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={(e) => {
                // If image fails to load, hide the image
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                // Show fallback (initials) by replacing with div
                const fallback = document.createElement('div')
                fallback.className = className.replace('object-cover', '')
                fallback.className += ' bg-slate-100 flex items-center justify-center text-slate-700 font-bold'
                fallback.textContent = initials
                target.parentNode?.replaceChild(fallback, target)
            }}
        />
    )
}

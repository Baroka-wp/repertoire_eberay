'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import SidebarMenu from './SidebarMenu'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  rightAction?: React.ReactNode
}

export default function AdminHeader({ title, subtitle, rightAction }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: Logo et titre */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <Link
              href="/repertoire"
              className="flex items-center gap-1 md:gap-2 text-slate-700 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-100 flex-shrink-0"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="h-6 w-px bg-neutral-300 hidden sm:block"></div>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <Image
                src="/logo_eberay.png"
                alt="Logo E-Beyray"
                width={24}
                height={24}
                className="object-contain w-6 h-6 md:w-8 md:h-8 flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-sm md:text-lg font-bold text-slate-900 truncate">{title}</h1>
                {subtitle && <p className="text-xs text-slate-500 hidden md:block truncate">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Right: Actions + Menu */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {rightAction}
            {rightAction && <div className="h-8 w-px bg-neutral-300 hidden sm:block"></div>}
            <SidebarMenu />
          </div>
        </div>
      </div>
    </header>
  )
}


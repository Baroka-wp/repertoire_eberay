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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo et titre */}
          <div className="flex items-center gap-4">
            <Link 
              href="/repertoire"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-neutral-100"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="h-6 w-px bg-neutral-300"></div>
            <div className="flex items-center gap-3">
              <Image 
                src="/logp_eberay.png" 
                alt="Logo E-Beyray" 
                width={32} 
                height={32}
                className="object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Right: Actions + Menu */}
          <div className="flex items-center gap-3">
            {rightAction}
            {rightAction && <div className="h-8 w-px bg-neutral-300"></div>}
            <SidebarMenu />
          </div>
        </div>
      </div>
    </header>
  )
}


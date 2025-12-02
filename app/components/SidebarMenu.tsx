'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Users, UserPlus, LogOut } from 'lucide-react'
import { hasPermission } from '@/lib/permissions-client'

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const canAccessAdmin = hasPermission(session?.user?.role, 'admin')

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Bouton Hamburger */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-neutral-100 transition-colors"
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header de la Sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-slate-900">Menu</h2>
            <button
              onClick={closeMenu}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-neutral-100 transition-colors"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Info Utilisateur */}
          {session?.user && (
            <div className="p-6 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-white text-lg font-bold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{session.user.name}</p>
                  <p className="text-sm text-slate-500">{session.user.email}</p>
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                    {session.user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {canAccessAdmin && (
                <>
                  <li>
                    <Link
                      href="/admin/utilisateurs"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-neutral-100 transition-colors group"
                    >
                      <Users size={20} className="text-slate-500 group-hover:text-slate-700" />
                      <span className="font-medium">Liste des utilisateurs</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/utilisateurs/ajouter"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-neutral-100 transition-colors group"
                    >
                      <UserPlus size={20} className="text-slate-500 group-hover:text-slate-700" />
                      <span className="font-medium">Ajouter un utilisateur</span>
                    </Link>
                  </li>
                  <li className="pt-2 pb-2">
                    <div className="h-px bg-neutral-200"></div>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => {
                    closeMenu()
                    signOut({ callbackUrl: '/login' })
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
                >
                  <LogOut size={20} className="text-red-500 group-hover:text-red-600" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <p className="text-xs text-slate-500 text-center">
              E-Beyray © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}


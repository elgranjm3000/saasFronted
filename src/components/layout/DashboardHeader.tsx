'use client'
import { useState } from 'react'
import { Bell, Search, User, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

export default function DashboardHeader() {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button className="text-slate-500 hover:text-slate-700 lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">
            {user?.company.name}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-400 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block font-medium text-slate-700">
                {user?.username}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Mi Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Configuración
                </a>
                <hr className="my-1 border-slate-200" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <div className="flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
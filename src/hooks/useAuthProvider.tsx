'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authAPI } from '@/lib/api'

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  company_id: number;
  is_active: boolean;
  is_company_admin: boolean;
  created_at: string;
  last_login?: string;
  company: {
    id: number;
    name: string;
    tax_id: string;
  };
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`
  }
}

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, null as string | null)
}

const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const publicPaths = ['/login', '/register', '/']

  // Inicializar autenticación UNA SOLA VEZ
  useEffect(() => {
    const initAuth = async () => {
      try {
        let token = getCookie('access_token') || localStorage.getItem('access_token')
        
        if (token) {
          console.log('Token found, verifying...')
          
          if (!getCookie('access_token') && localStorage.getItem('access_token')) {
            setCookie('access_token', token)
          }
          
          const response = await authAPI.getMe()
          console.log('User authenticated:', response.data.username)
          setUser(response.data)
          setIsAuthenticated(true)
          
          if (!getCookie('user_data')) {
            setCookie('user_data', JSON.stringify(response.data))
          }
        } else {
          console.log('No token found')
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        deleteCookie('access_token')
        deleteCookie('user_data')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_data')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
        setHasInitialized(true)
      }
    }

    initAuth()
  }, []) // ← Dependencias vacías: se ejecuta UNA SOLA VEZ

  // Manejar redirecciones DESPUÉS de inicializar
  useEffect(() => {
    if (!hasInitialized) return // Esperar a que se inicialice

    console.log(`Pathname changed to: ${pathname}, Authenticated: ${isAuthenticated}`)

    // Si no autenticado y no está en ruta pública → ir a login
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      console.log('Not authenticated, redirecting to login')
      router.push('/login')
    }

    // Si autenticado y está en ruta pública → ir a dashboard
    if (isAuthenticated && publicPaths.includes(pathname)) {
      console.log('Authenticated on public path, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [pathname, isAuthenticated, hasInitialized]) // ← Dependencias correctas

  const login = async (credentials: any) => {
    try {
      console.log('Attempting login...')
      const response = await authAPI.login(credentials)
      
      const { access_token, user: userData } = response.data
      
      setCookie('access_token', access_token, 7)
      setCookie('user_data', JSON.stringify(userData), 7)
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      
      console.log('Login successful')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('Logging out...')
    deleteCookie('access_token')
    deleteCookie('user_data')
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
    
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'


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
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    
    // ✅ En desarrollo: NO usar Secure (HTTP)
    // ✅ En producción: usar Secure (HTTPS)
    const isProduction = process.env.NODE_ENV === 'production'
    const secure = isProduction ? '; Secure' : ''
    
    const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${secure}; SameSite=Lax`
    
    console.log(`🍪 [setCookie] ${name} = ${cookieString}`)
    document.cookie = cookieString
    
    // Verificar que se seteo
    const verify = getCookie(name)
    console.log(`🍪 [setCookie] Verification - ${name} in cookie: ${verify ? 'YES ✅' : 'NO ❌'}`)
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
  const router = useRouter()
  const pathname = usePathname()
  
  // Inicializar autenticación UNA SOLA VEZ
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getCookie('access_token') || localStorage.getItem('access_token')
        console.log('🔍 [AuthProvider] Initializing, token exists:', !!token)
        
        if (token) {
          // Sincronizar token entre localStorage y cookies
          if (!getCookie('access_token') && localStorage.getItem('access_token')) {
            setCookie('access_token', token)
          }
          
          // Verificar token con la API
          const response = await authAPI.getMe()
          console.log('✅ [AuthProvider] User authenticated:', response.data.username)
          setUser(response.data)
          setIsAuthenticated(true)
          
          // Guardar datos en cookies
          if (!getCookie('user_data')) {
            setCookie('user_data', JSON.stringify(response.data))
          }
        } else {
          console.log('ℹ️ [AuthProvider] No token found')
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('❌ [AuthProvider] Error initializing auth:', error)
        deleteCookie('access_token')
        deleteCookie('user_data')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_data')
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: any) => {
    try {
      console.log('🔐 [AuthProvider] Attempting login...')
      const response = await authAPI.login(credentials)
      
      const { access_token, user: userData } = response.data
      
      console.log('✅ [AuthProvider] Login response received')
      console.log('📝 [AuthProvider] Setting cookies and localStorage...')
      
      // Guardar en cookies y localStorage
      setCookie('access_token', access_token, 7)
      setCookie('user_data', JSON.stringify(userData), 7)
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      // Verificar que se seteo
      console.log('🍪 [AuthProvider] Final verification:')
      console.log('   - Cookie access_token:', getCookie('access_token') ? '✅ YES' : '❌ NO')
      console.log('   - Cookie user_data:', getCookie('user_data') ? '✅ YES' : '❌ NO')
      console.log('   - localStorage access_token:', localStorage.getItem('access_token') ? '✅ YES' : '❌ NO')
      
      setUser(userData)
      setIsAuthenticated(true)
      
      console.log('✅ [AuthProvider] Login successful')
    } catch (error) {
      console.error('❌ [AuthProvider] Login error:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('🚪 [AuthProvider] Logging out...')
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
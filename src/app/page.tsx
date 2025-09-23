'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
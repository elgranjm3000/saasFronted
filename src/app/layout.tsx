import './globals.css'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LoadScript } from '@react-google-maps/api'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ERP System - Gestión Empresarial',
  description: 'Sistema de planificación de recursos empresariales',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    )
  }

  return (
    <html lang="es">
      <body className={inter.className}>
        <LoadScript
          googleMapsApiKey={apiKey}
          libraries={['places']}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </LoadScript>
      </body>
    </html>
  )
}
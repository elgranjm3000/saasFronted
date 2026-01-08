import { Loader2 } from 'lucide-react';
import { DashboardSkeleton, TableSkeleton, ListItemSkeleton } from './Skeleton';

/**
 * Componente de carga para mostrar durante el fetch de datos
 * Usa skeletons para mejor UX perceptible
 */
interface LoadingPageProps {
  type?: 'dashboard' | 'table' | 'list' | 'spinner';
  message?: string;
}

export function LoadingPage({ type = 'spinner', message }: LoadingPageProps) {
  if (type === 'dashboard') {
    return <DashboardSkeleton />;
  }

  if (type === 'table') {
    return <TableSkeleton />;
  }

  if (type === 'list') {
    return <ListItemSkeleton />;
  }

  // Default: centered spinner with optional message
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-4" />
      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
}

/**
 * Inline loading para botones o espacios pequeños
 */
export function InlineLoading() {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      <span className="text-sm text-gray-500">Cargando...</span>
    </div>
  );
}

/**
 * Loading overlay para modales o dialogs
 */
interface LoadingOverlayProps {
  message?: string;
  transparent?: boolean;
}

export function LoadingOverlay({ message = 'Cargando...', transparent = false }: LoadingOverlayProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="flex flex-col items-center space-y-4 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
        {message && (
          <p className="text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}

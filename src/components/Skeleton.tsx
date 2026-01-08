import React from 'react';

/**
 * Skeleton Components
 * Placeholders visuales durante la carga de contenido
 * Mejora la UX perceptible vs usar solo spinners
 */

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton básico para cualquier contenido
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

/**
 * Skeleton para texto (líneas)
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${i === lines - 1 ? 'w-3/4' : 'w-full'} h-4`}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton para tarjetas
 */
export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Footer */}
      <div className="flex justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

/**
 * Skeleton para tablas
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton para listas de elementos (productos, facturas, etc.)
 */
export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para dashboard con stats cards
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <ListItemSkeleton count={3} />
      </div>
    </div>
  );
}

/**
 * Skeleton para formularios
 */
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

/**
 * Loading Spinner (para cargas rápidas o overlays)
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin`}
        role="status"
        aria-label="Loading..."
      />
    </div>
  );
}

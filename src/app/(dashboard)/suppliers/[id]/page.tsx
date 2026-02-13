'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Hash,
  Loader2,
  Package,
  DollarSign
} from 'lucide-react';
import { suppliersAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Supplier } from '@/types/supplier';

interface SupplierDetailPageProps {
  params: {
    id: string;
  };
}

const SupplierDetailPage = ({ params }: SupplierDetailPageProps) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchSupplier();
    }
  }, [params.id]);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getById(Number(params.id));
      setSupplier(response.data);
    } catch (error: any) {
      console.error('Error fetching supplier:', error);
      setError('Error al cargar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!supplier) return;

    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se puede deshacer.')) {
      try {
        await suppliersAPI.delete(supplier.id);
        router.push('/suppliers');
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Error al eliminar el proveedor');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">Proveedor no encontrado</h3>
          <p className="text-gray-500 mb-6">
            {error || 'El proveedor que buscas no existe o fue eliminado.'}
          </p>
          <Link
            href="/suppliers"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-light">Volver a Proveedores</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/suppliers"
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">{supplier.name}</h1>
              <p className="text-gray-500 font-light">ID: {supplier.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/suppliers/${supplier.id}/edit`}
              className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              <Edit className="w-4 h-4 mr-2" />
              <span className="font-light">Editar</span>
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="font-light">Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Supplier Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-start space-x-6">
                {/* Supplier Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>

                {/* Supplier Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h2 className="text-2xl font-light text-gray-900 mb-2">{supplier.name}</h2>
                  </div>

                  {supplier.contact && (
                    <div className="mb-2">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>Contacto: {supplier.contact}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Información de Contacto</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supplier.contact && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Contacto</p>
                      <p className="font-medium text-gray-900">{supplier.contact}</p>
                    </div>
                  </div>
                )}

                {supplier.address && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium text-gray-900">{supplier.address}</p>
                    </div>
                  </div>
                )}

                {supplier.tax_id && (
                  <div className="flex items-center">
                    <Hash className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">RIF</p>
                      <p className="font-medium text-gray-900 font-mono">{supplier.tax_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href={`/suppliers/${supplier.id}/edit`}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                <Edit className="w-4 h-4 mr-3" />
                <span className="font-light">Editar Proveedor</span>
              </Link>
              <Link
                href="/purchases/new?supplier_id={supplier.id}"
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                <Package className="w-4 h-4 mr-3" />
                <span className="font-light">Nueva Compra</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Actividad</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Proveedor registrado</p>
                    <p className="text-xs text-gray-500">
                      {supplier.created_at ? formatDate(supplier.created_at) : 'Fecha no disponible'}
                    </p>
                  </div>
                </div>

                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No hay más actividad registrada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;

'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Product } from '@/types/api';
import ProductForm from '@/components/forms/product-form';

const NewProductPage = () => {
  const router = useRouter();

  const handleSuccess = (product: Product) => {
    // Redirigir a la página del producto creado
    setTimeout(() => {
      router.push(`/products/${product.id}`);
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/products');
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link
            href="/products"
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Nuevo Producto</h1>
            <p className="text-gray-500 font-light">
              Completa la información para crear un nuevo producto con todos los campos del sistema Desktop ERP
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8">
        <ProductForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NewProductPage;

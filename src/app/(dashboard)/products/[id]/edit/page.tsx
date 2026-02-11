'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import ProductForm from '@/components/forms/product-form';
import { Product } from '@/types/api';

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

const ProductEditPage = ({ params }: ProductEditPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(Number(params.id));
      setProduct(response.data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedProduct: Product) => {
    setSuccess(true);
    setTimeout(() => {
      router.push(`/products/${updatedProduct.id}`);
    }, 1500);
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

  if (error || !product) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-600">{error || 'Producto no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link
            href={`/products/${product.id}`}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Editar Producto</h1>
            <p className="text-gray-500 font-light">
              Modifica la información del producto
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-8 bg-green-50/80 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-600 font-medium">
              Producto actualizado correctamente
            </p>
          </div>
        </div>
      )}

      {/* Formulario unificado */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8">
        <ProductForm
          product={product}
          onSuccess={handleSuccess}
          onCancel={() => router.push(`/products/${product.id}`)}
        />
      </div>
    </div>
  );
};

export default ProductEditPage;

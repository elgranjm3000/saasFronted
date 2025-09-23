'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Hash,
  Tag,
  History,
  Loader2
} from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
  category?: {
    id: number;
    name: string;
  };
  company_id: number;
  created_at?: string;
  updated_at?: string;
}

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleDelete = async () => {
    if (!product) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        await productsAPI.delete(product.id);
        router.push('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const getStockStatus = (quantity: number) => {
    const minStock = 10;
    if (quantity === 0) return { 
      status: 'out', 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      icon: TrendingDown,
      label: 'Agotado' 
    };
    if (quantity <= minStock) return { 
      status: 'low', 
      color: 'text-orange-600', 
      bg: 'bg-orange-100', 
      icon: AlertTriangle,
      label: 'Stock Bajo' 
    };
    return { 
      status: 'good', 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      icon: TrendingUp,
      label: 'En Stock' 
    };
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">Producto no encontrado</h3>
          <p className="text-gray-500 mb-6">
            {error || 'El producto que buscas no existe o fue eliminado.'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-light">Volver a Productos</span>
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.quantity);
  const StockIcon = stockStatus.icon;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/products"
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 font-light">
                SKU: <span className="font-mono">{product.sku}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              href={`/products/${product.id}/edit`}
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
          {/* Product Image & Basic Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Product Image Placeholder */}
                <div className="w-full md:w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-400" />
                </div>
                
                {/* Product Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <h2 className="text-2xl font-light text-gray-900">{product.name}</h2>
                      {product.category && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    
                    {product.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Precio</span>
                      </div>
                      <p className="text-2xl font-light text-gray-900">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Stock</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-light text-gray-900">
                          {product.quantity}
                        </p>
                        <StockIcon className={`w-5 h-5 ${stockStatus.color}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Detalles del Producto</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ID del Producto</p>
                    <p className="font-medium text-gray-900">{product.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Tag className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium text-gray-900 font-mono">{product.sku}</p>
                  </div>
                </div>
                
                {product.category && (
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Categoría</p>
                      <p className="font-medium text-gray-900">{product.category.name}</p>
                    </div>
                  </div>
                )}
                
                {product.created_at && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Creación</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(product.created_at, 'long')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Estado del Stock</h3>
            </div>
            <div className="p-6">
              <div className={`flex items-center justify-center w-full py-4 px-6 rounded-2xl ${stockStatus.bg} mb-4`}>
                <StockIcon className={`w-6 h-6 ${stockStatus.color} mr-3`} />
                <span className={`font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Cantidad actual</span>
                  <span className="font-medium text-gray-900">{product.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock mínimo</span>
                  <span className="font-medium text-gray-900">10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Valor del stock</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(product.price * product.quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <Package className="w-4 h-4 mr-3" />
                <span className="font-light">Ajustar Stock</span>
              </button>
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <DollarSign className="w-4 h-4 mr-3" />
                <span className="font-light">Actualizar Precio</span>
              </button>
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <History className="w-4 h-4 mr-3" />
                <span className="font-light">Ver Historial</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Producto creado</p>
                    <p className="text-xs text-gray-500">
                      {product.created_at ? formatDate(product.created_at) : 'Fecha no disponible'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
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

export default ProductDetailPage;
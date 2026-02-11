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
  Loader2,
  ChevronDown,
  ChevronUp,
  Settings,
  Box,
  DollarSign as DollarIcon,
  Scale,
  Percent
} from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

// ✅ SISTEMA ESCRITORIO: Interface completa con todos los campos Desktop ERP
interface Product {
  id: number;
  name: string;
  sku: string;
  short_name?: string;
  description: string;

  // Clasificación
  mark?: string;
  model?: string;
  department_id?: number;
  size?: string;
  color?: string;
  product_type?: string;  // T=Terminado, S=Servicio, C=Compuesto

  // Departamento
  category_id?: number;
  category?: {
    id: number;
    name: string;
  };

  // Impuestos
  sale_tax_code?: string;  // 01=16%, 02=8%, 03=31%, 06=Percibido, EX=Exento
  buy_tax_code?: string;

  // Precios
  price: number;
  price_usd?: number;
  cost?: number;
  maximum_price?: number;
  offer_price?: number;
  higher_price?: number;
  minimum_price?: number;
  sale_price_type?: number;  // 0=Max, 1=Oferta, 2=Mayor, 3=Min, 4=Variable

  // Stock
  quantity?: number;
  stock_quantity?: number;
  min_stock?: number;
  maximum_stock?: number;
  allow_negative_stock?: boolean;
  serialized?: boolean;
  use_lots?: boolean;
  lots_order?: number;

  // Costeo
  costing_type?: number;  // 0=Promedio, 1=Último, 2=PEPS, 3=UEPS
  calculated_cost?: number;
  average_cost?: number;

  // Descuentos
  discount?: number;
  max_discount?: number;
  minimal_sale?: number;
  maximal_sale?: number;

  // Configuración
  allow_decimal?: boolean;
  rounding_type?: number;
  edit_name?: boolean;
  take_department_utility?: boolean;
  coin?: string;  // 01=Bolívar, 02=Dólar
  days_warranty?: number;
  status?: string;  // 01=Activo, 02=Inactivo

  // Auditoría
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

  // ✅ Secciones expandibles
  const [openSections, setOpenSections] = useState({
    basic: true,
    pricing: true,
    inventory: true,
    classification: false,
    taxes: false,
    costing: false,
    discounts: false,
    advanced: false,
  });

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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ✅ Funciones helper
  const getStockStatus = (quantity: number, minStock: number = 10) => {
    if (quantity === 0) return {
      status: 'Sin Stock',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: AlertTriangle
    };
    if (quantity <= minStock) return {
      status: 'Stock Bajo',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: AlertTriangle
    };
    return {
      status: 'En Stock',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: Package
    };
  };

  const getMargin = () => {
    if (!product.cost || !product.price) return { percentage: 0, profit: 0, color: 'text-gray-500' };
    const profit = product.price - product.cost;
    const percentage = (profit / product.cost) * 100;

    if (percentage < 10) return { percentage, profit, color: 'text-red-600' };
    if (percentage < 20) return { percentage, profit, color: 'text-orange-600' };
    return { percentage, profit, color: 'text-green-600' };
  };

  const getProductTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      'T': 'Terminado',
      'S': 'Servicio',
      'C': 'Compuesto'
    };
    return labels[type || 'T'] || 'Desconocido';
  };

  const getTaxCodeLabel = (code?: string) => {
    const labels: Record<string, string> = {
      '01': '16%',
      '02': '8%',
      '03': '31%',
      '06': 'Percibido',
      'EX': 'Exento'
    };
    return labels[code || '01'] || code || '01';
  };

  const getSalePriceTypeLabel = (type?: number) => {
    const labels: Record<number, string> = {
      0: 'Precio Máximo',
      1: 'Precio Oferta',
      2: 'Precio Mayor',
      3: 'Precio Mínimo',
      4: 'Precio Variable'
    };
    return labels[type || 0] || 'Desconocido';
  };

  const getCostingTypeLabel = (type?: number) => {
    const labels: Record<number, string> = {
      0: 'Promedio Ponderado',
      1: 'Último',
      2: 'PEPS (FIFO)',
      3: 'UEPS (LIFO)'
    };
    return labels[type || 0] || 'Desconocido';
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      '01': { label: 'Activo', color: 'bg-green-100 text-green-800' },
      '02': { label: 'Inactivo', color: 'bg-red-100 text-red-800' }
    };
    return labels[status || '01'] || { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
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
        <div className="flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100">
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

  const stockStatus = getStockStatus(product.quantity || product.stock_quantity || 0, product.min_stock);
  const margin = getMargin();
  const statusInfo = getStatusLabel(product.status);

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
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-light text-gray-900">{product.name}</h1>
                <span className={`px-3 py-1 text-sm rounded-full ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-gray-500 font-light mt-1">
                SKU: <span className="font-mono">{product.sku}</span>
                {product.short_name && (
                  <span className="ml-3">
                    | Nombre Corto: <span className="font-mono">{product.short_name}</span>
                  </span>
                )}
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
        <div className="xl:col-span-2 space-y-6">

          {/* ✅ SECCIÓN 1: INFORMACIÓN BÁSICA */}
          {Section({
            id: 'basic',
            title: 'Información Básica',
            icon: Package,
            isOpen: openSections.basic,
            onToggle: () => toggleSection('basic'),
            children: (
              <div className="space-y-4">
                {product.description && (
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Descripción</label>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Departamento" value={product.category?.name} />
                  <InfoRow label="Tipo" value={getProductTypeLabel(product.product_type)} />
                  <InfoRow label="Depósito" value={product.warehouse?.name} />
                  <InfoRow label="Moneda" value={product.coin === '01' ? 'Bolívar' : product.coin === '02' ? 'Dólar' : product.coin} />
                </div>
              </div>
            )
          })}

          {/* ✅ SECCIÓN 2: CLASIFICACIÓN */}
          {Section({
            id: 'classification',
            title: 'Clasificación',
            icon: Tag,
            isOpen: openSections.classification,
            onToggle: () => toggleSection('classification'),
            children: (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoRow label="Marca" value={product.mark} />
                <InfoRow label="Modelo" value={product.model} />
                <InfoRow label="Talla" value={product.size} />
                <InfoRow label="Color" value={product.color} />
                <InfoRow label="Tipo" value={getProductTypeLabel(product.product_type)} />
                <InfoRow label="Código IVA Venta" value={`${getTaxCodeLabel(product.sale_tax_code)} (${product.sale_tax_code})`} />
                <InfoRow label="Código IVA Compra" value={`${getTaxCodeLabel(product.buy_tax_code)} (${product.buy_tax_code})`} />
              </div>
            )
          })}

          {/* ✅ SECCIÓN 3: PRECIOS */}
          {Section({
            id: 'pricing',
            title: 'Precios',
            icon: DollarSign,
            isOpen: openSections.pricing,
            onToggle: () => toggleSection('pricing'),
            children: (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Precio Local (VES)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  {product.price_usd && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Precio Referencia USD</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${product.price_usd.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoRow label="Costo" value={product.cost ? formatCurrency(product.cost) : 'N/A'} />
                  <InfoRow label="Precio Máximo" value={product.maximum_price ? formatCurrency(product.maximum_price) : 'N/A'} />
                  <InfoRow label="Precio Oferta" value={product.offer_price ? formatCurrency(product.offer_price) : 'N/A'} />
                  <InfoRow label="Precio Mayor" value={product.higher_price ? formatCurrency(product.higher_price) : 'N/A'} />
                  <InfoRow label="Precio Mínimo" value={product.minimum_price ? formatCurrency(product.minimum_price) : 'N/A'} />
                  <InfoRow label="Tipo de Precio" value={getSalePriceTypeLabel(product.sale_price_type)} />
                </div>

                {/* Margen */}
                {product.cost && product.price && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Margen de Ganancia</p>
                        <div className="flex items-baseline space-x-2">
                          <span className={`text-2xl font-bold ${margin.color}`}>
                            {margin.percentage.toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-500">
                            ({formatCurrency(margin.profit)} por unidad)
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>Costo: {formatCurrency(product.cost)}</p>
                        <p>Precio: {formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* ✅ SECCIÓN 4: INVENTARIO */}
          {Section({
            id: 'inventory',
            title: 'Inventario',
            icon: Box,
            isOpen: openSections.inventory,
            onToggle: () => toggleSection('inventory'),
            children: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Stock Actual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {product.quantity || product.stock_quantity || 0}
                    </p>
                  </div>

                  <InfoRow label="Stock Mínimo" value={product.min_stock?.toString() || '0'} />
                  <InfoRow label="Stock Máximo" value={product.maximum_stock?.toString() || 'N/A'} />
                  <InfoRow
                    label="Stock Negativo"
                    value={product.allow_negative_stock ? 'Permitido' : 'No Permitido'}
                  />
                  <InfoRow label="Usa Serial" value={product.serialized ? 'Sí' : 'No'} />
                  <InfoRow label="Usa Lotes" value={product.use_lots ? 'Sí' : 'No'} />
                  <InfoRow label="Orden Lotes" value={product.lots_order === 0 ? 'PEPS' : product.lots_order === 1 ? 'PUPS' : 'Vencimiento'} />
                </div>
              </div>
            )
          })}

          {/* ✅ SECCIÓN 5: COSTEO */}
          {Section({
            id: 'costing',
            title: 'Costeo',
            icon: Scale,
            isOpen: openSections.costing,
            onToggle: () => toggleSection('costing'),
            children: (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow label="Tipo de Costeo" value={getCostingTypeLabel(product.costing_type)} />
                <InfoRow label="Costo Calculado" value={product.calculated_cost ? formatCurrency(product.calculated_cost) : 'N/A'} />
                <InfoRow label="Costo Promedio" value={product.average_cost ? formatCurrency(product.average_cost) : 'N/A'} />
              </div>
            )
          })}

          {/* ✅ SECCIÓN 6: DESCUENTOS */}
          {Section({
            id: 'discounts',
            title: 'Descuentos y Límites',
            icon: Percent,
            isOpen: openSections.discounts,
            onToggle: () => toggleSection('discounts'),
            children: (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoRow label="Descuento" value={product.discount ? `${product.discount}%` : '0%'} />
                <InfoRow label="Descuento Máximo" value={product.max_discount ? `${product.max_discount}%` : '0%'} />
                <InfoRow label="Venta Mínima" value={product.minimal_sale?.toString() || 'N/A'} />
                <InfoRow label="Venta Máxima" value={product.maximal_sale?.toString() || 'N/A'} />
              </div>
            )
          })}

          {/* ✅ SECCIÓN 7: CONFIGURACIÓN AVANZADA */}
          {Section({
            id: 'advanced',
            title: 'Configuración Avanzada',
            icon: Settings,
            isOpen: openSections.advanced,
            onToggle: () => toggleSection('advanced'),
            children: (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoRow label="Permitir Decimales" value={product.allow_decimal ? 'Sí' : 'No'} />
                <InfoRow label="Tipo Redondeo" value={product.rounding_type === 0 ? '0 decimales' : product.rounding_type === 2 ? '2 decimales' : '4 decimales'} />
                <InfoRow label="Editar Nombre" value={product.edit_name ? 'Sí' : 'No'} />
                <InfoRow label="Utilidad Depto" value={product.take_department_utility ? 'Sí' : 'No'} />
                <InfoRow label="Días Garantía" value={product.days_warranty ? `${product.days_warranty} días` : 'N/A'} />
                <InfoRow label="Estado" value={statusInfo.label} />
              </div>
            )
          })}

          {/* ✅ SECCIÓN 8: AUDITORÍA */}
          {Section({
            id: 'audit',
            title: 'Auditoría',
            icon: Calendar,
            isOpen: false,
            onToggle: () => toggleSection('audit'),
            children: (
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="ID" value={product.id.toString()} />
                <InfoRow label="Company ID" value={product.company_id?.toString()} />
                <InfoRow label="Creado" value={product.created_at ? formatDate(product.created_at) : 'N/A'} />
                <InfoRow label="Actualizado" value={product.updated_at ? formatDate(product.updated_at) : 'N/A'} />
              </div>
            )
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stock Status Card */}
          <div className={`bg-gradient-to-br ${stockStatus.bgColor} rounded-3xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado del Stock</h3>
              <stockStatus.icon className={`w-6 h-6 ${stockStatus.color}`} />
            </div>
            <p className={`text-3xl font-bold ${stockStatus.color} mb-2`}>
              {product.quantity || product.stock_quantity || 0}
            </p>
            <p className="text-sm text-gray-600">{stockStatus.status}</p>
            {product.min_stock && (
              <p className="text-xs text-gray-500 mt-2">
                Mínimo: {product.min_stock}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link
                href={`/products/${product.id}/edit`}
                className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Edit className="w-4 h-4 mr-2" />
                <span className="font-light">Editar Producto</span>
              </Link>

              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="font-light">Eliminar Producto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Componente reutilizable para secciones
const Section = ({
  id,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children
}: {
  id: string;
  title: string;
  icon: any;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>

    {isOpen && (
      <div className="p-6">
        {children}
      </div>
    )}
  </div>
);

// ✅ Componente para filas de información
const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-gray-900 font-medium">
      {value !== undefined && value !== null ? value : 'N/A'}
    </p>
  </div>
);

export default ProductDetailPage;

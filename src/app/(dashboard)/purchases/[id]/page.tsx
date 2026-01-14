'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Loader2,
  Printer,
  Download,
  Clock,
  Calendar,
  DollarSign,
  Truck,
  Mail,
  Phone,
  MapPin,
  Package,
  Building2
} from 'lucide-react';
import { purchasesAPI, suppliersAPI, warehousesAPI, productsAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PurchaseItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
}

interface Purchase {
  id: number;
  purchase_number: string;
  supplier_id: number;
  supplier?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  warehouse_id?: number;
  warehouse?: {
    id: number;
    name: string;
    location: string;
  };
  date: string;
  expected_delivery_date?: string;
  total_amount: number;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  items?: PurchaseItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface PurchaseDetailPageProps {
  params: {
    id: string;
  };
}

const PurchaseDetailPage = ({ params }: PurchaseDetailPageProps) => {
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchPurchase();
    }
  }, [params.id]);

  const fetchPurchase = async () => {
    try {
      setLoading(true);
      const response = await purchasesAPI.getById(Number(params.id));
      const purchaseData = response.data;

      console.log('Purchase data from API:', purchaseData);

      // Fetch supplier details if not included
      let supplierDetails = purchaseData.supplier;
      if (!supplierDetails && purchaseData.supplier_id) {
        try {
          const supplierResponse = await suppliersAPI.getById(purchaseData.supplier_id);
          supplierDetails = supplierResponse.data;
        } catch (error) {
          console.error('Error fetching supplier details:', error);
        }
      }

      // Fetch warehouse details if not included
      let warehouseDetails = purchaseData.warehouse;
      if (!warehouseDetails && purchaseData.warehouse_id) {
        try {
          const warehouseResponse = await warehousesAPI.getById(purchaseData.warehouse_id);
          warehouseDetails = warehouseResponse.data;
        } catch (error) {
          console.error('Error fetching warehouse details:', error);
        }
      }

      // Handle items - fetch product details if needed
      let items = purchaseData.items || [];
      if (items.length > 0) {
        items = await Promise.all(
          items.map(async (item: any) => {
            if (item.product_name) {
              return item;
            }
            // Fetch product details to get name
            try {
              const productResponse = await productsAPI.getById(item.product_id);
              return {
                ...item,
                product_name: productResponse.data.name
              };
            } catch (error) {
              console.error(`Error fetching product ${item.product_id}:`, error);
              return {
                ...item,
                product_name: `Producto ${item.product_id}`
              };
            }
          })
        );
      }

      // Combine all data
      const completePurchase: Purchase = {
        ...purchaseData,
        supplier: supplierDetails,
        warehouse: warehouseDetails,
        items: items
      };

      setPurchase(completePurchase);
    } catch (error: any) {
      console.error('Error fetching purchase:', error);
      setError('Error al cargar la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!purchase) return;

    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra? Esta acción no se puede deshacer.')) {
      try {
        await purchasesAPI.delete(purchase.id);
        router.push('/purchases');
      } catch (error) {
        console.error('Error deleting purchase:', error);
        alert('Error al eliminar la compra');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!purchase) return;

    try {
      // Create a simple text representation for download
      const content = `
ORDEN DE COMPRA: ${purchase.purchase_number}
========================================
Fecha: ${formatDate(purchase.date, 'long')}
Entrega Esperada: ${purchase.expected_delivery_date ? formatDate(purchase.expected_delivery_date, 'long') : 'N/A'}

PROVEEDOR
---------
${purchase.supplier?.name || 'N/A'}
${purchase.supplier?.email || ''}
${purchase.supplier?.phone || ''}
${purchase.supplier?.address || ''}

ALMACÉN
-------
${purchase.warehouse?.name || 'N/A'}
${purchase.warehouse?.location || ''}

ITEMS
-----
${purchase.items?.map(item =>
  `${item.product_name} x${item.quantity} - ${formatCurrency(item.price_per_unit)} = ${formatCurrency(item.total_price)}`
).join('\n') || 'No items'}

RESUMEN
------
TOTAL: ${formatCurrency(purchase.total_amount)}

Estado: ${purchase.status}
Notas: ${purchase.notes || 'N/A'}
      `.trim();

      // Create a Blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Compra_${purchase.purchase_number}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading purchase:', error);
      alert('Error al descargar la compra');
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { color: string; bg: string; icon: any; label: string }> = {
      'pending': { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, label: 'Pendiente' },
      'approved': { color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle, label: 'Aprobada' },
      'received': { color: 'text-green-600', bg: 'bg-green-100', icon: Package, label: 'Recibida' },
      'cancelled': { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, label: 'Cancelada' }
    };
    return statusMap[status] || statusMap['pending'];
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

  if (error || !purchase) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">Compra no encontrada</h3>
          <p className="text-gray-500 mb-6">
            {error || 'La compra que buscas no existe o fue eliminada.'}
          </p>
          <Link
            href="/purchases"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-light">Volver a Compras</span>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(purchase.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/purchases"
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {purchase.purchase_number}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm rounded-full ${statusInfo.bg} ${statusInfo.color} inline-flex items-center`}>
                  <StatusIcon className="w-3 h-3 mr-2" />
                  {statusInfo.label}
                </span>
                <p className="text-gray-500 font-light">
                  Creado: {formatDate(purchase.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
              title="Imprimir compra"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
              title="Descargar compra"
            >
              <Download className="w-5 h-5" />
            </button>
            <Link
              href={`/purchases/${purchase.id}/edit`}
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
          {/* Purchase Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Número de Compra
                  </p>
                  <p className="text-lg font-light text-gray-900">
                    {purchase.purchase_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Fecha de Compra
                  </p>
                  <p className="text-lg font-light text-gray-900">
                    {formatDate(purchase.date, 'long')}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Entrega Esperada
                  </p>
                  <p className="text-lg font-light text-gray-900">
                    {purchase.expected_delivery_date ? formatDate(purchase.expected_delivery_date, 'long') : '-'}
                  </p>
                </div>
              </div>

              {/* Supplier & Warehouse Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Proveedor
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-900 font-medium">{purchase.supplier?.name || '-'}</span>
                    </div>
                    {purchase.supplier?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-600">{purchase.supplier.email}</span>
                      </div>
                    )}
                    {purchase.supplier?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-600">{purchase.supplier.phone}</span>
                      </div>
                    )}
                    {purchase.supplier?.address && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <span className="text-gray-600">{purchase.supplier.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Almacén
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-900 font-medium">{purchase.warehouse?.name || '-'}</span>
                    </div>
                    {purchase.warehouse?.location && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <span className="text-gray-600">{purchase.warehouse.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Producto</th>
                    <th className="text-center py-4 px-6 font-medium text-gray-700">Cantidad</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">P. Unitario</th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchase.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">ID: {item.product_id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-900">
                        {formatCurrency(item.price_per_unit)}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-900">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {purchase.notes && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Notas</h3>
                <p className="text-gray-600">{purchase.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Estado</h3>
            </div>
            <div className="p-6">
              <div className={`flex items-center justify-center w-full py-6 px-4 rounded-2xl ${statusInfo.bg} mb-4`}>
                <StatusIcon className={`w-8 h-8 ${statusInfo.color} mr-3`} />
                <span className={`text-lg font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium text-gray-900">{purchase.items?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-2xl font-light text-purple-600">
                    {formatCurrency(purchase.total_amount)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href={`/purchases/${purchase.id}/edit`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="font-light">Editar Compra</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="font-light">Eliminar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Actividad</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">Compra creada</p>
                    <p className="text-xs text-gray-500">{formatDate(purchase.created_at)}</p>
                  </div>
                </div>
                {purchase.updated_at !== purchase.created_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-900">Última actualización</p>
                      <p className="text-xs text-gray-500">{formatDate(purchase.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetailPage;

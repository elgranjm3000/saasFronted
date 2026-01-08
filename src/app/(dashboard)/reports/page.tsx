'use client'
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { purchasesAPI, invoicesAPI, productsAPI, suppliersAPI, customersAPI, warehousesAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalPurchases: number;
  totalSales: number;
  totalProducts: number;
  totalSuppliers: number;
  totalCustomers: number;
  totalWarehouses: number;
  purchasesAmount: number;
  salesAmount: number;
  pendingPurchases: number;
  pendingInvoices: number;
  lowStockProducts: number;
}

interface RecentPurchase {
  id: number;
  purchase_number: string;
  date: string;
  total_amount: number;
  status: string;
  supplier?: { name: string };
}

interface RecentSale {
  id: number;
  invoice_number: string;
  date: string;
  total_amount: number;
  status: string;
  customer?: { name: string };
}

const ReportsPage = () => {
  const [stats, setStats] = useState<Stats>({
    totalPurchases: 0,
    totalSales: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalCustomers: 0,
    totalWarehouses: 0,
    purchasesAmount: 0,
    salesAmount: 0,
    pendingPurchases: 0,
    pendingInvoices: 0,
    lowStockProducts: 0
  });
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        purchasesResponse,
        invoicesResponse,
        productsResponse,
        suppliersResponse,
        customersResponse,
        warehousesResponse
      ] = await Promise.all([
        purchasesAPI.getAll({ limit: 100 }),
        invoicesAPI.getAll({ limit: 100 }),
        productsAPI.getAll({ limit: 100 }),
        suppliersAPI.getAll({ limit: 100 }),
        customersAPI.getAll({ limit: 100 }),
        warehousesAPI.getAll({ limit: 100 })
      ]);

      const purchases = purchasesResponse.data || [];
      const invoices = invoicesResponse.data || [];
      const products = productsResponse.data || [];
      const suppliers = suppliersResponse.data || [];
      const customers = customersResponse.data || [];
      const warehouses = warehousesResponse.data || [];

      // Filter by date range if needed
      const filteredPurchases = filterByDate(purchases);
      const filteredInvoices = filterByDate(invoices);

      // Load supplier and customer details
      const purchasesWithDetails = await Promise.all(
        filteredPurchases.slice(0, 5).map(async (purchase: any) => {
          try {
            const supplierResponse = await suppliersAPI.getById(purchase.supplier_id);
            return {
              ...purchase,
              supplier: supplierResponse.data
            };
          } catch {
            return purchase;
          }
        })
      );

      const invoicesWithDetails = await Promise.all(
        filteredInvoices.slice(0, 5).map(async (invoice: any) => {
          try {
            const customerResponse = await customersAPI.getById(invoice.customer_id);
            return {
              ...invoice,
              customer: customerResponse.data
            };
          } catch {
            return invoice;
          }
        })
      );

      setRecentPurchases(purchasesWithDetails);
      setRecentSales(invoicesWithDetails);

      // Calculate stats
      const newStats: Stats = {
        totalPurchases: filteredPurchases.length,
        totalSales: filteredInvoices.length,
        totalProducts: products.length,
        totalSuppliers: suppliers.length,
        totalCustomers: customers.length,
        totalWarehouses: warehouses.length,
        purchasesAmount: filteredPurchases.reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0),
        salesAmount: filteredInvoices.reduce((sum: number, i: any) => sum + (i.total_amount || 0), 0),
        pendingPurchases: filteredPurchases.filter((p: any) => p.status === 'pending').length,
        pendingInvoices: filteredInvoices.filter((i: any) => i.status === 'pending').length,
        lowStockProducts: products.filter((p: any) => p.stock_quantity < 10).length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (items: any[]) => {
    if (dateRange === 'all') return items;

    const now = new Date();
    const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    return items.filter((item: any) => {
      const itemDate = new Date(item.date);
      return itemDate >= cutoffDate;
    });
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    trendValue
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-2xl font-light text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 font-light">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-3">Reportes y Estadísticas</h1>
            <p className="text-gray-500 font-light text-lg">
              Vista general del rendimiento de tu negocio
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white/80 border border-gray-200/60 rounded-2xl p-1">
              {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-xl transition-all font-light text-sm ${
                    dateRange === range
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range === '7d' ? '7 días' : range === '30d' ? '30 días' : range === '90d' ? '90 días' : 'Todo'}
                </button>
              ))}
            </div>
            <button className="flex items-center px-4 py-3 text-gray-600 bg-white/80 border border-gray-200/60 rounded-2xl hover:bg-white hover:border-gray-300 transition-all">
              <Download className="w-4 h-4 mr-2" />
              <span className="font-light">Exportar</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ventas Totales"
            value={formatCurrency(stats.salesAmount)}
            subtitle={`${stats.totalSales} facturas`}
            icon={DollarSign}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Compras Totales"
            value={formatCurrency(stats.purchasesAmount)}
            subtitle={`${stats.totalPurchases} órdenes`}
            icon={ShoppingCart}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Productos"
            value={stats.totalProducts}
            subtitle={`${stats.lowStockProducts} con stock bajo`}
            icon={Package}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Clientes Activos"
            value={stats.totalCustomers}
            subtitle={`${stats.totalSuppliers} proveedores`}
            icon={Users}
            color="from-orange-500 to-orange-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Purchases */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Compras Recientes</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{stats.pendingPurchases} pendientes</span>
            </div>
          </div>

          <div className="space-y-4">
            {recentPurchases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay compras recientes</p>
              </div>
            ) : (
              recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{purchase.purchase_number}</p>
                        <p className="text-sm text-gray-500">{purchase.supplier?.name || 'Proveedor'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(purchase.total_amount)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Ventas Recientes</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{stats.pendingInvoices} pendientes</span>
            </div>
          </div>

          <div className="space-y-4">
            {recentSales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay ventas recientes</p>
              </div>
            ) : (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sale.invoice_number}</p>
                        <p className="text-sm text-gray-500">{sale.customer?.name || 'Cliente'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(sale.total_amount)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Acciones Pendientes</h2>

          <div className="space-y-4">
            {stats.pendingPurchases > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Compras Pendientes</p>
                    <p className="text-sm text-gray-500">Requieren aprobación</p>
                  </div>
                </div>
                <span className="text-lg font-medium text-yellow-600">{stats.pendingPurchases}</span>
              </div>
            )}

            {stats.pendingInvoices > 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Facturas Pendientes</p>
                    <p className="text-sm text-gray-500">Esperando pago</p>
                  </div>
                </div>
                <span className="text-lg font-medium text-blue-600">{stats.pendingInvoices}</span>
              </div>
            )}

            {stats.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Stock Bajo</p>
                    <p className="text-sm text-gray-500">Productos con menos de 10 unidades</p>
                  </div>
                </div>
                <span className="text-lg font-medium text-red-600">{stats.lowStockProducts}</span>
              </div>
            )}

            {stats.pendingPurchases === 0 && stats.pendingInvoices === 0 && stats.lowStockProducts === 0 && (
              <div className="text-center py-8 text-green-600">
                <p className="font-medium">¡Todo al día!</p>
                <p className="text-sm">No hay acciones pendientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Warehouse Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Resumen de Almacenes</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Almacenes</p>
                  <p className="text-sm text-gray-500">Ubicaciones activas</p>
                </div>
              </div>
              <span className="text-lg font-medium text-gray-900">{stats.totalWarehouses}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-light text-purple-900">{stats.purchasesAmount > 0 ? formatCurrency(stats.purchasesAmount / stats.totalWarehouses) : '$0'}</p>
                <p className="text-xs text-purple-700 mt-1">Promedio Compras</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
                <p className="text-2xl font-light text-green-900">{stats.salesAmount > 0 ? formatCurrency(stats.salesAmount / stats.totalWarehouses) : '$0'}</p>
                <p className="text-xs text-green-700 mt-1">Promedio Ventas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

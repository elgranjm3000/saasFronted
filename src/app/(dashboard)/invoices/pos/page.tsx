'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  X,
  Package,
  CreditCard,
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  LayoutGrid,
  List,
  Building2
} from 'lucide-react';
import { invoicesAPI, customersAPI, productsAPI, warehousesAPI, warehouseProductsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { extractErrorMessage } from '@/lib/errorHandler';

interface Warehouse {
  id: number;
  name: string;
  address?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  description?: string;
  image?: string;
  stock_quantity?: number;
  category_name?: string;
  // Warehouse product specific fields
  quantity?: number;
  min_stock?: number;
  max_stock?: number;
  cost?: number;
  warehouse_id?: number;
  product_id?: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const POSPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [showWarehouseSelector, setShowWarehouseSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch products for selected warehouse
  useEffect(() => {
    if (selectedWarehouse) {
      fetchProductsForWarehouse(selectedWarehouse.id);
    }
  }, [selectedWarehouse]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const [customersRes, warehousesRes] = await Promise.all([
        customersAPI.getAll(),
        warehousesAPI.getAll()
      ]);
      setCustomers(customersRes.data || []);
      setWarehouses(warehousesRes.data || []);

      // Auto-select first warehouse if available
      if (warehousesRes.data && warehousesRes.data.length > 0) {
        const firstWarehouse = warehousesRes.data[0];
        setSelectedWarehouse(firstWarehouse);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors({ general: 'Error al cargar los datos' });
      // Set empty arrays as fallback
      setCustomers([]);
      setWarehouses([]);
      setProducts([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchProductsForWarehouse = async (warehouseId: number) => {
    try {
      // Get warehouse-products: [{warehouse_id, product_id, stock}, ...]
      const warehouseProductsResponse = await warehousesAPI.getProducts(warehouseId);
      const warehouseProducts = warehouseProductsResponse.data || [];

      // Fetch complete product details for each product_id
      const productsWithStock = await Promise.all(
        warehouseProducts.map(async (wp: any) => {
          try {
            const productResponse = await productsAPI.getById(wp.product_id);
            const product = productResponse.data;

            // Combine product details with warehouse stock
            return {
              ...product,
              stock_quantity: wp.stock, // Use warehouse stock
              warehouse_id: wp.warehouse_id
            };
          } catch (error) {
            console.error(`Error fetching product ${wp.product_id}:`, error);
            return null;
          }
        })
      );

      // Filter out null values and set products
      const validProducts = productsWithStock.filter(p => p !== null);
      setProducts(validProducts);
    } catch (error) {
      console.error('Error fetching products for warehouse:', error);
      setProducts([]);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * 0.16; // 16% IVA
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      setErrors({ customer: 'Debes seleccionar un cliente' });
      return;
    }

    if (!selectedWarehouse) {
      setErrors({ warehouse: 'Debes seleccionar un almacén' });
      return;
    }

    if (cart.length === 0) {
      setErrors({ items: 'El carrito está vacío' });
      return;
    }

    try {
      setLoading(true);

      const invoiceData = {
        customer_id: selectedCustomer.id,
        warehouse_id: selectedWarehouse.id,
        status: 'factura',
        discount: 0,
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        })),
        notes: 'Venta desde POS',
        payment_terms: '0'
      };

      await invoicesAPI.create(invoiceData);

      setSuccess(true);

      // Update stock for each product
      console.log('Updating stock for products...');
      for (const item of cart) {
        await updateProductStock(
          item.product.id,
          selectedWarehouse.id,
          item.quantity
        );
      }

      // Refresh products to show updated stock
      await fetchProductsForWarehouse(selectedWarehouse.id);

      // Reset everything after 2 seconds
      setTimeout(() => {
        setCart([]);
        setSelectedCustomer(null);
        // Don't reset warehouse as it's likely the same for next sale
        setSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      setErrors({ general: extractErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = (products || []).filter(p =>
    p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = (customers || []).filter(c =>
    c?.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c?.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const { subtotal, tax, total } = calculateTotals();

  const updateProductStock = async (productId: number, warehouseId: number, quantitySold: number) => {
    try {
      // Get current stock
      const currentStockResponse = await warehouseProductsAPI.getByWarehouseAndProduct(warehouseId, productId);
      const currentStock = currentStockResponse.data;

      // Calculate new stock
      const newQuantity = (currentStock?.quantity || 0) - quantitySold;

      // Update stock using POST /api/v1/warehouse-products
      await warehouseProductsAPI.createOrUpdate({
        warehouse_id: warehouseId,
        product_id: productId,
        stock: newQuantity
      });

      console.log(`Stock updated: Product ${productId}, Warehouse ${warehouseId}, New quantity: ${newQuantity}`);
    } catch (error) {
      console.error('Error updating product stock:', error);
      // Don't throw error, just log it - invoice creation should still succeed
    }
  };

  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/invoices"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-light text-gray-900">Punto de Venta</h1>
              <p className="text-sm text-gray-500">Sistema de ventas rápidas</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              title={viewMode === 'grid' ? 'Vista de lista' : 'Vista de grid'}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mx-6 mt-4 bg-green-50/80 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-600 font-medium">Venta realizada correctamente</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mx-6 mt-4 bg-red-50/80 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Product count indicator */}
            {filteredProducts.length > 0 && (
              <div className="mb-4 text-sm text-gray-500">
                Mostrando <span className="font-medium text-gray-900">{filteredProducts.length}</span> productos
                {selectedWarehouse && (
                  <span> en <span className="font-medium text-gray-900">{selectedWarehouse.name}</span></span>
                )}
              </div>
            )}

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white rounded-2xl p-4 hover:shadow-lg hover:scale-105 transition-all border border-gray-100 group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(product.price)}
                      </span>
                      {product.stock_quantity !== undefined && (
                        <span className="text-xs text-gray-500">
                          Stock: {product.stock_quantity}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(product.price)}
                      </span>
                      {product.stock_quantity !== undefined && (
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock_quantity}
                        </span>
                      )}
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? 'Intenta con otro término de búsqueda'
                    : selectedWarehouse
                    ? `No hay productos disponibles en ${selectedWarehouse.name}`
                    : 'Cargando productos...'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Customer Selection */}
          <div className="p-4 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <button
              onClick={() => setShowCustomerSelector(!showCustomerSelector)}
              className={`w-full px-4 py-3 text-left rounded-xl border transition-colors flex items-center justify-between ${
                errors.customer
                  ? 'border-red-300 bg-red-50'
                  : selectedCustomer
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className={selectedCustomer ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                {selectedCustomer ? selectedCustomer.name : 'Seleccionar cliente...'}
              </span>
              <User className="w-4 h-4 text-gray-400" />
            </button>

            {errors.customer && (
              <p className="mt-2 text-sm text-red-600">{errors.customer}</p>
            )}

            {showCustomerSelector && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowCustomerSelector(false);
                        setCustomerSearch('');
                        setErrors(prev => ({ ...prev, customer: '' }));
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </button>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No se encontraron clientes
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Warehouse Selection */}
          <div className="p-4 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Almacén
            </label>
            <button
              onClick={() => setShowWarehouseSelector(!showWarehouseSelector)}
              className={`w-full px-4 py-3 text-left rounded-xl border transition-colors flex items-center justify-between ${
                errors.warehouse
                  ? 'border-red-300 bg-red-50'
                  : selectedWarehouse
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className={selectedWarehouse ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                {selectedWarehouse ? selectedWarehouse.name : 'Seleccionar almacén...'}
              </span>
              <Building2 className="w-4 h-4 text-gray-400" />
            </button>

            {errors.warehouse && (
              <p className="mt-2 text-sm text-red-600">{errors.warehouse}</p>
            )}

            {showWarehouseSelector && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  {warehouses.map(warehouse => (
                    <button
                      key={warehouse.id}
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setShowWarehouseSelector(false);
                        setErrors(prev => ({ ...prev, warehouse: '' }));
                        // Clear entire cart when switching warehouses since products are warehouse-specific
                        setCart([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{warehouse.name}</p>
                      {warehouse.address && (
                        <p className="text-sm text-gray-500">{warehouse.address}</p>
                      )}
                    </button>
                  ))}
                  {warehouses.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No hay almacenes disponibles
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Carrito vacío</h3>
                <p className="text-gray-500 text-sm">Agrega productos para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.product.sku}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.product.price)} c/u
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (16%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0 || !selectedCustomer}
                className="flex-1 flex items-center justify-center px-4 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    <span className="font-bold">Cobrar</span>
                  </>
                )}
              </button>

              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="px-4 py-4 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              <span className="font-medium">{cart.length}</span> productos en el carrito
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPage;

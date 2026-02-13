'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Building2,
  Search,
  Plus
} from 'lucide-react';
import { warehousesAPI, productsAPI, warehouseProductsAPI } from '@/lib/api';
import { extractErrorMessage } from '@/lib/errorHandler';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  description?: string;
}

interface Warehouse {
  id: number;
  name: string;
  location: string;
}

interface AddProductPageProps {
  params: {
    id: string;
  };
}

const AddProductToWarehousePage = ({ params }: AddProductPageProps) => {
  const router = useRouter();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  useEffect(() => {
    if (search) {
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [search, allProducts]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch warehouse details
      const warehouseRes = await warehousesAPI.getById(Number(params.id));
      setWarehouse(warehouseRes.data);

      // Fetch all products
      const productsRes = await productsAPI.getAll();

      // Fetch products already in warehouse to filter them out
      const warehouseProductsRes = await warehousesAPI.getProducts(Number(params.id));
      const warehouseProductIds = new Set(
        (warehouseProductsRes.data || []).map((wp: any) => wp.product_id)
      );

      // Filter out products already in warehouse
      const availableProducts = (productsRes.data || [])
        .filter((p: Product) => !warehouseProductIds.has(p.id));

      setAllProducts(availableProducts);
      setFilteredProducts(availableProducts);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !warehouse) return;

    if (stock < 0) {
      setError('El stock debe ser mayor o igual a 0');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Add product to warehouse using warehouse-products API
      await warehouseProductsAPI.createOrUpdate({
        warehouse_id: warehouse.id,
        product_id: selectedProduct.id,
        stock: stock
      });

      setSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        router.push(`/warehouses/${warehouse.id}`);
      }, 2000);

    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Depósito no encontrado</h2>
          <Link
            href="/warehouses"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Depósitos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/warehouses/${warehouse.id}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Depósito
          </Link>

          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Agregar Producto a {warehouse.name}
          </h1>
          <p className="text-gray-600 flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            {warehouse.location}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-700 font-medium">Producto agregado correctamente</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Seleccionar Producto</h2>
            <p className="text-gray-600 text-sm mt-1">
              Busca y selecciona un producto para agregarlo a este depósito
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Search & Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto
              </label>

              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Product List */}
              <div className="border border-gray-200 rounded-xl max-h-64 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors ${
                        selectedProduct?.id === product.id
                          ? 'bg-blue-50 border-l-4 border-l-blue-500'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 font-mono">{product.sku}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      {search
                        ? 'No se encontraron productos'
                        : 'No hay productos disponibles para agregar'}
                    </p>
                    {search && (
                      <p className="text-sm text-gray-400 mt-1">
                        Intenta con otro término de búsqueda
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stock Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Inicial
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min="0"
                placeholder="Cantidad de stock inicial"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedProduct}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Link
                href={`/warehouses/${warehouse.id}`}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={!selectedProduct || saving}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Agregar Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start">
            <Package className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Información</p>
              <p className="text-sm text-blue-700 mt-1">
                Solo se muestran productos que aún no están agregados a este depósito.
                Si necesitas agregar un producto que ya existe, primero elimínalo del depósito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductToWarehousePage;

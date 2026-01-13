'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
  DollarSign,
  Hash,
  Tag,
  FileText,
  Warehouse
} from 'lucide-react';
import { productsAPI, warehouseProductsAPI } from '@/lib/api';
import { generateSKU, formatCurrency } from '@/lib/utils';
import { useProductForm } from '@/hooks/useProductForm';
import { extractErrorMessage } from '@/lib/errorHandler';

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: string;
  cost: string;
  stock_quantity: string;
  min_stock: string;
  category_id: string;
  warehouse_id: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost?: number;
  stock_quantity?: number;
  min_stock?: number;
  category?: {
    id: number;
    name: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
}

const ProductFormPage = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    sku: '',
    price: '',
    cost: '',
    stock_quantity: '',
    min_stock: '10',
    category_id: '',
    warehouse_id: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const params = useParams();
  const { warehouses, categories, loading: formLoading } = useProductForm();

  // Determinar si estamos editando o creando
  const isEdit = params?.id && params.id !== 'new';
  const productId = isEdit ? Number(params.id) : null;

  useEffect(() => {
    if (isEdit && productId) {
      fetchProduct();
    } else {
      // Generate SKU for new product
      setFormData(prev => ({
        ...prev,
        sku: generateSKU('PROD')
      }));
    }
  }, [isEdit, productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setInitialLoading(true);
      const response = await productsAPI.getById(productId);
      const product: Product = response.data;

      setFormData({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        cost: product.cost?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        min_stock: product.min_stock?.toString() || '10',
        category_id: product.category?.id?.toString() || '',
        warehouse_id: product.warehouse?.id?.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setErrors({ general: 'Error al cargar el producto' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'El precio debe ser un número válido mayor o igual a 0';
    }

    if (!formData.stock_quantity.trim()) {
      newErrors.stock_quantity = 'El stock es requerido';
    } else if (isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'El stock debe ser un número válido mayor o igual a 0';
    }

    if (formData.cost && (isNaN(Number(formData.cost)) || Number(formData.cost) < 0)) {
      newErrors.cost = 'El costo debe ser un número válido mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        sku: formData.sku.trim(),
        price: Number(formData.price),
        cost: formData.cost ? Number(formData.cost) : undefined,
        stock_quantity: Number(formData.stock_quantity),
        min_stock: Number(formData.min_stock),
        category_id: formData.category_id ? Number(formData.category_id) : undefined
      };

      console.log('Submitting product data:', submitData);

      if (isEdit && productId) {
        console.log('Updating product:', productId);
        const response = await productsAPI.update(productId, submitData);
        console.log('Update response:', response.data);

        // Update warehouse product entry if warehouse_id is specified
        if (formData.warehouse_id) {
          console.log('Updating warehouse product entry...');
          try {
            await warehouseProductsAPI.createOrUpdate({
              warehouse_id: Number(formData.warehouse_id),
              product_id: productId,
              stock: Number(formData.stock_quantity)
            });
            console.log('Warehouse product entry updated successfully');
          } catch (warehouseError) {
            console.error('Error updating warehouse product:', warehouseError);
            // Don't fail the entire operation if warehouse update fails
          }
        }
      } else {
        console.log('Creating new product...');
        const response = await productsAPI.create(submitData);
        const createdProduct = response.data;
        console.log('Created product:', createdProduct);

        // Create warehouse product entry if warehouse_id is specified
        if (formData.warehouse_id && createdProduct?.id) {
          console.log('Creating warehouse product entry...');
          try {
            await warehouseProductsAPI.createOrUpdate({
              warehouse_id: Number(formData.warehouse_id),
              product_id: createdProduct.id,
              stock: Number(formData.stock_quantity)
            });
            console.log('Warehouse product entry created successfully');
          } catch (warehouseError) {
            console.error('Error creating warehouse product:', warehouseError);
            // Don't fail the entire operation if warehouse update fails
          }
        }
      }

      setSuccess(true);

      setTimeout(() => {
        if (isEdit) {
          router.push(`/products/${productId}`);
        } else {
          router.push('/products');
        }
      }, 1500);

    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error response:', error.response?.data);
      setErrors({ general: extractErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const generateNewSKU = () => {
    setFormData(prev => ({
      ...prev,
      sku: generateSKU('PROD')
    }));
  };

  if (initialLoading) {
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
          <div className="flex items-center space-x-4">
            <Link
              href={isEdit ? `/products/${productId}` : '/products'}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
              </h1>
              <p className="text-gray-500 font-light">
                {isEdit ? 'Modifica la información del producto' : 'Completa la información para crear un nuevo producto'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-8 bg-green-50/80 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-600 font-medium">
              {isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente'}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-8 bg-red-50/80 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-light text-gray-900">Información Básica</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre del Producto *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="Ej: Laptop Dell Inspiron 15"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Descripción
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                      placeholder="Descripción detallada del producto..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    SKU *
                  </label>
                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none font-mono ${
                          errors.sku ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                        }`}
                        placeholder="PROD-123456-001"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateNewSKU}
                      className="px-4 py-3 text-gray-600 bg-gray-50/80 border border-gray-200/60 rounded-2xl hover:bg-white hover:border-gray-300 transition-all"
                    >
                      Generar
                    </button>
                  </div>
                  {errors.sku && (
                    <p className="mt-2 text-sm text-red-600">{errors.sku}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-light text-gray-900">Precios e Inventario</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Precio de Venta *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                          errors.price ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Costo del Producto
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                          errors.cost ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.cost && (
                      <p className="mt-2 text-sm text-red-600">{errors.cost}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Stock Inicial *
                    </label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                          errors.stock_quantity ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                        }`}
                        placeholder="0"
                      />
                    </div>
                    {errors.stock_quantity && (
                      <p className="mt-2 text-sm text-red-600">{errors.stock_quantity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Stock Mínimo
                    </label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        name="min_stock"
                        value={formData.min_stock}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-light text-gray-900">Ubicación</h3>
              </div>
              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Almacén
                  </label>
                  <div className="relative">
                    <Warehouse className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="warehouse_id"
                      value={formData.warehouse_id}
                      onChange={handleInputChange}
                      disabled={formLoading}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Seleccionar almacén</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formLoading && (
                    <p className="mt-2 text-sm text-gray-500">Cargando almacenes...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-light text-gray-900">Categorización</h3>
              </div>
              <div className="p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categoría
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      disabled={formLoading}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formLoading && (
                    <p className="mt-2 text-sm text-gray-500">Cargando categorías...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href={isEdit ? `/products/${productId}` : '/products'}
                className="px-6 py-3 text-gray-600 bg-white/80 border border-gray-200/60 rounded-2xl hover:bg-white hover:border-gray-300 transition-all font-light"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                <span className="font-light">
                  {loading ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Vista Previa</h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {formData.name || 'Nombre del producto'}
                </h4>
                <p className="text-sm text-gray-500 font-mono">
                  {formData.sku || 'SKU'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Precio</span>
                  <span className="font-medium text-gray-900">
                    ${formData.price || '0.00'}
                  </span>
                </div>
                {formData.cost && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Costo</span>
                    <span className="font-medium text-gray-900">
                      ${formData.cost}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock</span>
                  <span className="font-medium text-gray-900">
                    {formData.stock_quantity || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Stock Mínimo</span>
                  <span className="font-medium text-gray-900">
                    {formData.min_stock || '10'}
                  </span>
                </div>
                {formData.price && formData.cost && (
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Margen</span>
                    <span className="font-medium text-gray-900">
                      {((Number(formData.price) - Number(formData.cost)) / Number(formData.price) * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                {formData.price && formData.stock_quantity && (
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Valor Total</span>
                    <span className="font-medium text-gray-900">
                      ${(Number(formData.price) * Number(formData.stock_quantity)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Consejos</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nombre descriptivo</p>
                    <p className="text-xs text-gray-500">
                      Usa un nombre claro que identifique fácilmente el producto
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">SKU único</p>
                    <p className="text-xs text-gray-500">
                      Cada producto debe tener un código único para el inventario
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Precio competitivo</p>
                    <p className="text-xs text-gray-500">
                      Investiga precios del mercado antes de establecer el tuyo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;

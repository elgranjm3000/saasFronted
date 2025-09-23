import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X
} from 'lucide-react';

const ProductsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    cost: '',
    category: '',
    stock: '',
    min_stock: ''
  });

  // Mock data de productos
  const products = [
    {
      id: 1,
      name: 'Laptop Dell Inspiron 15',
      sku: 'LAPTOP-DELL-001',
      category: 'Electrónicos',
      price: 850.00,
      cost: 650.00,
      stock: 25,
      min_stock: 5,
      status: 'active',
      last_updated: '2024-01-15',
      image: null
    },
    {
      id: 2,
      name: 'Mouse Inalámbrico Logitech',
      sku: 'MOUSE-LOG-002',
      category: 'Accesorios',
      price: 35.00,
      cost: 20.00,
      stock: 3,
      min_stock: 10,
      status: 'active',
      last_updated: '2024-01-14',
      image: null
    },
    {
      id: 3,
      name: 'Teclado Mecánico RGB',
      sku: 'KEYBOARD-RGB-003',
      category: 'Accesorios',
      price: 120.00,
      cost: 80.00,
      stock: 15,
      min_stock: 5,
      status: 'active',
      last_updated: '2024-01-13',
      image: null
    },
    {
      id: 4,
      name: 'Monitor 24" Full HD',
      sku: 'MONITOR-24-004',
      category: 'Electrónicos',
      price: 180.00,
      cost: 130.00,
      stock: 0,
      min_stock: 3,
      status: 'inactive',
      last_updated: '2024-01-12',
      image: null
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Crear producto:', formData);
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      sku: '',
      price: '',
      cost: '',
      category: '',
      stock: '',
      min_stock: ''
    });
  };

  const getStockStatus = (product) => {
    if (product.stock === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-100', label: 'Agotado' };
    if (product.stock <= product.min_stock) return { status: 'low', color: 'text-orange-600', bg: 'bg-orange-100', label: 'Stock Bajo' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100', label: 'En Stock' };
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
              <p className="text-slate-600 mt-1">Gestiona tu inventario y catálogo de productos</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Productos</p>
                <p className="text-2xl font-bold text-slate-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Valor del Inventario</p>
                <p className="text-2xl font-bold text-slate-900">$24,350</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Agotados</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar productos por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
              
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Todas las categorías</option>
                <option>Electrónicos</option>
                <option>Accesorios</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Producto</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">SKU</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Categoría</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Precio</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Stock</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Estado</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="py-4 px-6">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-mono text-sm">
                        {product.sku}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-900 mr-2">
                            {product.stock}
                          </span>
                          {product.stock <= product.min_stock && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-sm rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">4</span> de{' '}
                <span className="font-medium">4</span> productos
              </p>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-white transition-colors">
                  Anterior
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded-md text-sm hover:bg-white transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Nuevo Producto</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Laptop Dell Inspiron"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: LAPTOP-DELL-001"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción detallada del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Software">Software</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio de Venta *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Costo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock Inicial *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="min_stock"
                    value={formData.min_stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
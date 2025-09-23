import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  FileText, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  Truck,
  Settings, 
  Menu, 
  X, 
  Bell, 
  Search, 
  User,
  LogOut,
  Building2,
  ChevronDown,
  Home,
  TrendingUp,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Package, label: 'Productos', href: '/products' },
    { icon: FileText, label: 'Facturas', href: '/invoices' },
    { icon: ShoppingCart, label: 'Compras', href: '/purchases' },
    { icon: Warehouse, label: 'Almacenes', href: '/warehouses' },
    { icon: Users, label: 'Clientes', href: '/customers' },
    { icon: Truck, label: 'Proveedores', href: '/suppliers' },
    { icon: BarChart3, label: 'Reportes', href: '/reports' },
    { icon: Settings, label: 'Configuración', href: '/settings' },
  ];

  const statsCards = [
    {
      title: 'Ventas del Mes',
      value: '$45,230',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Productos',
      value: '1,248',
      change: '+23',
      changeType: 'positive',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Facturas Pendientes',
      value: '12',
      change: '-3',
      changeType: 'negative',
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      title: 'Stock Bajo',
      value: '8',
      change: '+2',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Nueva venta - Factura #001234', time: '2 min ago' },
    { id: 2, type: 'product', description: 'Producto "Laptop Dell" agregado', time: '15 min ago' },
    { id: 3, type: 'purchase', description: 'Compra #PUR-5678 completada', time: '1 hour ago' },
    { id: 4, type: 'warning', description: 'Stock bajo en 3 productos', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ERP System</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Company Info at bottom of sidebar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Mi Empresa S.A.</p>
                <p className="text-xs text-slate-500">Plan Professional</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-slate-500 hover:text-slate-700 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-slate-900 lg:ml-0">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-400 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block font-medium text-slate-700">Admin User</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      Mi Perfil
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      Configuración
                    </a>
                    <hr className="my-1 border-slate-200" />
                    <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <div className="flex items-center">
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              ¡Bienvenido de vuelta!
            </h2>
            <p className="text-slate-600">
              Aquí tienes un resumen de la actividad de tu empresa hoy.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {card.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        card.changeType === 'positive' ? 'text-green-500' : 
                        card.changeType === 'negative' ? 'text-red-500' : 'text-orange-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        card.changeType === 'positive' ? 'text-green-600' : 
                        card.changeType === 'negative' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {card.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Actividad Reciente
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Acciones Rápidas
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Nueva Factura
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Package className="w-4 h-4 mr-2" />
                    Agregar Producto
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Users className="w-4 h-4 mr-2" />
                    Nuevo Cliente
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Estado del Sistema
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Base de Datos</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Conectado
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">API Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Operativo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Último Backup</span>
                      <span className="text-xs text-slate-500">Hace 2 horas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
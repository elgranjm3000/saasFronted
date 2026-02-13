'use client'
import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Building2,
  Bell,
  Lock,
  Globe,
  Database,
  CreditCard,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  FileText,
  Shield,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency } from '@/lib/utils';

interface CompanySettings {
  name: string;
  tax_id: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
}

interface UserSettings {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface SystemSettings {
  default_currency: string;
  default_warehouse: number | null;
  low_stock_threshold: number;
  invoice_prefix: string;
  purchase_prefix: string;
  date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timezone: string;
}

interface NotificationSettings {
  email_low_stock: boolean;
  email_pending_invoices: boolean;
  email_pending_purchases: boolean;
  email_new_orders: boolean;
  browser_notifications: boolean;
}

const SettingsPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'company' | 'user' | 'notifications' | 'system'>('company');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Company settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: user?.company?.name || '',
    tax_id: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postal_code: ''
  });

  // User settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: ''
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    default_currency: 'USD',
    default_warehouse: null,
    low_stock_threshold: 10,
    invoice_prefix: 'INV',
    purchase_prefix: 'PO',
    date_format: 'DD/MM/YYYY',
    timezone: 'America/Lima'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_low_stock: true,
    email_pending_invoices: true,
    email_pending_purchases: true,
    email_new_orders: false,
    browser_notifications: false
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: 'Error al guardar configuración' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: 'Error al guardar configuración' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: 'Error al guardar configuración' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: 'Error al guardar configuración' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Empresa', icon: Building2 },
    { id: 'user', label: 'Mi Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'system', label: 'Sistema', icon: Settings }
  ] as const;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-3">Configuración</h1>
        <p className="text-gray-500 font-light text-lg">
          Gestiona la configuración de tu cuenta y sistema
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-900 font-medium">Configuración guardada exitosamente</p>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-900 font-medium">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-4 sticky top-8">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Company Settings */}
          {activeTab === 'company' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-gray-900 mb-2">Configuración de Empresa</h2>
                <p className="text-gray-500">Información de tu empresa para facturas y documentos</p>
              </div>

              <form onSubmit={handleSaveCompany} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RIF *
                    </label>
                    <input
                      type="text"
                      value={companySettings.tax_id}
                      onChange={(e) => setCompanySettings({ ...companySettings, tax_id: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                        className="w-full pl-12 px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        className="w-full pl-12 px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                        className="w-full pl-12 px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={companySettings.city}
                      onChange={(e) => setCompanySettings({ ...companySettings, city: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      value={companySettings.country}
                      onChange={(e) => setCompanySettings({ ...companySettings, country: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={companySettings.postal_code}
                      onChange={(e) => setCompanySettings({ ...companySettings, postal_code: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User Settings */}
          {activeTab === 'user' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-gray-900 mb-2">Mi Perfil</h2>
                <p className="text-gray-500">Información de tu cuenta de usuario</p>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-6">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-light shadow-lg">
                    {userSettings.first_name[0]}{userSettings.last_name[0]}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="px-4 py-2 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors font-medium"
                    >
                      Cambiar Foto
                    </button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG o GIF. Máximo 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={userSettings.first_name}
                      onChange={(e) => setUserSettings({ ...userSettings, first_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={userSettings.last_name}
                      onChange={(e) => setUserSettings({ ...userSettings, last_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Cambiar Contraseña
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-gray-900 mb-2">Configuración de Notificaciones</h2>
                <p className="text-gray-500">Elige qué notificaciones deseas recibir</p>
              </div>

              <form onSubmit={handleSaveNotifications} className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Notificaciones por Email
                  </h3>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">Stock Bajo</p>
                        <p className="text-sm text-gray-500">Recibe alertas cuando productos tengan poco stock</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_low_stock}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, email_low_stock: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">Facturas Pendientes</p>
                        <p className="text-sm text-gray-500">Alertas sobre facturas por cobrar</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_pending_invoices}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, email_pending_invoices: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">Compras Pendientes</p>
                        <p className="text-sm text-gray-500">Alertas sobre órdenes de compra por aprobar</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_pending_purchases}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, email_pending_purchases: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">Nuevas Órdenes</p>
                        <p className="text-sm text-gray-500">Notificaciones de nuevas ventas</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_new_orders}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, email_new_orders: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Browser Notifications */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notificaciones del Navegador
                  </h3>

                  <label className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">Activar Notificaciones</p>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real en tu navegador</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.browser_notifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, browser_notifications: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-light text-gray-900 mb-2">Configuración del Sistema</h2>
                <p className="text-gray-500">Preferencias generales del sistema</p>
              </div>

              <form onSubmit={handleSaveSystem} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda por Defecto
                    </label>
                    <select
                      value={systemSettings.default_currency}
                      onChange={(e) => setSystemSettings({ ...systemSettings, default_currency: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="PEN">PEN - Sol Peruano</option>
                      <option value="MXN">MXN - Peso Mexicano</option>
                      <option value="COP">COP - Peso Colombiano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato de Fecha
                    </label>
                    <select
                      value={systemSettings.date_format}
                      onChange={(e) => setSystemSettings({ ...systemSettings, date_format: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona Horaria
                    </label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="America/Lima">America/Lima (Perú)</option>
                      <option value="America/Mexico_City">America/Mexico_City (México)</option>
                      <option value="America/Bogota">America/Bogota (Colombia)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="Europe/Madrid">Europe/Madrid (España)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Umbral de Stock Bajo
                    </label>
                    <input
                      type="number"
                      value={systemSettings.low_stock_threshold}
                      onChange={(e) => setSystemSettings({ ...systemSettings, low_stock_threshold: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Productos por debajo de esta cantidad serán marcados como stock bajo</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prefijo de Facturas
                    </label>
                    <input
                      type="text"
                      value={systemSettings.invoice_prefix}
                      onChange={(e) => setSystemSettings({ ...systemSettings, invoice_prefix: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ejemplo: INV-0001</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prefijo de Compras
                    </label>
                    <input
                      type="text"
                      value={systemSettings.purchase_prefix}
                      onChange={(e) => setSystemSettings({ ...systemSettings, purchase_prefix: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ejemplo: PO-0001</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

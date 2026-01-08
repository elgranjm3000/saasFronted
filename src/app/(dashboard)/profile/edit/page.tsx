'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

interface EditProfileFormData {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  company_id: number;
  company_name?: string;
  role: string;
  is_company_admin: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

const EditProfilePage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<EditProfileFormData>({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    address: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setInitialLoading(true);
      const response = await authAPI.getMe();
      const profile: UserProfile = response.data;

      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrors({ general: 'Error al cargar el perfil' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'El email debe ser válido';
    }

    if (formData.full_name && formData.full_name.length < 3) {
      newErrors.full_name = 'El nombre completo debe tener al menos 3 caracteres';
    }

    if (activeTab === 'password') {
      if (formData.new_password || formData.confirm_password) {
        if (!formData.current_password) {
          newErrors.current_password = 'Debes ingresar tu contraseña actual';
        }

        if (!formData.new_password) {
          newErrors.new_password = 'La nueva contraseña es requerida';
        } else if (formData.new_password.length < 6) {
          newErrors.new_password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.new_password !== formData.confirm_password) {
          newErrors.confirm_password = 'Las contraseñas no coinciden';
        }
      }
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
        username: formData.username.trim(),
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      };

      await authAPI.updateProfile(submitData);
      setSuccess(true);

      setTimeout(() => {
        router.push('/profile');
      }, 1500);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.detail) {
        setErrors({ general: error.response.data.detail });
      } else {
        setErrors({ general: 'Error al actualizar el perfil. Inténtalo de nuevo.' });
      }
    } finally {
      setLoading(false);
    }
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
              href="/profile"
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Editar Perfil</h1>
              <p className="text-gray-500 font-light">
                Actualiza tu información personal
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
              Perfil actualizado correctamente
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
          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden mb-8">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-4 px-6 text-center font-light transition-all ${
                  activeTab === 'personal'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-4 px-6 text-center font-light transition-all ${
                  activeTab === 'password'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cambiar Contraseña
              </button>
            </div>

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre de Usuario *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.username ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="tu_usuario"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.full_name ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="+34 123 45 67 89"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dirección
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                      placeholder="Tu dirección completa"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Link
                    href="/profile"
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
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-blue-800 font-light">
                    Por seguridad, deberás confirmar tu contraseña actual para establecer una nueva.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Contraseña Actual *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-12 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.current_password ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="Tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.current_password && (
                    <p className="mt-2 text-sm text-red-600">{errors.current_password}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-12 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.new_password ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="Tu nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="mt-2 text-sm text-red-600">{errors.new_password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Confirmar Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-12 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                        errors.confirm_password ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                      }`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirm_password}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Link
                    href="/profile"
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
                      {loading ? 'Guardando...' : 'Actualizar Contraseña'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Tips */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Consejos de Seguridad</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Contraseña fuerte</p>
                  <p className="text-xs text-gray-500">
                    Usa una combinación de mayúsculas, minúsculas y números
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email verificado</p>
                  <p className="text-xs text-gray-500">
                    Mantén tu email actualizado para recuperar tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Cambios recientes</p>
                  <p className="text-xs text-gray-500">
                    Revisa tu historial de cambios en tu cuenta regularmente
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">¿Necesitas Ayuda?</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <Mail className="w-4 h-4 mr-3" />
                <span className="font-light">Contactar Soporte</span>
              </button>
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <User className="w-4 h-4 mr-3" />
                <span className="font-light">Ver Centro de Ayuda</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
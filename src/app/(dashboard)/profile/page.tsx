'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  LogOut,
  Camera,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  Shield,
  Clock
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import DashboardLayout from '@/components/DashboardLayout';

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

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
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

  if (error || !profile) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">Error al cargar el perfil</h3>
          <p className="text-gray-500 mb-6">
            {error || 'No se pudo cargar la información del perfil.'}
          </p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role: string): string => {
    const roleMap: Record<string, string> = {
      'admin': 'Administrador',
      'manager': 'Gerente',
      'user': 'Usuario',
      'company_admin': 'Administrador de Empresa'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string): string => {
    const colorMap: Record<string, string> = {
      'admin': 'bg-red-100 text-red-800',
      'manager': 'bg-blue-100 text-blue-800',
      'user': 'bg-green-100 text-green-800',
      'company_admin': 'bg-purple-100 text-purple-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-3">Mi Perfil</h1>
            <p className="text-gray-500 font-light text-lg">
              Gestiona tu información personal y preferencias
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/profile/edit"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              <Edit className="w-4 h-4 mr-2" />
              <span className="font-light">Editar Perfil</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 text-red-600 bg-red-50/80 border border-red-200 rounded-2xl hover:bg-red-100 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-light">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg relative">
                    <User className="w-16 h-16 text-white" />
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getRoleColor(profile.role)}`}>
                    {getRoleLabel(profile.role)}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-light text-gray-900 mb-2">
                    {profile.full_name || profile.username}
                  </h2>
                  <p className="text-gray-600 mb-6">@{profile.username}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">Email</span>
                      </div>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>

                    {profile.phone && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">Teléfono</span>
                        </div>
                        <p className="font-medium text-gray-900">{profile.phone}</p>
                      </div>
                    )}

                    {profile.address && (
                      <div className="md:col-span-2">
                        <div className="flex items-center mb-2">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">Dirección</span>
                        </div>
                        <p className="font-medium text-gray-900">{profile.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Detalles de la Cuenta</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-gray-50/80 rounded-2xl">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">ID de Usuario</p>
                    <p className="font-medium text-gray-900">#{profile.id}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50/80 rounded-2xl">
                  <Shield className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <p className="font-medium text-gray-900">{getRoleLabel(profile.role)}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50/80 rounded-2xl">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Registro</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(profile.created_at, 'long')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50/80 rounded-2xl">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Última Actualización</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(profile.updated_at, 'short')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Empresa</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="font-medium text-gray-900">
                    {profile.company_name || 'Mi Empresa'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Permisos</p>
                  <p className="font-medium text-gray-900">
                    {profile.is_company_admin ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy User ID */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Información Técnica</h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-2xl">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Company ID</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {profile.company_id}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(profile.company_id.toString())}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-2xl">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">User ID</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {profile.id}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(profile.id.toString())}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-light text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <Mail className="w-4 h-4 mr-3" />
                <span className="font-light">Cambiar Email</span>
              </button>
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <Shield className="w-4 h-4 mr-3" />
                <span className="font-light">Cambiar Contraseña</span>
              </button>
              <button className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] shadow-lg">
                <Shield className="w-4 h-4 mr-3" />
                <span className="font-light">Autenticación de Dos Factores</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
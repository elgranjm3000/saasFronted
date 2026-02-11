'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Hash,
  Building2,
  ChevronDown,
  ChevronRight,
  Info,
  CreditCard,
  UserCheck,
  Tag
} from 'lucide-react';
import { customersAPI } from '@/lib/api';
import { extractErrorMessage } from '@/lib/errorHandler';
import { Customer, CustomerCreate } from '@/types/customer';
import { GooglePlacesAutocomplete } from '@/components/GooglePlacesAutocomplete';
import { GoogleMapView } from '@/components/GoogleMapView';
import { GoogleMapsWrapper } from '@/components/GoogleMapsWrapper';

interface CustomerFormData {
  // Campos básicos
  name: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  contact_name: string;  // ✅ SISTEMA ESCRITORIO: Nombre del contacto
  location?: {
    lat: number;
    lng: number;
  };

  // ✅ SISTEMA ESCRITORIO: Clasificación fiscal
  name_fiscal: number;  // 0=Ordinario, 1=No Contribuyente, 2=Formal
  client_type: string;  // 01=Juridico, 02=Natural, 03=Government

  // ✅ SISTEMA ESCRITORIO: Retenciones
  retention_tax_agent: boolean;  // Agente de retención IVA
  retention_municipal_agent: boolean;  // Agente de retención municipal
  retention_islr_agent: boolean;  // Agente de retención ISLR

  // ✅ SISTEMA ESCRITORIO: Crédito
  credit_days: number;  // Días de crédito
  credit_limit: number;  // Límite de crédito
  allow_expired_balance: boolean;  // Permitir vender con saldo vencido

  // ✅ SISTEMA ESCRITORIO: Asignaciones
  seller_id: string;  // Vendedor asignado
  client_group_id: string;  // Grupo de cliente
  area_sales_id: string;  // Área de ventas

  // ✅ SISTEMA ESCRITORIO: Precios y descuentos
  sale_price: number;  // 0=Max, 1=Oferta, 2=Mayor, 3=Min, 4=Variable
  discount: number;  // Descuento fijo del cliente

  // ✅ SISTEMA ESCRITORIO: Estado
  status: string;  // 01=Activo, 02=Inactivo
}

const CustomerFormPage = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
    // Campos básicos
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    contact_name: '',
    location: undefined,

    // ✅ SISTEMA ESCRITORIO: Clasificación fiscal
    name_fiscal: 0,  // Ordinario por defecto
    client_type: '01',  // Jurídico por defecto

    // ✅ SISTEMA ESCRITORIO: Retenciones
    retention_tax_agent: false,
    retention_municipal_agent: false,
    retention_islr_agent: false,

    // ✅ SISTEMA ESCRITORIO: Crédito
    credit_days: 0,
    credit_limit: 0,
    allow_expired_balance: false,

    // ✅ SISTEMA ESCRITORIO: Asignaciones
    seller_id: '',
    client_group_id: '',
    area_sales_id: '',

    // ✅ SISTEMA ESCRITORIO: Precios y descuentos
    sale_price: 0,  // Precio máximo por defecto
    discount: 0,

    // ✅ SISTEMA ESCRITORIO: Estado
    status: '01',  // Activo por defecto
  });

  // ✅ Colapsible sections state
  const [openSections, setOpenSections] = useState({
    basic: true,
    fiscal: false,
    retentions: false,
    credit: false,
    assignments: false,
    pricing: false,
    advanced: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const params = useParams();

  // Determinar si estamos editando o creando
  const isEdit = params?.id && params.id !== 'new';
  const customerId = isEdit ? Number(params.id) : null;

  useEffect(() => {
    if (isEdit && customerId) {
      fetchCustomer();
    }
  }, [isEdit, customerId]);

  const fetchCustomer = async () => {
    if (!customerId) return;

    try {
      setInitialLoading(true);
      const response = await customersAPI.getById(customerId);
      const customer: Customer = response.data;

      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        tax_id: customer.tax_id || '',
        contact_name: customer.contact_name || '',
        location: customer.latitude && customer.longitude ? {
          lat: customer.latitude,
          lng: customer.longitude
        } : undefined,

        // ✅ SISTEMA ESCRITORIO: Cargar campos nuevos
        name_fiscal: customer.name_fiscal || 0,
        client_type: customer.client_type || '01',
        retention_tax_agent: customer.retention_tax_agent || false,
        retention_municipal_agent: customer.retention_municipal_agent || false,
        retention_islr_agent: customer.retention_islr_agent || false,
        credit_days: customer.credit_days || 0,
        credit_limit: customer.credit_limit || 0,
        allow_expired_balance: customer.allow_expired_balance || false,
        seller_id: customer.seller_id ? String(customer.seller_id) : '',
        client_group_id: customer.client_group_id ? String(customer.client_group_id) : '',
        area_sales_id: customer.area_sales_id ? String(customer.area_sales_id) : '',
        sale_price: customer.sale_price || 0,
        discount: customer.discount || 0,
        status: customer.status || '01',
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      setErrors({ general: 'Error al cargar el cliente' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddressChange = (address: string, location?: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address,
      location
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del cliente es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
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

      const submitData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        tax_id: formData.tax_id.trim() || undefined,
        latitude: formData.location?.lat,
        longitude: formData.location?.lng,

        // ✅ SISTEMA ESCRITORIO: Campos nuevos
        contact_name: formData.contact_name.trim() || undefined,
        name_fiscal: formData.name_fiscal,
        client_type: formData.client_type,
        retention_tax_agent: formData.retention_tax_agent,
        retention_municipal_agent: formData.retention_municipal_agent,
        retention_islr_agent: formData.retention_islr_agent,
        credit_days: formData.credit_days,
        credit_limit: formData.credit_limit,
        allow_expired_balance: formData.allow_expired_balance,
        seller_id: formData.seller_id ? parseInt(formData.seller_id) : undefined,
        client_group_id: formData.client_group_id ? parseInt(formData.client_group_id) : undefined,
        area_sales_id: formData.area_sales_id ? parseInt(formData.area_sales_id) : undefined,
        sale_price: formData.sale_price,
        discount: formData.discount,
        status: formData.status,
      };

      if (isEdit && customerId) {
        await customersAPI.update(customerId, submitData);
      } else {
        await customersAPI.create(submitData);
      }

      setSuccess(true);

      setTimeout(() => {
        if (isEdit) {
          router.push(`/customers/${customerId}`);
        } else {
          router.push('/customers');
        }
      }, 1500);

    } catch (error: any) {
      console.error('Error saving customer:', error);
      setErrors({ general: extractErrorMessage(error) });
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
              href={isEdit ? `/customers/${customerId}` : '/customers'}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h1>
              <p className="text-gray-500 font-light">
                {isEdit ? 'Modifica la información del cliente' : 'Completa la información para crear un nuevo cliente'}
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
              {isEdit ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente'}
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
            {/* ✅ SECCIÓN 1: INFORMACIÓN BÁSICA */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('basic')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-light text-gray-900">Información Básica</h3>
                </div>
                {openSections.basic ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.basic && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Nombre del Cliente *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50/80 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                          errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200/60 focus:border-blue-300'
                        }`}
                        placeholder="Ej: Empresa ABC S.A."
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ✅ SISTEMA ESCRITORIO: Nombre del Contacto
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="contact_name"
                        value={formData.contact_name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Persona de contacto en la empresa</p>
                  </div>

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
                        placeholder="contacto@empresa.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

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
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tax ID / RIF
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="J-123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <GoogleMapsWrapper>
                      <GooglePlacesAutocomplete
                        value={formData.address}
                        onChange={handleAddressChange}
                        label="Dirección"
                        placeholder="Buscar dirección en Google Maps..."
                      />
                    </GoogleMapsWrapper>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ SECCIÓN 2: CLASIFICACIÓN FISCAL */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('fiscal')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-light text-gray-900">Clasificación Fiscal</h3>
                </div>
                {openSections.fiscal ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.fiscal && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Contribuyente
                    </label>
                    <select
                      name="name_fiscal"
                      value={formData.name_fiscal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="0">0 - Contribuyente Ordinario</option>
                      <option value="1">1 - No Contribuyente</option>
                      <option value="2">2 - Contribuyente Formal</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Clasificación fiscal según SENIAT</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Cliente
                    </label>
                    <select
                      name="client_type"
                      value={formData.client_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="01">01 - Jurídico (Empresa)</option>
                      <option value="02">02 - Natural (Persona)</option>
                      <option value="03">03 - Gobierno</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Tipo de persona jurídica</p>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ SECCIÓN 3: RETENCIONES */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('retentions')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-light text-gray-900">Retenciones</h3>
                </div>
                {openSections.retentions ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.retentions && (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="retention_tax_agent"
                        checked={formData.retention_tax_agent}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Agente de Retención IVA</span>
                        <p className="text-xs text-gray-500">El cliente actúa como agente de retención de IVA</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="retention_municipal_agent"
                        checked={formData.retention_municipal_agent}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Agente de Retención Municipal</span>
                        <p className="text-xs text-gray-500">El cliente retiene impuestos municipales</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="retention_islr_agent"
                        checked={formData.retention_islr_agent}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Agente de Retención ISLR</span>
                        <p className="text-xs text-gray-500">El cliente retiene Impuesto Sobre la Renta</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ SECCIÓN 4: CRÉDITO */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('credit')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-light text-gray-900">Crédito</h3>
                </div>
                {openSections.credit ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.credit && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Días de Crédito
                      </label>
                      <input
                        type="number"
                        name="credit_days"
                        value={formData.credit_days}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="30"
                      />
                      <p className="text-xs text-gray-500 mt-1">Días de crédito otorgados al cliente</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Límite de Crédito
                      </label>
                      <input
                        type="number"
                        name="credit_limit"
                        value={formData.credit_limit}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">Monto máximo de crédito permitido</p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="allow_expired_balance"
                        checked={formData.allow_expired_balance}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Permitir Saldo Vencido</span>
                        <p className="text-xs text-gray-500">Permite realizar ventas aunque tenga saldo vencido</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ SECCIÓN 5: ASIGNACIONES */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('assignments')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-light text-gray-900">Asignaciones</h3>
                </div>
                {openSections.assignments ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.assignments && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vendedor
                      </label>
                      <input
                        type="number"
                        name="seller_id"
                        value={formData.seller_id}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="ID del vendedor"
                      />
                      <p className="text-xs text-gray-500 mt-1">Vendedor asignado al cliente</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Grupo de Cliente
                      </label>
                      <input
                        type="number"
                        name="client_group_id"
                        value={formData.client_group_id}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="ID del grupo"
                      />
                      <p className="text-xs text-gray-500 mt-1">Grupo al que pertenece el cliente</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Área de Ventas
                      </label>
                      <input
                        type="number"
                        name="area_sales_id"
                        value={formData.area_sales_id}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="ID del área"
                      />
                      <p className="text-xs text-gray-500 mt-1">Área de ventas asignada</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ SECCIÓN 6: PRECIOS Y DESCUENTOS */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('pricing')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Tag className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-xl font-light text-gray-900">Precios y Descuentos</h3>
                </div>
                {openSections.pricing ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.pricing && (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipo de Precio
                      </label>
                      <select
                        name="sale_price"
                        value={formData.sale_price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      >
                        <option value="0">0 - Precio Máximo</option>
                        <option value="1">1 - Precio Oferta</option>
                        <option value="2">2 - Precio Mayor</option>
                        <option value="3">3 - Precio Mínimo</option>
                        <option value="4">4 - Precio Variable</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Tipo de precio por defecto para este cliente</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Descuento Fijo (%)
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Descuento aplicado por defecto</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ SECCIÓN 7: CONFIGURACIÓN AVANZADA */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('advanced')}
                className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-light text-gray-900">Configuración Avanzada</h3>
                </div>
                {openSections.advanced ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
              </button>

              {openSections.advanced && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200/60 rounded-2xl focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="01">01 - Activo</option>
                      <option value="02">02 - Inactivo</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Estado del cliente en el sistema</p>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            {formData.location && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-light text-gray-900">Ubicación en Mapa</h3>
                </div>
                <div className="p-6">
                  <GoogleMapsWrapper>
                    <GoogleMapView
                      lat={formData.location.lat}
                      lng={formData.location.lng}
                      address={formData.address}
                      onLocationChange={(lat, lng) => {
                        setFormData(prev => ({
                          ...prev,
                        location: { lat, lng }
                      }));
                    }}
                  />
                  </GoogleMapsWrapper>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href={isEdit ? `/customers/${customerId}` : '/customers'}
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
                  {loading ? 'Guardando...' : isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
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
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {formData.name || 'Nombre del cliente'}
                </h4>
                <p className="text-sm text-gray-500">
                  {formData.email || 'email@cliente.com'}
                </p>
              </div>
              
              <div className="space-y-3">
                {formData.phone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Teléfono</span>
                    <span className="font-medium text-gray-900">
                      {formData.phone}
                    </span>
                  </div>
                )}
                {formData.tax_id && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax ID</span>
                    <span className="font-medium text-gray-900">
                      {formData.tax_id}
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
                    <p className="text-sm font-medium text-gray-900">Información completa</p>
                    <p className="text-xs text-gray-500">
                      Completa todos los campos posibles para facilitar la facturación
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email válido</p>
                    <p className="text-xs text-gray-500">
                      Asegúrate de que el email sea correcto para enviar documentos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tax ID</p>
                    <p className="text-xs text-gray-500">
                      El Tax ID es importante para la facturación legal
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

export default CustomerFormPage;
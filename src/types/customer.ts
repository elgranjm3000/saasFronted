// ✅ SISTEMA ESCRITORIO: Cliente con 15 campos adicionales
export interface Customer {
  id: number;
  company_id: number;

  // ✅ Campos básicos
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null; // ✅ VENEZUELA: RIF/CI del cliente
  latitude?: number | null; // ✅ UBICACIÓN: Latitud para mapa
  longitude?: number | null; // ✅ UBICACIÓN: Longitud para mapa
  contact_name?: string | null; // ✅ SISTEMA ESCRITORIO: Nombre del contacto

  // ✅ SISTEMA ESCRITORIO: Clasificación fiscal
  name_fiscal?: number; // ✅ 0=Ordinario, 1=No Contribuyente, 2=Formal
  client_type?: string; // ✅ 01=Juridico, 02=Natural, 03=Government

  // ✅ SISTEMA ESCRITORIO: Retenciones
  retention_tax_agent?: boolean; // ✅ Agente de retención IVA
  retention_municipal_agent?: boolean; // ✅ Agente de retención municipal
  retention_islr_agent?: boolean; // ✅ Agente de retención ISLR

  // ✅ SISTEMA ESCRITORIO: Crédito
  credit_days?: number; // ✅ Días de crédito
  credit_limit?: number; // ✅ Límite de crédito
  allow_expired_balance?: boolean; // ✅ Permitir vender con saldo vencido

  // ✅ SISTEMA ESCRITORIO: Asignaciones
  seller_id?: number; // ✅ Vendedor asignado
  client_group_id?: number; // ✅ Grupo de cliente
  area_sales_id?: number; // ✅ Área de ventas

  // Relaciones
  seller?: {  // ✅ SISTEMA ESCRITORIO
    id: number;
    name: string;
    code: string;
  };
  client_group?: {  // ✅ SISTEMA ESCRITORIO
    id: number;
    name: string;
    code: string;
  };
  area_sales?: {  // ✅ SISTEMA ESCRITORIO
    id: number;
    name: string;
    code: string;
  };

  // ✅ SISTEMA ESCRITORIO: Precios y descuentos
  sale_price?: number; // ✅ 0=Max, 1=Oferta, 2=Mayor, 3=Min, 4=Variable
  discount?: number; // ✅ Descuento fijo del cliente

  // ✅ SISTEMA ESCRITORIO: Estado
  status?: string; // ✅ 01=Activo, 02=Inactivo

  // Legacy
  is_active?: boolean;

  created_at: string;
  updated_at: string;
}

// ✅ SISTEMA ESCRITORIO: Cliente para crear
export interface CustomerCreate {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contact_name?: string | null;

  // ✅ Clasificación fiscal
  name_fiscal?: number;
  client_type?: string;

  // ✅ Retenciones
  retention_tax_agent?: boolean;
  retention_municipal_agent?: boolean;
  retention_islr_agent?: boolean;

  // ✅ Crédito
  credit_days?: number;
  credit_limit?: number;
  allow_expired_balance?: boolean;

  // ✅ Asignaciones
  seller_id?: number;
  client_group_id?: number;
  area_sales_id?: number;

  // ✅ Precios y descuentos
  sale_price?: number;
  discount?: number;

  // ✅ Estado
  status?: string;
}

export interface CustomerUpdate {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contact_name?: string | null;

  // ✅ Clasificación fiscal
  name_fiscal?: number;
  client_type?: string;

  // ✅ Retenciones
  retention_tax_agent?: boolean;
  retention_municipal_agent?: boolean;
  retention_islr_agent?: boolean;

  // ✅ Crédito
  credit_days?: number;
  credit_limit?: number;
  allow_expired_balance?: boolean;

  // ✅ Asignaciones
  seller_id?: number;
  client_group_id?: number;
  area_sales_id?: number;

  // ✅ Precios y descuentos
  sale_price?: number;
  discount?: number;

  // ✅ Estado
  status?: string;
  is_active?: boolean;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  total_orders: number;
  total_order_amount: number;
}

// ✅ SISTEMA ESCRITORIO: Tipos auxiliares
export interface Seller {
  id: number;
  code: string;
  name: string;
  status: string; // 01=Activo, 02=Inactivo
  percent_sales: number;
  percent_receivable: number;
  user_code?: string;
  percent_gerencial_debit_note: number;
  percent_gerencial_credit_note: number;
  percent_returned_check: number;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface ClientGroup {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface AreasSales {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  company_id: number;
  created_at: string;
  updated_at: string;
}

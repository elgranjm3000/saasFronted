// Cliente actualizado para Venezuela
export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null; // RIF: J-XXXXXXX-X o V-XXXXXXX-X
  latitude?: number | null;
  longitude?: number | null;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CustomerUpdate {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active?: boolean;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  total_orders: number;
  total_order_amount: number;
}

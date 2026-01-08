export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string;
}

export interface CustomerUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  is_active?: boolean;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  total_orders: number;
  total_order_amount: number;
}


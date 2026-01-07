// src/types/supplier.ts
export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  contact_person?: string;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_purchases?: number;
  total_purchase_amount?: number;
}

export interface SupplierCreate {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  contact_person?: string;
}

export interface SupplierUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  contact_person?: string;
  is_active?: boolean;
}

export interface SupplierStats {
  total_suppliers: number;
  active_suppliers: number;
  total_purchases: number;
  total_purchase_amount: number;
}

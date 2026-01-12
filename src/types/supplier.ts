// Proveedor actualizado para Venezuela
export interface Supplier {
  id: number;
  name: string;
  contact?: string | null;
  address?: string | null;
  tax_id?: string | null; // RIF: J-XXXXXXX-X
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierCreate {
  name: string;
  contact?: string | null;
  address?: string | null;
  tax_id?: string | null;
}

export interface SupplierUpdate {
  name?: string | null;
  contact?: string | null;
  address?: string | null;
  tax_id?: string | null;
}

export interface SupplierStats {
  total_suppliers: number;
  active_suppliers: number;
  total_purchases: number;
  total_purchase_amount: number;
}

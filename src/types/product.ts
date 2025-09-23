export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost?: number;
  category_id?: number;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost?: number;
  category_id?: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  cost?: number;
  category_id?: number;
  is_active?: boolean;
}

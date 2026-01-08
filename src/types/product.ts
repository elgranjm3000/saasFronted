export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost?: number;
  category_id?: number;
  company_id: number;
  warehouse_id?: number;
  stock_quantity?: number;
  min_stock?: number;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };
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
  warehouse_id?: number;
  stock_quantity?: number;
  min_stock?: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  cost?: number;
  category_id?: number;
  warehouse_id?: number;
  stock_quantity?: number;
  min_stock?: number;
  is_active?: boolean;
}

export interface ProductStats {
  total_products: number;
  total_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

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
  currency_id?: number;  // ✅ MONEDA: Moneda del precio
  currency?: {            // ✅ MONEDA: Datos de la moneda
    id: number;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
  };
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
  currency_id?: number;  // ✅ MONEDA: Moneda del precio
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
  currency_id?: number;  // ✅ MONEDA: Moneda del precio
}

export interface ProductStats {
  total_products: number;
  total_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

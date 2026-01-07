export interface Warehouse {
  id: number;
  name: string;
  address?: string;
  manager?: string;
  phone?: string;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
  total_stock_value?: number;
}

export interface WarehouseCreate {
  name: string;
  address?: string;
  manager?: string;
  phone?: string;
}

export interface WarehouseUpdate {
  name?: string;
  address?: string;
  manager?: string;
  phone?: string;
  is_active?: boolean;
}

export interface WarehouseStats {
  total_warehouses: number;
  active_warehouses: number;
  total_products: number;
  total_stock_value: number;
}

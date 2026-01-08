export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  company_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category;
  product_count?: number;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  parent_id?: number;
  is_active?: boolean;
}

export interface CategoryStats {
  total_categories: number;
  active_categories: number;
  categories_with_products: number;
}

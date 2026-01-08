import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  quantity: number;
  category?: {
    id: number;
    name: string;
  };
  company_id: number;
  created_at?: string;
  updated_at?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProduct: (data: any) => Promise<Product>;
  updateProduct: (id: number, data: any) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  getLowStockProducts: (threshold?: number) => Promise<Product[]>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (data: any): Promise<Product> => {
    try {
      const response = await productsAPI.create(data);
      const newProduct = response.data;
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Error al crear producto');
    }
  };

  const updateProduct = async (id: number, data: any): Promise<Product> => {
    try {
      const response = await productsAPI.update(id, data);
      const updatedProduct = response.data;
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Error al actualizar producto');
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Error al eliminar producto');
    }
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      const response = await productsAPI.search(query);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Error al buscar productos');
    }
  };

  const getLowStockProducts = async (threshold: number = 10): Promise<Product[]> => {
    try {
      const response = await productsAPI.getLowStock(threshold);
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Error al obtener productos con stock bajo');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getLowStockProducts
  };
};

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProduct = (id: number): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar producto');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

// Hook para estadísticas de productos
interface ProductStats {
  total: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
  topCategories: Array<{ name: string; count: number }>;
}

interface UseProductStatsReturn {
  stats: ProductStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductStats = (): UseProductStatsReturn => {
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    topCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todos los productos para calcular estadísticas
      const response = await productsAPI.getAll();
      const products: Product[] = response.data;
      
      const total = products.length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const lowStock = products.filter(p => p.quantity <= 10 && p.quantity > 0).length;
      const outOfStock = products.filter(p => p.quantity === 0).length;
      
      // Calcular categorías más populares
      const categoryCount: Record<string, number> = {};
      products.forEach(product => {
        if (product.category) {
          categoryCount[product.category.name] = (categoryCount[product.category.name] || 0) + 1;
        }
      });
      
      const topCategories = Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        total,
        totalValue,
        lowStock,
        outOfStock,
        topCategories
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar estadísticas');
      console.error('Error fetching product stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook para filtros y búsqueda avanzada
interface ProductFilters {
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  stockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  sortBy: 'name' | 'price' | 'quantity' | 'created_at';
  sortOrder: 'asc' | 'desc';
}

interface UseProductFiltersReturn {
  filters: ProductFilters;
  filteredProducts: Product[];
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  resetFilters: () => void;
  applyFilters: (products: Product[]) => Product[];
}

export const useProductFilters = (products: Product[]): UseProductFiltersReturn => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    stockStatus: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      stockStatus: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const applyFilters = (productList: Product[]): Product[] => {
    let filtered = [...productList];

    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de categoría
    if (filters.category) {
      filtered = filtered.filter(product =>
        product.category?.name === filters.category
      );
    }

    // Filtro de precio mínimo
    if (filters.minPrice !== null) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    // Filtro de precio máximo
    if (filters.maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    // Filtro de estado de stock
    if (filters.stockStatus !== 'all') {
      switch (filters.stockStatus) {
        case 'in_stock':
          filtered = filtered.filter(product => product.quantity > 10);
          break;
        case 'low_stock':
          filtered = filtered.filter(product => product.quantity <= 10 && product.quantity > 0);
          break;
        case 'out_of_stock':
          filtered = filtered.filter(product => product.quantity === 0);
          break;
      }
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredProducts = applyFilters(products);

  return {
    filters,
    filteredProducts,
    updateFilter,
    resetFilters,
    applyFilters
  };
};
import { useState, useEffect } from 'react';
import { warehousesAPI, categoriesAPI } from '@/lib/api';

interface Warehouse {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export const useProductForm = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [warehousesRes, categoriesRes] = await Promise.all([
          warehousesAPI.getAll({ limit: 100 }),
          categoriesAPI.getAll(),
        ]);

        setWarehouses(warehousesRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    warehouses,
    categories,
    loading
  };
};

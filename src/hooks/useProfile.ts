import { useState, useCallback } from 'react';
import { authAPI } from '@/lib/api';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  company_id: number;
  company_name?: string;
  role: string;
  is_company_admin: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getMe();
      setProfile(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al cargar el perfil';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.updateProfile(data);
      setProfile(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al actualizar el perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearError
  };
};
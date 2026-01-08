import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: {
    id: number;
    name: string;
    tax_id: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
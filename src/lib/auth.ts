import jwtDecode from 'jwt-decode';

interface TokenPayload {
  sub: string;
  company_id: number;
  role: string;
  is_company_admin: boolean;
  exp: number;
}

export const authUtils = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
  },

  getUserData: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  setUserData: (userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
  },

  isTokenValid: (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getTokenPayload: (token: string): TokenPayload | null => {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    return token ? authUtils.isTokenValid(token) : false;
  },

  hasRole: (requiredRole: string): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;
    
    const payload = authUtils.getTokenPayload(token);
    if (!payload) return false;
    
    const roleHierarchy = ['user', 'manager', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(payload.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    return userRoleIndex >= requiredRoleIndex;
  },

  isCompanyAdmin: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;
    
    const payload = authUtils.getTokenPayload(token);
    return payload?.is_company_admin || false;
  },
};
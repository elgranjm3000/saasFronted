export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  company_id: number;
  is_active: boolean;
  is_company_admin: boolean;
  created_at: string;
  last_login?: string;
  company: Company;
}

export interface Company {
  id: number;
  name: string;
  legal_name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  timezone: string;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  company_tax_id: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface CompanyRegistrationRequest {
  company_name: string;
  company_tax_id: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  admin_username: string;
  admin_email: string;
  admin_password: string;
}
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Configuración del cliente Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ IMPORTANTE: Permitir que Axios envíe cookies con cada request
  // Esto es necesario para que el servidor reciba el cookie HTTP-only
  withCredentials: true,
});

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, null as string | null)
}

// Interceptor para incluir el token de autorización
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (from Zustand persist storage)
    let tokenFromStorage = null;

    if (typeof window !== 'undefined') {
      // Try to get from Zustand persist storage
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          tokenFromStorage = parsed?.state?.token;
        } catch (e) {
          console.error('Error parsing auth-storage:', e);
        }
      }

      // Fallback to direct access_token
      if (!tokenFromStorage) {
        tokenFromStorage = localStorage.getItem('access_token');
      }
    }

    if (tokenFromStorage) {
      console.log('🔐 Request:', config.method?.toUpperCase(), config.url, '| Token:', tokenFromStorage.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${tokenFromStorage}`;
    } else {
      console.log('⚠️ Request:', config.method?.toUpperCase(), config.url, '| No token found in localStorage');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || 'unknown';

      // Don't logout if it's the login endpoint itself
      if (url.includes('/auth/login')) {
        console.error('❌ Login failed:', error.response?.data);
        return Promise.reject(error);
      }

      console.error('❌ Response: 401 Unauthorized on', url);

      // Only logout once to prevent infinite loops
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.warn('⚠️ Authentication failed, logging out...');

        // Limpiar todo el estado de autenticación
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth-storage');

        // Limpiar cookies
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

        // Redirigir a login
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

// =============================================
// 👥 AUTHENTICATION & USERS API
// =============================================
export const authAPI = {
  login: (credentials: { username: string; password: string; company_tax_id: string }) =>
    apiClient.post('/auth/login', credentials),
  
  loginLegacy: (username: string, password: string) =>
    apiClient.post('/login/', null, { params: { username, password } }),
  
  registerCompany: (data: any) =>
    apiClient.post('/auth/register-company', data),
  
  checkCompanyTaxId: (taxId: string) =>
    apiClient.get(`/auth/check-company-tax-id/${taxId}`),
  
  checkUsername: (username: string) =>
    apiClient.get(`/auth/check-username/${username}`),
  
  getMe: () =>
    apiClient.get('/users/me'),

  updateProfile: (data: any) =>
    apiClient.put('/users/me', data),

  createUser: (username: string, email: string, password: string) =>
    apiClient.post('/users/', null, { params: { username, email, password } }),
};

// =============================================
// 📦 PRODUCTS API
// =============================================
export const productsAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/products', { params }),
  
  getById: (id: number) =>
    apiClient.get(`/products/${id}`),
  
  create: (data: any) =>
    apiClient.post('/products', data),
  
  update: (id: number, data: any) =>
    apiClient.put(`/products/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/products/${id}`),
  
  search: (q: string) =>
    apiClient.get('/products/search', { params: { q } }),
  
  getLowStock: (threshold?: number) =>
    apiClient.get('/products/low-stock', { params: { threshold } }),

  getSummary: () =>
    apiClient.get('/products/stats/summary'),

  bulkUpdate: (updates: any[]) =>
    apiClient.post('/products/bulk-update', updates),

  getInventoryMovements: (productId: number) =>
    apiClient.get(`/products/${productId}/inventory_movements`),

  getByCategory: (categoryId: number) =>
    apiClient.get(`/categories/${categoryId}/products`),
};

// =============================================
// 📄 INVOICES API
// =============================================
export const invoicesAPI = {
  getAll: (params?: { skip?: number; limit?: number; status?: string }) =>
    apiClient.get('/invoices/', { params }),
  
  getById: (id: number) =>
    apiClient.get(`/invoices/${id}`),
  
  create: (data: any) =>
    apiClient.post('/invoices/', data),
  
  update: (id: number, data: any) =>
    apiClient.put(`/invoices/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/invoices/${id}`),

  getSummary: () =>
    apiClient.get('/invoices/stats/summary/'),

  getPending: () =>
    apiClient.get('/invoices/pending/'),

  createCreditMovement: (invoiceId: number, data: any) =>
    apiClient.post(`/invoices/${invoiceId}/credit-movements`, data),

  // ✅ MULTI-MONEDA: Preview de factura con conversión USD→VES
  preview: (data: {
    items: Array<{ product_id: number; quantity: number }>;
    customer_id: number;
    payment_method: string;
    manual_exchange_rate?: number | null;
    igtf_exempt?: boolean;
    iva_percentage?: number;
    reference_currency_code?: string;
    payment_currency_code?: string;
  }) =>
    apiClient.post('/invoices/preview', data),
};

// =============================================
// 💰 BUDGETS API
// =============================================
export const budgetsAPI = {
  create: (data: any) =>
    apiClient.post('/budgets', data),

  confirm: (budgetId: number) =>
    apiClient.put(`/budgets/${budgetId}/confirm`),
};

// =============================================
// 🛒 PURCHASES API
// =============================================
export const purchasesAPI = {
  getAll: (params?: { skip?: number; limit?: number; status?: string }) =>
    apiClient.get('/purchases', { params }),

  getById: (id: number) =>
    apiClient.get(`/purchases/${id}`),

  create: (data: any) =>
    apiClient.post('/purchases', data),

  update: (id: number, data: any) =>
    apiClient.put(`/purchases/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/purchases/${id}`),

  updateStatus: (id: number, status: string) =>
    apiClient.put(`/purchases/${id}/status`, null, { params: { status } }),

  getSummary: () =>
    apiClient.get('/purchases/stats/summary'),

  getPending: () =>
    apiClient.get('/purchases/pending'),

  // ✅ NOTAS DE CRÉDITO DE COMPRAS
  createCreditNote: (purchaseId: number, data: any) =>
    apiClient.post(`/purchases/${purchaseId}/credit-movements`, data),

  getCreditNotes: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/purchases/credit-movements', { params }),
};

// =============================================
// 🔄 INVENTORY MOVEMENTS API
// =============================================
export const inventoryMovementsAPI = {
  getAll: (params?: { skip?: number; limit?: number; movement_type?: string; product_id?: number }) =>
    apiClient.get('/inventory/movements', { params }),

  getById: (id: number) =>
    apiClient.get(`/inventory/movements/${id}`),

  create: (data: any) =>
    apiClient.post('/inventory/movements', data),

  getByProduct: (productId: number) =>
    apiClient.get(`/inventory/movements/product/${productId}`),

  getByInvoice: (invoiceId: number) =>
    apiClient.get(`/inventory/movements/invoice/${invoiceId}`),

  getSummary: () =>
    apiClient.get('/inventory/movements/stats/summary'),

  getByType: () =>
    apiClient.get('/inventory/movements/stats/by-type'),

  getRecent: (params?: { days?: number; limit?: number }) =>
    apiClient.get('/inventory/movements/recent', { params }),
};

// =============================================
// 🏭 WAREHOUSES API
// =============================================
export const warehousesAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/warehouses', { params }),
  
  getById: (id: number) =>
    apiClient.get(`/warehouses/${id}`),
  
  create: (data: any) =>
    apiClient.post('/warehouses', data),
  
  update: (id: number, data: any) =>
    apiClient.put(`/warehouses/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/warehouses/${id}`),

  getInventoryMovements: (warehouseId: number) =>
    apiClient.get(`/warehouses/${warehouseId}/inventory_movements`),

  getSummary: () =>
    apiClient.get('/warehouses/stats/summary'),

  getProducts: (warehouseId: number) =>
    apiClient.get(`/warehouses/${warehouseId}/products`),

  getLowStock: (warehouseId: number, threshold?: number) =>
    apiClient.get(`/warehouses/${warehouseId}/low-stock`, { params: { threshold } }),
};

// =============================================
// 📦 WAREHOUSE PRODUCTS (STOCK) API
// =============================================
export const warehouseProductsAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/warehouse-products', { params }),

  getByWarehouseAndProduct: (warehouseId: number, productId: number) =>
    apiClient.get(`/warehouse-products/${warehouseId}/${productId}`),

  createOrUpdate: (data: any) =>
    apiClient.post('/warehouse-products/', data),

  updateStock: (warehouseId: number, productId: number, data: any) =>
    apiClient.put(`/warehouse-products/${warehouseId}/${productId}`, data),

  delete: (warehouseId: number, productId: number) =>
    apiClient.delete(`/warehouse-products/${warehouseId}/${productId}`),

  getByWarehouse: (warehouseId: number) =>
    apiClient.get(`/warehouse-products/warehouse/${warehouseId}`),

  getByProduct: (productId: number) =>
    apiClient.get(`/warehouse-products/product/${productId}`),

  getLowStockAll: (threshold?: number) =>
    apiClient.get('/warehouse-products/low-stock', { params: { threshold } }),

  transferStock: (fromWarehouseId: number, toWarehouseId: number, productId: number, quantity: number) =>
    apiClient.post('/warehouse-products/transfer', null, {
      params: { from_warehouse_id: fromWarehouseId, to_warehouse_id: toWarehouseId, product_id: productId, quantity }
    }),

  adjustStock: (warehouseId: number, productId: number, adjustment: number, reason: string) =>
    apiClient.post('/warehouse-products/adjust-stock', null, {
      params: { warehouse_id: warehouseId, product_id: productId, adjustment, reason }
    }),
};

// =============================================
// 🚚 SUPPLIERS API (PARA IMPLEMENTAR EN BACKEND)
// =============================================
export const suppliersAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/suppliers', { params }),
  
  getById: (id: number) =>
    apiClient.get(`/suppliers/${id}`),
  
  create: (data: any) =>
    apiClient.post('/suppliers', data),
  
  update: (id: number, data: any) =>
    apiClient.put(`/suppliers/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/suppliers/${id}`),

  search: (q: string) =>
    apiClient.get('/suppliers/search', { params: { q } }),

  getSummary: () =>
    apiClient.get('/suppliers/stats/summary'),

  getActive: () =>
    apiClient.get('/suppliers/active'),

  getPurchases: (supplierId: number) =>
    apiClient.get(`/suppliers/${supplierId}/purchases`),
};

// =============================================
// 👥 CUSTOMERS API (PARA IMPLEMENTAR EN BACKEND)
// =============================================
export const customersAPI = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/customers', { params }),
  
  getById: (id: number) =>
    apiClient.get(`/customers/${id}`),
  
  create: async (data: any) => {
    try {
      const response = await apiClient.post('/customers', data);
      console.log('✅ Success:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  update: (id: number, data: any) =>
    apiClient.put(`/customers/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/customers/${id}`),

  search: (q: string) =>
    apiClient.get('/customers/search', { params: { q } }),

  getSummary: () =>
    apiClient.get('/customers/stats/summary'),

  getActive: () =>
    apiClient.get('/customers/active'),

  getInvoices: (customerId: number) =>
    apiClient.get(`/customers/${customerId}/invoices`),

  updateCreditLimit: (customerId: number, creditLimit: number) =>
    apiClient.put(`/customers/${customerId}/credit-limit`, { credit_limit: creditLimit }),

  getCreditStatus: (customerId: number) =>
    apiClient.get(`/customers/${customerId}/credit-status`),
};

// =============================================
// 📊 CATEGORIES API (PARA IMPLEMENTAR EN BACKEND)
// =============================================
export const categoriesAPI = {
  getAll: () =>
    apiClient.get('/categories'),

  list: () =>
    apiClient.get('/categories'),

  getById: (id: number) =>
    apiClient.get(`/categories/${id}`),

  getProducts: (id: number) =>
    apiClient.get(`/categories/${id}/products`),

  create: (data: any) =>
    apiClient.post('/categories', data),

  update: (id: number, data: any) =>
    apiClient.put(`/categories/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/categories/${id}`),
};

// =============================================
// 💰 CURRENCIES API (MONEDAS)
// =============================================
// =============================================
// 💱 CURRENCIES API - SISTEMA VENEZOLANO COMPLETO
// =============================================
export const currenciesAPI = {
  // ==================== CRUD BÁSICO ====================
  getAll: (params?: { skip?: number; limit?: number; is_active?: boolean }) =>
    apiClient.get('/currencies/', { params }),

  getById: (id: number) =>
    apiClient.get(`/currencies/${id}`),

  create: (data: any) =>
    apiClient.post('/currencies/', data),

  update: (id: number, data: any) =>
    apiClient.put(`/currencies/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/currencies/${id}`),

  // ==================== TASAS DE CAMBIO ====================

  /**
   * Actualizar tasa de cambio con registro histórico
   * Crea automáticamente un registro en CurrencyRateHistory
   */
  updateRate: (id: number, data: {
    new_rate: string;
    change_reason?: string;
    change_type?: 'manual' | 'automatic_api' | 'scheduled' | 'correction';
    change_source?: string;
    provider_metadata?: any;
  }) =>
    apiClient.put(`/currencies/${id}/rate`, data),

  /**
   * Obtener historial de cambios de tasa
   * Incluye: old_rate, new_rate, diferencia, variación %, usuario, timestamp
   */
  getRateHistory: (id: number, limit: number = 100) =>
    apiClient.get(`/currencies/${id}/rate/history`, { params: { limit } }),

  /**
   * Obtener estadísticas completas de una moneda
   * Incluye: total cambios, última actualización, variación promedio, máxima/mínima
   */
  getStatistics: (id: number) =>
    apiClient.get(`/currencies/${id}/statistics`),

  /**
   * Establecer una moneda como moneda base de la empresa
   * Desactiva automáticamente la moneda base anterior
   */
  setBaseCurrency: (id: number) =>
    apiClient.post(`/currencies/${id}/set-base-currency`),

  // ==================== CONVERSIÓN ====================

  /**
   * Convertir monto entre monedas usando tasas configuradas
   * @param from_currency - Moneda origen (ej: "USD")
   * @param to_currency - Moneda destino (ej: "VES")
   * @param amount - Monto a convertir
   */
  convert: (from_currency: string, to_currency: string, amount: number) =>
    apiClient.get('/currencies/convert', {
      params: {
        from_currency,
        to_currency,
        amount
      }
    }),

  /**
   * Obtener todos los factores de conversión
   * Retorna tabla con: code, name, exchange_rate, conversion_method, factor, applies_igtf
   */
  getConversionFactors: () =>
    apiClient.get('/currencies/factors'),

  // ==================== IGTF (IMPUESTO VENEZOLANO) ====================

  /**
   * Calcular IGTF para una transacción
   * @param amount - Monto en moneda extranjera
   * @param currency_id - ID de moneda
   * @param payment_method - Método de pago (transfer, cash, etc.)
   */
  calculateIGTF: (amount: number, currency_id: number, payment_method: string = 'transfer') =>
    apiClient.post('/currencies/igtf/calculate', null, {
      params: { amount, currency_id, payment_method }
    }),

  /**
   * Obtener configuraciones de IGTF de la empresa
   * @param currency_id - ID de moneda (opcional, para filtrar)
   */
  getIGTFConfigs: (currency_id?: number) =>
    apiClient.get('/currencies/igtf/config', {
      params: currency_id ? { currency_id } : undefined
    }),

  /**
   * Crear configuración personalizada de IGTF
   * Útil para empresas con régimen especial
   */
  createIGTFConfig: (data: any) =>
    apiClient.post('/currencies/igtf/config', data),

  // ==================== VALIDACIÓN ====================

  /**
   * Validar código ISO 4217
   * @param code - Código de 3 letras (ej: "USD")
   */
  validateISO: (code: string) =>
    apiClient.post('/currencies/validate/iso-4217', null, {
      params: { code }
    }),
};

// =============================================
// ✅ SISTEMA ESCRITORIO: COINS API (Desktop ERP)
// =============================================

/**
 * Coins API - Sistema de Monedas Desktop ERP Venezolano
 *
 * Endpoints compatibles con el sistema desktop que incluyen:
 * - Gestión de monedas con campos específicos (factor_type, rounding_type, etc.)
 * - Actualización de tasas con creación automática de coin_history
 * - Consulta de moneda base y monedas activas (show_in_browsers)
 */
export const coinsAPI = {
  // ==================== CONSULTAS ESPECIALES ====================

  /**
   * Obtener la moneda base de la empresa
   * GET /coins/base
   */
  getBaseCoin: () =>
    apiClient.get('/coins/base'),

  /**
   * Obtener solo las monedas activas que se muestran en browsers
   * Equivalente a: show_in_browsers = true AND is_active = true
   * GET /coins/active
   */
  getActiveCoins: () =>
    apiClient.get('/coins/active'),

  // ==================== CRUD BÁSICO ====================

  /**
   * Listar todas las monedas de la empresa
   * GET /coins
   */
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/coins', { params }),

  /**
   * Obtener una moneda por ID
   * GET /coins/{coin_id}
   */
  getById: (coinId: number) =>
    apiClient.get(`/coins/${coinId}`),

  /**
   * Crear nueva moneda (Coin) - Desktop ERP
   * POST /coins
   *
   * Campos del sistema desktop ERP:
   * - code: ISO 4217 (USD, VES, EUR)
   * - sales_aliquot: Tasa de venta
   * - buy_aliquot: Tasa de compra
   * - factor_type: 0 = Base, 1 = Convertida
   * - rounding_type: Tipo de redondeo
   * - status: "01", "02", etc.
   */
  create: (data: {
    code: string;
    name: string;
    symbol: string;
    sales_aliquot: number;
    buy_aliquot?: number;
    factor_type: number;
    rounding_type?: number;
    status?: string;
    show_in_browsers?: boolean;
    value_inventory?: boolean;
    applies_igtf?: boolean;
    decimal_places?: number;
    igtf_rate?: number;
  }) =>
    apiClient.post('/coins', data),

  /**
   * Actualizar moneda (Coin) - Desktop ERP
   * PUT /coins/{coin_id}
   */
  update: (coinId: number, data: {
    name?: string;
    symbol?: string;
    sales_aliquot?: number;
    buy_aliquot?: number;
    factor_type?: number;
    rounding_type?: number;
    status?: string;
    show_in_browsers?: boolean;
    value_inventory?: boolean;
    applies_igtf?: boolean;
    decimal_places?: number;
    igtf_rate?: number;
    is_active?: boolean;
  }) =>
    apiClient.put(`/coins/${coinId}`, data),

  /**
   * Eliminar moneda (solo admin)
   * DELETE /coins/{coin_id}
   *
   * Precaución: Verifica que no esté siendo usada en productos o facturas.
   * No se puede eliminar la moneda base.
   */
  delete: (coinId: number) =>
    apiClient.delete(`/coins/${coinId}`),

  // ==================== TASAS DE CAMBIO ====================

  /**
   * Actualizar tasa de cambio y registrar en historial
   * PUT /coins/{coin_id}/rate?sales_aliquot={value}&buy_aliquot={value}
   *
   * Este endpoint actualiza el exchange_rate y crea automáticamente
   * un registro en coin_history para mantener la auditoría del sistema desktop ERP.
   *
   * Retorna: { message, coin_id, old_rate, new_rate, history_id }
   */
  updateRate: (
    coinId: number,
    salesAliquot: number,
    buyAliquot?: number
  ) =>
    apiClient.put(`/coins/${coinId}/rate`, null, {
      params: {
        sales_aliquot: salesAliquot,
        buy_aliquot: buyAliquot || salesAliquot
      }
    }),
};

// =============================================
// ✅ SISTEMA ESCRITORIO: COIN HISTORY API (Desktop ERP)
// =============================================

/**
 * CoinHistory API - Historial de Tasas de Cambio (Desktop ERP)
 *
 * Sistema de auditoría de cambios de tasas con estructura
 * compatible con el desktop ERP venezolano (fecha y hora separadas).
 */
export const coinHistoryAPI = {
  /**
   * Listar historial de monedas
   * GET /coin-history?currency_id={id}&skip={0}&limit={100}
   */
  getAll: (params?: {
    currency_id?: number;
    skip?: number;
    limit?: number;
  }) =>
    apiClient.get('/coin-history', { params }),

  /**
   * Obtener un registro de historial por ID
   * GET /coin-history/{id}
   */
  getById: (id: number) =>
    apiClient.get(`/coin-history/${id}`),

  /**
   * Crear registro en coin_history
   * POST /coin-history
   */
  create: (data: {
    currency_id: number;
    sales_aliquot: number;
    buy_aliquot: number;
    register_date: string;  // Date ISO
    register_hour: string;  // Time ISO
    user_id?: number;
  }) =>
    apiClient.post('/coin-history', data),

  /**
   * Importación por lotes desde desktop ERP
   * POST /coin-history/batch
   *
   * Permite importar múltiples registros de historial
   * desde el sistema desktop.
   */
  createBatch: (data: Array<{
    currency_id: number;
    sales_aliquot: number;
    buy_aliquot: number;
    register_date: string;
    register_hour: string;
    user_id?: number;
  }>) =>
    apiClient.post('/coin-history/batch', data),

  /**
   * Obtener la tasa más reciente de una moneda
   * GET /coin-history/currency/{currency_id}/latest
   *
   * Retorna el registro más reciente de coin_history
   * para una moneda específica.
   */
  getLatestByCurrency: (currencyId: number) =>
    apiClient.get(`/coin-history/currency/${currencyId}/latest`),
};

// =============================================
// 📏 UNITS API (UNIDADES DE MEDIDA)
// =============================================
export const unitsAPI = {
  getAll: (params?: { skip?: number; limit?: number; active_only?: boolean }) =>
    apiClient.get('/units', { params }),

  getById: (id: number) =>
    apiClient.get(`/units/${id}`),

  create: (data: any) =>
    apiClient.post('/units', data),

  update: (id: number, data: any) =>
    apiClient.put(`/units/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/units/${id}`),
};

// =============================================
// 📊 REPORTS API (LIBRO DE VENTAS/COMPRAS SENIAT)
// =============================================
export const reportsAPI = {
  // Libro de Ventas
  getSalesBook: (params: { start_date: string; end_date: string; invoice_type?: string }) =>
    apiClient.get('/reports/sales-book', { params }),

  // Libro de Compras
  getPurchaseBook: (params: { start_date: string; end_date: string; purchase_type?: string }) =>
    apiClient.get('/reports/purchase-book', { params }),

  // Relación de Ventas (Resumen Gerencial)
  getSalesSummary: (params: { start_date: string; end_date: string; group_by?: string }) =>
    apiClient.get('/reports/sales-summary', { params }),

  // Flujo de Caja por Forma de Pago
  getCashFlow: (params: { start_date: string; end_date: string }) =>
    apiClient.get('/reports/cash-flow', { params }),
};

// =============================================
// 📄 PURCHASE CREDIT NOTES API (NOTAS DE CRÉDITO DE COMPRAS)
// =============================================
export const purchaseCreditNotesAPI = {
  // Crear nota de crédito para una compra
  create: (purchaseId: number, data: any) =>
    apiClient.post(`/purchases/${purchaseId}/credit-movements`, data),

  // Listar todas las notas de crédito de compras
  getAll: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/purchases/credit-movements', { params }),
};

// =============================================
// 🔐 PROTECTED ROUTES API
// =============================================
export const protectedAPI = {
  protected: () =>
    apiClient.get('/protected'),

  adminOnly: () =>
    apiClient.get('/admin-only'),

  managerOnly: () =>
    apiClient.get('/manager-only'),
};

// =============================================
// 🏥 HEALTH CHECK API
// =============================================
export const healthAPI = {
  check: () =>
    apiClient.get('/health'),

  root: () =>
    apiClient.get('/'),
};

// =============================================
// 💰 MULTI-CURRENCY RATES API
// =============================================
export const ratesAPI = {
  // Obtener tasa de hoy
  getTodayRate: (fromCurrency: string, toCurrency: string) =>
    apiClient.get(`/rates/today?from_currency=${fromCurrency}&to_currency=${toCurrency}`),

  // Obtener tasa más reciente
  getLatestRate: (fromCurrency: string, toCurrency: string) =>
    apiClient.get(`/rates/latest?from_currency=${fromCurrency}&to_currency=${toCurrency}`),

  // Obtener historial de tasas
  getRateHistory: (fromCurrency: string, toCurrency: string, limit?: number) =>
    apiClient.get(`/rates/history?from_currency=${fromCurrency}&to_currency=${toCurrency}&limit=${limit || 100}`),

  // Sincronizar tasas BCV
  syncBCVRates: (forceRefresh = false) =>
    apiClient.post(`/rates/bcv/sync?force_refresh=${forceRefresh}`),

  // Estado del servicio BCV
  getBCVStatus: () =>
    apiClient.get('/rates/bcv/status'),

  // Convertir monto entre monedas
  convert: (amount: number, fromCurrency: string, toCurrency: string, rateDate?: string, manualRate?: number) => {
    let url = `/rates/convert?amount=${amount}&from_currency=${fromCurrency}&to_currency=${toCurrency}`;
    if (rateDate) url += `&rate_date=${rateDate}`;
    if (manualRate) url += `&manual_rate=${manualRate}`;
    return apiClient.post(url);
  },

  // Crear tasa manual
  createManualRate: (fromCurrency: string, toCurrency: string, rateDate: string, exchangeRate: number, notes?: string) =>
    apiClient.post(`/rates/manual?from_currency=${fromCurrency}&to_currency=${toCurrency}&rate_date=${rateDate}&exchange_rate=${exchangeRate}${notes ? `&notes=${notes}` : ''}`),
};

// =============================================
// PRECIOS DE REFERENCIA (REF) - VENEZUELA
// =============================================
export const referencePricesAPI = {
  // Obtener precio de referencia de un producto
  getProductReferencePrice: (productId: number, referenceCurrency: string = 'USD') =>
    apiClient.get(`/reference-prices/products/${productId}/reference-price?reference_currency=${referenceCurrency}`),

  // Obtener resumen de precios para múltiples productos
  getProductsSummary: (productIds: number[]) =>
    apiClient.get(`/reference-prices/products/summary?product_ids=${productIds.join(',')}`),

  // Calcular item de factura
  calculateInvoiceItem: (productId: number, quantity: number, priceReferenceOverride?: number, paymentMethod: string = 'transferencia', manualExchangeRate?: number) => {
    const body: any = { product_id: productId, quantity };
    if (priceReferenceOverride) body.price_reference_override = priceReferenceOverride;

    return apiClient.post(`/reference-prices/invoices/calculate-item?payment_method=${paymentMethod}${manualExchangeRate ? `&manual_exchange_rate=${manualExchangeRate}` : ''}`, body);
  },

  // Calcular totales de factura completa
  calculateInvoiceTotals: (items: any[], customerId?: number, paymentMethod: string = 'transferencia', manualExchangeRate?: number, discountPercentage?: number) =>
    apiClient.post('/reference-prices/invoices/calculate-totals', {
      items,
      customer_id: customerId,
      payment_method: paymentMethod,
      manual_exchange_rate: manualExchangeRate,
      discount_percentage: discountPercentage,
    }),
};

// =============================================
// ✅ SISTEMA ESCRITORIO: OPERACIONES DE VENTA
// =============================================
export const salesOperationsAPI = {
  // Listar todas las operaciones
  getAll: (params?: any) =>
    apiClient.get('/sales-operations', { params }),

  // Obtener por ID
  getById: (id: number) =>
    apiClient.get(`/sales-operations/${id}`),

  // Crear nueva operación
  create: (data: any) =>
    apiClient.post('/sales-operations', data),

  // Actualizar operación
  update: (id: number, data: any) =>
    apiClient.put(`/sales-operations/${id}`, data),

  // Eliminar operación
  delete: (id: number) =>
    apiClient.delete(`/sales-operations/${id}`),

  // ✅ Convertir operación a otro tipo
  convert: (id: number, targetType: string) =>
    apiClient.post(`/sales-operations/${id}/convert?target_type=${targetType}`),

  // ✅ Estadísticas
  getStats: () =>
    apiClient.get('/sales-operations/stats/summary'),

  // ✅ Listar por tipo
  getByType: (operationType: string) =>
    apiClient.get(`/sales-operations/type/${operationType}`),

  // ✅ Listar presupuestos
  getBudgets: () =>
    apiClient.get('/sales-operations/type/BUDGET'),

  // ✅ Listar pedidos
  getOrders: () =>
    apiClient.get('/sales-operations/type/ORDER'),

  // ✅ Listar órdenes de entrega
  getDeliveryNotes: () =>
    apiClient.get('/sales-operations/type/DELIVERYNOTE'),

  // ✅ Listar facturas
  getBills: () =>
    apiClient.get('/sales-operations/type/BILL'),

  // ✅ Listar notas de crédito
  getCreditNotes: () =>
    apiClient.get('/sales-operations/type/CREDITNOTE'),

  // ✅ Listar notas de débito
  getDebitNotes: () =>
    apiClient.get('/sales-operations/type/DEBITNOTE'),
};

// =============================================
// EXPORT DEFAULT API CLIENT
// =============================================
export default apiClient;
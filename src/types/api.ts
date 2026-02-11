// =============================================
// TIPOS PARA API DE MONEDAS Y UNIDADES
// =============================================

// Tipos para Monedas (Currency)
export interface Currency {
  id: number;
  company_id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: string; // String con hasta 10 decimales
  decimal_places: number;
  is_base_currency: boolean;
  is_active: boolean;
  conversion_method: 'direct' | 'inverse' | 'via_usd' | 'undefined' | null;
  conversion_factor: string | null;
  applies_igtf: boolean;
  igtf_rate: string | null;
  igtf_exempt: boolean;
  igtf_min_amount: string | null;
  rate_update_method: 'manual' | 'api_bcv' | 'api_binance' | 'api_fixer' | 'scraper' | 'scheduled' | 'webhook';
  last_rate_update: string | null;
  next_rate_update: string | null;
  rate_source_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  notes: string | null;
}

export interface CurrencyCreate {
  code: string; // ISO 4217: 3 letras (USD, VES, EUR)
  name: string; // Nombre completo
  symbol: string; // Símbolo ($, Bs, €)
  exchange_rate: number | string; // Se puede enviar como number o string
  decimal_places?: number; // Default: 2, Max: 10
  is_base_currency?: boolean; // Default: false
  conversion_method?: 'direct' | 'inverse' | 'via_usd' | 'undefined' | null;
  applies_igtf?: boolean; // Default: false
  igtf_rate?: number | string; // Default: 3.00
  igtf_exempt?: boolean; // Default: false
  igtf_min_amount?: number | string; // Monto mínimo para IGTF
  rate_update_method?: 'manual' | 'api_bcv' | 'api_binance' | 'api_fixer' | 'scraper' | 'scheduled' | 'webhook'; // Default: manual
  rate_source_url?: string | null; // URL de API para actualización
  notes?: string | null; // Notas adicionales
}

export interface CurrencyUpdate {
  name?: string;
  symbol?: string;
  exchange_rate?: number | string;
  decimal_places?: number;
  is_active?: boolean;
  conversion_method?: 'direct' | 'inverse' | 'via_usd' | 'undefined' | null;
  applies_igtf?: boolean;
  igtf_rate?: number | string;
  igtf_exempt?: boolean;
  igtf_min_amount?: number | string;
  rate_update_method?: 'manual' | 'api_bcv' | 'api_binance' | 'api_fixer' | 'scraper' | 'scheduled' | 'webhook';
  rate_source_url?: string | null;
  notes?: string | null;
}

// Tipos para actualización de tasa de cambio
export interface CurrencyRateUpdate {
  new_rate: number | string; // Nueva tasa (hasta 10 decimales)
  change_reason?: string; // Razón del cambio (ej: 'Actualización BCV')
  change_type?: 'manual' | 'automatic_api' | 'scheduled' | 'correction'; // Default: manual
  change_source?: string; // Fuente del cambio (ej: 'api_bcv')
  provider_metadata?: any; // Metadata adicional del proveedor
}

// =============================================
// ✅ SISTEMA ESCRITORIO: Coins (Desktop ERP)
// =============================================

/**
 * Coin - Moneda del sistema Desktop ERP Venezolano
 *
 * Campos específicos del sistema desktop con compatibilidad multiempresa.
 */
export interface Coin {
  id: number;
  company_id: number;
  code: string;              // ISO 4217: USD, VES, EUR
  name: string;              // Nombre completo
  symbol: string;            // $, Bs, €

  // Tasas de cambio (Desktop ERP)
  exchange_rate: number;
  sales_aliquot: number;     // Tasa de venta
  buy_aliquot: number;       // Tasa de compra

  // Configuración Desktop ERP
  factor_type: number;       // 0 = Moneda base, 1 = Moneda convertida
  rounding_type: number;     // Tipo de redondeo
  status: string;            // "01", "02", etc.
  show_in_browsers: boolean; // Mostrar en browsers
  value_inventory: boolean;  // Valorar inventario
  applies_igtf: boolean;     // Aplica IGTF

  // Configuración extendida
  decimal_places: number;
  igtf_rate: number | null;
  is_base_currency: boolean;
  is_active: boolean;

  // Actualización de tasas
  last_rate_update: string | null;
  updated_by: number | null;

  // Auditoría
  created_at: string;
  updated_at: string;
  created_by: number | null;
}

/**
 * Para crear nueva moneda (Coin) - Desktop ERP
 */
export interface CoinCreate {
  code: string;              // ISO: USD, VES, EUR
  name: string;              // Full name
  symbol: string;            // $, Bs
  sales_aliquot: number;     // Tasa de venta
  buy_aliquot?: number;      // Tasa de compra (opcional, igual a sales si no se proporciona)
  factor_type: number;       // 0=Base, 1=Converted
  rounding_type?: number;    // Default: 2
  status?: string;           // Default: "01"
  show_in_browsers?: boolean;
  value_inventory?: boolean;
  applies_igtf?: boolean;
  decimal_places?: number;
  igtf_rate?: number;
}

/**
 * Para actualizar moneda (Coin) - Desktop ERP
 */
export interface CoinUpdate {
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
}

/**
 * Respuesta de actualización de tasa con coin_history
 */
export interface CoinRateUpdateResponse {
  message: string;
  coin_id: number;
  old_rate: number;
  new_rate: number;
  history_id: number;
}

// Historial de tasas
export interface CurrencyRateHistory {
  id: number;
  currency_id: number;
  company_id: number;
  old_rate: string;
  new_rate: string;
  rate_difference: string;
  rate_variation_percent: string | null;
  changed_by: number | null;
  change_type: string;
  change_source: string | null;
  changed_at: string;
  change_reason: string | null;
}

// =============================================
// ✅ SISTEMA ESCRITORIO: Coin History (Desktop ERP)
// =============================================

/**
 * CoinHistory - Historial de cambios de tasas de cambio (Desktop ERP Venezolano)
 *
 * Estructura basada en el sistema desktop con campos separados para fecha y hora.
 * Mantiene sales_aliquot (tasa de venta) y buy_aliquot (tasa de compra).
 */
export interface CoinHistory {
  id: number;
  company_id: number;
  currency_id: number;

  // Tasas de cambio (Desktop ERP)
  sales_aliquot: number;  // Tasa de venta
  buy_aliquot: number;    // Tasa de compra

  // Fecha y hora separadas (Desktop ERP)
  register_date: string;  // Date ISO (YYYY-MM-DD)
  register_hour: string;  // Time ISO (HH:MM:SS)

  // Auditoría
  user_id: number | null;
  created_at: string;     // DateTime ISO
}

/**
 * Para crear nuevo registro en coin_history
 */
export interface CoinHistoryCreate {
  currency_id: number;
  sales_aliquot: number;
  buy_aliquot: number;
  register_date: string;  // Date ISO
  register_hour: string;  // Time ISO
  user_id?: number;
}

/**
 * Para actualizar coin_history (si fuera necesario)
 */
export interface CoinHistoryUpdate {
  sales_aliquot?: number;
  buy_aliquot?: number;
  register_date?: string;
  register_hour?: string;
  user_id?: number;
}

// =============================================
// Tipos para Unidades de Medida (Unit)
// =============================================
export interface Unit {
  id: number;
  company_id: number;
  name: string; // Kilogramo, Litro, Unidad
  abbreviation: string; // KG, LTS, UND
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnitCreate {
  name: string;
  abbreviation: string;
  description?: string;
}

export interface UnitUpdate {
  name?: string;
  abbreviation?: string;
  description?: string;
  is_active?: boolean;
}

// =============================================
// REPORTES FISCALES SENIAT
// =============================================

// Tipos para Libro de Ventas
export interface SalesBookReport {
  period_start: string;
  period_end: string;
  company: {
    name: string;
    tax_id: string;
    fiscal_address: string;
  };
  totals: {
    taxable_base: number;
    exempt_amount: number;
    iva_retention: number;
    iva_amount: number;
    total_sales: number;
  };
  invoices: SalesBookInvoice[];
  total_invoices: number;
}

export interface SalesBookInvoice {
  invoice_number: string;
  control_number: string;
  date: string;
  customer_tax_id: string;
  customer_name: string;
  invoice_type: string; // 'factura', 'nota_credito'
  taxable_base: number;
  exempt_amount: number;
  iva_percentage: number;
  iva_amount: number;
  iva_retention: number;
  iva_retention_percentage: number;
  islr_retention: number;
  islr_retention_percentage: number;
  stamp_tax: number;
  subtotal: number;
  total_with_taxes: number;
  transaction_type: string;
  payment_method: string;
}

// Tipos para Libro de Compras
export interface PurchaseBookReport {
  period_start: string;
  period_end: string;
  company: {
    name: string;
    tax_id: string;
    fiscal_address: string;
  };
  totals: {
    taxable_base: number;
    exempt_amount: number;
    iva_retention: number;
    iva_amount: number;
    total_purchases: number;
  };
  purchases: PurchaseBookPurchase[];
  total_purchases_count: number;
}

export interface PurchaseBookPurchase {
  invoice_number: string;
  control_number: string;
  date: string;
  supplier_tax_id: string;
  supplier_name: string;
  purchase_type: string; // 'factura', 'nota_credito'
  taxable_base: number;
  exempt_amount: number;
  iva_percentage: number;
  iva_amount: number;
  iva_retention: number;
  iva_retention_percentage: number;
  islr_retention: number;
  islr_retention_percentage: number;
  stamp_tax: number;
  subtotal: number;
  total_with_taxes: number;
  transaction_type: string;
  payment_method: string;
}

// Tipos para Relación de Ventas (Resumen Gerencial)
export interface SalesSummaryReport {
  period_start: string;
  period_end: string;
  group_by: string; // 'day', 'week', 'month', 'payment_method'
  company: {
    name: string;
    tax_id: string;
  };
  data: SalesSummaryData[];
  totals: {
    total_invoices: number;
    total_amount: number;
    total_iva: number;
    total_retention: number;
    net_total: number;
  };
}

export interface SalesSummaryData {
  period?: string;
  payment_method?: string;
  total_invoices: number;
  total_amount: number;
  total_iva: number;
  total_retention: number;
}

// Tipos para Flujo de Caja
export interface CashFlowReport {
  period_start: string;
  period_end: string;
  company: {
    name: string;
    tax_id: string;
  };
  cash_flow: CashFlowData[];
  totals: {
    total_in: number;
    total_out: number;
    net_balance: number;
  };
}

export interface CashFlowData {
  payment_method: string;
  total_in: number;
  total_out: number;
  balance: number;
  transactions: number;
}

// =============================================
// NOTAS DE CRÉDITO DE COMPRAS
// =============================================

export interface PurchaseCreditMovement {
  id: number;
  purchase_id: number;
  amount: number;
  movement_type: string; // 'nota_credito', 'devolucion'
  reason: string;
  date: string;
  reference_purchase_number?: string;
  reference_control_number?: string;
  stock_reverted: boolean;
  warehouse_id?: number;
}

export interface PurchaseCreditMovementCreate {
  purchase_id: number;
  amount: number;
  movement_type: string;
  reason: string;
  reference_purchase_number?: string;
  reference_control_number?: string;
  warehouse_id?: number;
}

// =============================================
// ACTUALIZACIÓN DE PURCHASES CON CAMPOS SENIAT
// =============================================

export interface Purchase {
  id: number;
  company_id: number;
  supplier_id: number;
  warehouse_id: number;
  purchase_number: string;
  invoice_number?: string; // ✅ Número de factura del proveedor
  control_number?: string; // ✅ VENEZUELA
  date: string;
  total_amount: number;
  status: string;
  items?: PurchaseItem[];

  // ✅ VENEZUELA: Información fiscal
  transaction_type?: string; // 'contado', 'credito'
  payment_method?: string; // 'efectivo', 'transferencia', etc.
  credit_days?: number;
  iva_percentage?: number;
  iva_amount?: number;
  taxable_base?: number;
  exempt_amount?: number;
  iva_retention?: number;
  iva_retention_percentage?: number;
  islr_retention?: number;
  islr_retention_percentage?: number;
  stamp_tax?: number;
  subtotal?: number;
  total_with_taxes?: number;
  supplier_phone?: string;
  supplier_address?: string;
}

export interface PurchaseItem {
  product_id: number;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  tax_rate?: number;
  tax_amount?: number;
  is_exempt?: boolean;
}

export interface PurchaseCreate {
  supplier_id: number;
  warehouse_id: number;
  date: string;
  status?: string;
  items?: PurchaseItemCreate[];

  // ✅ VENEZUELA: Información fiscal
  transaction_type?: string;
  payment_method?: string;
  credit_days?: number;
  iva_percentage?: number;
  invoice_number?: string;
  supplier_phone?: string;
  supplier_address?: string;
}

export interface PurchaseItemCreate {
  product_id: number;
  quantity: number;
  price_per_unit: number;
}

// =============================================
// TIPOS PARA SISTEMA MULTI-MONEDA VENEZOLANO
// =============================================

// Tasa diaria de cambio
export interface DailyRate {
  id: number;
  company_id: number;
  base_currency_id: number;
  target_currency_id: number;
  rate_date: string; // YYYY-MM-DD
  exchange_rate: number;
  source: 'BCV' | 'MANUAL' | 'SCHEDULED' | 'API_BINANCE' | 'API_FIXER';
  is_active: boolean;
  created_at: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
  notes?: string;
  meta_data?: string;
}

// Preview de factura con conversión
export interface InvoicePreviewRequest {
  items: InvoicePreviewItem[];
  customer_id: number;
  payment_method: string;
  manual_exchange_rate?: number | null;
  igtf_exempt?: boolean;
  iva_percentage?: number;
  reference_currency_code?: string; // Default: 'USD'
  payment_currency_code?: string; // Default: 'VES'
}

export interface InvoicePreviewItem {
  product_id: number;
  quantity: number;
}

export interface InvoicePreviewResponse {
  items: InvoicePreviewItemResponse[];
  reference_currency: string;
  payment_currency: string;
  exchange_rate: {
    rate: number;
    rate_date: string;
    source: string;
    inverse_rate: number;
  };
  totals: {
    subtotal_reference: number; // Subtotal en USD
    subtotal_payment: number; // Subtotal en VES
    iva_percentage: number;
    iva_amount: number;
    igtf_percentage: number;
    igtf_amount: number;
    igtf_exempt: boolean;
    total_amount: number; // Total final en VES
  };
  payment_method: string;
}

export interface InvoicePreviewItemResponse {
  product_id: number;
  product_name: string;
  quantity: number;
  price_per_unit_reference: number; // Precio en USD
  price_per_unit_payment: number; // Precio en VES
  total_reference: number; // Total en USD
  total_payment: number; // Total en VES
}

// Producto con precio USD
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  price_usd?: number; // ✅ MULTI-MONEDA: Precio en USD
  cost?: number; // ✅ SISTEMA REF: Costo del producto para cálculo de margen
  quantity: number;
  category_id: number;
  sku?: string;
  currency_id?: number | null;
  company_id: number;
  category?: Category;
}

// =============================================
// TIPOS PARA PRECIOS DE REFERENCIA (REF)
// =============================================

export interface ReferencePriceResponse {
  product_id: number;
  product_name: string;
  price_reference: number | null;
  reference_currency: string;
  available: boolean;
  price_legacy: number | null;
}

export interface ReferencePriceSummary {
  product_id: number;
  product_name: string;
  price_reference: number | null;
  price_ves: number | null;
  reference_currency: string;
  exchange_rate: number | null;
  has_reference_price: boolean;
}

export interface InvoiceItemCalculation {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price_reference: number;
  unit_price_target: number;
  subtotal_reference: number;
  subtotal_target: number;
  exchange_rate: number;
  rate_date: string;
  rate_source: string;
  iva_percentage: number;
  iva_amount: number;
  igtf_percentage: number;
  igtf_amount: number;
  igtf_exempt: boolean;
  total_item: number;
}

export interface InvoiceTotalsResponse {
  reference_currency: string;
  payment_currency: string;
  items: InvoiceItemCalculation[];
  subtotal_reference: number;
  subtotal_target: number;
  iva_amount: number;
  igtf_amount: number;
  discount_amount: number;
  total_amount: number;
  exchange_rate: number | null;
  rate_date: string | null;
  rate_source: string | null;
}

export interface ReferencePriceItemRequest {
  product_id: number;
  quantity: number;
  price_reference_override?: number;
}

export interface ReferencePriceInvoiceRequest {
  items: ReferencePriceItemRequest[];
  customer_id?: number;
  payment_method: string;
  manual_exchange_rate?: number;
  discount_percentage?: number;
}

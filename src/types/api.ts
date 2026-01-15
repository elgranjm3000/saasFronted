// =============================================
// TIPOS PARA API DE REPORTES FISCALES
// =============================================

// Tipos para Monedas (Currency)
export interface Currency {
  id: number;
  company_id: number;
  code: string; // ISO 4217: USD, VES, EUR
  name: string; // Dólar estadounidense, Bolívar, Euro
  symbol: string; // $, Bs, €
  exchange_rate: number;
  is_base_currency: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CurrencyCreate {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_base_currency?: boolean;
}

export interface CurrencyUpdate {
  name?: string;
  symbol?: string;
  exchange_rate?: number;
  is_base_currency?: boolean;
  is_active?: boolean;
}

// Tipos para Unidades de Medida (Unit)
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
  tax_rate?: number;
  is_exempt?: boolean;
}

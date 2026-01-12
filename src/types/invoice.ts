// Tipos de factura actualizados para Venezuela (SENIAT)
export interface Invoice {
  id: number;
  company_id: number;
  customer_id: number;
  warehouse_id: number;
  invoice_number: string;
  control_number?: string; // Número de Control SENIAT
  date: string; // YYYY-MM-DD
  total_amount: number;
  status: 'presupuesto' | 'factura' | 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  discount: number;
  notes?: string;

  // Campos Venezuela SENIAT
  transaction_type?: 'contado' | 'credito'; // Tipo de transacción
  payment_method?: string; // Forma de pago
  credit_days?: number; // Días de crédito

  // IVA
  iva_percentage?: number; // 16, 8, 0
  iva_amount?: number;
  taxable_base?: number; // Base imponible
  exempt_amount?: number; // Monto exento

  // Retenciones
  iva_retention?: number; // Monto retención IVA
  iva_retention_percentage?: number; // 75%, 100%
  islr_retention?: number; // Monto retención ISLR
  islr_retention_percentage?: number; // 1%, 2%, 3%
  stamp_tax?: number; // Impuesto de timbre fiscal

  // Totales
  subtotal?: number;
  total_with_taxes?: number;

  // Cliente
  customer_phone?: string;
  customer_address?: string;

  // Items
  items?: InvoiceItem[];

  created_at?: string;
  updated_at?: string;
}

export interface InvoiceCreate {
  customer_id: number;
  warehouse_id: number;
  status?: string;
  discount?: number;
  date: string;
  items?: InvoiceItemCreate[];
  notes?: string;
  payment_terms?: string;

  // Venezuela
  transaction_type?: 'contado' | 'credito';
  payment_method?: string;
  credit_days?: number;
  iva_percentage?: number;
  customer_phone?: string;
  customer_address?: string;
}

export interface InvoiceUpdate {
  customer_id?: number;
  warehouse_id?: number;
  status?: string;
  discount?: number;
  items?: InvoiceItemCreate[];
  notes?: string;
  payment_terms?: string;

  // Venezuela
  transaction_type?: 'contado' | 'credito';
  payment_method?: string;
  credit_days?: number;
  iva_percentage?: number;
  customer_phone?: string;
  customer_address?: string;
}

export interface InvoiceItem {
  id: number;
  product_id: number;
  quantity: number;
  price_per_unit: number;
  total_price: number;

  // Venezuela
  tax_rate?: number; // 16, 8, 0
  tax_amount?: number;
  is_exempt?: boolean;
}

export interface InvoiceItemCreate {
  product_id: number;
  quantity: number;
  tax_rate?: number; // Por defecto 16
  is_exempt?: boolean; // Por defecto false
}

export interface CreditMovement {
  id: number;
  invoice_id: number;
  amount: number;
  movement_type: string;
  date: string;
}

export interface CreditMovementCreate {
  invoice_id: number;
  amount: number;
  movement_type: string;
}

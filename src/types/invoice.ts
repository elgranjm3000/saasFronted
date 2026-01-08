export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'presupuesto' | 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
  company_id: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceCreate {
  customer_id: number;
  issue_date: string;
  due_date?: string;
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  description?: string;
}

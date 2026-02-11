// ✅ SISTEMA ESCRITORIO: Producto con 31 campos adicionales
export interface Product {
  id: number;
  company_id: number;

  // ✅ Campos básicos
  name: string;
  short_name?: string;  // ✅ SISTEMA ESCRITORIO: Descripción corta
  description?: string;
  sku: string;

  // ✅ SISTEMA ESCRITORIO: Clasificación
  mark?: string;  // Marca
  model?: string;  // Modelo
  department_id?: number;  // Departamento
  size?: string;  // Talla
  color?: string;  // Color
  product_type?: string;  // T=Terminado, S=Servicio, C=Compuesto

  // ✅ SISTEMA ESCRITORIO: Impuestos (códigos)
  sale_tax_code?: string;  // 01=16%, 02=31%, 03=8%, 06=Percibido, EX=Exento
  buy_tax_code?: string;

  // ✅ Precios (legacy + múltiples niveles)
  price?: number;  // Legacy - Precio local (VES)
  price_usd?: number;  // ✅ Precio referencial en USD
  cost?: number;  // Costo del producto
  maximum_price?: number;  // ✅ Precio máximo
  offer_price?: number;  // ✅ Precio oferta
  higher_price?: number;  // ✅ Precio mayor
  minimum_price?: number;  // ✅ Precio mínimo
  sale_price_type?: number;  // ✅ 0=Max, 1=Oferta, 2=Mayor, 3=Min, 4=Variable

  // ✅ Stock e inventario
  quantity?: number;  // Stock actual (legacy)
  stock_quantity?: number;  // ✅ Stock actual (alternativo)
  min_stock?: number;  // Stock mínimo
  maximum_stock?: number;  // ✅ Stock máximo
  allow_negative_stock?: boolean;  // ✅ Permitir vender sin stock
  serialized?: boolean;  // ✅ Usa serial
  use_lots?: boolean;  // ✅ Usa lotes
  lots_order?: number;  // ✅ 0=PEPS, 1=PUPS, 2=Vencimiento

  // ✅ Costeo
  costing_type?: number;  // ✅ 0=Promedio, 1=Último, 2=PEPS, 3=UEPS
  calculated_cost?: number;  // ✅ Costo calculado
  average_cost?: number;  // ✅ Costo promedio

  // ✅ Descuentos y límites de venta
  discount?: number;  // ✅ Descuento del producto
  max_discount?: number;  // ✅ Máximo descuento permitido
  minimal_sale?: number;  // ✅ Cantidad mínima de venta
  maximal_sale?: number;  // ✅ Cantidad máxima de venta

  // ✅ Configuraciones adicionales
  allow_decimal?: boolean;  // ✅ Permitir decimales en cantidad
  rounding_type?: number;  // ✅ Decimales: 0=0,0, 2=0,00, 4=0,0000
  edit_name?: boolean;  // ✅ Permitir editar nombre en ventas
  take_department_utility?: boolean;  // ✅ Usar utilidad del departamento

  // ✅ Moneda
  coin?: string;  // ✅ 01=Bolívar, 02=Dólar
  currency_id?: number;  // ✅ Moneda del precio (legacy)
  currency?: {  // ✅ Datos de la moneda
    id: number;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
  };

  // ✅ Garantía
  days_warranty?: number;  // ✅ Días de garantía

  // ✅ Estado
  status?: string;  // ✅ 01=Activo, 02=Inactivo
  is_active?: boolean;  // Legacy

  // ✅ Legacy fields
  category_id?: number;
  warehouse_id?: number;

  // Relaciones
  category?: {
    id: number;
    name: string;
  };
  department?: {  // ✅ SISTEMA ESCRITORIO
    id: number;
    name: string;
  };
  warehouse?: {
    id: number;
    name: string;
  };

  created_at: string;
  updated_at: string;
}

// ✅ SISTEMA ESCRITORIO: Producto para crear/actualizar
export interface ProductCreate {
  name: string;
  short_name?: string;
  description?: string;
  sku: string;

  // ✅ Clasificación
  mark?: string;
  model?: string;
  department_id?: number;
  size?: string;
  color?: string;
  product_type?: string;

  // ✅ Impuestos
  sale_tax_code?: string;
  buy_tax_code?: string;

  // Precios
  price?: number;
  price_usd?: number;
  cost?: number;
  maximum_price?: number;
  offer_price?: number;
  higher_price?: number;
  minimum_price?: number;
  sale_price_type?: number;

  // Stock
  quantity?: number;
  stock_quantity?: number;
  min_stock?: number;
  maximum_stock?: number;
  allow_negative_stock?: boolean;
  serialized?: boolean;
  use_lots?: boolean;
  lots_order?: number;

  // Costeo
  costing_type?: number;
  calculated_cost?: number;
  average_cost?: number;

  // Descuentos
  discount?: number;
  max_discount?: number;
  minimal_sale?: number;
  maximal_sale?: number;

  // Configuración
  allow_decimal?: boolean;
  rounding_type?: number;
  edit_name?: boolean;
  take_department_utility?: boolean;

  // Moneda
  coin?: string;
  currency_id?: number;

  // Garantía
  days_warranty?: number;

  // Estado
  status?: string;

  // Legacy
  category_id?: number;
  warehouse_id?: number;
}

export interface ProductUpdate {
  name?: string;
  short_name?: string;
  description?: string;
  sku?: string;

  // ✅ Clasificación
  mark?: string;
  model?: string;
  department_id?: number;
  size?: string;
  color?: string;
  product_type?: string;

  // ✅ Impuestos
  sale_tax_code?: string;
  buy_tax_code?: string;

  // Precios
  price?: number;
  price_usd?: number;
  cost?: number;
  maximum_price?: number;
  offer_price?: number;
  higher_price?: number;
  minimum_price?: number;
  sale_price_type?: number;

  // Stock
  quantity?: number;
  stock_quantity?: number;
  min_stock?: number;
  maximum_stock?: number;
  allow_negative_stock?: boolean;
  serialized?: boolean;
  use_lots?: boolean;
  lots_order?: number;

  // Costeo
  costing_type?: number;
  calculated_cost?: number;
  average_cost?: number;

  // Descuentos
  discount?: number;
  max_discount?: number;
  minimal_sale?: number;
  maximal_sale?: number;

  // Configuración
  allow_decimal?: boolean;
  rounding_type?: number;
  edit_name?: boolean;
  take_department_utility?: boolean;

  // Moneda
  coin?: string;
  currency_id?: number;

  // Garantía
  days_warranty?: number;

  // Estado
  status?: string;
  is_active?: boolean;

  // Legacy
  category_id?: number;
  warehouse_id?: number;
}

// ✅ SISTEMA ESCRITORIO: Unidad de producto
export interface ProductUnit {
  id: number;
  company_id: number;
  product_id: number;

  // Identificación
  correlative: number;  // Secuencia: 1, 2, 3, 4, 5...
  unit_id: number;
  unit?: {
    id: number;
    name: string;
    abbreviation: string;
  };

  // Configuración
  main_unit: boolean;  // TRUE = unidad principal
  conversion_factor: number;
  unit_type: number;  // 1=Principal x Secundaria, 2=Secundaria x Principal
  show_in_screen: boolean;
  is_for_buy: boolean;
  is_for_sale: boolean;

  // Costos
  unitary_cost?: number;
  calculated_cost?: number;
  average_cost?: number;
  perc_waste_cost?: number;
  perc_handling_cost?: number;
  perc_operating_cost?: number;
  perc_additional_cost?: number;

  // Precios
  maximum_price?: number;
  offer_price?: number;
  higher_price?: number;
  minimum_price?: number;

  // Utilidades por precio
  perc_maximum_price?: number;
  perc_offer_price?: number;
  perc_higher_price?: number;
  perc_minimum_price?: number;

  // Porcentajes de costo
  perc_freight_cost?: number;
  perc_discount_provider?: number;

  // Medidas físicas
  lenght?: number;
  height?: number;
  width?: number;
  weight?: number;
  capacitance?: number;

  created_at: string;
  updated_at: string;
}

export interface ProductStats {
  total_products: number;
  total_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

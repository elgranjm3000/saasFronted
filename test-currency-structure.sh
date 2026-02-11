#!/bin/bash

# Test del Sistema de Monedas
# Verifica estructura y configuración

echo "=========================================="
echo "  TEST DEL SISTEMA DE MONEDAS"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASS=0
FAIL=0
WARN=0

# Función para verificar archivos
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1 (no encontrado)"
    ((FAIL++))
  fi
}

# Función para verificar directorios
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $1/ (no encontrado)"
    ((FAIL++))
  fi
}

echo "1. Verificando Estructura de Directorios"
echo "----------------------------------------"
check_dir "src/app/(dashboard)/currencies"
check_dir "src/components/currencies"
echo ""

echo "2. Verificando Archivos de Página"
echo "----------------------------------"
check_file "src/app/(dashboard)/currencies/page.tsx"
echo ""

echo "3. Verificando Componentes"
echo "--------------------------"
check_file "src/components/currencies/CurrencyForm.tsx"
check_file "src/components/currencies/RateUpdateModal.tsx"
check_file "src/components/currencies/RateHistory.tsx"
check_file "src/components/currencies/CurrencyConverter.tsx"
check_file "src/components/currencies/IGTFCalculator.tsx"
check_file "src/components/currencies/CurrencySelector.tsx"
check_file "src/components/currencies/index.ts"
echo ""

echo "4. Verificando Store"
echo "-------------------"
check_file "src/store/currency-store.ts"
echo ""

echo "5. Verificando Tipos"
echo "-------------------"
check_file "src/types/currency.ts"
echo ""

echo "6. Verificando Configuración API"
echo "-------------------------------"
check_file "src/lib/api.ts"

# Verificar que currenciesAPI esté definida
if grep -q "currenciesAPI" src/lib/api.ts; then
  echo -e "${GREEN}✓${NC} currenciesAPI está definida en lib/api.ts"
  ((PASS++))
else
  echo -e "${RED}✗${NC} currenciesAPI NO encontrada en lib/api.ts"
  ((FAIL++))
fi
echo ""

echo "7. Verificando Exportaciones"
echo "---------------------------"

# Verificar exportaciones en index.ts
if [ -f "src/components/currencies/index.ts" ]; then
  exports=("CurrencyForm" "RateUpdateModal" "RateHistory" "CurrencyConverter" "IGTFCalculator" "CurrencySelector")
  for export in "${exports[@]}"; do
    if grep -q "export { $export }" src/components/currencies/index.ts; then
      echo -e "${GREEN}✓${NC} $export exportado"
      ((PASS++))
    else
      echo -e "${RED}✗${NC} $export NO exportado"
      ((FAIL++))
    fi
  done
fi
echo ""

echo "8. Verificando Tipos TypeScript"
echo "-------------------------------"

if [ -f "src/types/currency.ts" ]; then
  types=("Currency" "CurrencyRateHistory" "IGTFConfig" "CurrencyConversion" "IGTFResult" "ConversionFactor" "CurrencyStatistics")
  for type in "${types[@]}"; do
    if grep -q "export interface $type" src/types/currency.ts; then
      echo -e "${GREEN}✓${NC} Interface $type definida"
      ((PASS++))
    else
      echo -e "${RED}✗${NC} Interface $type NO encontrada"
      ((FAIL++))
    fi
  done
fi
echo ""

echo "9. Verificando Métodos del Store"
echo "-------------------------------"

if [ -f "src/store/currency-store.ts" ]; then
  methods=("fetchCurrencies" "createCurrency" "updateCurrency" "deleteCurrency" "updateCurrencyRate" "fetchRateHistory" "convertCurrency" "calculateIGTF")
  for method in "${methods[@]}"; do
    if grep -q "$method:" src/store/currency-store.ts; then
      echo -e "${GREEN}✓${NC} Método $type definido"
      ((PASS++))
    else
      echo -e "${RED}✗${NC} Método $method NO encontrado"
      ((FAIL++))
    fi
  done
fi
echo ""

echo "10. Verificando Servidor"
echo "----------------------"

# Verificar si Next.js compila correctamente
echo "Compilando TypeScript..."
if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
  echo -e "${RED}✗${NC} Errores de TypeScript encontrados"
  echo "Ejecuta 'npx tsc --noEmit' para ver detalles"
  ((FAIL++))
else
  echo -e "${GREEN}✓${NC} TypeScript compila sin errores"
  ((PASS++))
fi
echo ""

echo "=========================================="
echo "  RESUMEN DE TESTS"
echo "=========================================="
echo -e "${GREEN}PASSED:${NC} $PASS"
echo -e "${RED}FAILED:${NC} $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✓ Todos los tests pasaron correctamente${NC}"
  exit 0
else
  echo -e "${RED}✗ Algunos tests fallaron${NC}"
  exit 1
fi

# 🏢 ERP System - Frontend

Sistema de gestión empresarial (ERP) moderno desarrollado con Next.js 14, TypeScript y Tailwind CSS. Diseñado para gestionar inventarios, ventas, compras, clientes y proveedores de manera eficiente.

![ERP System](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38BDF8?style=flat-square&logo=tailwind-css)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Módulos](#-módulos)
- [API](#-api)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Desarrollo](#-desarrollo)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 🎯 Gestión Comercial
- **Facturación**: Creación y gestión de facturas de venta
- **Punto de Venta (POS)**: Sistema rápido para ventas en tienda
- **Compras**: Gestión de órdenes de compra a proveedores
- **Clientes**: Base de datos de clientes con historial
- **Proveedores**: Directorio de proveedores y sus productos

### 📦 Gestión de Inventario
- **Productos**: Catálogo completo con gestión de stock
- **Categorías**: Organización de productos por categorías
- **Almacenes**: Soporte multi-almacén con transferencias
- **Control de Stock**: Alertas de stock bajo y movimientos
- **Actualización Automática**: Stock actualizado al crear facturas/compras

### 📊 Reportes y Análisis
- **Dashboard Principal**: Vista general del negocio
- **Reportes Completos**: Análisis de ventas, compras e inventario
- **Filtros por Fecha**: 7 días, 30 días, 90 días, todo el historial
- **KPIs en Tiempo Real**: Indicadores clave de rendimiento
- **Acciones Pendientes**: Alertas de tareas por realizar

### ⚙️ Configuración
- **Perfil de Empresa**: Configuración de datos fiscales
- **Usuario**: Gestión de perfil y contraseña
- **Notificaciones**: Preferencias de alertas por email y navegador
- **Sistema**: Moneda, formato de fecha, zona horaria, prefijos

### 🔐 Seguridad
- **Autenticación**: Login con JWT
- **Protección de Rutas**: Middleware de autenticación
- **Gestión de Tokens**: Almacenamiento seguro de tokens
- **Roles de Usuario**: Sistema de permisos

## 🛠️ Tecnologías

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript 5](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Componentes**: React 18 con Server Components
- **Iconos**: [Lucide React](https://lucide.dev/)

### Estado y Datos
- **Cliente HTTP**: Axios
- **Contexto**: React Context para autenticación
- **Hooks**: Custom hooks para lógica de negocio
- **Formularios**: React Hook Form (listo para implementar)

### Backend (Integración)
- **API**: REST API con FastAPI (backend separado)
- **Autenticación**: JWT tokens
- **CORS**: Configurado para desarrollo

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de usuario para autenticación

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/elgranjm3000/saas.git
cd saas
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=ERP System
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL de la API backend | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | `ERP System` |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación | `http://localhost:3000` |

### Configuración de API

Asegúrate de que el backend esté corriendo en la URL configurada. El frontend intentará conectarse a:
```
http://localhost:8000/api/v1/
```

## 🚀 Uso

### Iniciar Sesión
1. Ve a `/login`
2. Ingresa tu email y contraseña
3. Serás redirigido al dashboard

### Navegación
Usa el menú lateral para navegar entre módulos:
- 🏠 **Dashboard**: Vista general
- 📦 **Productos**: Catálogo de productos
- 📄 **Facturas**: Gestión de ventas
- 🛒 **Compras**: Órdenes de compra
- 🏭 **Almacenes**: Gestión de inventario
- 👥 **Clientes**: Base de clientes
- 🚚 **Proveedores**: Directorio de proveedores
- 📊 **Reportes**: Estadísticas y análisis
- ⚙️ **Configuración**: Ajustes del sistema

## 📱 Módulos

### 🏠 Dashboard
Vista general con:
- Estadísticas clave del negocio
- Gráficos de tendencias
- Actividad reciente
- Alertas y acciones pendientes

### 📦 Productos
- **Listado**: Vista de todos los productos con búsqueda y filtros
- **Crear**: Agregar nuevos productos con imágenes, precios, stock
- **Editar**: Modificar productos existentes
- **Detalles**: Ver información completa de un producto
- **Categorías**: Organizar productos por categorías

### 📄 Facturas
- **Listado**: Todas las facturas con filtros por estado, fecha, cliente
- **Crear**: Nueva factura con múltiples productos
- **POS**: Sistema rápido de punto de venta
- **Editar**: Modificar facturas (según permisos)
- **Gestión de Stock**: Stock actualizado automáticamente

### 🛒 Compras
- **Listado**: Órdenes de compra con detalles de proveedor
- **Crear**: Nueva orden de compra
- **Estados**: Pendiente, Aprobada, Recibida, Cancelada
- **Actualización de Stock**: Stock incrementado al crear compra
- **Proveedores**: Integración con el módulo de proveedores

### 👥 Clientes
- **Directorio**: Lista de clientes con información de contacto
- **Historial**: Facturas y pagos de cada cliente
- **Créditos**: Estado de crédito y límites
- **Crear/Editar**: Gestión completa de clientes

### 🚚 Proveedores
- **Directorio**: Lista de proveedores
- **Productos por Proveedor**: Ver productos de cada proveedor
- **Historial de Compras**: Órdenes de compra a cada proveedor
- **Crear/Editar**: Gestión completa de proveedores

### 🏭 Almacenes
- **Multi-almacén**: Soporte para múltiples ubicaciones
- **Stock por Almacén**: Control independiente de inventario
- **Transferencias**: Mover stock entre almacenes
- **Productos por Almacén**: Ver qué productos hay en cada ubicación

### 📊 Reportes
- **Ventas**: Análisis de ventas por período
- **Compras**: Análisis de compras por período
- **Inventario**: Estado actual del inventario
- **Productos Bajos de Stock**: Alertas de reabastecimiento
- **KPIs**: Indicadores clave de rendimiento

### ⚙️ Configuración
- **Empresa**: Datos fiscales y de contacto
- **Usuario**: Perfil y contraseña
- **Notificaciones**: Preferencias de alertas
- **Sistema**: Moneda, formatos, zona horaria

## 🔌 API

### Endpoints Principales

#### Autenticación
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
```

#### Productos
```
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

#### Facturas
```
GET    /api/v1/invoices
GET    /api/v1/invoices/{id}
POST   /api/v1/invoices
PUT    /api/v1/invoices/{id}
DELETE /api/v1/invoices/{id}
```

#### Compras
```
GET    /api/v1/purchases
GET    /api/v1/purchases/{id}
POST   /api/v1/purchases
PUT    /api/v1/purchases/{id}
DELETE /api/v1/purchases/{id}
```

#### Clientes
```
GET    /api/v1/customers
GET    /api/v1/customers/{id}
POST   /api/v1/customers
PUT    /api/v1/customers/{id}
DELETE /api/v1/customers/{id}
```

#### Proveedores
```
GET    /api/v1/suppliers
GET    /api/v1/suppliers/{id}
POST   /api/v1/suppliers
PUT    /api/v1/suppliers/{id}
DELETE /api/v1/suppliers/{id}
```

#### Almacenes
```
GET    /api/v1/warehouses
GET    /api/v1/warehouses/{id}
POST   /api/v1/warehouses
PUT    /api/v1/warehouses/{id}
DELETE /api/v1/warehouses/{id}
GET    /api/v1/warehouses/{id}/products
```

### Cliente API

El cliente HTTP está configurado en `src/lib/api.ts` con:
- Interceptores para agregar tokens JWT
- Manejo centralizado de errores
- Tipos TypeScript para todas las respuestas
- Métodos helper para endpoints comunes

## 📁 Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js 14
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   ├── login/               # Página de login
│   │   └── layout.tsx           # Layout de auth
│   ├── (dashboard)/             # Grupo de rutas del dashboard
│   │   ├── dashboard/           # Página principal
│   │   ├── products/            # Módulo de productos
│   │   │   ├── [id]/           # Detalles de producto
│   │   │   │   ├── edit/       # Editar producto
│   │   │   │   └── page.tsx     # Ver producto
│   │   │   ├── new/            # Crear producto
│   │   │   └── page.tsx         # Listado de productos
│   │   ├── invoices/            # Módulo de facturas
│   │   │   ├── [id]/           # Detalles de factura
│   │   │   ├── pos/            # Punto de venta
│   │   │   └── new/            # Nueva factura
│   │   ├── purchases/           # Módulo de compras
│   │   │   ├── [id]/           # Detalles de compra
│   │   │   │   └── edit/       # Editar compra
│   │   │   └── new/            # Nueva compra
│   │   ├── customers/           # Módulo de clientes
│   │   ├── suppliers/           # Módulo de proveedores
│   │   ├── warehouses/          # Módulo de almacenes
│   │   ├── categories/          # Módulo de categorías
│   │   ├── reports/             # Reportes y estadísticas
│   │   ├── settings/            # Configuración
│   │   └── layout.tsx           # Layout del dashboard
│   ├── api/                     # API Routes de Next.js
│   ├── middleware.ts            # Middleware de autenticación
│   └── page.tsx                 # Página principal
├── components/                  # Componentes reutilizables
│   ├── DashboardLayout.tsx      # Layout principal
│   └── ...                     # Otros componentes
├── contexts/                    # Contextos de React
│   └── AuthContext.tsx          # Contexto de autenticación
├── hooks/                       # Custom hooks
│   ├── useProductForm.ts        # Hook para formulario de productos
│   ├── useProfile.ts            # Hook para perfil
│   └── ...                     # Otros hooks
├── lib/                         # Utilidades y configuración
│   ├── api.ts                   # Cliente HTTP
│   ├── utils.ts                 # Funciones utilitarias
│   └── errorHandler.ts          # Manejo de errores
├── types/                       # Tipos TypeScript
│   ├── product.ts               # Tipos de productos
│   ├── customer.ts              # Tipos de clientes
│   ├── supplier.ts              # Tipos de proveedores
│   ├── warehouse.ts             # Tipos de almacenes
│   └── category.ts              # Tipos de categorías
└── styles/                      # Estilos globales
```

## 📸 Capturas de Pantalla

### Dashboard
Vista general con estadísticas y actividad reciente del negocio.

### Productos
Gestión completa del catálogo de productos con control de stock.

### Facturas
Sistema de facturación con lista de productos y cálculos automáticos.

### Punto de Venta (POS)
Interfaz rápida para ventas en tienda física.

### Compras
Gestión de órdenes de compra a proveedores con actualización de stock.

### Reportes
Análisis detallado de ventas, compras e inventario con filtros por fecha.

### Configuración
Ajustes del sistema, empresa y preferencias de usuario.

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Código
npm run lint         # Ejecuta linter
npm run type-check   # Verifica tipos TypeScript

# Testing (por agregar)
npm run test         # Ejecuta tests
npm run test:watch   # Tests en modo watch
```

### Arquitectura

#### Server Components vs Client Components
- **Server Components**: Por defecto en Next.js 14 para mejor rendimiento
- **Client Components**: Marcados con `'use client'` para interactividad

#### Estado Global
- **AuthContext**: Manejo de autenticación y usuario
- **Local State**: useState para estado de componente
- **Server State**: Datos fetcheados del backend

#### Estilos
- **Tailwind CSS**: Utilidades para estilos
- **CSS Modules**: Para estilos específicos de componente
- **Diseño Responsive**: Mobile-first approach

### Convenciones de Código

- **TypeScript**: Todo el código está tipado
- **ESLint**: Linter para mantener calidad del código
- **Prettier**: Formateador de código (configuración recomendada)
- **Nomenclatura**:
  - Componentes: PascalCase
  - Funciones: camelCase
  - Constantes: UPPER_CASE
  - Archivos: kebab-case

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Reportar Bugs

Para reportar bugs, por favor abre un issue con:
- Descripción detallada del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Capturas de pantalla si es aplicable
- Entorno (SO, navegador, versión)

### Sugerencias

Para sugerencias de features:
1. Abre un issue describiendo la feature sugerida
2. Explica el caso de uso
3. Propón soluciones si es posible

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Juan Miguel** - *Desarrollo inicial* - [elgranjm3000](https://github.com/elgranjm3000)

## 🙏 Agradecimientos

- Next.js team por el excelente framework
- Tailwind CSS por las utilidades de estilos
- La comunidad open source

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta a juan.miguel@example.com.

---

**Hecho con ❤️ usando Next.js y TypeScript**

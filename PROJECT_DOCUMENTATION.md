# 📋 DOCUMENTACIÓN COMPLETA - TIENDA DE CICLISMO

_Consolidación de toda la documentación del proyecto_
**Fecha de actualización:** 6 de septiembre de 2025
**Proyecto:** RockbrosShop - Tienda online de accesorios y repuestos de ciclismo

---

## 📑 ÍNDICE

1. [Información General del Proyecto](#información-general-del-proyecto)
2. [Configuración e Instalación](#configuración-e-instalación)
3. [Sistema de Autenticación y Administradores](#sistema-de-autenticación-y-administradores)
4. [Arquitectura del Backend](#arquitectura-del-backend)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Limpieza y Correcciones](#limpieza-y-correcciones)
7. [Estado del Sistema](#estado-del-sistema)
8. [Resolución de Problemas](#resolución-de-problemas)
9. [Guías de Despliegue](#guías-de-despliegue)

---

## 📋 INFORMACIÓN GENERAL DEL PROYECTO

### Descripción

Proyecto completo para una tienda online de accesorios y repuestos de ciclismo orientada a Colombia. Incluye frontend con React + TypeScript y backend integrado con Supabase.

### Tecnologías Principales

#### Frontend

- **Vite** - Build tool y servidor de desarrollo
- **React + TypeScript** - Framework y sistema de tipos
- **Tailwind CSS** - Framework de estilos
- **shadcn-ui** - Biblioteca de componentes UI
- **React Query** - Gestión de estado del servidor
- **React Router** - Navegación entre páginas

#### Backend

- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
- **Zod** - Validación de esquemas
- **TypeScript** - Tipos end-to-end

### Características del Sistema

- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth con roles (usuario/admin)
- **Storage**: Imágenes de productos en bucket público
- **Validación**: Esquemas Zod para type-safety
- **API**: Servicios TypeScript completamente tipados

---

## ⚙️ CONFIGURACIÓN E INSTALACIÓN

### Requisitos Previos

- Node.js (recomendado instalar con nvm)
- npm, bun o pnpm
- Cuenta en Supabase

### Instalación Paso a Paso

#### 1. Clonar e instalar

```bash
# Clonar el repositorio
git clone <TU_URL_GIT>
cd tienda_ciclismo

# Instalar dependencias
npm install
# o
bun install
```

#### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local
```

Configurar `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# Admin Configuration (temporal - migrar a roles en producción)
VITE_ADMIN_SECRET=tu_secreto_admin

# Storage Configuration
VITE_STORAGE_BUCKET_NAME=product-images
```

#### 3. Configurar Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecutar `supabase/schema.sql` en el SQL Editor de Supabase
3. Configurar el bucket de storage `product-images` como público
4. Ejecutar `supabase/admin-setup.sql` para configurar administradores

#### 4. Iniciar desarrollo

```bash
npm run dev
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN Y ADMINISTRADORES

### Configuración de Administradores

#### Archivos del Sistema

| Archivo             | Propósito                           | Cuándo usar              |
| ------------------- | ----------------------------------- | ------------------------ |
| `schema.sql`        | Schema completo de la base de datos | Primera instalación      |
| `admin-setup.sql`   | Sistema de administradores          | Configurar admins        |
| `verify-system.sql` | Diagnóstico y verificación          | Verificar funcionamiento |

#### Instalación Rápida

1. **Ejecutar Schema Principal**

   ```sql
   -- Ejecutar en Supabase SQL Editor:
   -- 1. Abrir schema.sql
   -- 2. Ejecutar todo el contenido
   ```

2. **Configurar Administradores**

   ```sql
   -- Ejecutar en Supabase SQL Editor:
   -- 1. Abrir admin-setup.sql
   -- 2. EDITAR los emails en la sección "CONFIGURAR ADMINISTRADORES AQUÍ"
   -- 3. Ejecutar todo el contenido
   ```

3. **Verificar Sistema**
   ```sql
   -- Ejecutar en Supabase SQL Editor:
   -- 1. Abrir verify-system.sql
   -- 2. Ejecutar para diagnosticar el sistema
   ```

#### Personalizar Administradores

En `admin-setup.sql`, editar:

```sql
-- 🔧 CONFIGURAR ADMINISTRADORES AQUÍ:
admin_emails text[] := ARRAY[
    'tu-email@ejemplo.com',     -- ← Cambiar por tu email real
    'gerente@ejemplo.com'       -- ← Cambiar por email del gerente
];

admin_names text[] := ARRAY[
    'Tu Nombre Completo',       -- ← Cambiar por tu nombre
    'Gerente de Tienda'         -- ← Cambiar por nombre del gerente
];
```

#### Comandos Útiles

```sql
-- Crear nuevo administrador
SELECT public.create_admin_user('email@ejemplo.com', 'Nombre Completo');

-- Ver administradores
SELECT email, full_name, is_admin FROM public.profiles WHERE is_admin = true;

-- Remover administrador
SELECT public.remove_admin_role('email@ejemplo.com');
```

#### Seguridad

- ✅ Solo administradores pueden crear productos
- ✅ Solo administradores pueden ver órdenes de todos los usuarios
- ✅ Solo administradores pueden acceder al panel de admin
- ✅ Políticas RLS protegen todas las operaciones
- ✅ No se puede remover el último administrador

---

## 🏗️ ARQUITECTURA DEL BACKEND

### Visión General

Framework principal con rutas API integradas y BBDD/autenticación mediante Supabase (PostgreSQL + Auth + Storage). El backend está enfocado en CRUD de productos, gestión de pedidos, direcciones de usuario y manejo de imágenes.

### Clientes Supabase

- **`lib/supabase.ts`** - Cliente público para el frontend
- **`lib/supabaseServer.ts`** - Cliente para operaciones server-side
- **`lib/supabaseAdmin.ts`** - Cliente administrativo con permisos elevados

### Autenticación y Autorización

- **`lib/auth.ts`** - Funciones principales:
  - `requireUser()` - Obtiene sesión y exige que exista usuario
  - `isCurrentUserAdmin()` - Verifica si el usuario actual es admin
  - `requireAdmin()` - Usa isCurrentUserAdmin y devuelve error 401 si no es admin

### Modelo de Datos

#### Tablas Principales

- **products** - Catálogo de productos con precios, stock, categorías
  - Campos: id, name, description, price, stock, category, sizes, colors, images, is_featured, status
- **orders** - Sistema de pedidos
  - Campos: id, user_id, total, status, shipping_address, billing_address
- **order_items** - Items de cada orden
  - Campos: id, order_id, product_id, quantity, price, size, color
- **addresses** - Direcciones de envío y facturación
  - Campos: id, user_id, full_name, phone, address_line1/2, city, region, postal_code, country
- **profiles** - Perfiles de usuario con roles
  - Campos: id, email, full_name, phone, is_admin, avatar_url

#### Funciones SQL

- **`create_order_with_items`** - Transacción atómica para crear orden y sus items
- **`create_admin_user`** - Promover usuario a administrador
- **`get_admin_users`** - Listar todos los administradores
- **`remove_admin_role`** - Remover privilegios de admin

### Servicios Disponibles

```typescript
// Productos
import { useProducts, useFeaturedProducts } from './lib/products'

// Autenticación
import { useAuth } from './hooks/use-auth'

// Storage
import { StorageService } from './lib/services'

// Administración
import { useAdminManagement } from './lib/admin-management'
```

---

## 📁 ESTRUCTURA DEL PROYECTO

### Estructura Completa

```
tienda_ciclismo/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 components/               # Componentes reutilizables
│   │   ├── 📁 ui/                  # Componentes base (shadcn-ui)
│   │   ├── Header.tsx              # Cabecera de la aplicación
│   │   ├── Footer.tsx              # Pie de página
│   │   ├── ProductGrid.tsx         # Grilla de productos
│   │   ├── AuthDialog.tsx          # Diálogo de autenticación
│   │   ├── CartSheet.tsx           # Panel lateral del carrito
│   │   ├── FavoritesSheet.tsx      # Panel lateral de favoritos
│   │   ├── UserMenu.tsx            # Menú de usuario
│   │   └── AdminRoute.tsx          # Protección de rutas admin
│   ├── 📁 hooks/                   # Hooks personalizados
│   │   ├── use-auth.tsx            # Autenticación y roles
│   │   ├── use-cart.tsx            # Gestión del carrito
│   │   ├── use-favorites.tsx       # Gestión de favoritos
│   │   ├── use-profile.tsx         # Gestión de perfiles
│   │   └── use-mobile.tsx          # Detección de dispositivos
│   ├── 📁 lib/                     # Lógica de negocio
│   │   ├── 📁 services/            # Servicios para API
│   │   │   ├── productService.ts   # CRUD de productos
│   │   │   ├── orderService.ts     # Gestión de órdenes
│   │   │   └── storageService.ts   # Gestión de archivos
│   │   ├── auth.ts                 # Helpers de autenticación
│   │   ├── admin-management.ts     # Gestión de administradores
│   │   ├── products.ts             # Lógica de productos
│   │   ├── schemas.ts              # Validación con Zod
│   │   ├── supabase.ts             # Cliente Supabase
│   │   ├── types.ts                # Tipos TypeScript
│   │   └── utils.ts                # Utilidades generales
│   ├── 📁 pages/                   # Páginas de la aplicación
│   │   ├── Index.tsx               # Página principal
│   │   ├── Login.tsx               # Página de login
│   │   ├── Profile.tsx             # Perfil de usuario
│   │   ├── Orders.tsx              # Historial de órdenes
│   │   ├── Favorites.tsx           # Productos favoritos
│   │   ├── Addresses.tsx           # Gestión de direcciones
│   │   ├── AdminDashboard.tsx      # Panel de administración
│   │   └── NotFound.tsx            # Página 404
│   └── 📁 assets/                  # Recursos estáticos
│       ├── hero-banner.jpg         # Banner principal
│       └── product-*.jpg           # Imágenes de productos
├── 📁 supabase/                    # Configuración de base de datos
│   ├── schema.sql                  # Schema principal
│   ├── admin-setup.sql             # Sistema de administradores
│   └── verify-system.sql           # Verificación del sistema
├── 📁 docs/                        # Documentación técnica
│   ├── backend-setup.md            # Configuración del backend
│   └── supabase-setup.md           # Configuración de Supabase
├── 📁 public/                      # Archivos públicos
│   ├── favicon.ico                 # Icono de la aplicación
│   ├── manifest.json               # Manifiesto PWA
│   └── robots.txt                  # Configuración SEO
└── 📄 Archivos de configuración
    ├── package.json                # Dependencias y scripts
    ├── vite.config.ts              # Configuración de Vite
    ├── tailwind.config.ts          # Configuración de Tailwind
    ├── tsconfig.json               # Configuración de TypeScript
    └── .env.local                  # Variables de entorno
```

### Resumen por Carpetas

#### 📁 `src/components/`

**Propósito**: Componentes reutilizables de la interfaz
**Contenido clave**: Componentes UI, diálogos, sheets, grillas
**Dependencias**: shadcn-ui, React, hooks personalizados

#### 📁 `src/hooks/`

**Propósito**: Lógica de estado y efectos reutilizables
**Contenido clave**: Autenticación, carrito, favoritos, perfiles
**Dependencias**: React Query, Supabase, Context API

#### 📁 `src/lib/`

**Propósito**: Lógica de negocio y utilidades
**Contenido clave**: Servicios API, tipos, validaciones, clientes Supabase
**Dependencias**: Supabase, Zod, TypeScript

#### 📁 `src/pages/`

**Propósito**: Páginas principales de la aplicación
**Contenido clave**: Rutas, vistas principales, layouts
**Dependencias**: React Router, hooks, componentes

#### 📁 `supabase/`

**Propósito**: Configuración y scripts de base de datos
**Contenido clave**: Schema, funciones SQL, políticas RLS
**Dependencias**: PostgreSQL, Supabase

---

## 🧹 LIMPIEZA Y CORRECCIONES

### Resumen de Cambios Realizados

#### Archivos Eliminados

- ❌ `src/hooks/use-cart.ts` - Archivo incompleto que causaba conflictos
- ❌ `src/hooks/use-performance.ts.bak` - Archivo de backup innecesario
- ❌ Múltiples archivos SQL redundantes en `supabase/`

#### Archivos Consolidados

- ✅ `supabase/schema.sql` - Schema principal unificado
- ✅ `supabase/admin-setup.sql` - Sistema de administradores completo
- ✅ `supabase/verify-system.sql` - Diagnóstico del sistema

#### Correcciones de Tipos

1. **Eliminación de `any`** - Reemplazado por tipos específicos
2. **Alineación de esquemas** - `role` → `is_admin` en toda la base de datos
3. **Type assertions** - Corrección de tipos en funciones admin

#### Correcciones de Fast Refresh

```typescript
// Antes (causaba warning):
export const useCart = () => {

// Después (corregido):
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
```

---

## 📊 ESTADO DEL SISTEMA

### Supabase - Estado de Configuración

#### ✅ Completado

- Schema de base de datos implementado
- Políticas RLS configuradas
- Funciones de administración creadas
- Bucket de storage configurado
- Autenticación funcionando

#### 🔧 En Desarrollo

- Optimización de queries
- Mejoras de performance
- Funciones de analytics

#### ⚠️ Pendiente

- Integración con pasarela de pagos
- Sistema de notificaciones
- Backup automático

### Frontend - Estado de Implementación

#### ✅ Completado

- Sistema de autenticación completo
- CRUD de productos funcionando
- Carrito de compras operativo
- Sistema de favoritos implementado
- Panel de administración funcional
- Gestión de perfiles y direcciones

#### 🔧 En Mejora

- Optimización de imágenes
- Lazy loading de componentes
- Performance monitoring

---

## 🔧 RESOLUCIÓN DE PROBLEMAS

### Problemas de Autenticación

#### No puedo acceder al panel admin

1. Ejecuta `verify-system.sql` en Supabase
2. Verifica que tu email aparezca como administrador
3. Si no aparece: `SELECT public.create_admin_user('tu-email@ejemplo.com', 'Tu Nombre');`

#### Error "Usuario no encontrado"

1. El usuario debe registrarse primero en la aplicación
2. Luego ejecutar la función para promover a admin

### Problemas de Base de Datos

#### Error "column 'role' does not exist"

El sistema usa `is_admin` boolean en lugar de `role` text:

```sql
-- ❌ Incorrecto
WHERE profiles.role = 'admin'

-- ✅ Correcto
WHERE profiles.is_admin = true
```

#### Problemas de permisos RLS

1. Ejecuta `verify-system.sql` para diagnóstico completo
2. Verifica que todas las políticas estén activas
3. Confirma que el usuario esté autenticado

### Problemas de TypeScript

#### Type errors con Supabase

```typescript
// Usar type assertion cuando sea necesario
const profile = data as { is_admin: boolean }
```

#### Errores de importación

Verificar que todos los paths sean absolutos y correctos en `tsconfig.json`

---

## 🚀 GUÍAS DE DESPLIEGUE

### Variables de Entorno (Producción)

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_privada
VITE_ADMIN_SECRET=secreto_temporal_admin
```

### Comandos de Build

```bash
# Build para producción
npm run build

# Preview local del build
npm run preview

# Verificar tipos
npx tsc --noEmit
```

### Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Schema de base de datos aplicado
- [ ] Administradores configurados
- [ ] Bucket de storage público
- [ ] Políticas RLS activadas
- [ ] Build sin errores
- [ ] Tests pasando

### Próximas Funcionalidades

- [ ] Integración con pasarela de pagos
- [ ] Sistema de reseñas y calificaciones
- [ ] Búsqueda avanzada y filtros
- [ ] Notificaciones en tiempo real
- [ ] Analytics de productos
- [ ] Sistema de cupones y descuentos
- [ ] PWA completa
- [ ] Multi-idioma

---

## 📞 SOPORTE Y CONTACTO

### Para Desarrolladores

- Revisar esta documentación primero
- Ejecutar `verify-system.sql` para diagnósticos
- Verificar logs de Supabase
- Comprobar variables de entorno

### Para Administradores

- Acceder via panel de admin una vez configurado
- Usar funciones SQL para gestión manual
- Revisar políticas de seguridad regularmente

---

**📝 Nota**: Esta documentación se actualiza continuamente. Para cambios importantes, consultar el historial de commits en Git.

**🗓️ Última actualización**: 6 de septiembre de 2025
**✅ Estado**: Sistema operativo y funcional

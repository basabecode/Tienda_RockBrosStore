# 🚴‍♂️ Tienda RockBros Store# 🚴‍♂️ Tienda RockBros Store# 🚴‍♂️ Tienda RockBros Store

Tienda online completa de accesorios y repuestos para ciclismo, desarrollada con **React + TypeScript + Supabase**. Sistema de autenticación robusto, gestión de productos, carrito de compras y panel de administración integrado.

**Repositorio**: [github.com/basabecode/tienda_RockBrosStore](https://github.com/basabecode/tienda_RockBrosStore)Tienda online completa de accesorios y repuestos para ciclismo, desarrollada con **React + TypeScript + Supabase**. Sistema de autenticación robusto, gestión de productos, carrito de compras y panel de administración integrado.Tienda online completa de accesorios y repuestos para ciclismo, desarrollada con React + TypeScript + Supabase. Sistema de autenticación, gestión de productos, carrito de compras y panel de administración integrado.

---

## ✨ Características Principales**Repositorio**: [github.com/basabecode/tienda_RockBrosStore](https://github.com/basabecode/tienda_RockBrosStore)## ✨ Características Principales

- 🔐 **Sistema de autenticación** completo con Supabase Auth

- 👑 **Panel de administración** con gestión de usuarios y perfiles admin

- 🛒 **Carrito de compras** funcional y persistente---- 🔐 **Sistema de autenticación** completo con Supabase Auth

- ❤️ **Lista de favoritos** integrada

- 📱 **Diseño responsive** con TailwindCSS- 👑 **Panel de administración** con gestión de usuarios admin

- 🎨 **Componentes UI** modernos con shadcn/ui

- 🔍 **Sistema de búsqueda** y filtros avanzados## ✨ Características Principales- 🛒 **Carrito de compras** funcional

- 📊 **Dashboard administrativo** completo

- 🛡️ **Protección de rutas** admin con RLS- ❤️ **Lista de favoritos**

- 🔧 **Herramientas de desarrollo** integradas

- 📸 **Gestión de imágenes** con Supabase Storage- 🔐 **Sistema de autenticación** completo con Supabase Auth- 📱 **Diseño responsive** con TailwindCSS

- 📊 **Base de datos relacional** con PostgreSQL

- 👑 **Panel de administración** con gestión de usuarios y perfiles admin- 🎨 **Componentes UI** modernos con shadcn/ui

---

- 🛒 **Carrito de compras** funcional y persistente- 🔍 **Sistema de búsqueda** y filtros

## 🚀 Guía de Inicio Rápido

- ❤️ **Lista de favoritos** integrada- 📊 **Dashboard administrativo**

### ✅ Requisitos

- 📱 **Diseño responsive** con TailwindCSS- 🛡️ **Protección de rutas** admin

- **Node.js 18+** (recomendado instalar con [nvm](https://github.com/nvm-sh/nvm))

- **npm**, **yarn**, o **bun**- 🎨 **Componentes UI** modernos con shadcn/ui- 🔧 **Herramientas de desarrollo** integradas

- **Cuenta en Supabase** (gratis en [supabase.com](https://supabase.com))

- **Git**- 🔍 **Sistema de búsqueda** y filtros avanzados

### 📦 Instalación- 📊 **Dashboard administrativo** completo## 🚀 Configuración Rápida

```````bash- 🛡️ **Protección de rutas** admin con RLS

# 1. Clonar el repositorio

git clone https://github.com/basabecode/tienda_RockBrosStore.git- 🔧 **Herramientas de desarrollo** integradas### Requisitos

cd tienda_RockBrosStore

- 📸 **Gestión de imágenes** con Supabase Storage

# 2. Instalar dependencias

npm install- 📊 **Base de datos relacional** con PostgreSQL- Node.js 18+ (recomendado instalar con nvm)



# 3. Configurar variables de entorno- npm, yarn, o bun

cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase---- Cuenta en Supabase



# 4. Ejecutar SQL en Supabase

# Ir a: Supabase > tu_proyecto > SQL Editor

# Copiar y ejecutar el contenido de: supabase/SUPABASE-SETUP-COMPLETE.sql## 📁 Estructura del Proyecto### Instalación

# Luego ejecutar: supabase/STORAGE-SETUP.sql



# 5. Iniciar servidor de desarrollo

npm run dev``````bash

```````

Tienda_RockBrosStore/# Clonar el repositorio

**La aplicación estará disponible en**: http://localhost:5173

├── 📁 src/ # Código fuentegit clone https://github.com/basabecode/tienda_RockBrosStore.git

---

│ ├── components/ # Componentes React reutilizablescd tienda_RockBrosStore

## 📁 Estructura del Proyecto

│ │ ├── ui/ # Componentes base (shadcn-ui)

````

Tienda_RockBrosStore/│   │   ├── Admin*.tsx               # Componentes administrativos# Instalar dependencias

├── 📁 src/                          # Código fuente

│   ├── components/                  # Componentes React reutilizables│   │   ├── Auth*.tsx                # Componentes de autenticaciónnpm install

│   │   ├── ui/                      # Componentes base (shadcn-ui)

│   │   ├── Footer.tsx               # ✅ Actualizado - Simplificado│   │   └── ...

│   │   ├── Brands.tsx               # ✅ Actualizado - Marcas de ciclismo

│   │   ├── Categories.tsx           # ✅ Actualizado - Iconos correctos│   ├── pages/                       # Páginas de la aplicación# Configurar variables de entorno

│   │   └── ...

│   ├── pages/                       # Páginas de la aplicación│   │   ├── Index.tsx                # Página de iniciocp .env.example .env.local

│   ├── hooks/                       # Custom hooks

│   ├── lib/                         # Lógica de negocio│   │   ├── Login.tsx                # Login de clientes# Editar .env.local con tus credenciales de Supabase

│   └── assets/                      # Recursos estáticos

││   │   ├── AdminLogin.tsx           # Login administrativo

├── 📁 docs/                         # 📚 Documentación completa

│   ├── INDEX.md                     # Índice de documentación│   │   ├── ProductDetail.tsx        # Detalles de producto# Ejecutar SQL en Supabase

│   ├── ACTUALIZACION-ALINEACION-CICLISMO.md  # ✨ Cambios realizados

│   ├── PROJECT-OVERVIEW.md│   │   ├── AdminDashboard.tsx       # Panel admin# Copiar y ejecutar el contenido de `supabase/SUPABASE-SETUP-COMPLETE.sql` en el SQL Editor

│   ├── DOCUMENTACION_TECNICA.md

│   ├── DEPLOYMENT-GUIDE.md│   │   └── ...

│   └── ...

││   ├── hooks/                       # Custom hooks de React# Iniciar servidor de desarrollo

├── 📁 tests/                        # 🧪 Testing y pruebas

│   ├── README.md                    # Guía de testing│   │   ├── use-auth.tsx             # Autenticaciónnpm run dev

│   ├── test-supabase.js

│   ├── supabase-test.html│   │   ├── use-admin-auth.tsx       # Autenticación admin```

│   └── ...

││   │   ├── use-cart.tsx             # Carrito

├── 📁 supabase/                     # ⚙️ Configuración de base de datos

├── 📁 scripts/                      # Automatización│   │   ├── use-favorites.tsx        # Favoritos## 📁 Estructura del Proyecto

├── 📁 public/                       # Archivos públicos

││   │   └── ...

└── Configuration Files

    ├── package.json│   ├── lib/                         # Lógica de negocio```

    ├── tsconfig.json

    ├── vite.config.ts│   │   ├── supabase.ts              # Cliente Supabasesrc/

    ├── tailwind.config.ts

    └── ...│   │   ├── auth.ts                  # Helpers de autenticación├── components/          # Componentes reutilizables

````

│ │ ├── products.ts # Lógica de productos│ ├── ui/ # Componentes base (shadcn-ui)

---

│ │ ├── schemas.ts # Validación con Zod│ └── QueryProvider.tsx

## 🛠️ Comandos Disponibles

│ │ ├── types.ts # Tipos TypeScript├── hooks/ # Hooks personalizados

### Desarrollo

│ │ ├── utils.ts # Utilidades│ └── use-auth.tsx # Autenticación

````bash

npm run dev          # Iniciar servidor de desarrollo│   │   └── services/                # Servicios para API├── lib/                # Lógica de negocio

npm run build        # Build para producción

npm run preview      # Preview del build local│   ├── assets/                      # Imágenes y recursos estáticos│   ├── services/       # Servicios para API

npm run lint         # Linting

```│   ├── App.tsx                      # Componente raíz│   ├── auth.ts         # Helpers de autenticación



### Testing│   └── main.tsx                     # Punto de entrada│   ├── schemas.ts      # Validación con Zod



```bash││   ├── supabase.ts     # Cliente Supabase

npm run test:supabase              # Test básico

npm run test:supabase:verbose      # Test con logs detallados├── 📁 docs/                         # Documentación del proyecto│   └── types.ts        # Tipos TypeScript

npm run test:supabase:json         # Test con output JSON

npm run verify:supabase            # Verificación rápida│   ├── AUDITORIA_COMPLETA.md        # Auditoría del sistema├── pages/              # Páginas de la aplicación

````

│ ├── DEPLOYMENT-GUIDE.md # Guía de desplieguesupabase/

### Administración

│ ├── DOCUMENTACION_PROCESOS.md # Documentación de procesos└── schema.sql # Esquema de base de datos

```bash

npm run admin:check      # Verificar admins│   ├── DOCUMENTACION_TECNICA.md     # Documentación técnicadocs/

npm run admin:setup      # Setup de admin

npm run manage:users     # Gestionar usuarios│   ├── GUIA-STORAGE-COMPLETA.md    # Guía de Storage└── backend-setup.md    # Documentación técnica

```

│ ├── PROJECT-OVERVIEW.md # Overview del proyecto```

---

│ ├── TESTS-README.md # Guía de testing

## 📊 Cambios Recientes - 26 Octubre 2025

│ └── README-configuracion-2025.md # Configuración 2025## 🏗️ Backend Integrado

### ✅ Reorganización Completada

│

#### 1. **Estructura de Carpetas**

- ✅ Creada carpeta `/docs` con toda la documentación├── 📁 tests/ # Archivos de pruebas y testing### Características

- ✅ Creada carpeta `/tests` con scripts de testing

- ✅ README.md en la raíz completo y actualizado│ ├── test-supabase.js # Script de tests Supabase

#### 2. **Alineación de Contenido a Ciclismo**│ ├── verify-supabase.js # Verificación de Supabase- **Base de datos**: Supabase (PostgreSQL)

- ✅ **Footer.tsx** - Refactorizado a 3 columnas simples

  - Información, Enlaces rápidos, Redes sociales│ ├── supabase-test.html # Test en navegador- **Autenticación**: Supabase Auth con roles

  - Escalable para futuro crecimiento

│ ├── cleanup-temp-files.sh # Limpieza de archivos temporales- **Storage**: Imágenes de productos

- ✅ **Brands.tsx** - Actualizado con marcas de ciclismo

  - Trek, Giant, Specialized, Cannondale, Scott, Merida│ ├── cleanup-unused-deps.sh # Limpieza de dependencias no usadas- **Validación**: Esquemas Zod

  - Remplazadas marcas de tecnología

│ └── identify-temp-files.sh # Identificar archivos temporales- **API**: Servicios TypeScript type-safe

- ✅ **Categories.tsx** - Iconos corregidos

  - Shield (Cascos), Shirt (Ropa), Lightbulb (Iluminación)│

  - Cog (Componentes), Package (Accesorios), Bike (Bicicletas)

  - Wrench (Herramientas), Circle (Neumáticos)├── 📁 supabase/ # Configuración de Supabase### Modelo de Datos

#### 3. **Documentación**│ ├── SUPABASE-SETUP-COMPLETE.sql # Setup completo de DB

- ✅ Creado `docs/INDEX.md` - Índice de documentación

- ✅ Creado `tests/README.md` - Guía de testing│ ├── STORAGE-SETUP.sql # Setup de Storage- **Productos**: Cascos, luces, candados, accesorios, repuestos

- ✅ Creado `docs/ACTUALIZACION-ALINEACION-CICLISMO.md` - Cambios realizados

│ ├── UPDATE-PRODUCTS-WITH-IMAGES.sql- **Órdenes**: Sistema completo de pedidos

**Ver [docs/ACTUALIZACION-ALINEACION-CICLISMO.md](./docs/ACTUALIZACION-ALINEACION-CICLISMO.md) para detalles completos**

│ ├── URGENT-FIXES.sql- **Usuarios**: Perfiles con roles (user/admin)

---

│ └── USER-MANAGEMENT-FIX.sql- **Direcciones**: Envío y facturación

## 🔐 Autenticación y Seguridad

│

### Roles y Permisos

├── 📁 scripts/ # Scripts de automatización### Servicios Disponibles

| Rol | Acceso |

|-----|--------|│ ├── setup-admin.js # Setup de usuarios admin

| **Guest** | Ver catálogo, buscar productos |

| **User** | Todo + crear órdenes, favoritos, carrito |│ ├── test-supabase.js # Tests de Supabase```typescript

| **Admin** | Todo + gestionar productos, usuarios, órdenes |

│ ├── verify-supabase.js # Verificación de Supabase// Productos

### Row Level Security (RLS)

│ ├── inspect-functions.js # Inspeccionar funcionesimport { useProducts, useFeaturedProducts } from './lib/products'

Todas las tablas tienen RLS habilitado para proteger los datos.

│ ├── manage-users.js # Gestión de usuarios

---

│ └── connect-github.sh # Conectar con GitHub// Autenticación

## 📖 Documentación

│import { useAuth } from './hooks/use-auth'

La documentación completa se encuentra en `/docs`:

├── 📁 public/ # Archivos públicos

| Documento | Contenido |

|-----------|----------|│ ├── hero_ppal/ # Imágenes hero// Storage

| **INDEX.md** | Índice y guía de navegación |

| **PROJECT-OVERVIEW.md** | Overview del proyecto |│ ├── img/ # Imágenes generalesimport { StorageService } from './lib/services'

| **DOCUMENTACION_TECNICA.md** | Detalles técnicos |

| **DEPLOYMENT-GUIDE.md** | Guía de despliegue |│ └── logos/ # Logos```

| **TESTS-README.md** | Guía de testing |

| **ACTUALIZACION-ALINEACION-CICLISMO.md** | Cambios realizados |│

---├── 📁 dist/ # Build de producción (generado)## 🔐 Autenticación y Roles

## 🚀 Despliegue│

### Vercel (Recomendado)├── Configuration Files- **Usuario**: Ver productos, gestionar pedidos

````bash│ ├── package.json                 # Dependencias- **Admin**: Gestión completa de productos y órdenes

# 1. Conectar repositorio en Vercel

# 2. Configurar variables de entorno│   ├── tsconfig.json                # Configuración TypeScript- **RLS**: Seguridad a nivel de fila en la base de datos

# 3. Deploy automático en cada push

```│   ├── vite.config.ts               # Configuración Vite



Ver [docs/DEPLOYMENT-GUIDE.md](./docs/DEPLOYMENT-GUIDE.md) para más detalles.│   ├── tailwind.config.ts           # Configuración TailwindCSS## 📚 Documentación



---│   ├── postcss.config.js            # PostCSS



## 🧪 Testing│   ├── eslint.config.js             # ESLint- [Configuración del Backend](./docs/backend-setup.md)



Todos los scripts de testing se encuentran en `/tests`:│   ├── components.json              # shadcn-ui config- [Esquema de Base de Datos](./supabase/schema.sql)



```bash│   ├── vercel.json                  # Vercel deployment- [Resumen Técnico](./Resumen%20del%20backend.md)

npm run test:supabase              # Suite completa

npm run test:supabase:verbose      # Con logs│   └── .env.example                 # Variables de entorno (ejemplo)

npm run test:supabase:html         # En navegador

npm run verify:supabase            # Verificación rápida│## 🛠️ Tecnologías

````

└── Documentation

Ver [tests/README.md](./tests/README.md) para más información.

    ├── README.md                    # Este archivo### Frontend

---

    ├── TESTS-README.md              # Guía de testing

## 🐛 Troubleshooting

    └── DEPLOYMENT-GUIDE.md          # Guía de despliegue- **Vite** - Build tool

### Error de Conexión a Supabase

`bash`- **React + TypeScript** - Framework y tipos

# Verificar .env.local y credenciales

npm run verify:supabase- **Tailwind CSS** - Estilos

````

---- **shadcn-ui** - Componentes UI

### Problemas con Imágenes

Ver [docs/GUIA-STORAGE-COMPLETA.md](./docs/GUIA-STORAGE-COMPLETA.md)- **React Query** - Estado del servidor



---## 🚀 Guía de Inicio Rápido- **React Router** - Navegación



## 📈 Roadmap



### ✅ Versión Actual (MVP)### ✅ Requisitos### Backend

- [x] Autenticación completa

- [x] Catálogo de productos

- [x] Carrito de compras

- [x] Panel de administración- **Node.js 18+** (recomendado instalar con [nvm](https://github.com/nvm-sh/nvm))- **Supabase** - BaaS (PostgreSQL + Auth + Storage)

- [x] Reorganización de archivos

- [x] Alineación al contenido de ciclismo- **npm**, **yarn**, o **bun**- **Zod** - Validación de esquemas



### 🎯 Próximas Versiones- **Cuenta en Supabase** (gratis en [supabase.com](https://supabase.com))- **TypeScript** - Tipos end-to-end

- [ ] Integración de pagos

- [ ] Sistema de reseñas- **Git**

- [ ] Notificaciones por email

- [ ] App móvil## 🚀 Despliegue



---### 📦 Instalación



## 🤝 Contribuir### Variables de Entorno (Producción)



1. Fork el proyecto```bash

2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)

3. Commit cambios (`git commit -am 'Agregar funcionalidad'`)# 1. Clonar el repositorio```env

4. Push a la rama (`git push origin feature/nueva-funcionalidad`)

5. Crear Pull Requestgit clone https://github.com/basabecode/tienda_RockBrosStore.gitVITE_SUPABASE_URL=https://tu-proyecto.supabase.co



---cd tienda_RockBrosStoreVITE_SUPABASE_ANON_KEY=tu_clave_publica



## 📧 ContactoVITE_ADMIN_SECRET=secreto_temporal_admin



- **Email**: soporte@rockbrosshop.com# 2. Instalar dependencias```

- **Teléfono**: +57 300 000 0000

- **Ubicación**: Bogotá, Colombianpm install

- **GitHub**: [@basabecode](https://github.com/basabecode)

# o con yarn: yarn installNota de seguridad: la variable `SUPABASE_SERVICE_ROLE_KEY` NUNCA debe usarse ni definirse en el frontend. Si necesitas realizar operaciones privilegiadas (admin), usa Edge Functions o un backend seguro con la service role configurada en el servidor.

---

# o con bun: bun install

## 📄 Licencia

### Comandos de Build

Este proyecto está bajo la licencia **MIT**.

# 3. Configurar variables de entorno

---

cp .env.example .env.local```sh

## 🙏 Agradecimientos

# Editar .env.local con tus credenciales de Supabase# Build para producción

- [Supabase](https://supabase.com) - Backend

- [React](https://react.dev) - Frameworknpm run build

- [TailwindCSS](https://tailwindcss.com) - Estilos

- [shadcn/ui](https://ui.shadcn.com) - Componentes# 4. Ejecutar SQL en Supabase



---# Ir a: Supabase > tu_proyecto > SQL Editor# Preview local



**Última actualización**: 26 de octubre de 2025  # Copiar y ejecutar el contenido de: supabase/SUPABASE-SETUP-COMPLETE.sqlnpm run preview

**Estado**: ✅ En desarrollo activo

**Versión**: 0.1.0# Luego ejecutar: supabase/STORAGE-SETUP.sql```



---



## 📌 Quick Start# 5. Iniciar servidor de desarrollo## 📈 Próximas Funcionalidades



```bashnpm run dev

git clone https://github.com/basabecode/tienda_RockBrosStore.git

cd tienda_RockBrosStore```- [ ] Integración con pasarela de pagos

npm install

cp .env.example .env.local- [ ] Sistema de reseñas y calificaciones

npm run dev

```**La aplicación estará disponible en**: http://localhost:5173- [ ] Búsqueda avanzada y filtros



¡Happy coding! 🚀- [ ] Notificaciones en tiempo real


---- [ ] Panel de administración completo

- [ ] Analytics de productos

## 🔧 Variables de Entorno- [ ] Sistema de cupones y descuentos



Crear archivo `.env.local` basado en `.env.example`:## 🤝 Contribuir



```env1. Fork el proyecto

# Supabase2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)

VITE_SUPABASE_ANON_KEY=tu_clave_publica_de_supabase4. Push a la rama (`git push origin feature/nueva-funcionalidad`)

5. Crear Pull Request

# Admin temporal (usar solo para desarrollo)

VITE_ADMIN_SECRET=secreto_admin_temporal## 📄 Licencia

````

Este proyecto está bajo la licencia MIT.

**⚠️ Nota de Seguridad**: La variable `SUPABASE_SERVICE_ROLE_KEY` **NUNCA** debe usarse ni definirse en el frontend.

---

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build local
npm run preview

# Linting (verificar código)
npm run lint
```

### Testing y Verificación

```bash
# Test básico de conexión Supabase
npm run test:supabase

# Test detallado con logs
npm run test:supabase:verbose

# Test con output JSON (para CI/CD)
npm run test:supabase:json

# Verificación rápida
npm run verify:supabase

# Test en navegador
npm run test:supabase:html
# Abre: http://localhost:3001/supabase-test.html
```

### Administración

```bash
# Verificar si existen admins
npm run admin:check

# Setup de usuario admin
npm run admin:setup

# Promover usuario a admin
npm run admin:promote

# Inspeccionar funciones
npm run inspect:functions

# Gestionar usuarios
npm run manage:users
```

---

## 🏗️ Stack Tecnológico

### Frontend

| Tecnología       | Propósito           | Versión |
| ---------------- | ------------------- | ------- |
| **React**        | Framework UI        | 18+     |
| **TypeScript**   | Tipado estático     | Latest  |
| **Vite**         | Build tool          | 5+      |
| **TailwindCSS**  | Estilos             | 3.x     |
| **shadcn-ui**    | Componentes UI      | Latest  |
| **React Query**  | Estado del servidor | Latest  |
| **React Router** | Navegación          | Latest  |
| **Zod**          | Validación          | Latest  |

### Backend

| Componente             | Descripción                    |
| ---------------------- | ------------------------------ |
| **Supabase**           | Backend as a Service (BaaS)    |
| **PostgreSQL**         | Base de datos relacional       |
| **Auth**               | Autenticación con JWT          |
| **Storage**            | Almacenamiento de imágenes     |
| **Row Level Security** | Seguridad a nivel de fila      |
| **Real-time**          | Actualizaciones en tiempo real |

### Herramientas

- **ESLint** - Linting
- **Git** - Control de versiones
- **GitHub** - Hosting
- **Vercel** - Deployment

---

## 🔐 Autenticación y Seguridad

### Roles y Permisos

| Rol       | Acceso                                        |
| --------- | --------------------------------------------- |
| **Guest** | Ver catálogo, buscar productos                |
| **User**  | Todo + crear órdenes, favoritos, carrito      |
| **Admin** | Todo + gestionar productos, usuarios, órdenes |

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

- `public.profiles` - Solo usuarios pueden ver su perfil
- `public.products` - Lectura pública, escritura solo admin
- `public.orders` - Solo usuarios pueden ver sus órdenes
- `public.favorites` - Solo usuarios pueden ver sus favoritos

### Protección de Rutas

- Rutas admin protegidas con `AdminRoute` y `ProtectedRoute`
- Verificación de token JWT en Supabase Auth
- Refresh automático de tokens

---

## 📊 Modelo de Datos

### Tablas Principales

#### `profiles`

```sql
- id (UUID, PK)
- email (String)
- full_name (String)
- role (user | admin)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### `products`

```sql
- id (UUID, PK)
- name (String)
- description (Text)
- price (Decimal)
- category (String)
- stock (Integer)
- image_url (String)
- created_at (Timestamp)
```

#### `orders`

```sql
- id (UUID, PK)
- user_id (UUID, FK)
- total_amount (Decimal)
- status (pending | completed | cancelled)
- created_at (Timestamp)
```

#### `order_items`

```sql
- id (UUID, PK)
- order_id (UUID, FK)
- product_id (UUID, FK)
- quantity (Integer)
- price (Decimal)
```

---

## 🧪 Testing

### Scripts de Testing

Todos los scripts se encuentran en la carpeta `/tests`:

1. **test-supabase.js** - Suite completa de tests
2. **verify-supabase.js** - Verificación de conexión
3. **supabase-test.html** - Tests en navegador

### Ejecutar Tests

```bash
# Desde CLI
npm run test:supabase

# Desde navegador
npm run test:supabase:html
# Abre: http://localhost:3001/supabase-test.html
```

Ver [docs/TESTS-README.md](./docs/TESTS-README.md) para más detalles.

---

## 📖 Documentación

La documentación completa se encuentra en la carpeta `/docs`:

| Archivo                          | Contenido                       |
| -------------------------------- | ------------------------------- |
| **PROJECT-OVERVIEW.md**          | Overview del proyecto           |
| **DOCUMENTACION_TECNICA.md**     | Documentación técnica detallada |
| **DOCUMENTACION_PROCESOS.md**    | Procesos y flujos del sistema   |
| **DEPLOYMENT-GUIDE.md**          | Guía de despliegue              |
| **TESTS-README.md**              | Guía de testing                 |
| **GUIA-STORAGE-COMPLETA.md**     | Gestión de Storage              |
| **AUDITORIA_COMPLETA.md**        | Auditoría del sistema           |
| **README-configuracion-2025.md** | Configuración 2025              |

---

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# 1. Conectar repositorio en Vercel
# Ir a: https://vercel.com/import
# Seleccionar tu repositorio

# 2. Configurar variables de entorno
# En Vercel Dashboard > Project Settings > Environment Variables
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica

# 3. Deploy automático
# Vercel desplegará automáticamente en cada push a main
```

### Deploy Manual

```bash
# 1. Build
npm run build

# 2. Copiar dist/ a tu servidor
# El contenido de dist/ es lo que se sirve en producción

# 3. Configurar servidor web (nginx, Apache, etc.)
# Todas las rutas deben servir index.html (para SPA)
```

Ver [docs/DEPLOYMENT-GUIDE.md](./docs/DEPLOYMENT-GUIDE.md) para más detalles.

---

## 🐛 Troubleshooting

### Error de Conexión a Supabase

```
Error: Failed to connect to Supabase
```

**Solución**:

1. Verificar que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están en `.env.local`
2. Verificar que el proyecto Supabase está activo
3. Ejecutar: `npm run verify:supabase`

### Error de RLS

```
Error: new row violates row-level security policy
```

**Solución**:

1. Verificar que las políticas RLS están configuradas correctamente
2. Ejecutar SQL de setup: `supabase/SUPABASE-SETUP-COMPLETE.sql`
3. Verificar el rol del usuario

### Problemas con Imágenes

```
Error: Image not found in Storage
```

**Solución**:

1. Verificar que Storage está configurado: `supabase/STORAGE-SETUP.sql`
2. Revisar políticas de Storage
3. Ver [docs/GUIA-STORAGE-COMPLETA.md](./docs/GUIA-STORAGE-COMPLETA.md)

---

## 📈 Roadmap

### ✅ Versión Actual (MVP)

- [x] Autenticación completa
- [x] Catálogo de productos
- [x] Carrito de compras
- [x] Panel de administración
- [x] Favoritos
- [x] Búsqueda

### 🎯 Próximas Versiones

#### v1.1 - Pagos

- [ ] Integración con Stripe/MercadoPago
- [ ] Procesamiento de órdenes
- [ ] Notificaciones por email

#### v1.2 - Social

- [ ] Sistema de reseñas
- [ ] Calificaciones de productos
- [ ] Wishlist compartible

#### v2.0 - Enterprise

- [ ] Reportes y analytics
- [ ] Sistema de cupones
- [ ] Marketplace multi-vendedor
- [ ] App móvil

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor sigue estos pasos:

1. **Fork** el proyecto
2. **Crear rama** de feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abrir Pull Request**

### Guías de Contribución

- Mantener el estilo de código (ESLint)
- Agregar tests para nuevas funcionalidades
- Actualizar documentación si es necesario
- Escribir commits descriptivos

---

## 📝 Changelog

### v0.1.0 (Actual)

- ✅ Setup inicial del proyecto
- ✅ Autenticación con Supabase
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Panel admin
- ✅ Reorganización de archivos y documentación

---

## 📧 Contacto y Soporte

- **GitHub Issues**: [Reportar bugs](https://github.com/basabecode/tienda_RockBrosStore/issues)
- **GitHub Discussions**: [Hacer preguntas](https://github.com/basabecode/tienda_RockBrosStore/discussions)
- **Autor**: [@basabecode](https://github.com/basabecode)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver [LICENSE](./LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend
- [React](https://react.dev) - Framework
- [TailwindCSS](https://tailwindcss.com) - Estilos
- [shadcn/ui](https://ui.shadcn.com) - Componentes
- [Vercel](https://vercel.com) - Hosting

---

**Última actualización**: 26 de octubre de 2025

**Estado**: ✅ En desarrollo activo

---

## 📌 Resumen Rápido

```bash
# Clonar y configurar
git clone https://github.com/basabecode/tienda_RockBrosStore.git
cd tienda_RockBrosStore
npm install
cp .env.example .env.local
# Editar .env.local con credenciales

# Iniciar desarrollo
npm run dev

# Testing
npm run test:supabase

# Build
npm run build
```

¡Happy coding! 🚀

# 🚴‍♂️ Tienda RockBros Store - Documentación Técnica

**Proyecto**: Tienda online completa de accesorios y repuestos para ciclismo
**Tecnologías**: React + TypeScript + Supabase + Tailwind CSS
**Última actualización**: 15 de septiembre de 2025

## 📋 Información General

Tienda online completa de accesorios y repuestos para ciclismo desarrollada con React + TypeScript + Supabase. Incluye sistema de autenticación, gestión de productos, carrito de compras y panel de administración integrado.

### Características Principales

- 🔐 Sistema de autenticación completo con Supabase Auth
- 👑 Panel de administración con gestión de usuarios admin
- 🛒 Carrito de compras funcional
- ❤️ Lista de favoritos
- 📱 Diseño responsive con TailwindCSS
- 🎨 Componentes UI modernos con shadcn/ui
- 🔍 Sistema de búsqueda y filtros
- 📊 Dashboard administrativo
- 🛡️ Protección de rutas admin
- 🔧 Herramientas de desarrollo integradas

## 🛠️ Tecnologías y Arquitectura

### Frontend

- **Vite** - Build tool y servidor de desarrollo
- **React + TypeScript** - Framework y sistema de tipos
- **Tailwind CSS** - Framework de estilos
- **shadcn-ui** - Biblioteca de componentes UI
- **React Query** - Gestión de estado del servidor
- **React Router** - Navegación entre páginas

### Backend

- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
- **Zod** - Validación de esquemas
- **TypeScript** - Tipos end-to-end

### Base de Datos

- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** implementado
- **Políticas de seguridad** configuradas
- **Triggers automáticos** para perfiles de usuario

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── AdminRoute.tsx  # Protección de rutas admin
│   ├── Header.tsx      # Navegación principal
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── AdminDashboard.tsx
│   ├── ProductGrid.tsx
│   └── ...
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades y configuración
│   ├── supabase.ts     # Cliente Supabase
│   ├── auth.ts         # Funciones de autenticación
│   └── ...
└── types/              # Definiciones de tipos TypeScript
```

## 🚀 Configuración e Instalación

### Requisitos

- Node.js 18+ (recomendado instalar con nvm)
- npm, yarn, o bun
- Cuenta en Supabase

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/basabecode/tienda_RockBrosStore.git
cd tienda_RockBrosStore

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar SQL en Supabase
# Copiar y ejecutar el contenido de supabase/schema.sql en el SQL Editor

# Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Sistema de Autenticación

### Roles de Usuario

- **Usuario regular**: Acceso a tienda, carrito, favoritos
- **Administrador**: Acceso completo al panel admin

### Funcionalidades

- Registro e inicio de sesión
- Recuperación de contraseña
- Protección de rutas por roles
- Gestión de perfiles de usuario

## 👑 Panel de Administración

### Funcionalidades del Dashboard

- Gestión completa de productos (CRUD)
- Gestión de usuarios
- Gestión de pedidos
- Estadísticas y métricas
- Configuración del sistema

### Seguridad

- Rutas protegidas con `AdminRoute`
- Validación de permisos en cada componente
- Políticas RLS en base de datos

## 🗄️ Base de Datos

### Esquemas Principales

- `profiles` - Perfiles de usuario con rol admin
- `products` - Catálogo de productos
- `orders` - Pedidos y transacciones
- `favorites` - Lista de favoritos por usuario

### Configuración de Supabase

1. Crear proyecto en Supabase
2. Ejecutar esquema SQL (`supabase/schema.sql`)
3. Configurar bucket de storage público
4. Establecer políticas RLS

## 🔧 Desarrollo y Build

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Verificación de código
npm run preview  # Vista previa del build
```

### Configuración de TypeScript

- Configuración estricta habilitada
- Paths absolutos configurados
- Tipos end-to-end implementados

## 📦 Despliegue

### Opciones de Despliegue

- **Vercel**: Recomendado para frontend
- **Netlify**: Alternativa con buen soporte
- **Railway**: Para backend personalizado

### Variables de Entorno de Producción

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_STORAGE_BUCKET_NAME=product-images
```

## 🐛 Resolución de Problemas

### Problemas Comunes

1. **Error de autenticación admin**: Verificar configuración RLS
2. **Imágenes no cargan**: Revisar configuración de storage bucket
3. **Build falla**: Verificar dependencias y configuración TypeScript

### Debugging

- Logs detallados en consola del navegador
- Herramientas de desarrollo React activas
- Validación de tipos TypeScript

## 📈 Optimizaciones

### Performance

- Lazy loading de componentes
- Optimización de imágenes
- Caching inteligente con React Query
- Bundle splitting automático

### SEO

- Meta tags dinámicos
- Open Graph configurado
- URLs amigables
- Sitemap automático

---

_Esta documentación consolida toda la información técnica necesaria para desarrollar, mantener y desplegar la Tienda RockBros Store._</content>
<parameter name="filePath">C:\Users\Usuario\Desktop\tienda_rockbrosStore\Tienda_RockBrosStore\DOCUMENTACION_TECNICA.md

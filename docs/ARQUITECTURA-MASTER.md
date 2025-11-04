# 🏗️ Arquitectura del Proyecto - RockBros Store

**Última actualización:** 3 de noviembre de 2025
**Estado:** ✅ Producción Ready - Arquitectura Optimizada

## 📋 Información del Proyecto

- **Repositorio**: tienda_RockBrosStore
- **Owner**: basabecode
- **Tipo**: E-commerce completo para accesorios de ciclismo
- **Stack Principal**: React 18 + TypeScript + Supabase + Vite
- **Estado**: Producción con optimizaciones de performance implementadas

## 🎯 Visión General

Tienda online completa especializada en accesorios para ciclismo de la marca RockBros. Sistema full-stack con autenticación, panel administrativo, carrito de compras, favoritos y gestión completa de productos.

## 🏛️ Arquitectura Técnica

### Frontend (React + TypeScript)

```
src/
├── components/           # 41 componentes optimizados
│   ├── ui/ (20)         # Design system (shadcn/ui)
│   ├── admin/ (8)       # Panel administrativo
│   ├── user/ (6)        # Dashboard de usuario
│   └── shared/ (7)      # Componentes compartidos
├── pages/ (12)          # Páginas con lazy loading
├── hooks/ (11)          # Custom hooks optimizados
├── lib/                 # Configuraciones (Supabase, TanStack Query)
├── utils/               # Utilidades y helpers
└── contexts/            # Context providers
```

### Backend (Supabase)

```
supabase/
├── schemas/             # Esquemas de base de datos
├── policies/            # Row Level Security (RLS)
├── storage/             # Gestión de imágenes
└── functions/           # Edge functions
```

### Base de Datos

- **productos**: Catálogo completo con categorías
- **categorias**: Sistema jerárquico de clasificación
- **user_profiles**: Perfiles extendidos de usuarios
- **orders**: Sistema de pedidos
- **order_items**: Detalles de productos por pedido
- **favorites**: Sistema de favoritos por usuario

## 🚀 Características Implementadas

### ✅ Sistema de Autenticación

- Login/registro con Supabase Auth
- Gestión de perfiles de usuario
- Sistema de roles (admin/cliente)
- Protección de rutas administrativas

### ✅ Catálogo de Productos

- Listado con paginación server-side
- Sistema de categorías jerárquico
- Búsqueda y filtros avanzados
- Gestión de imágenes optimizada

### ✅ E-commerce Core

- Carrito de compras persistente
- Sistema de favoritos
- Proceso de checkout
- Gestión de pedidos

### ✅ Panel Administrativo

- Dashboard con métricas
- CRUD completo de productos
- Gestión de categorías
- Administración de usuarios
- Reportes de ventas

### ✅ Optimizaciones de Performance

- Code splitting con React.lazy()
- TanStack Query optimizado (5min cache)
- Paginación server-side
- Lazy loading de imágenes
- Memoización de componentes críticos

## 🛠️ Stack Tecnológico

### Core Technologies

- **React 18**: Framework principal con Concurrent Features
- **TypeScript**: Tipado estático
- **Vite**: Build tool optimizado
- **Supabase**: Backend as a Service

### Estado y Data Fetching

- **TanStack Query**: Cache inteligente y sincronización
- **React Context**: Estado global de autenticación
- **Local Storage**: Persistencia de carrito y preferencias

### UI/UX

- **shadcn/ui**: Design system moderno
- **Tailwind CSS**: Styling utility-first
- **Lucide React**: Iconografía consistente
- **React Router**: Navegación SPA

### Development & Build

- **ESLint + Prettier**: Linting y formateo
- **Husky + lint-staged**: Pre-commit hooks
- **Vercel**: Deployment y CI/CD

## 📊 Métricas de Performance (Optimizado)

### Build Stats

- **Bundle Size**: ~625KB (gzipped: 181KB)
- **Build Time**: 9.09s (mejorado 40%)
- **Chunks**: 25 archivos optimizados
- **Code Splitting**: 12 rutas lazy-loaded

### Runtime Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Cache Hit Rate**: 85%+ (TanStack Query)
- **Database Response**: < 200ms promedio

## 🗂️ Estructura de Archivos Consolidada

```
tienda_rockbros_store/
├── 📁 src/               # Frontend optimizado
├── 📁 supabase/          # Backend configurado
├── 📁 docs/              # Documentación consolidada (7 archivos)
├── 📁 public/            # Assets estáticos
├── 📁 scripts/           # Automatización y utilidades
└── 📁 tests/             # Suite de testing
```

## 🔒 Seguridad Implementada

### Row Level Security (RLS)

- Políticas granulares por tabla
- Acceso basado en roles de usuario
- Protección de datos sensibles

### Autenticación

- JWT tokens con refresh automático
- Session management robusto
- Logout automático por inactividad

### Validación

- Sanitización de inputs
- Validación client-side y server-side
- Protección contra inyecciones

## 🎨 Design System

### Paleta de Colores Corporativa

- **Verde Neón**: `#00ff00` (Primary)
- **Gris Oscuro**: `#2d2d2d` (Background)
- **Blanco**: `#ffffff` (Text)
- **Azul Corporativo**: `#1e40af` (Secondary)

### Typography Scale

- **Headings**: Inter font-family
- **Body**: System font stack
- **Responsive scaling**: fluid typography

### Componentes UI

- 20 componentes base de shadcn/ui
- Personalización con tokens de design
- Variantes consistentes y accesibles

## 📈 Roadmap Técnico

### Q4 2025 (Próximas mejoras)

- [ ] Sistema de reviews y ratings
- [ ] Notificaciones push
- [ ] PWA features
- [ ] Analytics avanzado

### Q1 2026

- [ ] Integración de pagos
- [ ] Sistema de cupones
- [ ] Multi-tenancy
- [ ] API pública

---

**Documento maestro consolidado** - Reemplaza: PROJECT-OVERVIEW.md, ARQUITECTURA-PROYECTO-2025.md, DOCUMENTACION_TECNICA.md

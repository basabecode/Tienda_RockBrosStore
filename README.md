# 🚴‍♂️ Tienda RockBros Store

Tienda online completa de accesorios y repuestos para ciclismo, desarrollada con React + TypeScript + Supabase. Sistema de autenticación, gestión de productos, carrito de compras y panel de administración integrado.

## ✨ Características Principales

- 🔐 **Sistema de autenticación** completo con Supabase Auth
- 👑 **Panel de administración** con gestión de usuarios admin
- 🛒 **Carrito de compras** funcional
- ❤️ **Lista de favoritos** 
- 📱 **Diseño responsive** con TailwindCSS
- 🎨 **Componentes UI** modernos con shadcn/ui
- 🔍 **Sistema de búsqueda** y filtros
- 📊 **Dashboard administrativo** 
- 🛡️ **Protección de rutas** admin
- 🔧 **Herramientas de desarrollo** integradas

## 🚀 Configuración Rápida

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

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (shadcn-ui)
│   └── QueryProvider.tsx
├── hooks/              # Hooks personalizados
│   └── use-auth.tsx    # Autenticación
├── lib/                # Lógica de negocio
│   ├── services/       # Servicios para API
│   ├── auth.ts         # Helpers de autenticación
│   ├── schemas.ts      # Validación con Zod
│   ├── supabase.ts     # Cliente Supabase
│   └── types.ts        # Tipos TypeScript
├── pages/              # Páginas de la aplicación
supabase/
└── schema.sql          # Esquema de base de datos
docs/
└── backend-setup.md    # Documentación técnica
```

## 🏗️ Backend Integrado

### Características

- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth con roles
- **Storage**: Imágenes de productos
- **Validación**: Esquemas Zod
- **API**: Servicios TypeScript type-safe

### Modelo de Datos

- **Productos**: Cascos, luces, candados, accesorios, repuestos
- **Órdenes**: Sistema completo de pedidos
- **Usuarios**: Perfiles con roles (user/admin)
- **Direcciones**: Envío y facturación

### Servicios Disponibles

```typescript
// Productos
import { useProducts, useFeaturedProducts } from './lib/products'

// Autenticación
import { useAuth } from './hooks/use-auth'

// Storage
import { StorageService } from './lib/services'
```

## 🔐 Autenticación y Roles

- **Usuario**: Ver productos, gestionar pedidos
- **Admin**: Gestión completa de productos y órdenes
- **RLS**: Seguridad a nivel de fila en la base de datos

## 📚 Documentación

- [Configuración del Backend](./docs/backend-setup.md)
- [Esquema de Base de Datos](./supabase/schema.sql)
- [Resumen Técnico](./Resumen%20del%20backend.md)

## 🛠️ Tecnologías

### Frontend

- **Vite** - Build tool
- **React + TypeScript** - Framework y tipos
- **Tailwind CSS** - Estilos
- **shadcn-ui** - Componentes UI
- **React Query** - Estado del servidor
- **React Router** - Navegación

### Backend

- **Supabase** - BaaS (PostgreSQL + Auth + Storage)
- **Zod** - Validación de esquemas
- **TypeScript** - Tipos end-to-end

## 🚀 Despliegue

### Variables de Entorno (Producción)

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_privada
VITE_ADMIN_SECRET=secreto_temporal_admin
```

### Comandos de Build

```sh
# Build para producción
npm run build

# Preview local
npm run preview
```

## 📈 Próximas Funcionalidades

- [ ] Integración con pasarela de pagos
- [ ] Sistema de reseñas y calificaciones
- [ ] Búsqueda avanzada y filtros
- [ ] Notificaciones en tiempo real
- [ ] Panel de administración completo
- [ ] Analytics de productos
- [ ] Sistema de cupones y descuentos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

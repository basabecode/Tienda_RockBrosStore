# Configuración del Backend - Tienda de Ciclismo

Este documento explica cómo configurar y usar el backend basado en Supabase para la tienda de ciclismo.

## Configuración Inicial

### 1. Variables de Entorno

Crear un archivo `.env.local` basado en `.env.example`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# Admin Configuration (temporal - migrar a roles en producción)
VITE_ADMIN_SECRET=tu_secreto_admin

# Storage Configuration
VITE_STORAGE_BUCKET_NAME=product-images
```

### 2. Configuración de Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script SQL de `supabase/schema.sql` en el SQL Editor de Supabase
3. Configurar el bucket de storage `product-images` como público
4. Configurar las políticas RLS según el esquema

### 3. Instalación de Dependencias

Las dependencias ya están incluidas en `package.json`:

```bash
npm install
# o
bun install
```

## Estructura del Backend

### Componentes Principales

1. **Clientes Supabase**:

   - `lib/supabase.ts` - Cliente público para el frontend
   - `lib/supabaseServer.ts` - Cliente para operaciones server-side
   - `lib/supabaseAdmin.ts` - Cliente administrativo con permisos elevados

2. **Tipos y Esquemas**:

   - `lib/types.ts` - Tipos TypeScript para la base de datos
   - `lib/schemas.ts` - Esquemas de validación con Zod

3. **Servicios**:

   - `lib/services/productService.ts` - CRUD de productos
   - `lib/services/orderService.ts` - Gestión de órdenes
   - `lib/services/storageService.ts` - Manejo de archivos e imágenes

4. **Autenticación**:
   - `lib/auth.ts` - Helpers de autenticación
   - `hooks/use-auth.tsx` - Hook de React para auth

## Uso del Backend

### Productos

```typescript
import { useProducts, useFeaturedProducts } from '../lib/products'

// Obtener productos con filtros
const { data: products, isLoading } = useProducts({
  category: 'cascos',
  is_featured: true,
  page: 1,
  pageSize: 12,
})

// Obtener productos destacados
const { data: featured } = useFeaturedProducts(8)
```

### Autenticación

```typescript
import { useAuth } from '../hooks/use-auth'

function LoginComponent() {
  const { signIn, signUp, user, isAuthenticated } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (error) {
      console.error('Error:', error)
    }
  }
}
```

### Storage de Imágenes

```typescript
import { StorageService } from '../lib/services'

// Subir imagen de producto
const { url, path } = await StorageService.uploadProductImage(file)

// Validar archivo antes de subir
const validation = StorageService.validateImageFile(file)
if (!validation.valid) {
  console.error(validation.error)
}
```

## Modelo de Datos

### Tablas Principales

1. **products** - Productos de ciclismo

   - Campos: name, description, price, stock, category, brand, images, etc.
   - Soporte para tallas, colores y especificaciones técnicas

2. **orders** - Órdenes de compra

   - Campos: user_id, total, status, addresses
   - Estados: pending, confirmed, shipped, delivered, cancelled

3. **order_items** - Items de las órdenes

   - Relación con productos y órdenes
   - Cantidad, precio, talla, color

4. **profiles** - Perfiles de usuario

   - Extiende auth.users de Supabase
   - Roles: user, admin

5. **addresses** - Direcciones de usuarios
   - Direcciones de envío y facturación

### Categorías de Productos

- cascos
- luces
- candados
- accesorios
- repuestos
- ropa
- herramientas

## Seguridad

### Row Level Security (RLS)

- Todas las tablas tienen RLS habilitado
- Los usuarios solo pueden ver/editar sus datos
- Los admins tienen acceso completo
- Los productos activos son públicos

### Roles de Usuario

- **user**: Usuario normal, puede ver productos y gestionar sus órdenes
- **admin**: Administrador, puede gestionar productos, órdenes y usuarios

### Validación

- Todos los inputs se validan con Zod
- Tipos TypeScript estrictos
- Validación de archivos en el frontend

## Funciones SQL

### create_order_with_items

Función para crear órdenes con items de forma atómica:

```sql
SELECT create_order_with_items(
  '{"user_id": "uuid", "total": 150000, "status": "pending"}'::jsonb,
  '[{"product_id": "uuid", "quantity": 2, "price": 75000}]'::jsonb[]
);
```

## Desarrollo y Debugging

### React Query

- Configurado con `QueryProvider`
- Cache automático de consultas
- Invalidación inteligente

### Testing

- Usar `.env.test` para variables de test
- Crear base de datos de pruebas separada
- Mockear servicios para unit tests

## Deployment

### Variables de Producción

1. Configurar variables en el hosting (Vercel/Netlify)
2. Usar diferentes proyectos Supabase para staging/prod
3. Configurar dominio personalizado para storage

### Migraciones

1. Exportar esquema: `supabase db dump`
2. Aplicar cambios: Ejecutar SQLs en producción
3. Migrar datos si es necesario

## Troubleshooting

### Errores Comunes

1. **CORS**: Configurar dominios en Supabase Dashboard
2. **RLS**: Verificar políticas de seguridad
3. **Tipos**: Regenerar tipos con `supabase gen types`

### Monitoreo

- Logs en Supabase Dashboard
- Métricas de uso y rendimiento
- Alertas de errores

## Próximos Pasos

1. Implementar búsqueda full-text
2. Agregar sistema de reseñas
3. Integrar pasarela de pagos
4. Notificaciones en tiempo real
5. Analytics de productos

# 🚀 Guía de Configuración - Base de Datos Supabase

## 📋 Resumen Ejecutivo

Esta guía proporciona instrucciones completas para configurar la base de datos Supabase de la tienda RockBros. Incluye schema completo, políticas de seguridad, funciones útiles, triggers automáticos y datos iniciales.

## 📁 Archivos de Configuración

```
supabase/
├── migracion-completa-2025.sql     # Archivo principal con TODO
├── schema-completo-2025.sql        # Solo estructura de tablas
├── policies-completas-2025.sql     # Solo políticas RLS
├── funciones-backend-2025.sql      # Funciones útiles
├── triggers-automaticos-2025.sql   # Triggers y automatizaciones
├── datos-iniciales-2025.sql        # Datos de ejemplo
├── README-configuracion-2025.md    # Esta guía
└── README.md                       # Estructura anterior
```

## ⚡ Configuración Rápida

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

### 2. Ejecutar Migración Completa

1. Ve al **SQL Editor** en tu proyecto Supabase
2. Copia y pega el contenido de `migracion-completa-2025.sql`
3. Haz clic en **Run** para ejecutar la migración

### 3. Verificar Configuración

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 🔧 Configuración Manual (Paso a Paso)

Si prefieres configurar paso a paso:

### Paso 1: Schema de Base de Datos

```bash
# Ejecutar en SQL Editor de Supabase
# Archivo: schema-completo-2025.sql
```

### Paso 2: Políticas de Seguridad

```bash
# Ejecutar después del schema
# Archivo: policies-completas-2025.sql
```

### Paso 3: Funciones Útiles

```bash
# Ejecutar después de las políticas
# Archivo: funciones-backend-2025.sql
```

### Paso 4: Triggers Automáticos

```bash
# Ejecutar después de las funciones
# Archivo: triggers-automaticos-2025.sql
```

### Paso 5: Datos Iniciales

```bash
# Ejecutar al final
# Archivo: datos-iniciales-2025.sql
```

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto frontend:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### Cómo obtener las claves:

1. Ve a **Settings** > **API** en tu proyecto Supabase
2. Copia el **Project URL** y **anon public** key
3. Pégalos en tu archivo `.env.local`

## 🧪 Probar la Configuración

### 1. Verificar Conexión

```javascript
// En la consola del navegador
import { supabase } from './lib/supabase'
console.log(
  'Conexión:',
  await supabase.from('products').select('count').single()
)
```

### 2. Probar Funciones

```sql
-- Probar búsqueda de productos
SELECT * FROM search_products('mtb', '', '', 0, 10000, 'rating', 'desc', 5);

-- Probar productos destacados
SELECT * FROM get_featured_products(4);

-- Probar alternar favorito (reemplaza con ID real de usuario)
SELECT toggle_favorite('user-id-aqui', 'product-id-aqui');
```

### 3. Verificar Políticas RLS

```sql
-- Debería funcionar (productos públicos)
SELECT name, price FROM products LIMIT 5;

-- Debería requerir autenticación
SELECT * FROM favorites LIMIT 5;
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **`products`** - Catálogo de productos
- **`product_variants`** - Variantes de productos (tallas, colores)
- **`profiles`** - Perfiles de usuarios
- **`orders`** - Órdenes de compra
- **`order_items`** - Items de cada orden
- **`carts`** - Carritos de compra
- **`favorites`** - Productos favoritos
- **`reviews`** - Reseñas de productos
- **`addresses`** - Direcciones de envío/facturación

### Tablas de Soporte

- **`categories`** - Categorías de productos
- **`brands`** - Marcas de productos
- **`inventory_movements`** - Movimientos de inventario
- **`coupons`** - Cupones de descuento
- **`site_settings`** - Configuración del sitio

## 🔒 Políticas de Seguridad (RLS)

### Lectura Pública

- Productos, categorías, marcas
- Reseñas activas
- Configuración del sitio

### Requiere Autenticación

- Perfiles de usuario (solo el propio)
- Direcciones (solo las propias)
- Órdenes (solo las propias)
- Favoritos (solo los propios)
- Carrito (solo el propio)

### Solo Administradores

- Modificación de productos
- Gestión de órdenes
- Movimientos de inventario
- Configuración del sitio

## ⚙️ Funciones Útiles

### Búsqueda y Filtros

- `search_products()` - Búsqueda avanzada con filtros
- `get_featured_products()` - Productos destacados
- `get_related_products()` - Productos relacionados

### Carrito y Compras

- `get_or_create_cart()` - Obtener o crear carrito
- `add_to_cart()` - Agregar producto al carrito
- `create_order_from_cart()` - Crear orden desde carrito

### Gestión de Datos

- `toggle_favorite()` - Alternar favorito
- `update_product_rating()` - Actualizar rating promedio

## 🔄 Triggers Automáticos

### Actualización Automática

- **Rating de productos** - Se actualiza cuando hay nuevas reseñas
- **Stock de productos** - Se sincroniza con variantes
- **Timestamps** - `updated_at` se actualiza automáticamente

### Validaciones

- **Stock disponible** - Verifica stock antes de vender
- **Direcciones válidas** - Valida propiedad de direcciones
- **Movimientos de inventario** - Registra cambios automáticamente

## 📈 Monitoreo y Mantenimiento

### Consultas Útiles

```sql
-- Productos con stock bajo
SELECT name, stock, min_stock FROM products WHERE stock <= min_stock;

-- Órdenes recientes
SELECT order_number, total, status, created_at FROM orders
ORDER BY created_at DESC LIMIT 10;

-- Estadísticas de ventas
SELECT
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value
FROM orders
WHERE status = 'completed'
AND created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### Limpieza Automática

```sql
-- Limpiar carritos expirados (ejecutar periódicamente)
DELETE FROM cart_items
WHERE cart_id IN (
  SELECT id FROM carts WHERE expires_at < now()
);
DELETE FROM carts WHERE expires_at < now();
```

## 🚨 Solución de Problemas

### Error: "relation does not exist"

**Solución:** Verificar que todas las tablas se crearon correctamente

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### Error: "permission denied for table"

**Solución:** Verificar políticas RLS

```sql
SELECT * FROM pg_policies WHERE tablename = 'nombre_tabla';
```

### Error: "function does not exist"

**Solución:** Verificar que las funciones se crearon

```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';
```

## 📞 Soporte

Si encuentras problemas:

1. Verifica los logs en **Supabase Dashboard** > **Logs**
2. Revisa la consola del navegador para errores de red
3. Confirma que las variables de entorno están correctas
4. Verifica que el usuario tenga los permisos adecuados

## 🎯 Próximos Pasos

Después de configurar la base de datos:

1. **Configurar Autenticación** - Configurar proveedores OAuth
2. **Subir Imágenes** - Configurar Storage para imágenes de productos
3. **Configurar Pagos** - Integrar pasarela de pagos
4. **Deploy del Frontend** - Desplegar la aplicación
5. **Monitoreo** - Configurar alertas y monitoreo

---

**¡Tu tienda RockBros está lista para funcionar!** 🏁

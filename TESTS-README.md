# 🧪 SUPABASE CONNECTION TESTS

## 📋 Descripción

Suite completa de tests para validar la conexión y funcionalidad de Supabase en la tienda RockBros. Incluye tests de conexión, lectura de datos, funciones backend, políticas RLS y performance.

## 🚀 Métodos de Ejecución

### 1. 🖥️ Desde Línea de Comandos (Node.js)

```bash
# Test básico
npm run test:supabase

# Test detallado con logs completos
npm run test:supabase:verbose

# Test con output JSON (para CI/CD)
npm run test:supabase:json

# Verificación rápida (solo checks críticos)
npm run verify:supabase

# Ejecutar directamente
node scripts/test-supabase.js --verbose
```

### 2. 🌐 Desde Navegador

```bash
# Opción 1: Servidor local
npm run test:supabase:html
# Abre: http://localhost:3001/supabase-test.html

# Opción 2: Archivo directo
# Abre supabase-test.html en tu navegador
```

### 3. 📱 Desde Consola del Navegador

```javascript
// Copia y pega en la consola del navegador
import { runSupabaseTests } from './src/utils/supabase-tests.js'
await runSupabaseTests()
```

## 📊 Tests Incluidos

### ✅ Tests de Conexión

- **Conexión Básica**: Verifica conexión con Supabase
- **Lectura de Productos**: Valida acceso a tabla products
- **Lectura de Categorías**: Verifica tabla categories
- **Lectura de Marcas**: Valida tabla brands

### ⚙️ Tests de Funciones

- **Función de Búsqueda**: Valida `search_products()`
- **Productos Destacados**: Verifica `get_featured_products()`
- **Verificación de Salud**: Valida `health_check_report()`

### 🔒 Tests de Seguridad

- **Políticas RLS**: Verifica que las tablas protegidas requieran autenticación
- **Acceso Público**: Confirma que datos públicos sean accesibles

### ⚡ Tests de Performance

- **Queries Múltiples**: Ejecuta múltiples consultas en paralelo
- **Tiempo de Respuesta**: Mide performance de las operaciones

## 📋 Resultados Esperados

### ✅ Configuración Correcta

```
✅ Conexión Básica - PASS (150ms)
✅ Lectura de Productos - PASS (200ms)
✅ Lectura de Categorías - PASS (120ms)
✅ Función de Búsqueda - PASS (180ms)
✅ Verificación de Salud - PASS (250ms)
✅ Políticas RLS - PASS (300ms)
✅ Performance Básica - PASS (450ms)

================================
📊 RESUMEN DE TESTS
================================
✅ Tests Pasados: 7
❌ Tests Fallidos: 0
📈 Tasa de Éxito: 100.0%
```

### ❌ Problemas Comunes

#### Error: "infinite recursion detected in policy for relation profiles"

```
❌ Conexión Básica - FAIL: Error de conexión: infinite recursion detected in policy for relation "profiles"
```

**Causa**: Las políticas RLS de admin consultan la tabla `profiles` dentro de sí misma, creando recursión infinita.

**Solución**: Ejecutar `supabase/URGENT-FIXES.sql` en Supabase SQL Editor

#### Error: "column reference sort_order is ambiguous"

```
❌ Función de Búsqueda - FAIL: Error en función search_products: column reference "sort_order" is ambiguous
```

**Causa**: La función `search_products` tiene referencias ambiguas a columnas entre tablas JOIN.

**Solución**: Ejecutar `supabase/URGENT-FIXES.sql` en Supabase SQL Editor

#### Error: "structure of query does not match function result type"

```
❌ Función search_products: structure of query does not match function result type
```

**Causa**: La consulta SELECT devuelve menos columnas o tipos diferentes a los declarados en RETURNS TABLE.

**Ejemplo del problema:**

```sql
-- ❌ Función declara 8 columnas
RETURNS TABLE (id, name, description, price, image_url, category_name, brand_name, created_at)

-- ❌ Consulta devuelve solo 7 columnas (falta created_at)
SELECT p.id, p.name, p.description, p.price, p.main_image, p.category, p.brand
```

**Solución**: Ejecutar `supabase/URGENT-FIXES.sql` que corrige la consulta para devolver exactamente las columnas declaradas.

```
❌ Función search_products: column p.category_id does not exist
```

**Causa**: La función intenta acceder a columnas que no existen en la tabla `products`.

**Estructura real de la tabla products:**

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,        -- ❌ NO es category_id
  brand TEXT NOT NULL,           -- ❌ NO es brand_id
  main_image TEXT,               -- ❌ NO es image_url
  -- ... otras columnas
);
```

**Solución**: Ejecutar `supabase/URGENT-FIXES.sql` que corrige la función para usar las columnas correctas.

#### Error: "Usuarios no se crean en tabla profiles"

```
❌ Usuarios registrados en Authentication pero no aparecen en profiles
```

**Causa**: Falta trigger automático para crear perfiles cuando se registra un usuario.

**Síntomas:**

- Usuarios aparecen en Authentication > Users
- No aparecen en la tabla `profiles`
- Error al intentar acceder a funcionalidades que requieren perfil

**Solución**: Ejecutar `supabase/USER-MANAGEMENT-FIX.sql` que incluye:

- Trigger automático para crear perfiles
- Sistema completo de gestión de roles
- Funciones para promocionar/degradar usuarios
- Usuarios de prueba incluidos

```
❌ Lectura de Productos - FAIL: permission denied for table products
```

**Causa**: Políticas RLS no permiten acceso público a las tablas.

**Solución**: Ejecutar `supabase/URGENT-FIXES.sql` en Supabase SQL Editor

## 🔧 Configuración

### Variables de Entorno Requeridas

Asegúrate de tener estas variables en tu `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### Dependencias

```json
{
  "@supabase/supabase-js": "^2.x.x"
}
```

## 📊 Interpretación de Resultados

### Métricas Clave

- **Tasa de Éxito**: Porcentaje de tests que pasan
- **Tiempo Total**: Tiempo total de ejecución
- **Tiempo por Test**: Performance individual

### Códigos de Salida (CLI)

- `0`: Todos los tests pasaron ✅
- `1`: Algunos tests fallaron ❌

## 🚨 Troubleshooting

### Problema: Tests no se ejecutan

```bash
# Verificar Node.js
node --version

# Verificar dependencias
npm list @supabase/supabase-js

# Verificar variables de entorno
echo $VITE_SUPABASE_URL
```

### Problema: Error de CORS en navegador

```
Access to fetch ... has been blocked by CORS policy
```

**Solución**: Configurar CORS en Supabase Dashboard → Settings → API

### Problema: Tests pasan pero datos vacíos

```
✅ Lectura de Productos - PASS
Products found: 0
```

**Solución**: Verificar que hay datos en las tablas de Supabase

### Problema: Recursión infinita en políticas RLS

```
infinite recursion detected in policy for relation "profiles"
```

**Solución**: Las políticas de admin están consultando la tabla profiles dentro de sí misma. Usar función helper en lugar de consulta directa.

### Problema: Referencia ambigua de columna

```
column reference "sort_order" is ambiguous
```

**Solución**: Usar alias explícitos en consultas JOIN para evitar ambigüedades.

### Problema: Función no existe

```
#### Error: "Could not choose the best candidate function"
```

❌ Función search_products: Could not choose the best candidate function between: public.search_products(...)

````
**Causa**: Hay múltiples versiones de la función `search_products` con diferentes parámetros, causando ambigüedad en PostgreSQL.

**Solución**: Ejecutar `supabase/URGENT-FIXES.sql` que elimina todas las versiones conflictivas y crea una sola versión compatible.

**¿Por qué ocurre?**
- PostgreSQL permite sobrecarga de funciones (múltiples funciones con el mismo nombre)
- Cuando hay ambigüedad, el sistema no puede determinar cuál versión usar
- Los tests llaman con 3 parámetros simples, pero existen versiones con 9 parámetros

**Solución aplicada:**
```sql
-- Elimina todas las versiones existentes
DROP FUNCTION IF EXISTS public.search_products(TEXT, TEXT, TEXT, DECIMAL, DECIMAL, TEXT, TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.search_products(TEXT, INTEGER, INTEGER);

-- Crea una sola versión compatible con los tests
CREATE OR REPLACE FUNCTION public.search_products(search_query TEXT, limit_count INTEGER, offset_count INTEGER)
````

````
**Solución**: Re-ejecutar el archivo de setup completo o crear la función manualmente.

## � Gestión de Usuarios y Roles

### Configuración de Usuarios

Después de aplicar `supabase/USER-MANAGEMENT-FIX.sql`, tendrás:

- ✅ **Creación automática de perfiles** al registrar usuarios
- ✅ **Sistema de roles**: `user` (compras), `moderator`, `admin` (gestión)
- ✅ **Funciones de gestión** desde línea de comandos

### Comandos para Gestionar Usuarios

```bash
# Verificar configuración de usuarios
npm run manage:users check

# Listar todos los usuarios
npm run manage:users list

# Promocionar usuario a admin
npm run manage:users promote <user_id>

# Degradar admin a usuario común
npm run manage:users demote <user_id>

# Activar/desactivar usuario
npm run manage:users toggle <user_id>
```

### Usuarios de Prueba Recomendados

1. **Usuario común**: `usuario@ejemplo.com` (password: `usuario123`)
2. **Usuario admin**: `admin@rockbros.com` (password: `admin123`)

### Funciones Disponibles

| Función | Descripción | Uso |
|---------|-------------|-----|
| `promote_to_admin()` | Convierte usuario en admin | Solo admins |
| `demote_from_admin()` | Quita rol de admin | Solo admins |
| `get_users_list()` | Lista todos los usuarios | Solo admins |
| `toggle_user_status()` | Activa/desactiva usuario | Solo admins |
| `check_users_setup()` | Verifica configuración | Público |

### Seguridad Implementada

- 🔒 **Solo admins** pueden gestionar otros usuarios
- 🛡️ **Protección** contra eliminar último admin
- ✅ **Trigger automático** crea perfiles al registrarse
- 🔐 **RLS policies** protegen las operaciones`

## 📞 Solución de Problemas Específicos

### Si los tests fallan después de aplicar URGENT-FIXES.sql:

1. **Verificar que el SQL se ejecutó completamente**
2. **Reiniciar la conexión de Supabase** (refresh en el dashboard)
3. **Limpiar cache del navegador** si usas la interfaz web
4. **Re-ejecutar tests** con `npm run test:supabase`

### Si persisten errores de permisos:

1. **Verificar políticas RLS** en Supabase Dashboard → Authentication → Policies
2. **Asegurar que las tablas públicas** tengan políticas de lectura pública
3. **Verificar configuración de autenticación** si usas datos protegidos

### Si hay errores de conexión:

1. **Verificar URL y API Key** en el archivo `.env`
2. **Comprobar conectividad** con `ping bhvwdmyakynstahxwqtx.supabase.co`
3. **Verificar configuración de red** y firewalls

## 🔄 Integración con CI/CD

### GitHub Actions

```yaml
- name: Test Supabase Connection
  run: npm run test:supabase:json
  env:
    VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Verificación Automática

```bash
# En pre-commit hook
npm run test:supabase || exit 1
```

## 📈 Métricas y Monitoreo

### Métricas Recolectadas

- Tiempo de respuesta de queries
- Tasa de éxito de tests
- Número de productos/categorías
- Estado de políticas RLS
- Performance de funciones

### Alertas Recomendadas

- Tasa de éxito < 90%
- Tiempo de respuesta > 2s
- Tests fallidos > 0

## 🎯 Próximos Pasos

Después de validar la conexión:

1. **Configurar Autenticación** en Supabase
2. **Subir imágenes** al Storage
3. **Implementar hooks** en el frontend
4. **Configurar pagos** (Stripe/PayPal)
5. **Deploy a producción**

## 📞 Soporte

- 📖 **Documentación**: Ver `README-configuracion-2025.md`
- 🐛 **Issues**: Reportar en GitHub
- 💬 **Comunidad**: [Supabase Discord](https://supabase.com/discord)

---

**¡Felicitaciones!** 🎉 Tu tienda RockBros está lista para funcionar.
````

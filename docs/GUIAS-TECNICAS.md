# 🛠️ Guías Técnicas Consolidadas - RockBros Store

**Última actualización:** 3 de noviembre de 2025
**Cobertura:** Deployment, Testing, Storage, Configuración, Filtros

---

## 📋 Tabla de Contenidos

1. [🚀 Deployment y Producción](#deployment)
2. [🧪 Testing y Validación](#testing)
3. [💾 Storage y Gestión de Archivos](#storage)
4. [⚙️ Configuración del Proyecto](#configuracion)
5. [🔍 Sistema de Filtros](#filtros)
6. [🎨 Accesibilidad y UI](#accesibilidad)

---

## 🚀 Deployment y Producción {#deployment}

### 📋 Checklist Pre-Deploy

#### ✅ Base de Datos

- [ ] Migración completa ejecutada en Supabase
- [ ] Políticas RLS verificadas y probadas
- [ ] Funciones backend (Edge Functions) operativas
- [ ] Datos iniciales cargados (productos, categorías, marcas)
- [ ] Triggers automáticos funcionando
- [ ] Storage buckets configurados con políticas

#### ✅ Frontend

- [ ] Variables de entorno configuradas (`.env.local`)
- [ ] Dependencias instaladas (`npm install` o `bun install`)
- [ ] Build de producción generado (`npm run build`)
- [ ] Conexión con Supabase probada
- [ ] Tests de funcionalidad ejecutados
- [ ] Performance optimizada (bundle < 700KB)

#### ✅ Configuración

- [ ] Autenticación de Supabase configurada
- [ ] Storage para imágenes configurado
- [ ] Variables de entorno en producción
- [ ] Dominio y SSL configurado (opcional)
- [ ] Analytics configurado (opcional)

### 🌐 Opciones de Deployment

#### **Opción 1: Vercel (Recomendado)**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login y conectar
vercel login
vercel

# 3. Configurar variables de entorno
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 4. Deploy a producción
vercel --prod
```

#### **Opción 2: Netlify**

1. **Setup automático:**

   - Conectar repositorio en [netlify.com](https://netlify.com)
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Variables de entorno:**
   - Site settings → Environment variables
   - Agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

#### **Opción 3: Deploy Manual**

```bash
# Build local
npm run build

# Servir estáticamente
npx serve dist
# O: python -m http.server 3000 -d dist
```

### 🔧 Variables de Entorno Producción

```env
# Supabase (REQUERIDO)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-produccion

# Opcional: Integraciones
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...
```

---

## 🧪 Testing y Validación {#testing}

### 🎯 Suite de Tests Incluida

#### **Tests de Conexión**

- ✅ **Conexión Básica**: Verifica conectividad con Supabase
- ✅ **Lectura de Productos**: Valida acceso a tabla `products`
- ✅ **Lectura de Categorías**: Verifica tabla `categories`
- ✅ **Lectura de Marcas**: Valida tabla `brands`

#### **Tests de Funciones Backend**

- ✅ **Función de Búsqueda**: Valida `search_products()`
- ✅ **Productos Destacados**: Verifica `get_featured_products()`
- ✅ **Health Check**: Valida `health_check_report()`

#### **Tests de Seguridad**

- ✅ **Políticas RLS**: Verifica protección de datos sensibles
- ✅ **Acceso Público**: Confirma accesibilidad de datos públicos

### 📝 Métodos de Ejecución

#### **Línea de Comandos**

```bash
# Test completo
npm run test:supabase

# Test detallado con logs
npm run test:supabase:verbose

# Output JSON para CI/CD
npm run test:supabase:json

# Verificación rápida
npm run verify:supabase
```

#### **Navegador Web**

```bash
# Servidor local de tests
npm run test:supabase:html
# Abre: http://localhost:3001/supabase-test.html
```

#### **Consola del Navegador**

```javascript
// Copia y pega en DevTools
import { runSupabaseTests } from './src/utils/supabase-tests.js'
await runSupabaseTests()
```

### 📊 Resultados Esperados

#### ✅ **Configuración Correcta**

```
✅ Conexión Básica - PASS (150ms)
✅ Lectura de Productos - PASS (200ms)
✅ Lectura de Categorías - PASS (120ms)
✅ Función de Búsqueda - PASS (180ms)
✅ Health Check - PASS (250ms)
✅ Políticas RLS - PASS (300ms)
✅ Performance - PASS (450ms)

📊 RESUMEN: 7/7 tests pasados (100.0%)
```

#### ❌ **Problemas Comunes y Soluciones**

**Error: "infinite recursion detected in policy"**

```sql
-- Solución: Revisar políticas RLS circulares
-- Archivo: supabase/URGENT-FIXES.sql
```

**Error: "relation does not exist"**

```bash
# Solución: Ejecutar migraciones
psql -h db.supabase.co -U postgres -f supabase/SUPABASE-SETUP-COMPLETE.sql
```

---

## 💾 Storage y Gestión de Archivos {#storage}

### 🗂️ Configuración de Storage

#### **Buckets Configurados**

```sql
-- 1. Bucket principal para productos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- 2. Bucket para avatares de usuario
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- 3. Bucket para assets generales
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true);
```

#### **Políticas de Acceso**

```sql
-- Lectura pública para imágenes de productos
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Upload autenticado para avatares
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'avatars');
```

### 📁 Estructura de Archivos

```
Storage (Supabase)
├── product-images/
│   ├── categoria-1/
│   │   ├── producto-1-main.jpg
│   │   ├── producto-1-gallery-1.jpg
│   │   └── producto-1-gallery-2.jpg
│   └── categoria-2/
├── avatars/
│   └── user-{id}/
│       └── avatar.jpg
└── public-assets/
    ├── logos/
    ├── banners/
    └── icons/
```

### 🔄 Gestión de Imágenes

#### **Upload de Productos (Admin)**

```typescript
// src/hooks/useImageUpload.ts
const uploadProductImage = async (file: File, productId: string) => {
  const filePath = `products/${productId}/${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (error) throw error
  return getPublicUrl('product-images', filePath)
}
```

#### **Optimización Automática**

- **Compresión**: WebP con fallback JPEG
- **Lazy Loading**: Intersection Observer API
- **Responsive Images**: srcset para diferentes tamaños
- **CDN**: URLs optimizadas de Supabase

---

## ⚙️ Configuración del Proyecto {#configuracion}

### 🚀 Setup Inicial

#### **1. Clonar y Instalar**

```bash
# Clonar repositorio
git clone https://github.com/basabecode/Tienda_RockBrosStore.git
cd Tienda_RockBrosStore

# Instalar dependencias (preferir bun)
bun install
# O: npm install

# Configurar pre-commit hooks
npx husky install
```

#### **2. Configurar Supabase**

```bash
# Instalar Supabase CLI
npm i -g supabase

# Login y conectar proyecto
supabase login
supabase link --project-ref TU-PROJECT-REF
```

#### **3. Variables de Entorno**

```env
# .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Opcional para desarrollo
VITE_DEV_MODE=true
VITE_ENABLE_DEVTOOLS=true
```

#### **4. Base de Datos**

```bash
# Ejecutar setup completo
psql -h db.supabase.co -U postgres -f supabase/SUPABASE-SETUP-COMPLETE.sql

# O migración manual
supabase db push
```

### 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (Vite)
npm run dev:host     # Servidor accesible en red local

# Construcción
npm run build        # Build de producción
npm run preview      # Preview del build

# Linting y formateo
npm run lint         # ESLint
npm run lint:fix     # Auto-fix ESLint
npm run format       # Prettier

# Testing
npm run test         # Tests unitarios (Vitest)
npm run test:e2e     # Tests end-to-end (Playwright)
npm run test:supabase # Tests de conexión Supabase

# Utilidades
npm run analyze      # Análisis de bundle
npm run clean        # Limpiar cache y node_modules
```

### 📦 Stack Tecnológico

#### **Core Dependencies**

```json
{
  "react": "^18.2.0",
  "typescript": "^5.2.2",
  "vite": "^5.0.0",
  "@supabase/supabase-js": "^2.38.4",
  "@tanstack/react-query": "^5.8.4",
  "react-router-dom": "^6.18.0"
}
```

#### **UI/UX Dependencies**

```json
{
  "tailwindcss": "^3.3.5",
  "@radix-ui/react-*": "^1.0.4",
  "lucide-react": "^0.294.0",
  "class-variance-authority": "^0.7.0"
}
```

---

## 🔍 Sistema de Filtros {#filtros}

### 🎯 Arquitectura de Filtros

#### **Filtros Implementados**

- ✅ **Por Categoría**: Filtrado jerárquico de categorías
- ✅ **Por Rango de Precio**: Slider con min/max configurables
- ✅ **Por Marca**: Multi-select de marcas disponibles
- ✅ **Por Disponibilidad**: En stock, agotado, todos
- ✅ **Búsqueda de Texto**: Full-text search en nombre y descripción
- ✅ **Ordenamiento**: Precio, nombre, fecha, popularidad

#### **Hook Principal**

```typescript
// src/hooks/useProductFilters.ts
const useProductFilters = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    category: null,
    priceRange: [0, 1000],
    brands: [],
    inStock: null,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  })

  const filteredProducts = useMemo(
    () => applyFilters(products, filters),
    [products, filters]
  )

  return { filters, setFilters, filteredProducts }
}
```

#### **Componente de Filtros**

```typescript
// src/components/FilterSidebar.tsx
const FilterSidebar = ({ onFiltersChange }) => {
  return (
    <div className="space-y-6">
      <CategoryFilter />
      <PriceRangeFilter />
      <BrandFilter />
      <AvailabilityFilter />
      <SortingOptions />
    </div>
  )
}
```

### 🔄 Sincronización con URL

#### **URL Params Integration**

```typescript
// Sync filters with URL for shareable links
const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateFilters = (newFilters: ProductFilters) => {
    const params = new URLSearchParams()
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.search) params.set('q', newFilters.search)
    setSearchParams(params)
  }
}
```

---

## 🎨 Accesibilidad y UI {#accesibilidad}

### ♿ Mejores Prácticas Implementadas

#### **Contraste y Legibilidad**

```css
/* Variables CSS optimizadas */
:root {
  --contrast-high: #ffffff;
  --contrast-medium: #a0a0a0;
  --contrast-low: #606060;
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --accent-primary: #00ff00;
}
```

#### **Navegación por Teclado**

- ✅ **Tab Order**: Orden lógico de navegación
- ✅ **Focus Indicators**: Indicadores visuales claros
- ✅ **Skip Links**: Enlaces de salto al contenido principal
- ✅ **Escape Handlers**: ESC para cerrar modales

#### **Screen Readers**

```jsx
// Ejemplo de accesibilidad en componentes
<button
  aria-label="Agregar al carrito"
  aria-describedby="product-description"
  role="button"
>
  <ShoppingCart aria-hidden="true" />
  <span className="sr-only">Agregar al carrito</span>
</button>
```

#### **Responsive Design**

```css
/* Mobile-first approach */
.container {
  @apply px-4 sm:px-6 lg:px-8;
  @apply max-w-sm sm:max-w-md lg:max-w-7xl;
}

/* Fluid typography */
.heading {
  @apply text-lg sm:text-xl lg:text-2xl;
}
```

### 📱 Breakpoints Utilizados

| Breakpoint | Tamaño  | Uso                   |
| ---------- | ------- | --------------------- |
| `sm`       | 640px+  | Tablets pequeñas      |
| `md`       | 768px+  | Tablets               |
| `lg`       | 1024px+ | Desktop               |
| `xl`       | 1280px+ | Desktop grande        |
| `2xl`      | 1536px+ | Pantallas muy grandes |

---

## 📚 Scripts y Utilidades

### 🤖 Scripts de Automatización

```bash
# Gestión de base de datos
./scripts/setup-admin.js          # Crear usuario admin
./scripts/manage-users.js         # Gestión de usuarios
./scripts/validate-userprofile.js # Validar perfiles

# Testing y diagnóstico
./scripts/test-supabase.js        # Test conexión Supabase
./scripts/diagnose-rls.js         # Diagnóstico RLS
./scripts/verify-routes.js        # Verificar rutas

# Limpieza y optimización
./tests/cleanup-temp-files.sh     # Limpiar archivos temporales
./tests/cleanup-unused-deps.sh    # Remover dependencias no usadas
```

### 🔧 Herramientas de Desarrollo

```bash
# Análisis de bundle
npm run analyze

# Performance profiling
npm run profile

# Verificación de tipos
npm run type-check

# Audit de seguridad
npm audit --audit-level moderate
```

---

## 🎯 Roadmap Técnico

### Q4 2025 (Próximas mejoras)

- [ ] **PWA Features**: Service workers, offline support
- [ ] **Advanced Analytics**: User behavior tracking
- [ ] **A/B Testing**: Feature flag system
- [ ] **Performance**: Image optimization, CDN

### Q1 2026 (Futuras integraciones)

- [ ] **Payment Gateway**: Stripe/PayPal integration
- [ ] **Real-time Features**: WebSocket notifications
- [ ] **Multi-language**: i18n implementation
- [ ] **API Documentation**: OpenAPI/Swagger specs

---

**Documento consolidado** - Reemplaza: DEPLOYMENT-GUIDE.md, TESTS-README.md, GUIA-STORAGE-COMPLETA.md, README-configuracion-2025.md, FILTROS-SISTEMA-README.md, GUIA-ACCESIBILIDAD-MEJORES-PRACTICAS.md, DOCUMENTACION_PROCESOS.md

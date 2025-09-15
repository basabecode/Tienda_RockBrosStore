# 🎯 DEPLOYMENT Y USO - TIENDA ROCKBROS

## 📋 Checklist Pre-Deploy

### ✅ Base de Datos

- [ ] Migración completa ejecutada en Supabase
- [ ] Políticas RLS verificadas
- [ ] Funciones backend probadas
- [ ] Datos iniciales cargados
- [ ] Triggers automáticos funcionando

### ✅ Frontend

- [ ] Variables de entorno configuradas (`.env.local`)
- [ ] Dependencias instaladas (`npm install` o `bun install`)
- [ ] Build de producción generado (`npm run build`)
- [ ] Conexión con Supabase probada

### ✅ Configuración

- [ ] Autenticación de Supabase configurada
- [ ] Storage para imágenes configurado
- [ ] Variables de entorno en producción
- [ ] Dominio configurado (opcional)

## 🚀 Guía de Deploy

### Opción 1: Vercel (Recomendado)

1. **Conectar repositorio:**

   ```bash
   # Instalar Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Conectar proyecto
   vercel
   ```

2. **Configurar variables de entorno:**

   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Opción 2: Netlify

1. **Conectar repositorio:**

   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Configura build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

2. **Variables de entorno:**

   - En Netlify Dashboard → Site settings → Environment variables
   - Agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

3. **Deploy automático:**
   - Cada push a `main` dispara deploy automático

### Opción 3: Deploy Manual

```bash
# Build de producción
npm run build

# Servir archivos estáticos
npx serve dist

# O usar cualquier servidor web
python -m http.server 3000 -d dist
```

## 🔧 Configuración de Producción

### Variables de Entorno (.env.production)

```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-produccion

# Opcional: Analytics, pagos, etc.
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Configuración de Supabase

1. **Habilitar autenticación:**

   - Authentication → Settings
   - Configurar proveedores OAuth (Google, GitHub)
   - Configurar URLs de redirect

2. **Configurar Storage:**

   - Storage → Create bucket `product-images`
   - Políticas para uploads públicos

3. **Configurar Edge Functions (opcional):**
   - Para procesamiento de pagos
   - Para envío de emails

## 🧪 Pruebas en Producción

### Verificar Funcionalidades Core

```javascript
// Probar conexión
const { data, error } = await supabase
  .from('products')
  .select('name, price')
  .limit(5)

if (error) console.error('Error de conexión:', error)
```

### Endpoints Críticos

- [ ] `/` - Página principal
- [ ] `/productos` - Listado de productos
- [ ] `/producto/[id]` - Detalle de producto
- [ ] `/carrito` - Carrito de compras
- [ ] `/perfil` - Perfil de usuario
- [ ] `/admin` - Panel de administración

### Pruebas de Usuario

1. **Usuario anónimo:**

   - Ver productos
   - Agregar al carrito
   - Buscar productos

2. **Usuario registrado:**

   - Login/Registro
   - Agregar favoritos
   - Hacer pedido
   - Ver historial

3. **Administrador:**
   - Acceder al panel admin
   - Gestionar productos
   - Ver órdenes
   - Gestionar usuarios

## 📊 Monitoreo y Analytics

### Supabase Dashboard

- **Database:** Uso de recursos, queries lentas
- **Auth:** Usuarios activos, registros
- **Storage:** Uso de almacenamiento
- **Edge Functions:** Performance y errores

### Métricas a Monitorear

```sql
-- Órdenes del día
SELECT COUNT(*) as orders_today
FROM orders
WHERE DATE(created_at) = CURRENT_DATE;

-- Productos más vendidos
SELECT p.name, SUM(oi.quantity) as total_sold
FROM order_items oi
JOIN products p ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;

-- Usuarios activos
SELECT COUNT(DISTINCT user_id) as active_users
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
```

### Alertas Recomendadas

- Error rate > 5%
- Response time > 3s
- Database connections > 80%
- Storage usage > 80%

## 🔧 Mantenimiento

### Tareas Diarias

```sql
-- Limpiar carritos expirados
DELETE FROM cart_items
WHERE cart_id IN (
  SELECT id FROM carts
  WHERE expires_at < now()
);

DELETE FROM carts WHERE expires_at < now();
```

### Tareas Semanales

- Revisar logs de errores
- Verificar stock bajo
- Backup de base de datos
- Actualizar dependencias

### Tareas Mensuales

- Análisis de performance
- Revisión de costos
- Optimización de queries
- Actualización de seguridad

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de conexión:**

   ```javascript
   // Verificar variables de entorno
   console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
   console.log(
     'KEY:',
     import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + '...'
   )
   ```

2. **Error de permisos:**

   ```sql
   -- Verificar políticas RLS
   SELECT * FROM pg_policies
   WHERE tablename = 'products';
   ```

3. **Error de funciones:**
   ```sql
   -- Verificar funciones existentes
   SELECT routine_name FROM information_schema.routines
   WHERE routine_schema = 'public';
   ```

### Debug Mode

```javascript
// Habilitar debug en desarrollo
const supabase = createClient(url, key, {
  auth: { debug: true },
  db: { debug: true },
})
```

## 📈 Escalabilidad

### Optimizaciones de Performance

1. **Database:**

   ```sql
   -- Crear índices adicionales si es necesario
   CREATE INDEX CONCURRENTLY idx_products_category ON products(category);
   CREATE INDEX CONCURRENTLY idx_orders_user_date ON orders(user_id, created_at);
   ```

2. **Frontend:**

   - Implementar React Query para caching
   - Lazy loading de imágenes
   - Code splitting

3. **CDN:**
   - Usar CDN para assets estáticos
   - Optimizar imágenes
   - Cache headers apropiados

### Escalado Horizontal

- **Database:** Connection pooling
- **Auth:** Multiple instances
- **Storage:** CDN integration
- **Edge Functions:** Geographic distribution

## 💰 Costos y Presupuesto

### Supabase (Gratuito → $25/mes)

- **Free:** 500MB DB, 50MB Storage, 2GB Bandwidth
- **Pro:** $25/mes - 8GB DB, 100GB Storage, 50GB Bandwidth
- **Team:** $75/mes - 50GB DB, 500GB Storage, 250GB Bandwidth

### Hosting

- **Vercel:** Gratuito para proyectos pequeños
- **Netlify:** Gratuito con límites generosos
- **AWS/VPS:** $5-20/mes dependiendo del tráfico

### Dominio

- **Namecheap/GoDaddy:** ~$15/año
- **Google Domains:** ~$12/año

## 🎯 Roadmap de Mejoras

### Fase 1 (1-2 semanas)

- [ ] Sistema de pagos (Stripe/PayPal)
- [ ] Sistema de envío
- [ ] Emails de confirmación
- [ ] Reviews y ratings

### Fase 2 (2-4 semanas)

- [ ] Panel admin completo
- [ ] Analytics avanzado
- [ ] Sistema de cupones
- [ ] Integración con redes sociales

### Fase 3 (1-2 meses)

- [ ] App móvil
- [ ] Multi-idioma
- [ ] Sistema de wishlist avanzado
- [ ] Integración con marketplaces

## 📞 Soporte y Contacto

### Recursos Útiles

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **React Docs:** [react.dev](https://react.dev)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)

### Comunidad

- **Discord Supabase:** [supabase.com/discord](https://supabase.com/discord)
- **Reddit r/reactjs:** [reddit.com/r/reactjs](https://reddit.com/r/reactjs)
- **Stack Overflow:** Buscar con tags `supabase`, `react`, `postgresql`

---

## 🎉 ¡Felicitaciones!

Tu tienda **RockBros** está lista para recibir sus primeros clientes. 🚀

**Próximos pasos recomendados:**

1. Configurar dominio personalizado
2. Agregar productos reales con fotos
3. Configurar método de pago
4. Promocionar en redes sociales
5. Monitorear métricas y feedback

**¡Éxito con tu tienda de ciclismo!** 🏁

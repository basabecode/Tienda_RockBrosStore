# Configuración de Usuarios Admin - Guía Rápida

## 📋 Problema a Resolver

El sistema no reconocía cuando un usuario era promovido a admin en la base de datos de Supabase. Esta guía explica cómo configurar correctamente el sistema de administradores.

## 🔧 Pasos de Configuración

### 1. Aplicar el Esquema de Base de Datos

Ejecuta el siguiente archivo SQL en tu proyecto Supabase:

```bash
# Copiar el contenido de supabase/admin-schema-simple.sql
# y ejecutarlo en el editor SQL de Supabase
```

**Archivo:** `supabase/admin-schema-simple.sql`

Este esquema:

- ✅ Asegura que la tabla `profiles` tiene el campo `is_admin`
- ✅ Crea índices para consultas rápidas
- ✅ Configura triggers para crear perfiles automáticamente
- ✅ Establece políticas de seguridad RLS
- ✅ Añade funciones utilitarias para manejo de admins

### 2. Configurar Variables de Entorno

Copia `.env.example` a `.env.local` y completa con tus datos:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
VITE_ADMIN_SECRET=tu_secreto_admin_opcional
```

### 3. Configurar el Primer Admin

Hay varias formas de crear tu primer usuario admin:

#### Opción A: Script Automático (Recomendado)

```bash
# Ver todos los usuarios
npm run admin:check

# Promover automáticamente al primer usuario registrado
npm run admin:setup

# Promover un usuario específico por email
npm run admin:promote usuario@ejemplo.com
```

#### Opción B: Directamente en Supabase

1. Ve a tu proyecto Supabase → Table Editor → `profiles`
2. Encuentra tu usuario (por email)
3. Cambia el campo `is_admin` de `false` a `true`
4. Guarda los cambios

#### Opción C: SQL Manual

```sql
-- Ejecutar en el editor SQL de Supabase
UPDATE public.profiles
SET is_admin = true
WHERE email = 'tu-email@ejemplo.com';
```

### 4. Verificar en la Aplicación

1. **Inicia sesión** con tu cuenta
2. **Refresca los datos** usando:
   - Botón "Refresh" en DevTools (esquina superior derecha)
   - O cierra sesión y vuelve a iniciar
3. **Verifica acceso admin**:
   - En el menú de usuario debe aparecer "Dashboard Admin"
   - Puedes acceder a `/admin`
   - El ícono en DevTools debe ser un escudo verde

## 🛠️ Herramientas de Desarrollo

### DevTools (Componente incluido)

Cuando estés autenticado, verás un panel pequeño en la esquina superior derecha con:

- **Botón Refresh (🔄)**: Actualiza datos del usuario desde la DB
- **Ícono de Estado**:
  - 🛡️ Verde = Admin
  - 👤 Azul = Usuario normal
- **Texto del Rol**: Muestra "admin" o "user"

### Scripts de Terminal

```bash
# Ver estado de todos los usuarios
npm run admin:check

# Configurar primer admin automáticamente
npm run admin:setup

# Promover usuario específico
npm run admin:promote usuario@ejemplo.com

# Ver ayuda
npm run admin
```

## 🔍 Debugging

### Logs en Consola

El sistema incluye logs detallados:

```javascript
// Al iniciar sesión
🔄 Iniciando signIn para: usuario@ejemplo.com
✅ Usuario autenticado: usuario@ejemplo.com

// Al obtener usuario
📦 Usando usuario desde cache
// o
🔍 Obteniendo usuario desde Supabase...
👤 Usuario de auth obtenido: usuario@ejemplo.com

// Al verificar permisos de admin
✅ Acceso permitido al dashboard admin
// o
🚫 Acceso denegado: Usuario no es admin
```

### Verificación Manual

```javascript
// En la consola del navegador
// Verificar usuario actual
const {
  data: { user },
} = await supabase.auth.getUser()
console.log('Auth user:', user)

// Verificar perfil
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
console.log('Profile:', profile)
```

## ⚠️ Troubleshooting

### Problema: "Usuario no es admin" pero lo configuré en Supabase

**Solución:**

1. Limpia el cache: Usa el botón Refresh en DevTools
2. Verifica en Supabase que el campo `is_admin` es `true`
3. Cierra sesión y vuelve a iniciar sesión

### Problema: No aparece el menú "Dashboard Admin"

**Verificar:**

1. Usuario autenticado correctamente
2. Campo `is_admin = true` en la tabla `profiles`
3. Cache limpiado (botón Refresh)

### Problema: Error al acceder a `/admin`

**Verificar:**

1. El componente `AdminRoute` está funcionando
2. La ruta está configurada en `App.tsx`
3. El usuario tiene permisos de admin

## 📁 Archivos Importantes

```
├── supabase/
│   └── admin-schema-simple.sql      # Esquema de DB para admins
├── scripts/
│   └── setup-admin.js               # Scripts de configuración
├── src/
│   ├── components/
│   │   ├── AdminRoute.tsx           # Protección de rutas admin
│   │   └── DevTools.tsx             # Herramientas de desarrollo
│   ├── hooks/
│   │   └── use-auth.tsx             # Hook de autenticación
│   └── lib/
│       └── auth.ts                  # Lógica de autenticación
└── .env.example                     # Variables de entorno
```

## ✅ Resumen

Con esta configuración tendrás:

1. **Tabla profiles** correctamente configurada con campo `is_admin`
2. **Scripts automáticos** para gestionar admins
3. **Interfaz de usuario** que reconoce permisos de admin
4. **Herramientas de debugging** integradas
5. **Protección de rutas** admin funcional

¡El sistema ahora debería reconocer correctamente cuando un usuario es promovido a administrador! 🎉

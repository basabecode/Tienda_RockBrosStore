# 🗂️ Estructura Supabase Consolidada

## 📁 Archivos Organizados (3 archivos finales)

### 1️⃣ `01-database-schema.sql`

**Ejecutar PRIMERO** - Base de datos completa

- ✅ Todas las tablas (profiles, products, orders, addresses, order_items)
- ✅ Migración de datos existentes (mapeo title → name)
- ✅ Índices para performance
- ✅ Triggers y funciones básicas
- ✅ Verificación de estructura

### 2️⃣ `02-security-policies.sql`

**Ejecutar SEGUNDO** - Seguridad y permisos

- ✅ Funciones helper sin recursión infinita
- ✅ Políticas RLS para todas las tablas
- ✅ Permisos de usuario y administrador
- ✅ Verificación de políticas aplicadas

### 3️⃣ `03-admin-functions.sql`

**Ejecutar TERCERO** - Gestión administrativa

- ✅ Funciones para promover/degradar admins
- ✅ Setup inicial del primer administrador
- ✅ Productos de ejemplo para ciclismo
- ✅ Scripts de mantenimiento
- ✅ Comandos útiles documentados

### 🚨 `URGENT-FIX.sql`

**Para emergencias** - Deshabilita RLS temporalmente

- 🔧 Corrección inmediata de problemas críticos
- 🔧 Eliminar después de usar los archivos principales

---

## 🚀 Orden de Ejecución

```sql
-- 1. Ejecutar en Supabase Dashboard → SQL Editor:
-- Copiar y pegar contenido completo de cada archivo

-- PASO 1: Base de datos
\i 01-database-schema.sql

-- PASO 2: Seguridad
\i 02-security-policies.sql

-- PASO 3: Administración
\i 03-admin-functions.sql
```

## 🎯 Comandos Útiles Después del Setup

```sql
-- Promover usuario a admin (cambiar email):
SELECT public.promote_to_admin('tu-email@ejemplo.com', 'Tu Nombre');

-- Verificar administradores:
SELECT * FROM public.list_admins();

-- Verificar salud del sistema:
SELECT public.check_admin_health();

-- Insertar productos de ejemplo:
SELECT public.insert_sample_products();
```

## 📊 Consolidación Realizada

**ANTES:** 5 archivos fragmentados

- ❌ `00-migration.sql`
- ❌ `01-schema.sql`
- ❌ `02-security.sql`
- ❌ `03-admin-setup.sql`
- ❌ `URGENT-FIX.sql`

**DESPUÉS:** 3 archivos organizados + 1 emergencia

- ✅ `01-database-schema.sql` (Estructura completa)
- ✅ `02-security-policies.sql` (Seguridad RLS)
- ✅ `03-admin-functions.sql` (Administración)
- 🚨 `URGENT-FIX.sql` (Solo emergencias)

---

## 🔧 Características Mejoradas

- **Sin recursión infinita** en políticas RLS
- **Mapeo automático** de columnas existentes (title → name)
- **Funciones de administración** completas y seguras
- **Productos de ejemplo** específicos para ciclismo
- **Verificaciones automáticas** de salud del sistema
- **Documentación incluida** con comandos útiles

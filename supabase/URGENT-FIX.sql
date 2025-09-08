-- ==========================================
-- CORRECCIÓN URGENTE - EJECUTAR PRIMERO
-- ==========================================

-- 1. DESHABILITAR RLS TEMPORALMENTE
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses DISABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR TODAS LAS POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los admins pueden ver todos los perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Los admins pueden gestionar perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Ver propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Actualizar propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Insertar propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins gestionan perfiles" ON public.profiles;

DROP POLICY IF EXISTS "Todos pueden ver productos activos" ON public.products;
DROP POLICY IF EXISTS "Los admins pueden gestionar productos" ON public.products;
DROP POLICY IF EXISTS "Ver productos activos" ON public.products;
DROP POLICY IF EXISTS "Admins gestionan productos" ON public.products;

DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Los admins pueden ver todas las órdenes" ON public.orders;
DROP POLICY IF EXISTS "Los admins pueden gestionar órdenes" ON public.orders;
DROP POLICY IF EXISTS "Ver propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Crear propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Actualizar propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Admins gestionan órdenes" ON public.orders;

-- 3. AGREGAR COLUMNAS FALTANTES CRÍTICAS

-- Agregar name a products si no existe
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS name TEXT;

-- Copiar title a name si name está vacío
UPDATE public.products
SET name = COALESCE(name, title, 'Producto sin nombre')
WHERE name IS NULL OR name = '';

-- Agregar status a products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Agregar is_featured a products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Agregar brand a products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS brand TEXT;

-- Agregar is_admin a profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 4. VERIFICAR QUE LAS TABLAS FUNCIONEN SIN RLS
SELECT 'products' as tabla, count(*) as registros FROM public.products
UNION ALL
SELECT 'profiles' as tabla, count(*) as registros FROM public.profiles
UNION ALL
SELECT 'orders' as tabla, count(*) as registros FROM public.orders
UNION ALL
SELECT 'addresses' as tabla, count(*) as registros FROM public.addresses;

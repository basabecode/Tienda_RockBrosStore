-- ==========================================
-- POLÍTICAS DE SEGURIDAD - RLS
-- ==========================================
-- ARCHIVO CONSOLIDADO: Row Level Security y Autenticación
-- Ejecutar SEGUNDO - Después del schema

-- ==========================================
-- 1. FUNCIÓN HELPER PARA VERIFICAR ADMIN
-- ==========================================
-- Esta función evita la recursión infinita al verificar admin status

CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar directamente en auth.users para evitar recursión
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = user_id
    AND (auth.users.raw_user_meta_data->>'is_admin')::BOOLEAN = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener usuario actual de forma segura
CREATE OR REPLACE FUNCTION public.get_current_user_safe()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. HABILITAR RLS EN TODAS LAS TABLAS
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. POLÍTICAS PARA PROFILES
-- ==========================================

-- Limpiar políticas existentes
DROP POLICY IF EXISTS "Ver propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Actualizar propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Insertar propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins gestionan perfiles" ON public.profiles;

-- Políticas corregidas para perfiles
CREATE POLICY "Ver propio perfil" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin_user()
  );

CREATE POLICY "Actualizar propio perfil" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR public.is_admin_user()
  );

CREATE POLICY "Insertar propio perfil" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR public.is_admin_user()
  );

-- Los admins pueden gestionar todos los perfiles
CREATE POLICY "Admins gestionan perfiles" ON public.profiles
  FOR ALL USING (public.is_admin_user());

-- ==========================================
-- 4. POLÍTICAS PARA PRODUCTS
-- ==========================================

-- Limpiar políticas existentes
DROP POLICY IF EXISTS "Ver productos activos" ON public.products;
DROP POLICY IF EXISTS "Admins gestionan productos" ON public.products;

-- Todos pueden ver productos activos
CREATE POLICY "Ver productos activos" ON public.products
  FOR SELECT USING (status = 'active');

-- Solo admins pueden gestionar productos
CREATE POLICY "Admins gestionan productos" ON public.products
  FOR ALL USING (public.is_admin_user());

-- ==========================================
-- 5. POLÍTICAS PARA ORDERS
-- ==========================================

-- Limpiar políticas existentes
DROP POLICY IF EXISTS "Ver propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Crear propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Actualizar propias órdenes" ON public.orders;
DROP POLICY IF EXISTS "Admins gestionan órdenes" ON public.orders;

-- Los usuarios pueden ver sus propias órdenes
CREATE POLICY "Ver propias órdenes" ON public.orders
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Los usuarios pueden crear sus propias órdenes
CREATE POLICY "Crear propias órdenes" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Los usuarios pueden actualizar sus propias órdenes (solo ciertos campos)
CREATE POLICY "Actualizar propias órdenes" ON public.orders
  FOR UPDATE USING (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Los admins pueden gestionar todas las órdenes
CREATE POLICY "Admins gestionan órdenes" ON public.orders
  FOR ALL USING (public.is_admin_user());

-- ==========================================
-- 6. POLÍTICAS PARA ORDER_ITEMS
-- ==========================================

-- Los usuarios pueden ver items de sus propias órdenes
CREATE POLICY "Ver items propias órdenes" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin_user())
    )
  );

-- Los usuarios pueden crear items en sus propias órdenes
CREATE POLICY "Crear items propias órdenes" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin_user())
    )
  );

-- Los usuarios pueden actualizar items de sus propias órdenes
CREATE POLICY "Actualizar items propias órdenes" ON public.order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin_user())
    )
  );

-- Los usuarios pueden eliminar items de sus propias órdenes
CREATE POLICY "Eliminar items propias órdenes" ON public.order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin_user())
    )
  );

-- ==========================================
-- 7. POLÍTICAS PARA ADDRESSES
-- ==========================================

-- Los usuarios pueden ver sus propias direcciones
CREATE POLICY "Ver propias direcciones" ON public.addresses
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Los usuarios pueden crear sus propias direcciones
CREATE POLICY "Crear propias direcciones" ON public.addresses
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Los usuarios pueden actualizar sus propias direcciones
CREATE POLICY "Actualizar propias direcciones" ON public.addresses
  FOR UPDATE USING (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- Los usuarios pueden eliminar sus propias direcciones
CREATE POLICY "Eliminar propias direcciones" ON public.addresses
  FOR DELETE USING (
    auth.uid() = user_id OR public.is_admin_user()
  );

-- ==========================================
-- 8. VERIFICACIÓN FINAL DE POLÍTICAS
-- ==========================================

-- Verificar que las políticas se aplicaron correctamente
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

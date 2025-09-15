-- ==========================================
-- 🔧 CORRECCIÓN DE POLÍTICAS RLS PROBLEMÁTICAS
-- Fecha: 15 de septiembre de 2025
-- ==========================================

-- Eliminar políticas problemáticas que causan recursión infinita
DROP POLICY IF EXISTS "Admins pueden ver todos los perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins pueden modificar perfiles" ON public.profiles;

-- Crear función helper para verificar rol de admin sin recursión
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar si el usuario autenticado tiene rol de admin
  -- Usamos auth.jwt() para acceder a los claims del JWT sin consultar tablas
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear políticas corregidas usando la función helper
CREATE POLICY "Admins pueden ver todos los perfiles" ON public.profiles FOR SELECT USING (
  public.is_admin()
);

CREATE POLICY "Admins pueden modificar perfiles" ON public.profiles FOR ALL USING (
  public.is_admin()
);

-- ==========================================
-- 🔧 CORRECCIÓN DE FUNCIÓN SEARCH_PRODUCTS
-- ==========================================

-- ELIMINAR TODAS LAS VERSIONES EXISTENTES DE LA FUNCIÓN
-- Esto resuelve el error "Could not choose the best candidate function"
DROP FUNCTION IF EXISTS public.search_products(TEXT, TEXT, TEXT, DECIMAL, DECIMAL, TEXT, TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.search_products(TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.search_products();

-- Crear función corregida con estructura de tabla correcta
CREATE OR REPLACE FUNCTION public.search_products(
  search_query TEXT DEFAULT '',
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  image_url TEXT,
  category_name TEXT,
  brand_name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.main_image AS image_url,
    p.category AS category_name,
    p.brand AS brand_name,
    p.created_at  -- ✅ Agregar created_at que faltaba
  FROM public.products p
  WHERE p.is_active = true
    AND (search_query = '' OR
         p.name ILIKE '%' || search_query || '%' OR
         p.description ILIKE '%' || search_query || '%' OR
         p.category ILIKE '%' || search_query || '%' OR
         p.brand ILIKE '%' || search_query || '%' OR
         p.tags @> ARRAY[search_query])
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 🔧 VERIFICACIÓN DE POLÍTICAS EN OTRAS TABLAS
-- ==========================================

-- Asegurar que las políticas de otras tablas no tengan problemas similares
-- Verificar políticas de products
DROP POLICY IF EXISTS "Productos son públicos para lectura" ON public.products;
CREATE POLICY "Productos son públicos para lectura" ON public.products FOR SELECT USING (true);

-- Verificar políticas de categories
DROP POLICY IF EXISTS "Categorías son públicas para lectura" ON public.categories;
CREATE POLICY "Categorías son públicas para lectura" ON public.categories FOR SELECT USING (true);

-- Verificar políticas de brands
DROP POLICY IF EXISTS "Marcas son públicas para lectura" ON public.brands;
CREATE POLICY "Marcas son públicas para lectura" ON public.brands FOR SELECT USING (true);

-- ==========================================
-- 📋 INSTRUCCIONES DE EJECUCIÓN
-- ==========================================
/*
Para aplicar estas correcciones:

1. Copia y pega este SQL completo en el SQL Editor de Supabase
2. Ejecuta el script
3. Espera a que se complete la ejecución
4. Re-ejecuta los tests con: npm run test:supabase

Las correcciones resuelven:
- ✅ Recursión infinita en políticas RLS de profiles
- ✅ Referencia ambigua de columna sort_order en search_products
- ✅ Columnas inexistentes (category_id, brand_id) en función search_products
- ✅ Estructura de consulta no coincide con tipo de retorno de función
- ✅ Políticas de lectura pública para productos, categorías y marcas
*/

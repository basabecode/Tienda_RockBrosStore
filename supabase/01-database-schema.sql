-- ==========================================
-- SCHEMA COMPLETO - TIENDA DE CICLISMO
-- ==========================================
-- ARCHIVO CONSOLIDADO: Schema + Migración + Estructura de Datos
-- Ejecutar PRIMERO - Base de datos completa

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLAS PRINCIPALES
-- ==========================================

-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  avatar_url TEXT
);

-- Tabla de productos de ciclismo
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT, -- Columna original (mantener compatibilidad)
  name TEXT, -- Nueva columna estandarizada
  slug TEXT, -- SEO friendly URL
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD',
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  category TEXT, -- ej: 'cascos', 'luces', 'candados', 'accesorios', 'repuestos'
  sizes TEXT[], -- ej: ['S', 'M', 'L', 'XL'] para cascos/ropa
  colors TEXT[], -- ej: ['negro', 'blanco', 'rojo']
  images TEXT[], -- URLs de imágenes
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active'::text CHECK (status IN ('active', 'archived')),
  brand TEXT, -- ej: 'RockBros', 'Giant', 'Trek'
  specifications JSONB -- especificaciones técnicas flexibles
);

-- Tabla de direcciones
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- ej: 'Casa', 'Trabajo'
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'México',
  is_default BOOLEAN DEFAULT false
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  currency TEXT DEFAULT 'USD',
  shipping_address_id UUID REFERENCES public.addresses(id),
  notes TEXT,
  tracking_number TEXT
);

-- Tabla de items de órdenes
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  size TEXT,
  color TEXT
);

-- ==========================================
-- 2. MIGRACIÓN DE DATOS EXISTENTES
-- ==========================================

-- Agregar columna name mapeando desde title si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'name'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN name TEXT;
    END IF;
END $$;

-- Copiar datos de title a name si name está vacío
UPDATE public.products
SET name = COALESCE(name, title, 'Producto sin nombre')
WHERE name IS NULL OR name = '';

-- Agregar otras columnas faltantes
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS brand TEXT;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- ==========================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ==========================================

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand) WHERE status = 'active';

-- Índices para órdenes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Índices para direcciones
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON public.addresses(is_default) WHERE is_default = true;

-- ==========================================
-- 4. TRIGGERS Y FUNCIONES BÁSICAS
-- ==========================================

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta al crear usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Función para calcular total de orden automáticamente
CREATE OR REPLACE FUNCTION public.update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.orders
  SET total = (
    SELECT COALESCE(SUM(total_price), 0)
    FROM public.order_items
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  )
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar total automáticamente
DROP TRIGGER IF EXISTS on_order_items_change ON public.order_items;
CREATE TRIGGER on_order_items_change
  AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_order_total();

-- ==========================================
-- 5. VERIFICACIÓN FINAL
-- ==========================================

-- Verificar que las tablas se crearon correctamente
SELECT
  'Tabla: ' || table_name as info,
  'Registros: ' || (
    CASE table_name
      WHEN 'profiles' THEN (SELECT count(*)::text FROM public.profiles)
      WHEN 'products' THEN (SELECT count(*)::text FROM public.products)
      WHEN 'orders' THEN (SELECT count(*)::text FROM public.orders)
      WHEN 'addresses' THEN (SELECT count(*)::text FROM public.addresses)
      ELSE '0'
    END
  ) as registros
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'products', 'orders', 'addresses', 'order_items')
ORDER BY table_name;

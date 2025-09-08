-- ==========================================
-- SCRIPT DE MIGRACIÓN - AGREGAR COLUMNAS FALTANTES
-- ==========================================
-- Ejecutar ANTES de aplicar las políticas RLS

-- PRIMERA PRIORIDAD: Deshabilitar RLS temporalmente para evitar recursión
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Arreglar tabla products - mapear columnas existentes a nuevas
-- La tabla actual tiene: title, slug, currency
-- Necesitamos: name, status, brand, etc.

-- Agregar columna name mapeando desde title
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

        -- Copiar datos de title a name
        UPDATE public.products SET name = title WHERE title IS NOT NULL;

        -- Hacer name NOT NULL
        ALTER TABLE public.products ALTER COLUMN name SET NOT NULL;
    END IF;
END $$;

-- Agregar columna status a products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived'));

        -- Actualizar productos existentes
        UPDATE public.products SET status = 'active' WHERE status IS NULL;
    END IF;
END $$;

-- Agregar columna status a orders si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'orders'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.orders
        ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

        -- Actualizar órdenes existentes
        UPDATE public.orders SET status = 'pending' WHERE status IS NULL;
    END IF;
END $$;

-- Agregar columna is_featured a products si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN is_featured BOOLEAN DEFAULT false;

        -- Actualizar productos existentes
        UPDATE public.products SET is_featured = false WHERE is_featured IS NULL;
    END IF;
END $$;

-- Agregar columna brand a products si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'brand'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN brand TEXT;
    END IF;
END $$;

-- Agregar columna specifications a products si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'specifications'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN specifications JSONB;
    END IF;
END $$;

-- Agregar columna sizes a products si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'sizes'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN sizes TEXT[];
    END IF;
END $$;

-- Agregar columna colors a products si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'colors'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN colors TEXT[];
    END IF;
END $$;

-- Agregar columna images a products si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'products'
        AND column_name = 'images'
    ) THEN
        ALTER TABLE public.products
        ADD COLUMN images TEXT[];
    END IF;
END $$;

-- Agregar columna is_admin a profiles si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN is_admin BOOLEAN DEFAULT false;

        -- Actualizar perfiles existentes
        UPDATE public.profiles SET is_admin = false WHERE is_admin IS NULL;
    END IF;
END $$;

-- Crear tabla addresses si no existe
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'Colombia',
  is_default BOOLEAN DEFAULT false
);

-- Verificar que todas las columnas existen
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('products', 'orders', 'profiles', 'addresses', 'order_items')
ORDER BY table_name, ordinal_position;

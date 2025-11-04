-- ==========================================
-- 🔧 CORRECCIÓN DE POLÍTICAS RLS FALTANTES
-- Fecha: 29 de octubre de 2025
-- ==========================================

-- ✅ POLÍTICA FALTANTE: Permitir que usuarios creen su propio perfil
-- Esta política es CRÍTICA para permitir el registro de nuevos usuarios
CREATE POLICY "Usuarios pueden crear su propio perfil" ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ✅ VERIFICAR Y CREAR POLÍTICAS DE FAVORITOS
-- Eliminar políticas existentes si existen para recrearlas
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios favoritos" ON public.favorites;
DROP POLICY IF EXISTS "Usuarios pueden gestionar sus propios favoritos" ON public.favorites;

-- Crear políticas de favoritos
CREATE POLICY "Usuarios pueden ver sus propios favoritos" ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden gestionar sus propios favoritos" ON public.favorites
FOR ALL
USING (auth.uid() = user_id);

-- ✅ VERIFICAR ESTRUCTURA DE LA TABLA FAVORITES
-- La tabla favorites debe tener las siguientes columnas:
-- - id (UUID, PRIMARY KEY)
-- - user_id (UUID, REFERENCES auth.users(id))
-- - product_id (UUID, REFERENCES products(id))
-- - created_at (TIMESTAMPTZ)

-- Verificar si la tabla favorites existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        -- Crear tabla favorites si no existe
        CREATE TABLE public.favorites (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, product_id) -- Evitar duplicados
        );

        -- Habilitar RLS
        ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

        -- Crear índices para mejor rendimiento
        CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
        CREATE INDEX idx_favorites_product_id ON public.favorites(product_id);

        RAISE NOTICE 'Tabla favorites creada exitosamente';
    ELSE
        RAISE NOTICE 'Tabla favorites ya existe';
    END IF;
END
$$;

-- ✅ VERIFICAR ESTRUCTURA DE LA TABLA PROFILES
-- Asegurar que la tabla profiles tenga las columnas necesarias
DO $$
BEGIN
    -- Verificar si la columna role existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
        RAISE NOTICE 'Columna role agregada a profiles';
    END IF;

    -- Verificar si la columna full_name existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
        RAISE NOTICE 'Columna full_name agregada a profiles';
    END IF;

    -- Verificar si la columna email existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
        RAISE NOTICE 'Columna email agregada a profiles';
    END IF;
END
$$;

-- ✅ CREAR TRIGGER PARA AUTO-CREAR PERFIL AL REGISTRAR USUARIO
-- Este trigger es CRÍTICO para el flujo de registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear nuevo trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ✅ FUNCIÓN HELPER PARA DEBUGGING RLS
CREATE OR REPLACE FUNCTION public.debug_user_policies()
RETURNS TABLE (
    table_name TEXT,
    policy_name TEXT,
    policy_type TEXT,
    user_can_access BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        'profiles'::TEXT,
        'Usuarios pueden crear su propio perfil'::TEXT,
        'INSERT'::TEXT,
        (auth.uid() IS NOT NULL)::BOOLEAN
    UNION ALL
    SELECT
        'favorites'::TEXT,
        'Usuarios pueden ver sus propios favoritos'::TEXT,
        'SELECT'::TEXT,
        (auth.uid() IS NOT NULL)::BOOLEAN
    UNION ALL
    SELECT
        'favorites'::TEXT,
        'Usuarios pueden gestionar sus propios favoritos'::TEXT,
        'ALL'::TEXT,
        (auth.uid() IS NOT NULL)::BOOLEAN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 📝 VERIFICACIÓN FINAL
-- ==========================================

-- Mostrar todas las políticas de profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'favorites')
ORDER BY tablename, policyname;

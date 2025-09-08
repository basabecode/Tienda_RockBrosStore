-- ==========================================
-- ESQUEMA SIMPLIFICADO PARA ADMIN USERS
-- ==========================================
-- Este archivo corrige y simplifica la configuración de usuarios admin

-- Asegurar que la tabla profiles existe con la estructura correcta
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  avatar_url TEXT
);

-- Asegurar que existe un índice para consultas rápidas de admin
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ==========================================
-- FUNCIONES PARA MANEJO DE ADMIN
-- ==========================================

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    false -- Por defecto, los usuarios no son admin
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- FUNCIONES ADMIN UTILITIES
-- ==========================================

-- Función para promover usuario a admin (solo admin puede ejecutar)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_is_admin BOOLEAN;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT is_admin INTO current_user_is_admin
  FROM public.profiles
  WHERE id = auth.uid();

  IF NOT current_user_is_admin THEN
    RAISE EXCEPTION 'Solo los administradores pueden promover usuarios';
  END IF;

  -- Promover al usuario
  UPDATE public.profiles
  SET is_admin = true
  WHERE email = user_email;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para remover permisos de admin
CREATE OR REPLACE FUNCTION public.demote_user_from_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_is_admin BOOLEAN;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT is_admin INTO current_user_is_admin
  FROM public.profiles
  WHERE id = auth.uid();

  IF NOT current_user_is_admin THEN
    RAISE EXCEPTION 'Solo los administradores pueden remover permisos de admin';
  END IF;

  -- Remover permisos de admin
  UPDATE public.profiles
  SET is_admin = false
  WHERE email = user_email;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener información del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  is_admin BOOLEAN,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.is_admin, p.avatar_url
  FROM public.profiles p
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- POLÍTICAS DE SEGURIDAD SIMPLIFICADAS
-- ==========================================

-- Habilitar RLS en la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil (excepto is_admin)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Política: Los admins pueden ver todos los perfiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Política: Los admins pueden actualizar cualquier perfil
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ==========================================
-- INSERTAR PRIMER ADMIN (TEMPORAL)
-- ==========================================
-- NOTA: Cambiar este email por el tuyo antes de ejecutar
-- Esta inserción fallará si el usuario no existe en auth.users

-- Comentar esta línea después de crear tu primer admin
-- INSERT INTO public.profiles (id, email, full_name, is_admin)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), true
-- FROM auth.users
-- WHERE email = 'tu-email@ejemplo.com'
-- ON CONFLICT (id) DO UPDATE SET is_admin = true;

COMMIT;

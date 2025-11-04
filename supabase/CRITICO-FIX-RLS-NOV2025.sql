-- ==========================================
-- 🔧 CORRECCIÓN CRÍTICA DE POLÍTICAS RLS
-- Fecha: 2 de noviembre de 2025
-- ==========================================

-- 🎯 POLÍTICA CRÍTICA: Permitir que usuarios creen su propio perfil
-- Sin esta política, los usuarios no pueden registrarse
CREATE POLICY "Usuarios pueden crear su propio perfil" ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 🎯 POLÍTICAS DE FAVORITOS
-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios favoritos" ON public.favorites;
DROP POLICY IF EXISTS "Usuarios pueden gestionar sus propios favoritos" ON public.favorites;

-- Crear políticas de favoritos
CREATE POLICY "Usuarios pueden ver sus propios favoritos" ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden gestionar sus propios favoritos" ON public.favorites
FOR ALL
USING (auth.uid() = user_id);

-- 🎯 TRIGGER PARA AUTO-CREAR PERFIL AL REGISTRARSE
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

-- 🎯 VERIFICACIÓN FINAL
SELECT 'Correcciones aplicadas exitosamente' as status;

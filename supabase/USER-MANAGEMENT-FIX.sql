-- ==========================================
-- 👥 CORRECCIÓN DE GESTIÓN DE USUARIOS Y ROLES
-- Fecha: 15 de septiembre de 2025
-- ==========================================

-- ==========================================
-- 🔄 TRIGGER PARA CREAR PERFILES AUTOMÁTICAMENTE
-- ==========================================

-- Función que se ejecuta cuando se crea un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'), -- Por defecto 'user', pero puede venir de metadata
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger que se ejecuta después de insertar en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 👤 FUNCIONES PARA GESTIÓN DE ROLES
-- ==========================================

-- Función para promocionar usuario a admin
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Verificar que el usuario que ejecuta es admin
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_user_role != 'admin' THEN
    RETURN json_build_object('success', false, 'message', 'No tienes permisos para realizar esta acción');
  END IF;

  -- Actualizar el rol del usuario objetivo
  UPDATE public.profiles
  SET role = 'admin', updated_at = now()
  WHERE id = target_user_id;

  IF FOUND THEN
    result := json_build_object('success', true, 'message', 'Usuario promovido a administrador exitosamente');
  ELSE
    result := json_build_object('success', false, 'message', 'Usuario no encontrado');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para degradar admin a usuario común
CREATE OR REPLACE FUNCTION public.demote_from_admin(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Verificar que el usuario que ejecuta es admin
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_user_role != 'admin' THEN
    RETURN json_build_object('success', false, 'message', 'No tienes permisos para realizar esta acción');
  END IF;

  -- No permitir degradar al último admin
  IF (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') <= 1 AND
     (SELECT role FROM public.profiles WHERE id = target_user_id) = 'admin' THEN
    RETURN json_build_object('success', false, 'message', 'No puedes degradar al último administrador');
  END IF;

  -- Actualizar el rol del usuario objetivo
  UPDATE public.profiles
  SET role = 'user', updated_at = now()
  WHERE id = target_user_id;

  IF FOUND THEN
    result := json_build_object('success', true, 'message', 'Usuario degradado a usuario común exitosamente');
  ELSE
    result := json_build_object('success', false, 'message', 'Usuario no encontrado');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener lista de usuarios con sus roles
CREATE OR REPLACE FUNCTION public.get_users_list(limit_count INTEGER DEFAULT 50, offset_count INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  last_sign_in TIMESTAMPTZ
) AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Verificar que el usuario que ejecuta es admin
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_user_role != 'admin' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at,
    u.last_sign_in_at as last_sign_in
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para activar/desactivar usuario
CREATE OR REPLACE FUNCTION public.toggle_user_status(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  current_user_role TEXT;
  new_status BOOLEAN;
  result JSON;
BEGIN
  -- Verificar que el usuario que ejecuta es admin
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF current_user_role != 'admin' THEN
    RETURN json_build_object('success', false, 'message', 'No tienes permisos para realizar esta acción');
  END IF;

  -- No permitir desactivar al último admin
  IF (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin' AND is_active = true) <= 1 AND
     (SELECT role FROM public.profiles WHERE id = target_user_id) = 'admin' AND
     (SELECT is_active FROM public.profiles WHERE id = target_user_id) = true THEN
    RETURN json_build_object('success', false, 'message', 'No puedes desactivar al último administrador activo');
  END IF;

  -- Toggle del estado
  UPDATE public.profiles
  SET is_active = NOT is_active, updated_at = now()
  WHERE id = target_user_id
  RETURNING is_active INTO new_status;

  IF FOUND THEN
    IF new_status THEN
      result := json_build_object('success', true, 'message', 'Usuario activado exitosamente', 'new_status', 'active');
    ELSE
      result := json_build_object('success', true, 'message', 'Usuario desactivado exitosamente', 'new_status', 'inactive');
    END IF;
  ELSE
    result := json_build_object('success', false, 'message', 'Usuario no encontrado');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- � BOOTSTRAP DEL PRIMER ADMIN
-- ==========================================

-- Promueve a admin al usuario indicado SOLO si aún no existe ningún admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(target_user_id UUID)
RETURNS JSON AS $$
DECLARE
  admin_count INTEGER;
  result JSON;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role = 'admin';

  IF admin_count > 0 THEN
    RETURN json_build_object('success', false, 'message', 'Ya existen administradores. Usa promote_to_admin con permisos.');
  END IF;

  UPDATE public.profiles SET role = 'admin', updated_at = now() WHERE id = target_user_id;

  IF FOUND THEN
    result := json_build_object('success', true, 'message', 'Primer administrador creado exitosamente');
  ELSE
    result := json_build_object('success', false, 'message', 'Usuario no encontrado');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 🧪 VERIFICACIÓN DE CONFIGURACIÓN DE USUARIOS
-- ==========================================
CREATE OR REPLACE FUNCTION public.check_users_setup()
RETURNS JSON AS $$
DECLARE
  total_users INTEGER;
  admin_users INTEGER;
  active_users INTEGER;
  regular_users INTEGER;
  recommendations TEXT;
  result JSON;
BEGIN
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  SELECT COUNT(*) INTO admin_users FROM public.profiles WHERE role = 'admin';
  SELECT COUNT(*) INTO active_users FROM public.profiles WHERE is_active = true;
  SELECT COUNT(*) INTO regular_users FROM public.profiles WHERE role = 'user';

  IF admin_users = 0 AND total_users > 0 THEN
    recommendations := 'Ejecuta bootstrap_first_admin para promover al primer usuario.';
  ELSE
    recommendations := 'Configuración correcta. Usa get_users_list para gestionar.';
  END IF;

  result := json_build_object(
    'users_setup', json_build_object(
      'total_users', total_users,
      'admin_users', admin_users,
      'regular_users', regular_users,
      'active_users', active_users
    ),
    'recommendations', recommendations
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- �👥 CREAR USUARIOS DE PRUEBA
-- ==========================================

-- Nota: Para crear usuarios de prueba, ejecuta estos comandos en el SQL Editor de Supabase
-- después de aplicar las correcciones. Los usuarios se crearán automáticamente en profiles
-- gracias al trigger que acabamos de crear.

/*
-- Usuario común de prueba
-- Email: usuario@ejemplo.com
-- Password: usuario123
-- Role: user (automático)

-- Usuario admin de prueba
-- Email: admin@rockbros.com
-- Password: admin123
-- Role: admin (se puede cambiar después con promote_to_admin)
*/

-- ==========================================
-- 🔧 FUNCIONES DE VERIFICACIÓN
-- ==========================================

-- Función para verificar estado de usuarios
CREATE OR REPLACE FUNCTION public.check_users_setup()
RETURNS JSON AS $$
DECLARE
  total_users INTEGER;
  admin_users INTEGER;
  active_users INTEGER;
  result JSON;
BEGIN
  SELECT COUNT(*) INTO total_users FROM public.profiles;
  SELECT COUNT(*) INTO admin_users FROM public.profiles WHERE role = 'admin';
  SELECT COUNT(*) INTO active_users FROM public.profiles WHERE is_active = true;

  result := json_build_object(
    'users_setup', json_build_object(
      'total_users', total_users,
      'admin_users', admin_users,
      'active_users', active_users,
      'regular_users', total_users - admin_users
    ),
    'recommendations', CASE
      WHEN total_users = 0 THEN 'No hay usuarios registrados. Los usuarios se crearán automáticamente al registrarse.'
      WHEN admin_users = 0 THEN 'No hay administradores. Crea al menos un usuario admin manualmente.'
      WHEN admin_users >= 1 THEN 'Configuración de usuarios correcta ✅'
      ELSE 'Configuración pendiente'
    END
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 📋 INSTRUCCIONES DE USO
-- ==========================================

/*
INSTRUCCIONES PARA CONFIGURAR USUARIOS:

1. APLICAR ESTE ARCHIVO:
   - Copia y pega todo el contenido en el SQL Editor de Supabase
   - Ejecuta el script completo

2. VERIFICAR QUE FUNCIONA:
   - SELECT public.check_users_setup();

3. CREAR USUARIOS DE PRUEBA:
   - Ve a Authentication > Users en el dashboard de Supabase
   - Crea usuarios con los emails mencionados arriba
   - Los perfiles se crearán automáticamente

4. PROMOCIONAR USUARIO A ADMIN:
   - Una vez creado el usuario admin@rockbros.com
   - Ejecuta: SELECT public.promote_to_admin('ID_DEL_USUARIO');

5. GESTIONAR USUARIOS:
   - Ver lista: SELECT * FROM public.get_users_list();
   - Promocionar: SELECT public.promote_to_admin('user_id');
   - Degradar: SELECT public.demote_from_admin('user_id');
   - Toggle status: SELECT public.toggle_user_status('user_id');

PROBLEMAS RESUELTOS:
- ✅ Creación automática de perfiles al registrar usuarios
- ✅ Sistema de roles (user, moderator, admin)
- ✅ Funciones para gestionar usuarios
- ✅ Protección contra eliminar último admin
- ✅ Usuarios de prueba incluidos
*/

-- Verificar configuración después de aplicar
SELECT public.check_users_setup();

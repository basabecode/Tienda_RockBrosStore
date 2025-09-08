-- ==========================================
-- GESTIÓN DE ADMINISTRADORES Y SETUP
-- ==========================================
-- ARCHIVO CONSOLIDADO: Funciones de administración y datos iniciales
-- Ejecutar TERCERO - Después de políticas de seguridad

-- ==========================================
-- 1. FUNCIONES DE ADMINISTRACIÓN
-- ==========================================

-- Función para promover usuario a administrador
CREATE OR REPLACE FUNCTION public.promote_to_admin(
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  user_record RECORD;
  auth_user_id UUID;
BEGIN
  -- Buscar usuario en profiles
  SELECT id, email, full_name, is_admin INTO user_record
  FROM public.profiles
  WHERE email = user_email;

  IF user_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Usuario no encontrado: ' || user_email,
      'action', 'El usuario debe registrarse primero'
    );
  END IF;

  IF user_record.is_admin THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'El usuario ya es administrador',
      'user_id', user_record.id,
      'email', user_record.email
    );
  END IF;

  -- Promover en profiles
  UPDATE public.profiles
  SET
    is_admin = true,
    full_name = COALESCE(user_full_name, full_name)
  WHERE id = user_record.id;

  -- Promover en auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
  WHERE id = user_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Usuario promovido a administrador exitosamente',
    'user_id', user_record.id,
    'email', user_record.email,
    'full_name', COALESCE(user_full_name, user_record.full_name)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para degradar administrador a usuario normal
CREATE OR REPLACE FUNCTION public.demote_from_admin(
  user_email TEXT
) RETURNS JSONB AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Buscar usuario en profiles
  SELECT id, email, full_name, is_admin INTO user_record
  FROM public.profiles
  WHERE email = user_email;

  IF user_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Usuario no encontrado: ' || user_email
    );
  END IF;

  IF NOT user_record.is_admin THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'El usuario no es administrador',
      'user_id', user_record.id,
      'email', user_record.email
    );
  END IF;

  -- Degradar en profiles
  UPDATE public.profiles
  SET is_admin = false
  WHERE id = user_record.id;

  -- Degradar en auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": false}'::jsonb
  WHERE id = user_record.id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Administrador degradado a usuario normal',
    'user_id', user_record.id,
    'email', user_record.email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para listar todos los administradores
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ,
  auth_is_admin BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    COALESCE((au.raw_user_meta_data->>'is_admin')::BOOLEAN, false) as auth_is_admin
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.id
  WHERE p.is_admin = true
  ORDER BY p.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar salud del sistema admin
CREATE OR REPLACE FUNCTION public.check_admin_health()
RETURNS JSONB AS $$
DECLARE
  profile_admins INTEGER;
  auth_admins INTEGER;
  total_users INTEGER;
  result JSONB;
BEGIN
  -- Contar administradores en profiles
  SELECT COUNT(*) INTO profile_admins
  FROM public.profiles
  WHERE is_admin = true;

  -- Contar administradores en auth.users
  SELECT COUNT(*) INTO auth_admins
  FROM auth.users
  WHERE (raw_user_meta_data->>'is_admin')::BOOLEAN = true;

  -- Contar usuarios totales
  SELECT COUNT(*) INTO total_users
  FROM public.profiles;

  result := jsonb_build_object(
    'total_users', total_users,
    'profile_admins', profile_admins,
    'auth_admins', auth_admins,
    'sync_status', CASE
      WHEN profile_admins = auth_admins THEN 'sincronizado'
      ELSE 'desincronizado'
    END,
    'health', CASE
      WHEN profile_admins > 0 AND auth_admins > 0 THEN 'saludable'
      WHEN profile_admins = 0 AND auth_admins = 0 THEN 'sin_admins'
      ELSE 'problemas'
    END
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. SETUP AUTOMÁTICO DE PRIMER ADMIN
-- ==========================================

-- Función para setup inicial (ejecutar solo una vez)
CREATE OR REPLACE FUNCTION public.setup_first_admin(
  admin_email TEXT,
  admin_password TEXT DEFAULT 'admin123456',
  admin_full_name TEXT DEFAULT 'Administrador Principal'
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
  existing_admin INTEGER;
BEGIN
  -- Verificar si ya hay administradores
  SELECT COUNT(*) INTO existing_admin
  FROM public.profiles
  WHERE is_admin = true;

  IF existing_admin > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Ya existen administradores en el sistema',
      'existing_admins', existing_admin
    );
  END IF;

  -- Si el usuario ya existe, solo promoverlo
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = admin_email) THEN
    RETURN public.promote_to_admin(admin_email, admin_full_name);
  END IF;

  RETURN jsonb_build_object(
    'success', false,
    'message', 'Usuario no encontrado. Debe registrarse primero con email: ' || admin_email,
    'action', 'Regístrate en la aplicación y luego ejecuta: SELECT public.promote_to_admin(''' || admin_email || ''')'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. DATOS INICIALES DE PRODUCTOS (OPCIONAL)
-- ==========================================

-- Función para insertar productos de ejemplo
CREATE OR REPLACE FUNCTION public.insert_sample_products()
RETURNS JSONB AS $$
DECLARE
  product_count INTEGER;
BEGIN
  -- Verificar si ya hay productos
  SELECT COUNT(*) INTO product_count FROM public.products;

  IF product_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Ya existen productos en la base de datos',
      'existing_products', product_count
    );
  END IF;

  -- Insertar productos de ejemplo para ciclismo
  INSERT INTO public.products (name, title, slug, description, price, currency, category, brand, stock, is_featured, status, images) VALUES
  ('Casco MTB Pro', 'Casco MTB Pro', 'casco-mtb-pro', 'Casco de alta protección para mountain bike con certificación CE', 89.99, 'USD', 'cascos', 'RockBros', 25, true, 'active', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64']),

  ('Luz LED Ultra Bright', 'Luz LED Ultra Bright', 'luz-led-ultra-bright', 'Luz LED de alta potencia recargable por USB con 5 modos', 34.99, 'USD', 'luces', 'CatEye', 50, true, 'active', ARRAY['https://images.unsplash.com/photo-1571068316344-75bc76f77890']),

  ('Candado U-Lock Seguro', 'Candado U-Lock Seguro', 'candado-u-lock-seguro', 'Candado en U de alta seguridad con cable adicional', 59.99, 'USD', 'candados', 'Kryptonite', 30, false, 'active', ARRAY['https://images.unsplash.com/photo-1571068316344-75bc76f77890']),

  ('Kit Reparación Completo', 'Kit Reparación Completo', 'kit-reparacion-completo', 'Kit completo con herramientas básicas para mantenimiento', 24.99, 'USD', 'accesorios', 'Park Tool', 40, false, 'active', ARRAY['https://images.unsplash.com/photo-1544191696-15693e20c999']),

  ('Llantas Tubeless 29"', 'Llantas Tubeless 29"', 'llantas-tubeless-29', 'Par de llantas tubeless para MTB 29 pulgadas', 199.99, 'USD', 'repuestos', 'Maxxis', 15, true, 'active', ARRAY['https://images.unsplash.com/photo-1544191696-15693e20c999']);

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Productos de ejemplo insertados correctamente',
    'products_inserted', 5
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. SCRIPTS DE MANTENIMIENTO
-- ==========================================

-- Función para limpiar datos de prueba
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS JSONB AS $$
DECLARE
  deleted_orders INTEGER;
  deleted_products INTEGER;
BEGIN
  -- Eliminar órdenes de prueba (opcional)
  DELETE FROM public.order_items WHERE order_id IN (
    SELECT id FROM public.orders WHERE notes LIKE '%test%' OR notes LIKE '%prueba%'
  );

  GET DIAGNOSTICS deleted_orders = ROW_COUNT;

  DELETE FROM public.orders WHERE notes LIKE '%test%' OR notes LIKE '%prueba%';

  -- Eliminar productos marcados como prueba (opcional)
  DELETE FROM public.products WHERE description LIKE '%test%' OR description LIKE '%prueba%';

  GET DIAGNOSTICS deleted_products = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_orders', deleted_orders,
    'deleted_products', deleted_products,
    'message', 'Datos de prueba eliminados'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. VERIFICACIÓN FINAL Y COMANDOS ÚTILES
-- ==========================================

-- Mostrar resumen del estado del sistema
SELECT 'ESTADO DEL SISTEMA' as seccion;

-- Verificar salud de administradores
SELECT public.check_admin_health() as salud_admin;

-- Contar registros por tabla
SELECT
  'profiles' as tabla,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_admin = true) as admins
FROM public.profiles
UNION ALL
SELECT
  'products' as tabla,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'active') as activos
FROM public.products
UNION ALL
SELECT
  'orders' as tabla,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'pending') as pendientes
FROM public.orders;

-- ==========================================
-- COMANDOS ÚTILES PARA COPIAR Y PEGAR:
-- ==========================================

/*
-- Para promover un usuario a admin (cambiar email):
SELECT public.promote_to_admin('tu-email@ejemplo.com', 'Tu Nombre Completo');

-- Para verificar administradores:
SELECT * FROM public.list_admins();

-- Para verificar salud del sistema:
SELECT public.check_admin_health();

-- Para insertar productos de ejemplo:
SELECT public.insert_sample_products();

-- Para limpiar datos de prueba:
SELECT public.cleanup_test_data();

-- Para setup inicial (solo primera vez):
SELECT public.setup_first_admin('admin@tutienda.com', 'password123', 'Administrador Principal');
*/

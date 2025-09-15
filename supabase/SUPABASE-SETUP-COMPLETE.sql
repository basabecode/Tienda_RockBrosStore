-- ==========================================
-- 🚀 SUPABASE SETUP COMPLETO - TIENDA ROCKBROS
-- ==========================================
-- Fecha: 15 de septiembre de 2025
-- Archivo ÚNICO y COMPLETO para configurar Supabase
-- Ejecutar este archivo UNA SOLA VEZ en Supabase SQL Editor
-- Contiene: Schema + Políticas RLS + Funciones + Triggers + Datos Iniciales

-- ==========================================
-- 📋 INSTRUCCIONES DE USO
-- ==========================================
-- 1. Crear proyecto en https://supabase.com
-- 2. Ir a SQL Editor en el dashboard
-- 3. Copiar y pegar TODO este archivo
-- 4. Ejecutar con el botón "Run"
-- 5. Verificar que no hay errores
-- 6. Configurar variables de entorno en el frontend

-- ==========================================
-- 🏗️ 1. SCHEMA COMPLETO DE BASE DE DATOS
-- ==========================================

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de marcas
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  main_image TEXT,
  images TEXT[],
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  weight DECIMAL(5,2),
  dimensions TEXT,
  material TEXT,
  color TEXT,
  size TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de variantes de productos
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  attributes JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_active BOOLEAN DEFAULT true,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de direcciones de envío/facturación
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address_id UUID REFERENCES public.addresses(id),
  billing_address_id UUID REFERENCES public.addresses(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de items de orden
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de reseñas de productos
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_active BOOLEAN DEFAULT true,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de productos favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Tabla de carritos de compra
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de items del carrito
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  type TEXT NOT NULL CHECK (type IN ('sale', 'purchase', 'adjustment', 'return')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER,
  new_stock INTEGER,
  reference_type TEXT,
  reference_id UUID,
  user_id UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de cupones de descuento
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value DECIMAL(10,2),
  min_purchase DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==========================================
-- 🔒 2. POLÍTICAS DE SEGURIDAD (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para categorías (lectura pública)
CREATE POLICY "Categorías son públicas" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar categorías" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para marcas (lectura pública)
CREATE POLICY "Marcas son públicas" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar marcas" ON public.brands FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para productos (lectura pública)
CREATE POLICY "Productos son públicos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar productos" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para variantes (lectura pública)
CREATE POLICY "Variantes son públicas" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar variantes" ON public.product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para perfiles de usuario
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins pueden ver todos los perfiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins pueden modificar perfiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para direcciones
CREATE POLICY "Usuarios pueden ver sus propias direcciones" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden gestionar sus propias direcciones" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Políticas para órdenes
CREATE POLICY "Usuarios pueden ver sus propias órdenes" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden crear sus propias órdenes" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins pueden ver todas las órdenes" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins pueden modificar órdenes" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para items de orden
CREATE POLICY "Usuarios pueden ver items de sus órdenes" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins pueden ver todos los items de orden" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sistema puede crear items de orden" ON public.order_items FOR INSERT WITH CHECK (true);

-- Políticas para reseñas
CREATE POLICY "Reseñas son públicas" ON public.reviews FOR SELECT USING (is_active = true);
CREATE POLICY "Usuarios pueden crear reseñas" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden actualizar sus reseñas" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins pueden gestionar reseñas" ON public.reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para favoritos
CREATE POLICY "Usuarios pueden ver sus favoritos" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden gestionar sus favoritos" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Políticas para carritos
CREATE POLICY "Usuarios pueden ver su carrito" ON public.carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios pueden gestionar su carrito" ON public.carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Carritos de sesión son públicos para operaciones anónimas" ON public.carts FOR ALL USING (session_id IS NOT NULL);

-- Políticas para items de carrito
CREATE POLICY "Usuarios pueden ver items de su carrito" ON public.cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND (user_id = auth.uid() OR session_id IS NOT NULL))
);
CREATE POLICY "Usuarios pueden gestionar items de su carrito" ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND (user_id = auth.uid() OR session_id IS NOT NULL))
);

-- Políticas para movimientos de inventario
CREATE POLICY "Admins pueden ver movimientos de inventario" ON public.inventory_movements FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sistema puede crear movimientos de inventario" ON public.inventory_movements FOR INSERT WITH CHECK (true);

-- Políticas para cupones
CREATE POLICY "Cupones activos son públicos" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins pueden gestionar cupones" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para configuración del sitio
CREATE POLICY "Configuración es pública para lectura" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Solo admins pueden modificar configuración" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- ⚙️ 3. FUNCIONES ÚTILES DEL BACKEND
-- ==========================================

-- Función para buscar productos con filtros avanzados
CREATE OR REPLACE FUNCTION public.search_products(
  search_query TEXT DEFAULT '',
  category_filter TEXT DEFAULT '',
  brand_filter TEXT DEFAULT '',
  min_price DECIMAL DEFAULT 0,
  max_price DECIMAL DEFAULT 999999999,
  sort_by TEXT DEFAULT 'name',
  sort_order TEXT DEFAULT 'asc',
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  price DECIMAL,
  main_image TEXT,
  category TEXT,
  brand TEXT,
  rating DECIMAL,
  review_count INTEGER,
  stock INTEGER,
  is_featured BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.price,
    p.main_image,
    p.category,
    p.brand,
    p.rating,
    p.review_count,
    p.stock,
    p.is_featured
  FROM public.products p
  WHERE p.is_active = true
    AND (search_query = '' OR
         p.name ILIKE '%' || search_query || '%' OR
         p.description ILIKE '%' || search_query || '%' OR
         p.tags @> ARRAY[search_query])
    AND (category_filter = '' OR p.category = category_filter)
    AND (brand_filter = '' OR p.brand = brand_filter)
    AND p.price BETWEEN min_price AND max_price
  ORDER BY
    CASE WHEN sort_by = 'name' AND sort_order = 'asc' THEN p.name END ASC,
    CASE WHEN sort_by = 'name' AND sort_order = 'desc' THEN p.name END DESC,
    CASE WHEN sort_by = 'price' AND sort_order = 'asc' THEN p.price END ASC,
    CASE WHEN sort_by = 'price' AND sort_order = 'desc' THEN p.price END DESC,
    CASE WHEN sort_by = 'rating' AND sort_order = 'asc' THEN p.rating END ASC,
    CASE WHEN sort_by = 'rating' AND sort_order = 'desc' THEN p.rating END DESC,
    CASE WHEN sort_by = 'newest' THEN p.created_at END DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener productos destacados
CREATE OR REPLACE FUNCTION public.get_featured_products(limit_count INTEGER DEFAULT 8)
RETURNS TABLE (
  id UUID,
  name TEXT,
  price DECIMAL,
  main_image TEXT,
  category TEXT,
  brand TEXT,
  rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.price,
    p.main_image,
    p.category,
    p.brand,
    p.rating
  FROM public.products p
  WHERE p.is_active = true AND p.is_featured = true
  ORDER BY p.sort_order ASC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para alternar favorito
CREATE OR REPLACE FUNCTION public.toggle_favorite(p_user_id UUID, p_product_id UUID)
RETURNS JSON AS $$
DECLARE
  existing_favorite UUID;
  result JSON;
BEGIN
  SELECT id INTO existing_favorite
  FROM public.favorites
  WHERE user_id = p_user_id AND product_id = p_product_id;

  IF existing_favorite IS NOT NULL THEN
    DELETE FROM public.favorites WHERE id = existing_favorite;
    result := json_build_object('success', true, 'action', 'removed', 'message', 'Removido de favoritos');
  ELSE
    INSERT INTO public.favorites (user_id, product_id)
    VALUES (p_user_id, p_product_id);
    result := json_build_object('success', true, 'action', 'added', 'message', 'Agregado a favoritos');
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear orden desde carrito
CREATE OR REPLACE FUNCTION public.create_order_from_cart(
  p_user_id UUID,
  p_shipping_address_id UUID,
  p_billing_address_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  cart_id UUID;
  order_id UUID;
  order_number TEXT;
  subtotal DECIMAL := 0;
  total DECIMAL := 0;
  item_count INTEGER := 0;
BEGIN
  SELECT id INTO cart_id
  FROM public.carts
  WHERE user_id = p_user_id;

  IF cart_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Carrito vacío');
  END IF;

  SELECT SUM(ci.quantity * ci.unit_price), COUNT(*)
  INTO subtotal, item_count
  FROM public.cart_items ci
  WHERE ci.cart_id = cart_id;

  IF item_count = 0 THEN
    RETURN json_build_object('success', false, 'message', 'Carrito vacío');
  END IF;

  total := subtotal;

  order_number := 'RB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');

  INSERT INTO public.orders (
    user_id, order_number, subtotal, total, shipping_address_id,
    billing_address_id, notes
  )
  VALUES (
    p_user_id, order_number, subtotal, total, p_shipping_address_id,
    COALESCE(p_billing_address_id, p_shipping_address_id), p_notes
  )
  RETURNING id INTO order_id;

  INSERT INTO public.order_items (
    order_id, product_id, variant_id, quantity, unit_price, total_price,
    product_name, product_image, variant_name
  )
  SELECT
    order_id,
    ci.product_id,
    ci.variant_id,
    ci.quantity,
    ci.unit_price,
    (ci.quantity * ci.unit_price),
    p.name,
    p.main_image,
    pv.name
  FROM public.cart_items ci
  JOIN public.products p ON p.id = ci.product_id
  LEFT JOIN public.product_variants pv ON pv.id = ci.variant_id
  WHERE ci.cart_id = cart_id;

  DELETE FROM public.cart_items WHERE cart_id = cart_id;

  RETURN json_build_object(
    'success', true,
    'order_id', order_id,
    'order_number', order_number,
    'total', total,
    'message', 'Orden creada exitosamente'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 🔄 4. TRIGGERS AUTOMÁTICOS
-- ==========================================

-- Trigger para actualizar rating de productos
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  product_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    product_id := OLD.product_id;
  ELSE
    product_id := NEW.product_id;
  END IF;

  UPDATE public.products
  SET
    rating = (
      SELECT ROUND(AVG(rating), 2)
      FROM public.reviews
      WHERE product_id = products.id AND is_active = true
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE product_id = products.id AND is_active = true
    )
  WHERE id = product_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger updated_at a todas las tablas relevantes
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- 📦 5. DATOS INICIALES
-- ==========================================

-- Insertar categorías
INSERT INTO public.categories (name, slug, description, sort_order, is_active) VALUES
('Bicicletas de Montaña', 'bicicletas-montana', 'Bicicletas especializadas para terrenos difíciles', 1, true),
('Bicicletas de Ruta', 'bicicletas-ruta', 'Bicicletas de alto rendimiento para carretera', 2, true),
('Bicicletas Urbanas', 'bicicletas-urbanas', 'Bicicletas cómodas para uso diario en ciudad', 3, true),
('Componentes', 'componentes', 'Piezas y accesorios para bicicletas', 4, true),
('Accesorios', 'accesorios', 'Equipamiento adicional para ciclistas', 5, true);

-- Insertar marcas
INSERT INTO public.brands (name, slug, description, is_active) VALUES
('RockBros', 'rockbros', 'Marca especializada en ciclismo', true),
('Trek', 'trek', 'Fabricante líder de bicicletas', true),
('Giant', 'giant', 'Marca global de bicicletas', true),
('Specialized', 'specialized', 'Especialistas en bicicletas de alto rendimiento', true);

-- Insertar productos de ejemplo
INSERT INTO public.products (name, slug, description, price, category, brand, stock, is_featured, is_active, rating, review_count) VALUES
('RockBros MTB Pro 2025', 'rockbros-mtb-pro-2025', 'Bicicleta de montaña full suspension con componentes de alta gama', 4500.00, 'Bicicletas de Montaña', 'RockBros', 15, true, true, 4.8, 24),
('Trek Fuel EX 9.8', 'trek-fuel-ex-9-8', 'Bicicleta e-MTB con motor Bosch y batería integrada', 8500.00, 'Bicicletas de Montaña', 'Trek', 8, true, true, 4.9, 18),
('Giant Trance X Advanced Pro', 'giant-trance-x-advanced-pro', 'Bicicleta de trail con cuadro Advanced Composite', 6200.00, 'Bicicletas de Montaña', 'Giant', 12, true, true, 4.7, 31),
('Specialized Epic Pro', 'specialized-epic-pro', 'Bicicleta de cross-country con Brain technology', 5800.00, 'Bicicletas de Montaña', 'Specialized', 10, false, true, 4.6, 15);

-- Insertar configuración del sitio
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', '"RockBros Store"', 'Nombre de la tienda'),
('site_description', '"Tienda especializada en ciclismo"', 'Descripción de la tienda'),
('currency', '"CLP"', 'Moneda por defecto'),
('tax_rate', '0.19', 'Tasa de impuesto (19%)');

-- ==========================================
-- ✅ 6. VERIFICACIÓN FINAL
-- ==========================================

-- Función de verificación de salud del sistema
CREATE OR REPLACE FUNCTION public.health_check_report()
RETURNS JSON AS $$
DECLARE
  result JSON;
  tables_count INTEGER;
  policies_count INTEGER;
  functions_count INTEGER;
  products_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tables_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name NOT IN ('schema_migrations');

  SELECT COUNT(*) INTO policies_count
  FROM pg_policies
  WHERE schemaname = 'public';

  SELECT COUNT(*) INTO functions_count
  FROM information_schema.routines
  WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION';

  SELECT COUNT(*) INTO products_count
  FROM public.products;

  result := json_build_object(
    'status', 'success',
    'timestamp', now(),
    'database_health', json_build_object(
      'tables_count', tables_count,
      'policies_count', policies_count,
      'functions_count', functions_count,
      'products_count', products_count,
      'expected_tables', 16,
      'expected_policies', 25,
      'expected_functions', 5
    ),
    'recommendations', CASE
      WHEN tables_count < 16 THEN 'Faltan tablas por crear'
      WHEN policies_count < 25 THEN 'Faltan políticas RLS'
      WHEN functions_count < 5 THEN 'Faltan funciones'
      WHEN products_count = 0 THEN 'No hay productos'
      ELSE 'Configuración completa ✅'
    END
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar verificación final
SELECT public.health_check_report();

-- ==========================================
-- 🎯 SETUP COMPLETADO
-- ==========================================
-- ✅ Schema de base de datos creado
-- ✅ Políticas RLS configuradas
-- ✅ Funciones backend implementadas
-- ✅ Triggers automáticos configurados
-- ✅ Datos iniciales cargados
-- ✅ Verificación de salud ejecutada
--
-- Próximos pasos:
-- 1. Configurar variables de entorno en el frontend
-- 2. Probar conexión con Supabase
-- 3. Implementar hooks para consumir datos
-- 4. Desplegar aplicación
--
-- ¡Tu tienda RockBros está lista! 🚀

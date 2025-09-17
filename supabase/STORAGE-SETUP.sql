-- ==========================================
-- 📁 CONFIGURACIÓN DE SUPABASE STORAGE
-- ==========================================
-- Este archivo contiene las instrucciones para configurar Storage en Supabase
-- IMPORTANTE: Storage debe habilitarse desde el dashboard de Supabase

-- ==========================================
-- 📋 PASOS PARA HABILITAR STORAGE
-- ==========================================

/*
PASO 1: Habilitar Storage en Supabase Dashboard
1. Ir a https://supabase.com/dashboard/projects/[tu-proyecto-id]
2. En el menú lateral, ir a "Storage"
3. Si no está habilitado, hacer clic en "Enable Storage"
4. Confirmar la habilitación

PASO 2: Crear Bucket para Imágenes de Productos
1. En Storage, hacer clic en "New bucket"
2. Nombre: "product-images"
3. Configurar como público: ☑️ Public bucket
4. Hacer clic en "Create bucket"

PASO 3: Configurar Políticas RLS para el Bucket
Ejecutar el siguiente SQL en el SQL Editor:
*/

-- ==========================================
-- 🔒 POLÍTICAS RLS PARA STORAGE
-- ==========================================

-- Política para ver imágenes (público)
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Política para subir imágenes (solo admins)
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Política para actualizar imágenes (solo admins)
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Política para eliminar imágenes (solo admins)
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ==========================================
-- 🔧 FUNCIONES HELPER PARA STORAGE
-- ==========================================

-- Función para obtener URL pública de imagen
CREATE OR REPLACE FUNCTION public.get_product_image_url(file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT
      CASE
        WHEN file_path IS NULL OR file_path = '' THEN NULL
        WHEN file_path LIKE 'http%' THEN file_path -- URL externa
        ELSE format('%s/storage/v1/object/public/product-images/%s',
                   current_setting('app.settings.supabase_url', true),
                   file_path)
      END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar URLs de imágenes eliminadas
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_images()
RETURNS INTEGER AS $$
DECLARE
  cleanup_count INTEGER := 0;
BEGIN
  -- Esta función se puede llamar periódicamente para limpiar
  -- imágenes que no están siendo usadas por ningún producto

  -- Por ahora solo retorna 0, se puede implementar lógica más compleja
  RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 📝 NOTAS IMPORTANTES
-- ==========================================

/*
ALTERNATIVA SIN STORAGE:
Si no puedes habilitar Storage por ahora, puedes usar:
1. URLs externas (Unsplash, CloudFlare, etc.)
2. Base64 embebido (no recomendado para producción)
3. Servicio externo como Cloudinary o AWS S3

LÍMITES DE STORAGE EN SUPABASE:
- Plan gratuito: 1GB de storage
- Archivos hasta 50MB por defecto
- Se pueden configurar límites personalizados

CONFIGURACIÓN RECOMENDADA:
- Bucket público para imágenes de productos
- RLS habilitado para seguridad
- Compresión automática de imágenes
- CDN para mejor rendimiento
*/

-- ==========================================
-- ✅ VERIFICACIÓN DE CONFIGURACIÓN
-- ==========================================

-- Verificar que Storage está habilitado
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'storage'
      AND table_name = 'buckets'
    )
    THEN '✅ Storage está habilitado'
    ELSE '❌ Storage NO está habilitado - Habilitar desde Dashboard'
  END as storage_status;

-- Verificar que el bucket existe
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets
      WHERE name = 'product-images'
    )
    THEN '✅ Bucket product-images existe'
    ELSE '❌ Bucket product-images NO existe - Crear desde Dashboard'
  END as bucket_status;

-- Listar políticas de storage
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';

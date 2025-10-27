#!/bin/bash
# Script de limpieza de archivos temporales
# Ejecutar desde la raíz del proyecto

echo "🧹 Iniciando limpieza de archivos temporales..."

# Crear carpeta de archivos temporales
mkdir -p temp-files

echo "📋 Moviendo archivos de backup..."
[ -f "src/components/ProductGrid_Backup.tsx" ] && mv "src/components/ProductGrid_Backup.tsx" temp-files/

echo "🧪 Moviendo scripts de prueba..."
mv apply-*.js temp-files/ 2>/dev/null || true
mv check-*.js temp-files/ 2>/dev/null || true
mv debug-*.js temp-files/ 2>/dev/null || true
mv demo-*.js temp-files/ 2>/dev/null || true
mv test-*.js temp-files/ 2>/dev/null || true
mv create-*.js temp-files/ 2>/dev/null || true

echo "🔧 Moviendo SQL temporales..."
mv fix-rls-*.sql temp-files/ 2>/dev/null || true
mv URGENT-FIX-RLS.sql temp-files/ 2>/dev/null || true

echo "🛠️ Moviendo scripts de verificación..."
mv verify-*.sh temp-files/ 2>/dev/null || true

echo "📄 Moviendo documentación redundante..."
mv ADMIN_GUIDE.md temp-files/ 2>/dev/null || true
mv ADMIN_SETUP_GUIDE.md temp-files/ 2>/dev/null || true
mv ADMIN_SIMPLE_GUIDE.md temp-files/ 2>/dev/null || true
mv ADMIN_TROUBLESHOOTING.md temp-files/ 2>/dev/null || true
mv CLEANUP_REPORT.md temp-files/ 2>/dev/null || true
mv SUPABASE_*.md temp-files/ 2>/dev/null || true

echo "✅ Limpieza completada!"
echo "📁 Archivos movidos a: temp-files/"
echo ""
echo "🔍 Archivos movidos:"
ls -la temp-files/ 2>/dev/null || echo "No hay archivos en temp-files/"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Revisa temp-files/ antes de eliminar"
echo "   - Si todo funciona bien: rm -rf temp-files/"
echo "   - Si necesitas algo: mv temp-files/archivo ./"

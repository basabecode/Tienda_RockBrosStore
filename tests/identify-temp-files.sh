#!/bin/bash
# Script para identificar archivos temporales automáticamente

echo "🔍 ANALIZANDO ARCHIVOS TEMPORALES..."
echo "=================================="

echo ""
echo "📋 ARCHIVOS DE BACKUP:"
find . -name "*backup*" -o -name "*_backup*" -o -name "*.bak" -o -name "*_bak*" -o -name "*Backup*" | grep -v node_modules | grep -v .git

echo ""
echo "🧪 SCRIPTS DE PRUEBA/DEBUG:"
find . -name "test-*" -o -name "debug-*" -o -name "check-*" -o -name "apply-*" -o -name "demo-*" | grep -v node_modules | grep -v .git

echo ""
echo "🔧 ARCHIVOS SQL TEMPORALES:"
find . -name "fix-*" -o -name "urgent-*" -o -name "*-fix*" | grep -v node_modules | grep -v .git | grep "\.sql$"

echo ""
echo "📄 DOCUMENTACIÓN REDUNDANTE:"
find . -name "ADMIN_*.md" -o -name "CLEANUP_*.md" -o -name "SUPABASE_*.md" | grep -v PROJECT_ | grep -v node_modules | grep -v .git

echo ""
echo "🛠️ SCRIPTS DE VERIFICACIÓN:"
find . -name "verify-*" | grep -v node_modules | grep -v .git

echo ""
echo "📁 DIRECTORIOS TEMPORALES:"
find . -type d -name "*temp*" -o -name "*tmp*" -o -name "*backup*" | grep -v node_modules | grep -v .git

echo ""
echo "🗂️ ARCHIVOS VSCODE TEMPORALES:"
find . -name "*.tmp" -o -name "*.swp" -o -name "*~" | grep -v node_modules | grep -v .git

echo ""
echo "💾 ARCHIVOS DE CACHÉ:"
find . -name "*.cache" -o -name ".DS_Store" -o -name "Thumbs.db" | grep -v node_modules | grep -v .git

echo ""
echo "=================================="
echo "✅ Análisis completado"
echo ""
echo "💡 RECOMENDACIONES:"
echo "   1. Revisa cada categoría antes de eliminar"
echo "   2. Haz backup de archivos importantes"
echo "   3. Usa 'cleanup-temp-files.sh' para limpiar de forma segura"

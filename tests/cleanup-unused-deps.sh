#!/bin/bash

# 🚀 Script de Limpieza Automática - Tienda RockBros
# Fecha: 14 de septiembre de 2025

echo "🧹 Iniciando limpieza automática de dependencias no utilizadas..."

# Lista de dependencias Radix UI no utilizadas
RADIX_DEPS=(
  "@radix-ui/react-accordion"
  "@radix-ui/react-alert-dialog"
  "@radix-ui/react-alert"
  "@radix-ui/react-aspect-ratio"
  "@radix-ui/react-avatar"
  "@radix-ui/react-breadcrumb"
  "@radix-ui/react-calendar"
  "@radix-ui/react-carousel"
  "@radix-ui/react-chart"
  "@radix-ui/react-collapsible"
  "@radix-ui/react-command"
  "@radix-ui/react-context-menu"
  "@radix-ui/react-drawer"
  "@radix-ui/react-form"
  "@radix-ui/react-hover-card"
  "@radix-ui/react-input-otp"
  "@radix-ui/react-menubar"
  "@radix-ui/react-navigation-menu"
  "@radix-ui/react-popover"
  "@radix-ui/react-progress"
  "@radix-ui/react-radio-group"
  "@radix-ui/react-resizable"
  "@radix-ui/react-scroll-area"
  "@radix-ui/react-select"
  "@radix-ui/react-sidebar"
  "@radix-ui/react-skeleton"
  "@radix-ui/react-slider"
  "@radix-ui/react-sonner"
  "@radix-ui/react-switch"
  "@radix-ui/react-table"
  "@radix-ui/react-tabs"
  "@radix-ui/react-textarea"
  "@radix-ui/react-toggle-group"
  "@radix-ui/react-tooltip"
)

# Otras dependencias no utilizadas
OTHER_DEPS=(
  "next-themes"
  "react-day-picker"
  "react-resizable-panels"
  "recharts"
  "vaul"
)

echo "📦 Eliminando ${#RADIX_DEPS[@]} dependencias Radix UI no utilizadas..."
for dep in "${RADIX_DEPS[@]}"; do
  if npm list "$dep" > /dev/null 2>&1; then
    echo "❌ Eliminando $dep..."
    npm uninstall "$dep"
  else
    echo "⚠️  $dep ya no está instalado"
  fi
done

echo "📦 Eliminando ${#OTHER_DEPS[@]} otras dependencias no utilizadas..."
for dep in "${OTHER_DEPS[@]}"; do
  if npm list "$dep" > /dev/null 2>&1; then
    echo "❌ Eliminando $dep..."
    npm uninstall "$dep"
  else
    echo "⚠️  $dep ya no está instalado"
  fi
done

echo "🧹 Eliminando archivos de componentes UI no utilizados..."

# Lista de archivos UI a eliminar
UI_FILES=(
  "src/components/ui/accordion.tsx"
  "src/components/ui/alert-dialog.tsx"
  "src/components/ui/alert.tsx"
  "src/components/ui/aspect-ratio.tsx"
  "src/components/ui/avatar.tsx"
  "src/components/ui/breadcrumb.tsx"
  "src/components/ui/calendar.tsx"
  "src/components/ui/carousel.tsx"
  "src/components/ui/chart.tsx"
  "src/components/ui/collapsible.tsx"
  "src/components/ui/command.tsx"
  "src/components/ui/context-menu.tsx"
  "src/components/ui/drawer.tsx"
  "src/components/ui/form.tsx"
  "src/components/ui/hover-card.tsx"
  "src/components/ui/input-otp.tsx"
  "src/components/ui/menubar.tsx"
  "src/components/ui/navigation-menu.tsx"
  "src/components/ui/popover.tsx"
  "src/components/ui/progress.tsx"
  "src/components/ui/radio-group.tsx"
  "src/components/ui/resizable.tsx"
  "src/components/ui/scroll-area.tsx"
  "src/components/ui/select.tsx"
  "src/components/ui/sidebar.tsx"
  "src/components/ui/skeleton.tsx"
  "src/components/ui/slider.tsx"
  "src/components/ui/sonner.tsx"
  "src/components/ui/switch.tsx"
  "src/components/ui/table.tsx"
  "src/components/ui/tabs.tsx"
  "src/components/ui/textarea.tsx"
  "src/components/ui/toggle-group.tsx"
  "src/components/ui/tooltip.tsx"
)

for file in "${UI_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "🗑️  Eliminando $file..."
    rm "$file"
  else
    echo "⚠️  $file ya no existe"
  fi
done

echo "📦 Actualizando package-lock.json..."
npm install

echo "📊 Verificando tamaño del bundle..."
npm run build

echo "✅ Limpieza completada!"
echo ""
echo "📈 RESULTADOS:"
echo "- Dependencias eliminadas: $((${#RADIX_DEPS[@]} + ${#OTHER_DEPS[@]}))"
echo "- Archivos UI eliminados: ${#UI_FILES[@]}"
echo "- Ejecuta 'npm run dev' para verificar que todo funciona"
echo ""
echo "🎯 PRÓXIMOS PASOS RECOMENDADOS:"
echo "1. Implementar búsqueda funcional"
echo "2. Crear página de detalle de producto"
echo "3. Completar proceso de checkout"
echo "4. Agregar sistema de reviews"

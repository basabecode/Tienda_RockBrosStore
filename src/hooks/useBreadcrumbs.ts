/**
 * Hook para generar breadcrumbs automáticamente
 */
import { useLocation } from 'react-router-dom'
import type { BreadcrumbItem } from '@/components/ui/breadcrumbs'

// Mapeo de rutas a labels legibles
const routeLabels: Record<string, string> = {
  '/usuario': 'Dashboard',
  '/usuario/perfil': 'Mi Perfil',
  '/usuario/pedidos': 'Mis Pedidos',
  '/usuario/favoritos': 'Mis Favoritos',
  '/admin': 'Panel Admin',
  '/admin/productos': 'Gestión de Productos',
  '/admin/usuarios': 'Gestión de Usuarios',
  '/admin/categorias': 'Gestión de Categorías',
  '/productos': 'Productos',
  '/categorias': 'Categorías',
}

export const useBreadcrumbs = () => {
  const location = useLocation()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Agregar inicio
    breadcrumbs.push({
      label: 'Inicio',
      href: '/',
    })

    // Construir breadcrumbs basado en la ruta
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      breadcrumbs.push({
        label:
          routeLabels[currentPath] ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
        isActive: isLast,
      })
    })

    return breadcrumbs
  }

  return generateBreadcrumbs()
}

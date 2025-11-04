import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

const Breadcrumbs = () => {
  const location = useLocation()

  // Configuración de breadcrumbs por ruta
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname
    const segments = path.split('/').filter(Boolean)

    // Casos especiales por ruta
    if (path === '/') {
      return [{ label: 'Inicio', href: '/', isActive: true }]
    }

    if (path.startsWith('/dashboard')) {
      const baseBreadcrumbs = [
        { label: 'Inicio', href: '/' },
        { label: 'Mi Cuenta', href: '/dashboard' },
      ]

      if (path === '/dashboard') {
        return [
          ...baseBreadcrumbs.slice(0, -1),
          { ...baseBreadcrumbs[1], isActive: true },
        ]
      }

      const subpageMap = {
        perfil: 'Mi Perfil',
        direcciones: 'Mis Direcciones',
        pedidos: 'Mis Pedidos',
        favoritos: 'Mis Favoritos',
        seguridad: 'Seguridad',
      }

      const subpage = segments[1]
      if (subpage && subpageMap[subpage]) {
        return [
          ...baseBreadcrumbs,
          { label: subpageMap[subpage], isActive: true },
        ]
      }
    }

    if (path.startsWith('/admin')) {
      const baseBreadcrumbs = [
        { label: 'Inicio', href: '/' },
        { label: 'Admin Panel', href: '/admin' },
      ]

      if (path === '/admin') {
        return [
          ...baseBreadcrumbs.slice(0, -1),
          { ...baseBreadcrumbs[1], isActive: true },
        ]
      }

      const adminPageMap = {
        productos: 'Gestión de Productos',
        usuarios: 'Gestión de Usuarios',
        ventas: 'Ventas y Pedidos',
        categorias: 'Categorías',
        reportes: 'Reportes',
      }

      const subpage = segments[1]
      if (subpage && adminPageMap[subpage]) {
        return [
          ...baseBreadcrumbs,
          { label: adminPageMap[subpage], isActive: true },
        ]
      }
    }

    if (path.startsWith('/producto/')) {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Productos', href: '/#shop' },
        { label: 'Detalle del Producto', isActive: true },
      ]
    }

    // Otras rutas especiales
    const specialRoutes = {
      '/login': [
        { label: 'Inicio', href: '/' },
        { label: 'Iniciar Sesión', isActive: true },
      ],
      '/admin/login': [
        { label: 'Inicio', href: '/' },
        { label: 'Admin', href: '/admin' },
        { label: 'Acceso Administrativo', isActive: true },
      ],
    }

    if (specialRoutes[path]) {
      return specialRoutes[path]
    }

    // Fallback genérico
    return [
      { label: 'Inicio', href: '/' },
      { label: 'Página', isActive: true },
    ]
  }

  const breadcrumbs = getBreadcrumbs()

  // No mostrar breadcrumbs si solo hay un elemento (página de inicio)
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm text-subtle-dark mb-4"
    >
      {/* ✅ CORREGIDO: text-gray-500 → text-subtle-dark para navegación */}
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {/* ✅ MANTIENE: text-gray-400 OK para iconos separadores */}
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}

          {item.isActive ? (
            /* ✅ CORREGIDO: text-gray-900 → text-white para elemento activo */
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.href || '#'}
              className="hover:text-brand-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumbs

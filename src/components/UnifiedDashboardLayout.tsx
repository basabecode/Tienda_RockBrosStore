import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import {
  ArrowLeft,
  Home,
  Shield,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  MapPin,
  Heart,
  Key,
  User as UserIcon,
  Store,
} from 'lucide-react'

/**
 * Layout unificado para dashboard de usuario y administrador
 * Maneja roles con lógica condicional para evitar duplicación
 *
 * Funcionalidades:
 * - Header simplificado con logo y botón volver
 * - Sidebar con navegación específica por rol
 * - Responsive design
 * - Protección de rutas integrada
 */
const UnifiedDashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin, user } = useAuth()

  // Solo usuarios autenticados pueden ver el dashboard
  if (!isAuthenticated) {
    return null
  }

  // Configuración de navegación por rol
  const navigationConfig = isAdmin ? adminNavigation : clientNavigation

  return (
    <div
      className={`min-h-screen ${
        isAdmin ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'
      }`}
    >
      {/* Header unificado - Logo + Botón volver */}
      <header
        className={`w-full border-b ${
          isAdmin ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } shadow-sm flex items-center justify-between px-6 py-4 fixed top-0 left-0 z-40`}
      >
        <div className="flex items-center space-x-3">
          <img src="/favicon.ico" alt="RockBros Logo" className="w-10 h-10" />
          <span className="font-bold text-xl text-gray-900">RockBrosShop</span>
          {isAdmin && (
            <div className="ml-4 px-3 py-1 bg-green-700 text-white text-sm rounded-full font-medium">
              Panel Admin
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la Tienda
          </Button>

          {/* Info de usuario */}
          <div className="text-sm text-gray-600 hidden md:block">
            {user?.full_name || user?.email}
          </div>
        </div>
      </header>

      {/* Layout principal con sidebar y contenido */}
      <div className="max-w-7xl mx-auto pt-20 pb-10 px-6">
        <div className="flex gap-8 mt-6">
          {/* Sidebar unificado */}
          <aside
            className={`w-80 rounded-lg shadow-sm p-6 h-fit ${
              isAdmin
                ? 'bg-gray-800 border border-gray-700 text-gray-100'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="mb-6">
              <h2
                className={`text-xl font-semibold pb-4 border-b ${
                  isAdmin
                    ? 'text-gray-100 border-gray-700'
                    : 'text-gray-900 border-gray-100'
                }`}
              >
                {isAdmin ? 'Panel de Administración' : 'Mi Cuenta'}
              </h2>
              {isAdmin && (
                <p className="text-sm text-gray-400 mt-2">
                  Gestiona la tienda y usuarios
                </p>
              )}
            </div>

            {/* Navegación dinámica por rol */}
            <nav className="space-y-2">
              {navigationConfig.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {section.title && (
                    <>
                      <h3
                        className={`text-xs font-semibold uppercase tracking-wider mt-6 mb-2 ${
                          isAdmin ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {section.title}
                      </h3>
                    </>
                  )}

                  {section.items.map(item => {
                    const Icon = item.icon
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== '/' &&
                        location.pathname.startsWith(item.path))

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium group ${
                          isActive
                            ? 'bg-green-600 text-white shadow-md'
                            : isAdmin
                            ? 'text-gray-200 hover:bg-gray-700 hover:text-white hover:pl-6'
                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                        } ${
                          item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={
                          item.disabled ? e => e.preventDefault() : undefined
                        }
                      >
                        <Icon
                          className={`h-5 w-5 mr-3 ${
                            isActive
                              ? 'text-white'
                              : isAdmin
                              ? 'text-gray-400 group-hover:text-white'
                              : 'text-gray-500 group-hover:text-green-600'
                          }`}
                        />
                        <span className="flex-1">{item.name}</span>
                        {item.disabled && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              isAdmin
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            Próximo
                          </span>
                        )}
                      </NavLink>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* Footer del sidebar */}
            <div
              className={`mt-8 pt-6 border-t ${
                isAdmin ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <p
                className={`text-xs text-center ${
                  isAdmin ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                RockBrosShop v2.0
              </p>
              {isAdmin && (
                <div className="mt-2 text-xs text-center text-green-400 font-medium">
                  Modo Administrador
                </div>
              )}
            </div>
          </aside>

          {/* Contenido principal */}
          <main
            className={`flex-1 rounded-lg shadow-sm p-8 ${
              isAdmin
                ? 'bg-gray-900 border border-gray-700 text-gray-100'
                : 'bg-white border border-gray-200'
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

// Configuración de navegación para clientes
const clientNavigation = {
  sections: [
    {
      title: null, // Sección principal sin título
      items: [
        {
          name: 'Mi Panel',
          path: '/dashboard',
          icon: LayoutDashboard,
          disabled: false,
        },
        {
          name: 'Mi Perfil',
          path: '/perfil',
          icon: UserIcon,
          disabled: false,
        },
        {
          name: 'Mis Pedidos',
          path: '/pedidos',
          icon: ShoppingCart,
          disabled: false,
        },
        {
          name: 'Favoritos',
          path: '/favoritos',
          icon: Heart,
          disabled: false,
        },
      ],
    },
  ],
}

// Configuración de navegación para administradores
const adminNavigation = {
  sections: [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'Panel Principal',
          path: '/admin',
          icon: LayoutDashboard,
          disabled: false,
        },
      ],
    },
    {
      title: 'Gestión',
      items: [
        {
          name: 'Productos',
          path: '/admin/productos',
          icon: Package,
          disabled: false,
        },
        {
          name: 'Usuarios',
          path: '/admin/usuarios',
          icon: Users,
          disabled: false,
        },
        {
          name: 'Ventas y Pedidos',
          path: '/admin/ventas',
          icon: ShoppingCart,
          disabled: false,
        },
      ],
    },
    {
      title: 'Próximamente',
      items: [
        {
          name: 'Categorías',
          path: '/admin/categorias',
          icon: BarChart3,
          disabled: true,
        },
        {
          name: 'Reportes',
          path: '/admin/reportes',
          icon: BarChart3,
          disabled: true,
        },
      ],
    },
    {
      title: 'Cuenta Personal',
      items: [
        {
          name: 'Mi Perfil',
          path: '/dashboard/perfil',
          icon: UserIcon,
          disabled: false,
        },
        {
          name: 'Ver como Usuario',
          path: '/dashboard',
          icon: Home,
          disabled: false,
        },
      ],
    },
  ],
}

export default UnifiedDashboardLayout

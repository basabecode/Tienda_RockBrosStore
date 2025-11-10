import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
  Shield,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react'
import { useState } from 'react'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Panel Principal',
      path: '/admin',
      description: 'Vista general y estadísticas',
      badge: null,
    },
    {
      icon: Package,
      label: 'Gestión Productos',
      path: '/admin/productos',
      description: 'Inventario y catálogo',
      badge: null,
    },
    {
      icon: Users,
      label: 'Usuarios',
      path: '/admin/usuarios',
      description: 'Gestión de clientes',
      badge: null, // Ejemplo de badge con número
    },
    {
      icon: BarChart3,
      label: 'Análisis Ventas',
      path: '/admin/ventas',
      description: 'Reportes e informes',
      badge: null,
    },
    {
      icon: Settings,
      label: 'Configuración',
      path: '/admin/configuracion',
      description: 'Sistema y preferencias',
      badge: null,
    },
  ]

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-verde-neon/3">
      {/* Header profesional con paleta RockBros */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gris-medio/20 fixed top-0 left-0 right-0 z-50 h-16 shadow-sm">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Lado izquierdo - Logo y menú móvil */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <div
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-200 group"
            >
              <img
                src="/favicon.ico"
                alt="RockBros Logo"
                className="w-10 h-10 rounded-xl shadow-lg group-hover:shadow-verde-bosque/30 transition-shadow"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold text-gris-oscuro leading-tight">
                  RockBrosShop
                </span>
                <span className="text-xs text-gris-medio leading-tight">
                  Panel Administrador
                </span>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="hidden sm:flex bg-verde-neon/10 text-verde-bosque border-verde-neon/30 font-semibold"
            >
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>

          {/* Centro - Panel de Control */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 items-center justify-center">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-verde-bosque/5 to-verde-neon/5 px-6 py-3 rounded-lg border border-verde-neon/20">
              <Shield className="w-5 h-5 text-verde-bosque" />
              <span className="text-lg font-bold text-gris-oscuro">
                Panel de Control
              </span>
            </div>
          </div>

          {/* Lado derecho - Acciones rápidas y usuario */}
          <div className="flex items-center space-x-3">
            {/* Botón de acceso rápido a tienda */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Ver Tienda</span>
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gris-oscuro">
                  Administrador
                </span>
                <span className="text-xs text-gris-medio font-medium">
                  {user?.email}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-verde-bosque to-verde-neon rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gris-medio hover:text-red-600 hover:bg-red-50/80 font-medium transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar profesional con paleta RockBros */}
        <aside
          className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 transform bg-white/95 backdrop-blur-sm border-r border-gris-medio/20 shadow-xl transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:min-h-[calc(100vh-4rem)] ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Información del admin
            <div className="p-6 border-b border-gris-medio/20">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-br from-verde-bosque to-verde-neon rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gris-oscuro text-lg">
                    Administrador
                  </h2>
                  <p className="text-sm text-gris-medio font-medium">
                    Gestión completa
                  </p>
                </div>
              </div>
            </div>*/}

            {/* Navegación principal */}
            <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
              {menuItems.map(item => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? 'bg-gradient-to-r from-verde-bosque to-verde-neon text-white shadow-lg shadow-verde-bosque/25 border-verde-neon'
                        : 'text-gris-oscuro hover:bg-verde-neon/5 hover:text-verde-bosque hover:border-verde-neon/30 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-gris-medio group-hover:text-verde-bosque'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {item.label}
                        </div>
                        <div
                          className={`text-xs mt-1 truncate ${
                            isActive ? 'text-white/90' : 'text-gris-medio'
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {item.badge && (
                      <Badge
                        variant={isActive ? 'secondary' : 'default'}
                        className={`text-xs font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : 'bg-verde-neon/10 text-verde-bosque border-verde-neon/30'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* Panel de métricas rápidas */}
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-emerald-800 mb-3">
                  Estado del Sistema
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700">
                      Estado del servidor:
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium">Activo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700">
                      Última actualización:
                    </span>
                    <span className="text-emerald-600 font-medium">
                      {new Date().toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del sidebar */}
            <div className="p-4 border-t border-gris-medio/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="w-full justify-center text-verde-bosque border-verde-bosque hover:bg-verde-bosque hover:text-white font-semibold transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Tienda Pública
              </Button>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-0 min-h-[calc(100vh-4rem)]">
          <div className="p-6">
            {/* Contenedor del contenido con diseño modular */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gris-medio/20 min-h-[calc(100vh-8rem)]">
              <div className="p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

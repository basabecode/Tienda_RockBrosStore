import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/use-auth'

const DashboardLayout = () => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  // Layout para administradores
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="container mx-auto py-8">
          {/* Breadcrumb y botón volver para administradores */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver a la Tienda</span>
              </Button>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>/</span>
                <Shield className="h-4 w-4" />
                <span>Panel de Administración</span>
              </div>
            </div>
          </div>

          {/* Contenido principal de administrador - sin sidebar */}
          <div className="w-full">
            <Outlet />
          </div>
        </div>
        {/* Sin footer para administradores */}
      </div>
    )
  }

  // Layout para usuarios regulares
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 mt-20">
        {/* Breadcrumb y botón volver */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a la Tienda</span>
            </Button>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span>Mi Cuenta</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Componente de sidebar para el dashboard
const DashboardSidebar = () => {
  const navigation = [
    { name: 'Resumen', href: '/dashboard', icon: '📊' },
    { name: 'Perfil', href: '/dashboard/profile', icon: '👤' },
    { name: 'Direcciones', href: '/dashboard/addresses', icon: '📍' },
    { name: 'Pedidos', href: '/dashboard/orders', icon: '📦' },
    { name: 'Favoritos', href: '/dashboard/favorites', icon: '❤️' },
    {
      name: 'Cambiar Contraseña',
      href: '/dashboard/change-password',
      icon: '🔐',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Mi Cuenta</h2>
      <nav className="space-y-2">
        {navigation.map(item => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default DashboardLayout

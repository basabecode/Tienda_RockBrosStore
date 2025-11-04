import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// Layout refactorizado: elimina duplicación, mejora UX y consistencia
const DashboardLayout = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Solo usuarios autenticados pueden ver el dashboard
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header limpio y profesional */}
      <header className="w-full border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-6 py-4 fixed top-0 left-0 z-40">
        <div className="flex items-center space-x-3">
          <img src="/favicon.ico" alt="RockBros Logo" className="w-10 h-10" />
          <span className="font-bold text-xl text-gray-900">RockBrosShop</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-300"
        >
          Volver a la Tienda
        </Button>
      </header>

      {/* Layout principal con espaciado mejorado */}
      <div className="max-w-7xl mx-auto pt-20 pb-10 px-6">
        <div className="flex gap-8 mt-6">
          {/* Menú lateral mejorado: mejor contraste, espaciado y tipografía */}
          <aside className="w-72 bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Mi Cuenta
            </h2>
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                  }`
                }
              >
                Mi Panel
              </NavLink>
              <NavLink
                to="/dashboard/perfil"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                  }`
                }
              >
                Mi Perfil
              </NavLink>
              <NavLink
                to="/dashboard/direcciones"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                  }`
                }
              >
                Direcciones
              </NavLink>
              <NavLink
                to="/dashboard/pedidos"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                  }`
                }
              >
                Mis Pedidos
              </NavLink>
              <NavLink
                to="/dashboard/favoritos"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                  }`
                }
              >
                Favoritos
              </NavLink>
              <NavLink
                to="/dashboard/seguridad"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700 hover:pl-6'
                  }`
                }
              >
                Seguridad
              </NavLink>
            </nav>

            {/* Información adicional del sidebar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                RockBrosShop v2.0
              </p>
            </div>
          </aside>

          {/* Contenido principal con mejor espaciado */}
          <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

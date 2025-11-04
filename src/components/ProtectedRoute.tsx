import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/hooks/use-admin-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAdmin, isLoading, error } = useAdminAuth()
  const location = useLocation()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Redirección inteligente según el tipo de ruta requerida
  if (error || !user) {
    const currentPath = location.pathname

    // Si es una ruta de admin, redirigir al login de admin
    if (requireAdmin || currentPath.startsWith('/admin')) {
      return (
        <Navigate
          to={`/admin/login?redirect=${encodeURIComponent(currentPath)}`}
          replace
        />
      )
    }

    // Para rutas de usuario, redirigir al login normal
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(currentPath)}`}
        replace
      />
    )
  }

  // Si se requiere admin y no es admin, mostrar acceso denegado
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            No tienes permisos de administrador para acceder a esta página.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Volver Atrás
            </button>
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className="w-full bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-secondary transition-colors"
            >
              🏠 Ir a Mi Cuenta
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Si crees que esto es un error, contacta al administrador del
            sistema.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

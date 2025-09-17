import { Navigate } from 'react-router-dom'
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

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Si hay error o no hay usuario, redirigir al login
  if (error || !user) {
    return <Navigate to="/login" replace />
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
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🏠 Ir al Dashboard
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

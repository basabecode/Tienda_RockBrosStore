import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'admin'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
}) => {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-primary" />
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // No authenticated
  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search)

    if (requiredRole === 'admin') {
      return <Navigate to={`/admin/login?returnUrl=${returnUrl}`} replace />
    }

    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />
  }

  // Check admin role
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-6">🚫</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Acceso Denegado
          </h1>
          <p className="text-muted-foreground mb-6">
            No tienes permisos de administrador para acceder a esta área.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-muted text-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
            >
              ← Volver
            </button>
            <button
              onClick={() => (window.location.href = '/usuario')}
              className="w-full bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-secondary transition-colors"
            >
              🏠 Mi Cuenta
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

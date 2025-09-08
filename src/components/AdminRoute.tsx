import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/use-auth'

type AdminRouteProps = {
  children: React.ReactNode
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth()

  // Mostrar loading mientras se obtienen los datos del usuario
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si el usuario no es admin, redirigir a la página principal
  if (user.role !== 'admin') {
    console.log('🚫 Acceso denegado: Usuario no es admin', {
      userId: user.id,
      role: user.role,
      isAdmin: user.is_admin,
    })
    return <Navigate to="/" replace />
  }

  console.log('✅ Acceso permitido al dashboard admin', {
    userId: user.id,
    role: user.role,
    isAdmin: user.is_admin,
  })

  return <>{children}</>
}

export default AdminRoute

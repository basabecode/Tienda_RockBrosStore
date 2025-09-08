import { Button } from '@/components/ui/button'
import { RefreshCw, Shield, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'

const DevTools = () => {
  const { user, refreshUser, isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  const handleRefreshUser = async () => {
    toast({
      title: 'Refrescando usuario...',
      description: 'Obteniendo datos actualizados desde la base de datos',
    })

    await refreshUser()

    toast({
      title: 'Usuario actualizado',
      description: `Rol: ${user?.role}, Admin: ${user?.is_admin ? 'Sí' : 'No'}`,
    })
  }

  const showUserInfo = () => {
    toast({
      title: 'Información del usuario',
      description: `Email: ${user?.email}, Rol: ${user?.role}, Admin: ${
        user?.is_admin ? 'Sí' : 'No'
      }`,
    })
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md text-xs">
      <span className="text-gray-600">Dev:</span>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefreshUser}
        className="h-6 px-2 text-xs"
        title="Refrescar datos del usuario"
      >
        <RefreshCw className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={showUserInfo}
        className="h-6 px-2 text-xs"
        title="Mostrar información del usuario"
      >
        {user?.is_admin ? (
          <Shield className="h-3 w-3 text-green-600" />
        ) : (
          <User className="h-3 w-3 text-blue-600" />
        )}
      </Button>

      <span className="text-xs text-gray-500">{user?.role}</span>
    </div>
  )
}

export default DevTools

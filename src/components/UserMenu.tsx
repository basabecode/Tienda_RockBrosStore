import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  User as UserIcon,
  LogOut,
  Shield,
  Home,
  Package,
  MapPin,
  Heart,
  Key,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import type { User } from '@/lib/auth'

export function UserMenu() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la sesión',
        variant: 'destructive',
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Menú de navegación principal para clientes
  const userMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Panel Principal',
      description: 'Vista general de tu cuenta',
      path: '/dashboard',
    },
    {
      icon: UserIcon,
      label: 'Mi Perfil',
      description: 'Datos personales y configuración',
      path: '/dashboard/profile',
    },
    {
      icon: MapPin,
      label: 'Mis Direcciones',
      description: 'Gestionar direcciones de envío',
      path: '/dashboard/addresses',
    },
    {
      icon: Package,
      label: 'Mis Pedidos',
      description: 'Historial y estado de compras',
      path: '/dashboard/orders',
    },
    {
      icon: Heart,
      label: 'Favoritos',
      description: 'Productos guardados',
      path: '/dashboard/favorites',
    },
    {
      icon: Key,
      label: 'Seguridad',
      description: 'Cambiar contraseña',
      path: '/dashboard/change-password',
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.profile?.avatar_url || ''}
              alt={user.profile?.full_name || user.email}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.profile?.full_name
                ? getInitials(user.profile.full_name)
                : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">
                {user.profile?.full_name || 'Usuario'}
              </p>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navegación rápida - no duplicar si ya estamos en esa página */}
        {!location.pathname.startsWith('/dashboard') && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center space-x-3 w-full">
              <Home className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Volver al Inicio</span>
                <span className="text-xs text-muted-foreground">
                  Ir a la tienda principal
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        )}

        {/* Menú principal de navegación */}
        <div className="py-1">
          {userMenuItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <DropdownMenuItem
                key={item.path}
                className={`cursor-pointer ${
                  isActive ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <Icon
                    className={`h-4 w-4 mt-0.5 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>

        {/* Acceso admin separado */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              <div className="flex items-center space-x-3 w-full">
                <Shield className="h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-700">
                    Panel de Administración
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Gestionar productos y usuarios
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

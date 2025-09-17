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
import {
  User as UserIcon,
  LogOut,
  Home,
  Package,
  MapPin,
  Heart,
  Key,
  LayoutDashboard,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import type { User } from '@/lib/auth'

export function ClientUserMenu() {
  const { user, signOut } = useAuth()
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

  // Menú de navegación para clientes
  const clientMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Mi Panel',
      description: 'Resumen de mi cuenta',
      path: '/dashboard',
    },
    {
      icon: UserIcon,
      label: 'Mi Perfil',
      description: 'Información personal',
      path: '/dashboard/profile',
    },
    {
      icon: Package,
      label: 'Mis Pedidos',
      description: 'Historial de compras',
      path: '/dashboard/orders',
    },
    {
      icon: Heart,
      label: 'Lista de Deseos',
      description: 'Productos favoritos',
      path: '/dashboard/favorites',
    },
    {
      icon: MapPin,
      label: 'Direcciones',
      description: 'Direcciones de envío',
      path: '/dashboard/addresses',
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
                {user.profile?.full_name || 'Cliente'}
              </p>
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Cliente
              </div>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navegación rápida - Volver al inicio si no estamos ahí */}
        {location.pathname !== '/' && (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-blue-50"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center space-x-3 w-full">
                <Home className="h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-700">
                    Volver a la Tienda
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Continuar comprando
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Menú principal de navegación para clientes */}
        <div className="py-1">
          {clientMenuItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <DropdownMenuItem
                key={item.path}
                className={`cursor-pointer transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
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

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

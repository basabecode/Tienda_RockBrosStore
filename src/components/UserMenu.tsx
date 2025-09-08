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
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Shield,
  Package,
  Users,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/lib/auth'

export function UserMenu() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

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

  const menuItems = [
    {
      icon: UserIcon,
      label: 'Mi Perfil',
      href: '/profile',
      description: 'Información personal y configuración',
    },
    {
      icon: ShoppingBag,
      label: 'Mis Pedidos',
      href: '/orders',
      description: 'Historial de compras y seguimiento',
    },
    {
      icon: Heart,
      label: 'Favoritos',
      href: '/favorites',
      description: 'Productos guardados',
    },
    {
      icon: MapPin,
      label: 'Direcciones',
      href: '/addresses',
      description: 'Direcciones de envío',
    },
  ]

  const adminItems = [
    {
      icon: Shield,
      label: 'Dashboard Admin',
      href: '/admin',
      description: 'Panel de administración',
    },
    {
      icon: Package,
      label: 'Productos',
      href: '/admin/products',
      description: 'Gestionar catálogo',
    },
    {
      icon: ShoppingBag,
      label: 'Pedidos',
      href: '/admin/orders',
      description: 'Gestionar pedidos',
    },
    {
      icon: Users,
      label: 'Usuarios',
      href: '/admin/users',
      description: 'Gestionar usuarios',
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

        {/* Opciones de usuario */}
        <div className="py-1">
          {menuItems.map(item => (
            <DropdownMenuItem
              key={item.href}
              className="cursor-pointer"
              onClick={() => navigate(item.href)}
            >
              <div className="flex items-start space-x-3 w-full">
                <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        {/* Opciones de administrador */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              ADMINISTRACIÓN
            </DropdownMenuLabel>
            <div className="py-1">
              {adminItems.map(item => (
                <DropdownMenuItem
                  key={item.href}
                  className="cursor-pointer"
                  onClick={() => navigate(item.href)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
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

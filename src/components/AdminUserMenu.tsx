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
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import type { User } from '@/lib/auth'

export function AdminUserMenu() {
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

  // Menú de navegación principal para administradores
  const adminMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard Admin',
      description: 'Panel de control principal',
      path: '/admin',
    },
    {
      icon: Package,
      label: 'Gestión de Productos',
      description: 'Crear, editar y eliminar productos',
      path: '/admin/products',
    },
    {
      icon: Users,
      label: 'Gestión de Usuarios',
      description: 'Administrar usuarios registrados',
      path: '/admin/users',
    },
    {
      icon: ShoppingCart,
      label: 'Revisión de Compras',
      description: 'Pedidos y transacciones',
      path: '/admin/sales',
    },
    {
      icon: BarChart3,
      label: 'Estadísticas',
      description: 'Análisis y reportes',
      path: '/admin/analytics',
      disabled: true,
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
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
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
                {user.profile?.full_name || 'Administrador'}
              </p>
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-700"
              >
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navegación rápida - Volver a la tienda */}
        {!location.pathname.startsWith('/') || location.pathname !== '/' ? (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-green-50"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center space-x-3 w-full">
                <Store className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-700">
                    Ver Tienda
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Vista pública de la tienda
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {/* Acceso a cuenta personal */}
        <DropdownMenuItem
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => navigate('/dashboard')}
        >
          <div className="flex items-center space-x-3 w-full">
            <UserIcon className="h-4 w-4 text-gray-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Mi Cuenta Personal</span>
              <span className="text-xs text-muted-foreground">
                Panel de usuario normal
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Menú principal de administración */}
        <div className="py-1">
          {adminMenuItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const isDisabled = item.disabled

            if (isDisabled) {
              return (
                <DropdownMenuItem
                  key={item.path}
                  className="cursor-not-allowed opacity-50"
                  disabled
                >
                  <div className="flex items-start space-x-3 w-full">
                    <Icon className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-gray-400">
                        {item.label}
                      </span>
                      <span className="text-xs text-orange-500">
                        Próximamente
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            }

            return (
              <DropdownMenuItem
                key={item.path}
                className={`cursor-pointer transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <Icon
                    className={`h-4 w-4 mt-0.5 ${
                      isActive ? 'text-blue-600' : 'text-muted-foreground'
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

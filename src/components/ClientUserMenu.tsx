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

  // Detectar si el usuario es administrador
  const isAdmin = user.role === 'admin'
  const isInUserArea =
    location.pathname.startsWith('/usuario') ||
    location.pathname.startsWith('/admin')

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      })
      // Redirigir al home después del logout
      navigate('/')
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

  // Menús dinámicos por rol
  const adminMenuItems = [
    {
      icon: LayoutDashboard,
      label: 'Panel Admin',
      description: 'Dashboard administrativo',
      path: '/admin',
    },
    {
      icon: Package,
      label: 'Productos',
      description: 'Gestionar catálogo',
      path: '/admin/productos',
    },
    {
      icon: UserIcon,
      label: 'Usuarios',
      description: 'Administrar usuarios',
      path: '/admin/usuarios',
    },
    {
      icon: ShoppingBag,
      label: 'Ventas',
      description: 'Gestionar pedidos',
      path: '/admin/ventas',
    },
  ]

  const clientMenuItems = [
    {
      icon: UserIcon,
      label: 'Mi Perfil',
      description: 'Información personal, direcciones y seguridad',
      path: '/usuario/perfil',
    },
    {
      icon: Package,
      label: 'Mis Pedidos',
      description: 'Historial de compras',
      path: '/usuario/pedidos',
    },
    {
      icon: Heart,
      label: 'Lista de Deseos',
      description: 'Productos favoritos',
      path: '/usuario/favoritos',
    },
  ]

  // Seleccionar menú según rol
  const menuItems = isAdmin ? adminMenuItems : clientMenuItems

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-10 w-10 rounded-full transition-colors ${
            isAdmin
              ? 'hover:bg-brand-primary/10 focus:bg-brand-primary/10'
              : 'hover:bg-brand-primary/10 focus:bg-brand-primary/10'
          }`}
        >
          <Avatar
            className={`h-10 w-10 border-2 border-transparent ${
              isAdmin
                ? 'hover:border-brand-primary/20'
                : 'hover:border-brand-primary/20'
            }`}
          >
            <AvatarImage
              src={user.profile?.avatar_url || user.avatar_url || ''}
              alt={user.profile?.full_name || user.full_name || user.email}
            />
            <AvatarFallback
              className={`text-white font-semibold ${
                isAdmin ? 'bg-brand-primary' : 'bg-brand-primary'
              }`}
            >
              {user.profile?.full_name
                ? getInitials(user.profile.full_name)
                : user.full_name
                ? getInitials(user.full_name)
                : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 bg-card border border-border shadow-2xl rounded-xl backdrop-blur-sm"
        align="end"
        forceMount
        side="bottom"
        sideOffset={12}
        style={
          {
            '--radix-dropdown-menu-content-transform-origin':
              'var(--radix-popper-transform-origin)',
            '--radix-dropdown-menu-content-available-width':
              'var(--radix-popper-available-width)',
            '--radix-dropdown-menu-content-available-height':
              'var(--radix-popper-available-height)',
            '--radix-dropdown-menu-trigger-width':
              'var(--radix-popper-anchor-width)',
            '--radix-dropdown-menu-trigger-height':
              'var(--radix-popper-anchor-height)',
          } as React.CSSProperties
        }
      >
        <DropdownMenuLabel
          className={`font-normal p-4 ${
            isAdmin
              ? 'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10'
              : 'bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5'
          }`}
        >
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={user.profile?.avatar_url || user.avatar_url || ''}
                  alt={user.profile?.full_name || user.full_name || user.email}
                />
                <AvatarFallback
                  className={`text-white font-bold text-lg ${
                    isAdmin ? 'bg-brand-primary' : 'bg-brand-primary'
                  }`}
                >
                  {user.profile?.full_name
                    ? getInitials(user.profile.full_name)
                    : user.full_name
                    ? getInitials(user.full_name)
                    : user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {/* ✅ CORREGIDO: text-gray-900 → text-foreground para tema oscuro */}
                <p className="text-base font-semibold text-foreground leading-none">
                  {user.profile?.full_name ||
                    user.full_name ||
                    (isAdmin ? 'Administrador' : 'Cliente')}
                </p>
                <div
                  className={`mt-1 px-2 py-1 text-xs rounded-full inline-block w-fit ${
                    isAdmin
                      ? 'bg-brand-primary/20 text-brand-primary'
                      : 'bg-brand-primary/15 text-brand-primary'
                  }`}
                >
                  {isAdmin ? 'Administrador' : 'Cliente'}
                </div>
              </div>
            </div>
            {/* ✅ CORREGIDO: text-gray-600 → text-secondary-dark para mejor contraste */}
            <p className="text-sm text-secondary-dark font-medium">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navegación rápida - Volver al inicio si no estamos ahí */}
        {location.pathname !== '/' && (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center space-x-3 w-full">
                <Home className="h-4 w-4 text-brand-primary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-primary">
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

        {/* Acceso rápido al área del usuario alternativa si es admin */}
        {isAdmin && (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate('/usuario/perfil')}
            >
              <div className="flex items-center space-x-3 w-full">
                <UserIcon className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-700">
                    Mi Perfil Personal
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Configuración personal
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Menú principal de navegación dinámico por rol */}
        <div className="py-1">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const colorClass = isAdmin
              ? 'text-brand-primary'
              : 'text-brand-primary'
            const hoverClass = isAdmin
              ? 'hover:bg-brand-primary/10'
              : 'hover:bg-brand-primary/10'

            return (
              <DropdownMenuItem
                key={item.path}
                className={`cursor-pointer transition-colors ${
                  isActive
                    ? `${
                        isAdmin ? 'bg-brand-primary/15' : 'bg-brand-primary/15'
                      } ${colorClass}`
                    : `hover:bg-muted/50 ${hoverClass}`
                }`}
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <Icon
                    className={`h-4 w-4 mt-0.5 ${
                      isActive ? colorClass : 'text-muted-foreground'
                    }`}
                  />
                  <div className="flex flex-col space-y-1">
                    <span
                      className={`text-sm font-medium ${
                        isActive ? colorClass : ''
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>

        {/* Acceso rápido a modo cliente para administradores */}
        {isAdmin && !isInUserArea && (
          <>
            <DropdownMenuSeparator />
            <div className="py-1">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate('/usuario/perfil')}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Heart className="h-4 w-4 text-brand-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-brand-primary">
                      Ver como Cliente
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Acceder a funciones de cliente
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-500/10"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

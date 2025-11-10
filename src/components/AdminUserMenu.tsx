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
  Store,
  LayoutDashboard,
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

  // Navegación simplificada - Solo acceso principal al panel admin
  const mainAdminPath = '/admin'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.profile?.avatar_url || ''}
              alt={user.profile?.full_name || user.email}
            />
            <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold">
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
                {user.profile?.full_name || user.email.split('@')[0]}
              </p>
              <Badge
                variant="secondary"
                className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200"
              >
                <Shield className="w-3 h-3 mr-1" />
                Administrador
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Navegación principal - Panel de Control */}
        <DropdownMenuItem
          className="cursor-pointer hover:bg-emerald-50 transition-colors"
          onClick={() => navigate(mainAdminPath)}
        >
          <div className="flex items-center space-x-3 w-full">
            <LayoutDashboard className="h-5 w-5 text-emerald-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-emerald-700">
                Panel de Control
              </span>
              <span className="text-xs text-muted-foreground">
                Centro de administración
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Navegación rápida - Volver a la tienda */}
        {location.pathname.startsWith('/admin') && (
          <>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => navigate('/')}
            >
              <div className="flex items-center space-x-3 w-full">
                <Store className="h-4 w-4 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-700">
                    Ver Tienda
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Vista pública del sitio
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleSignOut}
        >
          <div className="flex items-center space-x-3 w-full">
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

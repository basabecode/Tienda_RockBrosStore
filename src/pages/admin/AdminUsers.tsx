import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Datos de ejemplo - en producción vendrían de Supabase
  const users = []

  const userStats = [
    {
      title: 'Total Usuarios',
      value: '0',
      icon: Users,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
    },
    {
      title: 'Usuarios Activos',
      value: '0',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Administradores',
      value: '1',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Nuevos este mes',
      value: '0',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gris-oscuro">
          Gestión de Usuarios
        </h1>
        <p className="text-gris-medio mt-2">
          Administra los usuarios registrados en RockBros Store
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gris-medio">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gris-oscuro">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gris-medio h-4 w-4" />
                <Input
                  placeholder="Buscar usuarios por nombre o email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
              >
                Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
              >
                Activos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-gris-medio mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gris-oscuro mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-gris-medio mb-6 max-w-md mx-auto">
              Los usuarios registrados aparecerán aquí cuando se registren en tu
              tienda. Podrás gestionar sus permisos y ver su actividad.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
              >
                <Mail className="h-4 w-4 mr-2" />
                Invitar Usuarios
              </Button>
              <Button className="bg-brand-primary hover:bg-brand-secondary text-white">
                <Crown className="h-4 w-4 mr-2" />
                Crear Administrador
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían los usuarios */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-gris-oscuro">
                        Administrador
                      </p>
                      <p className="text-sm text-gris-medio">
                        admin@rockbros.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gris-oscuro hover:bg-gris-medio/10 hover:text-gris-oscuro"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                        <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Suspender usuario
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar invitaciones masivas
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Activar usuarios pendientes
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
            >
              <Crown className="h-4 w-4 mr-2" />
              Gestionar administradores
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gris-medio mx-auto mb-4" />
              <p className="text-gris-medio">
                La actividad de usuarios aparecerá aquí
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminUsers

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { TempAdminPage } from '@/components/TempAdminPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/utils/formatters'
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Shield,
  Crown,
  User,
  Mail,
  Calendar,
  Filter,
} from 'lucide-react'

interface SupabaseUserData {
  id: string
  full_name: string | null
  role: 'user' | 'moderator' | 'admin'
  is_active: boolean
  created_at: string
  auth: {
    users: {
      email: string
      last_sign_in_at: string | null
    }
  }
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'user' | 'moderator' | 'admin'
  is_active: boolean
  created_at: string
  last_sign_in_at: string | null
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, selectedRole],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(
          `
          id,
          full_name,
          role,
          is_active,
          created_at,
          auth.users!inner(email, last_sign_in_at)
        `
        )
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,auth.users.email.ilike.%${searchTerm}%`
        )
      }

      if (selectedRole !== 'all') {
        query = query.eq('role', selectedRole)
      }

      const { data, error } = await query
      if (error) throw error

      // Transform data to match interface
      return (data as unknown[]).map((user: unknown) => {
        const userRecord = user as Record<string, unknown>
        const authData = userRecord.auth as Record<string, unknown> | undefined
        const usersData = authData?.users as Record<string, unknown> | undefined

        return {
          id: userRecord.id as string,
          email: (usersData?.email as string) || '',
          full_name: (userRecord.full_name as string) || 'Sin nombre',
          role: userRecord.role as 'user' | 'admin',
          is_active: userRecord.is_active as boolean,
          created_at: userRecord.created_at as string,
          last_sign_in_at: usersData?.last_sign_in_at as string | undefined,
        }
      }) as UserProfile[]
    },
  })

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string
      newRole: string
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast({
        title: 'Rol actualizado',
        description: 'El rol del usuario ha sido actualizado exitosamente.',
      })
      setIsDialogOpen(false)
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message || 'Ha ocurrido un error al actualizar el rol.',
        variant: 'destructive',
      })
    },
  })

  // Toggle user active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: string
      isActive: boolean
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast({
        title: isActive ? 'Usuario activado' : 'Usuario desactivado',
        description: `El usuario ha sido ${
          isActive ? 'activado' : 'desactivado'
        } exitosamente.`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message ||
          'Ha ocurrido un error al cambiar el estado del usuario.',
        variant: 'destructive',
      })
    },
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4" />
      case 'moderator':
        return <Shield className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'moderator':
        return 'bg-brand-primary/10 text-brand-primary'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Función formatDate movida a utils/formatters.ts

  const handleRoleChange = (user: UserProfile) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const confirmRoleChange = (newRole: string) => {
    if (selectedUser) {
      updateRoleMutation.mutate({ userId: selectedUser.id, newRole })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  return (
    <TempAdminPage
      title="Gestión de Usuarios"
      description="Administra usuarios registrados, valida cuentas y gestiona roles del sistema"
      icon={Users}
      actions={
        <Button
          variant="outline"
          size="sm"
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avanzados
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Total Usuarios
                  </p>
                  <p className="text-2xl font-bold text-gray-100">
                    {users?.length || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Administradores
                  </p>
                  <p className="text-2xl font-bold text-red-400">
                    {users?.filter(u => u.role === 'admin').length || 0}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Moderadores
                  </p>
                  <p className="text-2xl font-bold text-brand-primary">
                    {users?.filter(u => u.role === 'moderator').length || 0}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Usuarios Activos
                  </p>
                  <p className="text-2xl font-bold text-green-400">
                    {users?.filter(u => u.is_active).length || 0}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  />
                </div>
              </div>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem
                    value="all"
                    className="text-gray-100 hover:bg-gray-600"
                  >
                    Todos los roles
                  </SelectItem>
                  <SelectItem
                    value="admin"
                    className="text-gray-100 hover:bg-gray-600"
                  >
                    Administradores
                  </SelectItem>
                  <SelectItem
                    value="moderator"
                    className="text-gray-100 hover:bg-gray-600"
                  >
                    Moderadores
                  </SelectItem>
                  <SelectItem
                    value="user"
                    className="text-gray-100 hover:bg-gray-600"
                  >
                    Usuarios
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Usuario
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Rol
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Registro
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Último acceso
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-300">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map(user => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-600 hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.full_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-100">
                              {user.full_name}
                            </p>
                            <p className="text-sm text-gray-300 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleColor(user.role)}>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role === 'admin'
                              ? 'Admin'
                              : user.role === 'moderator'
                              ? 'Moderador'
                              : 'Usuario'}
                          </div>
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.is_active ? 'default' : 'secondary'}
                        >
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">
                        {user.last_sign_in_at
                          ? formatDate(user.last_sign_in_at)
                          : 'Nunca'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleChange(user)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            Cambiar Rol
                          </Button>
                          <Button
                            variant={user.is_active ? 'outline' : 'default'}
                            size="sm"
                            onClick={() =>
                              toggleActiveMutation.mutate({
                                userId: user.id,
                                isActive: !user.is_active,
                              })
                            }
                            className={
                              user.is_active
                                ? 'text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-700'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users?.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-gray-300">
                  {searchTerm || selectedRole !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'No hay usuarios registrados en el sistema'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Change Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-100">
                Cambiar Rol de Usuario
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg">
                  <h4 className="font-medium text-gray-100">
                    {selectedUser.full_name}
                  </h4>
                  <p className="text-sm text-gray-300">{selectedUser.email}</p>
                  <p className="text-sm text-gray-300">
                    Rol actual: <strong>{selectedUser.role}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-100">
                    Seleccionar nuevo rol:
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={
                        selectedUser.role === 'user' ? 'default' : 'outline'
                      }
                      onClick={() => confirmRoleChange('user')}
                      disabled={selectedUser.role === 'user'}
                      className={`justify-start ${
                        selectedUser.role === 'user'
                          ? 'bg-brand-primary text-white'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Usuario - Acceso básico
                    </Button>

                    <Button
                      variant={
                        selectedUser.role === 'moderator'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => confirmRoleChange('moderator')}
                      disabled={selectedUser.role === 'moderator'}
                      className={`justify-start ${
                        selectedUser.role === 'moderator'
                          ? 'bg-brand-primary text-white'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Moderador - Gestión de contenido
                    </Button>

                    <Button
                      variant={
                        selectedUser.role === 'admin' ? 'default' : 'outline'
                      }
                      onClick={() => confirmRoleChange('admin')}
                      disabled={selectedUser.role === 'admin'}
                      className={`justify-start ${
                        selectedUser.role === 'admin'
                          ? 'bg-brand-primary text-white'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Administrador - Control total
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TempAdminPage>
  )
}

export default UserManagement

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  MapPin,
  Key,
  Lock,
  Plus,
  Trash2,
  Home,
  Building,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

export default function ProfileEnhanced() {
  const { user, isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || '',
    phone: user?.profile?.phone || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'Casa',
      street: 'Calle Principal 123',
      city: 'Ciudad',
      state: 'Estado',
      postal_code: '12345',
      country: 'País',
      is_default: true,
    },
  ])

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              Debes iniciar sesión para ver tu perfil.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    if (!formData.full_name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre completo es requerido.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido actualizada correctamente.',
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden.',
        variant: 'destructive',
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada correctamente.',
      })
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error updating password:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cambiar la contraseña. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header del perfil */}
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                      <AvatarImage
                        src={user.profile?.avatar_url || user.avatar_url || ''}
                        alt={
                          user.profile?.full_name ||
                          user.full_name ||
                          user.email
                        }
                      />
                      <AvatarFallback className="bg-white text-green-600 text-xl font-bold">
                        {user.profile?.full_name
                          ? getInitials(user.profile.full_name)
                          : user.full_name
                          ? getInitials(user.full_name)
                          : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-white border-2 border-green-600 hover:bg-green-50"
                    >
                      <Camera className="h-3 w-3 text-green-600" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                      {user.profile?.full_name || user.full_name || 'Usuario'}
                    </h1>
                    <p className="text-green-100 mt-1">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-3">
                      <Badge
                        variant="secondary"
                        className={`${
                          isAdmin
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white text-green-600'
                        } font-semibold`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {isAdmin ? 'Administrador' : 'Cliente'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal con tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
              <TabsTrigger
                value="personal"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Información Personal</span>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>Direcciones</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center space-x-2"
              >
                <Key className="h-4 w-4" />
                <span>Seguridad</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab de Información Personal */}
            <TabsContent value="personal">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-green-600" />
                        <span>Información Personal</span>
                      </CardTitle>
                      <CardDescription>
                        Actualiza tu información personal y de contacto
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {isEditing ? (
                        <X className="h-4 w-4 mr-2" />
                      ) : (
                        <Edit className="h-4 w-4 mr-2" />
                      )}
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="full_name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Nombre Completo
                      </Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="border-gray-300 focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        value={formData.email}
                        disabled
                        className="bg-gray-50 border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={!isEditing}
                        className="border-gray-300 focus:border-green-500"
                        placeholder="Número de teléfono"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-300"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Direcciones */}
            <TabsContent value="addresses">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span>Mis Direcciones</span>
                      </CardTitle>
                      <CardDescription>
                        Gestiona tus direcciones de envío y facturación
                      </CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Dirección
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {addresses.map(address => (
                      <Card
                        key={address.id}
                        className="border-2 border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                {address.type === 'home' ? (
                                  <Home className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Building className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {address.name}
                                  </h3>
                                  {address.is_default && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-700"
                                    >
                                      Principal
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mt-1">
                                  {address.street}
                                </p>
                                <p className="text-gray-600">
                                  {address.city}, {address.state}{' '}
                                  {address.postal_code}
                                </p>
                                <p className="text-gray-600">
                                  {address.country}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Seguridad */}
            <TabsContent value="security">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    <span>Seguridad de la Cuenta</span>
                  </CardTitle>
                  <CardDescription>
                    Cambia tu contraseña y gestiona la seguridad de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Contraseña Actual
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={e =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-red-500"
                        placeholder="Ingresa tu contraseña actual"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Nueva Contraseña
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={e =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-red-500"
                        placeholder="Ingresa tu nueva contraseña"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Confirmar Nueva Contraseña
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={e =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-red-500"
                        placeholder="Confirma tu nueva contraseña"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleChangePassword}
                      disabled={loading || !passwordData.newPassword}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

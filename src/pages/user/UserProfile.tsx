import React, { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import Breadcrumbs from '@/components/ui/breadcrumbs'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import {
  User,
  MapPin,
  Key,
  Lock,
  Plus,
  Trash2,
  Home,
  Building,
  Edit,
  Save,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
  Star,
  Camera,
  CheckCircle,
  X,
} from 'lucide-react'
import {
  colors,
  spacing,
  typography,
  shadows,
  transitions,
} from '@/utils/design-system'

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  label: string
  address: string
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

const UserProfile = () => {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const breadcrumbs = useBreadcrumbs()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || user?.full_name || '',
    phone: user?.profile?.phone || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [newAddress, setNewAddress] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    label: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false,
  })

  // Calcular completitud del perfil
  const getProfileCompletion = () => {
    const fields = [
      formData.full_name,
      formData.phone,
      formData.email,
      user?.profile?.avatar_url,
    ]
    const completedFields = fields.filter(Boolean).length
    return Math.round((completedFields / fields.length) * 100)
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
        .eq('id', user?.id)

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

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 8 caracteres.',
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

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.address || !newAddress.city) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos obligatorios.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.from('addresses').insert([
        {
          user_id: user?.id,
          ...newAddress,
        },
      ])

      if (error) throw error

      toast({
        title: 'Dirección agregada',
        description: 'La nueva dirección ha sido guardada correctamente.',
      })

      setNewAddress({
        type: 'home',
        label: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        is_default: false,
      })
      setShowAddressForm(false)
    } catch (error) {
      console.error('Error adding address:', error)
      toast({
        title: 'Error',
        description: 'No se pudo agregar la dirección. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header rediseñado con RockBros branding */}
      <Card className="border-0 shadow-lg" style={{ boxShadow: shadows.lg }}>
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar mejorado */}
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: colors.primary }}
                >
                  {user?.profile?.avatar_url ? (
                    <img
                      src={user.profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    (user?.profile?.full_name || user?.full_name || 'U')
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <button
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white shadow-md border"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Camera
                    className="h-4 w-4"
                    style={{ color: colors.gray[600] }}
                  />
                </button>
              </div>

              <div>
                <h1
                  className="text-3xl font-bold"
                  style={{ color: colors.gray[900], ...typography.title }}
                >
                  {user?.profile?.full_name || user?.full_name || 'Usuario'}
                </h1>
                <p
                  className="text-lg flex items-center"
                  style={{ color: colors.gray[600] }}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  {user?.email}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge
                    variant={isAdmin ? 'default' : 'secondary'}
                    className={
                      isAdmin
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {isAdmin ? 'Administrador' : 'Cliente'}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Miembro desde 2024
                  </Badge>
                </div>
              </div>
            </div>

            {/* Completitud del perfil */}
            <div className="mt-6 lg:mt-0 lg:text-right">
              <div className="space-y-3">
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.gray[600] }}
                  >
                    Completitud del perfil
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {getProfileCompletion()}%
                  </p>
                </div>
                <Progress value={getProfileCompletion()} className="w-40" />
                <p className="text-xs" style={{ color: colors.gray[500] }}>
                  {getProfileCompletion() === 100
                    ? '¡Perfil completo!'
                    : 'Completa tu información'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs rediseñadas */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList
          className="grid w-full grid-cols-3 p-1"
          style={{ backgroundColor: colors.gray[50], borderRadius: '12px' }}
        >
          <TabsTrigger
            value="personal"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg"
            style={{ minHeight: '44px' }}
          >
            <User className="h-5 w-5" />
            <span>Información Personal</span>
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg"
            style={{ minHeight: '44px' }}
          >
            <MapPin className="h-5 w-5" />
            <span>Direcciones</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg"
            style={{ minHeight: '44px' }}
          >
            <Key className="h-5 w-5" />
            <span>Seguridad</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Información Personal */}
        <TabsContent value="personal">
          <Card style={{ boxShadow: shadows.sm }}>
            <CardHeader
              className="pb-6"
              style={{
                backgroundColor: colors.gray[50] + '80',
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <User
                      className="h-6 w-6"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <CardTitle
                      className="text-xl"
                      style={{ color: colors.gray[900] }}
                    >
                      Información Personal
                    </CardTitle>
                    <p className="text-sm" style={{ color: colors.gray[600] }}>
                      Actualiza tu información personal y de contacto
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile()
                    } else {
                      setIsEditing(true)
                    }
                  }}
                  disabled={loading}
                  className="text-white"
                  style={{
                    backgroundColor: isEditing
                      ? colors.success
                      : colors.primary,
                    minHeight: '44px',
                    transition: transitions.normal,
                  }}
                >
                  {loading ? (
                    'Guardando...'
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="full_name"
                      className="text-base font-semibold flex items-center"
                      style={{ color: colors.gray[700] }}
                    >
                      <User
                        className="h-4 w-4 mr-2"
                        style={{ color: colors.gray[500] }}
                      />
                      Nombre Completo *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={e =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="h-12 text-base"
                      style={{
                        backgroundColor: isEditing
                          ? colors.white
                          : colors.gray[50],
                        borderColor: isEditing
                          ? colors.primary
                          : colors.gray[200],
                        minHeight: '44px',
                      }}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-base font-semibold flex items-center"
                      style={{ color: colors.gray[700] }}
                    >
                      <Mail
                        className="h-4 w-4 mr-2"
                        style={{ color: colors.gray[500] }}
                      />
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="h-12 text-base cursor-not-allowed"
                      style={{
                        backgroundColor: colors.gray[50],
                        borderColor: colors.gray[200],
                        minHeight: '44px',
                      }}
                    />
                    <p className="text-sm" style={{ color: colors.gray[500] }}>
                      El correo electrónico no se puede modificar
                    </p>
                  </div>

                  <div className="space-y-3 lg:col-span-2">
                    <Label
                      htmlFor="phone"
                      className="text-base font-semibold flex items-center"
                      style={{ color: colors.gray[700] }}
                    >
                      <Phone
                        className="h-4 w-4 mr-2"
                        style={{ color: colors.gray[500] }}
                      />
                      Número de Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="h-12 text-base"
                      style={{
                        backgroundColor: isEditing
                          ? colors.white
                          : colors.gray[50],
                        borderColor: isEditing
                          ? colors.primary
                          : colors.gray[200],
                        minHeight: '44px',
                      }}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div
                    className="flex justify-end space-x-3 pt-6"
                    style={{ borderTop: `1px solid ${colors.gray[200]}` }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          full_name:
                            user?.profile?.full_name || user?.full_name || '',
                          phone: user?.profile?.phone || '',
                          email: user?.email || '',
                        })
                      }}
                      style={{
                        minHeight: '44px',
                        borderColor: colors.gray[300],
                        color: colors.gray[700],
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="text-white"
                      style={{
                        backgroundColor: colors.success,
                        minHeight: '44px',
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Direcciones */}
        <TabsContent value="addresses">
          <Card style={{ boxShadow: shadows.sm }}>
            <CardHeader
              className="pb-6"
              style={{
                backgroundColor: colors.gray[50] + '80',
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <MapPin
                      className="h-6 w-6"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <div>
                    <CardTitle
                      className="text-xl"
                      style={{ color: colors.gray[900] }}
                    >
                      Mis Direcciones
                    </CardTitle>
                    <p className="text-sm" style={{ color: colors.gray[600] }}>
                      Gestiona tus direcciones de envío y facturación
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowAddressForm(true)}
                  className="text-white"
                  style={{
                    backgroundColor: colors.primary,
                    minHeight: '44px',
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Dirección
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {showAddressForm ? (
                <div
                  className="space-y-6 p-6 rounded-lg"
                  style={{
                    backgroundColor: colors.gray[50],
                    border: `1px solid ${colors.gray[200]}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: colors.gray[900] }}
                    >
                      Nueva Dirección
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        className="text-base font-semibold"
                        style={{ color: colors.gray[700] }}
                      >
                        Etiqueta *
                      </Label>
                      <Input
                        value={newAddress.label}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            label: e.target.value,
                          })
                        }
                        placeholder="Casa, Trabajo, etc."
                        style={{ minHeight: '44px' }}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        className="text-base font-semibold"
                        style={{ color: colors.gray[700] }}
                      >
                        Ciudad *
                      </Label>
                      <Input
                        value={newAddress.city}
                        onChange={e =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder="Bogotá, Medellín, etc."
                        style={{ minHeight: '44px' }}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <Label
                        className="text-base font-semibold"
                        style={{ color: colors.gray[700] }}
                      >
                        Dirección Completa *
                      </Label>
                      <Input
                        value={newAddress.address}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            address: e.target.value,
                          })
                        }
                        placeholder="Calle 123 #45-67, Barrio, etc."
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddressForm(false)}
                      style={{ minHeight: '44px' }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddAddress}
                      disabled={loading}
                      className="text-white"
                      style={{
                        backgroundColor: colors.primary,
                        minHeight: '44px',
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar Dirección'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="text-center py-16 rounded-lg border-2 border-dashed"
                  style={{
                    backgroundColor: colors.gray[50],
                    borderColor: colors.gray[200],
                  }}
                >
                  <MapPin
                    className="h-20 w-20 mx-auto mb-6"
                    style={{ color: colors.gray[300] }}
                  />
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ color: colors.gray[600] }}
                  >
                    Sin direcciones guardadas
                  </h3>
                  <p
                    className="mb-6 text-base max-w-md mx-auto"
                    style={{ color: colors.gray[500] }}
                  >
                    Agrega una dirección para facilitar el proceso de compra y
                    envío de tus productos RockBros
                  </p>
                  <Button
                    onClick={() => setShowAddressForm(true)}
                    className="text-white"
                    style={{
                      backgroundColor: colors.primary,
                      minHeight: '44px',
                    }}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Primera Dirección
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Seguridad */}
        <TabsContent value="security">
          <Card style={{ boxShadow: shadows.sm }}>
            <CardHeader
              className="pb-6"
              style={{
                backgroundColor: colors.gray[50] + '80',
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${colors.error}20` }}
                >
                  <Shield className="h-6 w-6" style={{ color: colors.error }} />
                </div>
                <div>
                  <CardTitle
                    className="text-xl"
                    style={{ color: colors.gray[900] }}
                  >
                    Seguridad de la Cuenta
                  </CardTitle>
                  <p className="text-sm" style={{ color: colors.gray[600] }}>
                    Cambia tu contraseña y gestiona la seguridad de tu cuenta
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="max-w-lg space-y-8">
                <div
                  className="rounded-lg p-4"
                  style={{
                    backgroundColor: colors.warning + '20',
                    border: `1px solid ${colors.warning}40`,
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle
                      className="h-5 w-5 mt-0.5"
                      style={{ color: colors.warning }}
                    />
                    <div>
                      <h4
                        className="font-medium"
                        style={{ color: colors.gray[800] }}
                      >
                        Recomendaciones de Seguridad
                      </h4>
                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.gray[700] }}
                      >
                        Use una contraseña fuerte de al menos 8 caracteres con
                        mayúsculas, minúsculas, números y símbolos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="currentPassword"
                      className="text-base font-semibold flex items-center"
                      style={{ color: colors.gray[700] }}
                    >
                      <Lock
                        className="h-4 w-4 mr-2"
                        style={{ color: colors.gray[500] }}
                      />
                      Contraseña Actual *
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
                      placeholder="Ingresa tu contraseña actual"
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="newPassword"
                      className="text-base font-semibold flex items-center"
                      style={{ color: colors.gray[700] }}
                    >
                      <Key
                        className="h-4 w-4 mr-2"
                        style={{ color: colors.gray[500] }}
                      />
                      Nueva Contraseña *
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
                      placeholder="Ingresa tu nueva contraseña"
                      style={{ minHeight: '44px' }}
                    />
                    {passwordData.newPassword &&
                      passwordData.newPassword.length < 8 && (
                        <p className="text-sm" style={{ color: colors.error }}>
                          La contraseña debe tener al menos 8 caracteres
                        </p>
                      )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-base font-semibold flex items-center"
                      style={{ color: colors.gray[700] }}
                    >
                      <Shield
                        className="h-4 w-4 mr-2"
                        style={{ color: colors.gray[500] }}
                      />
                      Confirmar Nueva Contraseña *
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
                      placeholder="Confirma tu nueva contraseña"
                      style={{ minHeight: '44px' }}
                    />
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !==
                        passwordData.confirmPassword && (
                        <p className="text-sm" style={{ color: colors.error }}>
                          Las contraseñas no coinciden
                        </p>
                      )}
                  </div>
                </div>

                <div
                  className="flex justify-end pt-6"
                  style={{ borderTop: `1px solid ${colors.gray[200]}` }}
                >
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      loading ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword !==
                        passwordData.confirmPassword ||
                      passwordData.newPassword.length < 8
                    }
                    className="text-white"
                    style={{
                      backgroundColor: colors.error,
                      minHeight: '44px',
                    }}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {loading ? 'Cambiando Contraseña...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default UserProfile

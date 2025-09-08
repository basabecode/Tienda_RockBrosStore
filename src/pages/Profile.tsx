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
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'

export default function Profile() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || '',
    phone: user?.profile?.phone || '',
    email: user?.email || '',
  })

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>
                Necesitas iniciar sesión para acceder a tu perfil.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Implementar actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular API call

      toast({
        title: 'Perfil actualizado',
        description: 'Tu información se ha guardado correctamente',
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.profile?.full_name || '',
      phone: user?.profile?.phone || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Mi Perfil</h1>
              <p className="text-muted-foreground">
                Gestiona tu información personal y configuración de cuenta
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Información Principal */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información personal y de contacto
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                      className="pl-10"
                      disabled={!isEditing}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      className="pl-10"
                      disabled
                      placeholder="tu@email.com"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El email no se puede cambiar por motivos de seguridad
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="pl-10"
                      disabled={!isEditing}
                      placeholder="+34 123 456 789"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Cuenta */}
            <div className="space-y-6">
              {/* Avatar y Rol */}
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user.profile?.avatar_url || ''}
                        alt={user.profile?.full_name || user.email}
                      />
                      <AvatarFallback className="text-2xl">
                        {user.profile?.full_name
                          ? getInitials(user.profile.full_name)
                          : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={() => {
                        toast({
                          title: 'Función en desarrollo',
                          description:
                            'La subida de avatar estará disponible pronto',
                        })
                      }}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <h3 className="font-medium">
                      {user.profile?.full_name || 'Usuario'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    {isAdmin && (
                      <Badge variant="secondary" className="mt-2">
                        <Shield className="w-3 h-3 mr-1" />
                        Administrador
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pedidos realizados</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Productos favoritos</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Miembro desde</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(
                        user.profile?.created_at || ''
                      ).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

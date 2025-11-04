import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Settings,
  Store,
  Mail,
  Globe,
  Shield,
  Bell,
  Palette,
  Save,
  Database,
  Key,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // Configuración general
    storeName: 'RockBros Store',
    storeDescription: 'Tu tienda de ciclismo y aventuras',
    storeEmail: 'info@rockbros.com',
    storePhone: '+1 (555) 123-4567',

    // Notificaciones
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,

    // Seguridad
    requireEmailVerification: true,
    allowGuestCheckout: false,
    twoFactorAuth: false,

    // Apariencia
    primaryColor: '#22c55e',
    accentColor: '#3b82f6',
    darkMode: false,
  })

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    console.log('Guardando configuración:', settings)
    // Aquí se guardarían los settings en Supabase
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gris-oscuro">Configuración</h1>
          <p className="text-gris-medio mt-2">
            Gestiona la configuración de RockBros Store
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-brand-primary hover:bg-brand-secondary text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2 text-brand-primary" />
                Información de la Tienda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nombre de la tienda</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={e =>
                      handleSettingChange('storeName', e.target.value)
                    }
                    className="bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email de contacto</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    className="bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                    onChange={e =>
                      handleSettingChange('storeEmail', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeDescription">Descripción</Label>
                <Textarea
                  id="storeDescription"
                  value={settings.storeDescription}
                  onChange={e =>
                    handleSettingChange('storeDescription', e.target.value)
                  }
                  rows={3}
                  className="bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone">Teléfono</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={e =>
                    handleSettingChange('storePhone', e.target.value)
                  }
                  className="bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-brand-primary" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificaciones por email</Label>
                  <p className="text-sm text-gris-medio">
                    Recibe emails sobre eventos importantes de la tienda
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={checked =>
                    handleSettingChange('emailNotifications', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Alertas de pedidos</Label>
                  <p className="text-sm text-gris-medio">
                    Notificaciones cuando se reciben nuevos pedidos
                  </p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={checked =>
                    handleSettingChange('orderNotifications', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Alertas de inventario</Label>
                  <p className="text-sm text-gris-medio">
                    Notificaciones cuando los productos están por agotarse
                  </p>
                </div>
                <Switch
                  checked={settings.inventoryAlerts}
                  onCheckedChange={checked =>
                    handleSettingChange('inventoryAlerts', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-brand-primary" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Verificación de email requerida</Label>
                  <p className="text-sm text-gris-medio">
                    Los usuarios deben verificar su email antes de usar la
                    cuenta
                  </p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={checked =>
                    handleSettingChange('requireEmailVerification', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Permitir compra como invitado</Label>
                  <p className="text-sm text-gris-medio">
                    Los usuarios pueden comprar sin registrarse
                  </p>
                </div>
                <Switch
                  checked={settings.allowGuestCheckout}
                  onCheckedChange={checked =>
                    handleSettingChange('allowGuestCheckout', checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Autenticación de dos factores</Label>
                  <p className="text-sm text-gris-medio">
                    Requiere verificación adicional para administradores
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={checked =>
                    handleSettingChange('twoFactorAuth', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2 text-brand-primary" />
                Personalización de Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Color principal</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={e =>
                        handleSettingChange('primaryColor', e.target.value)
                      }
                      className="w-16 h-10 bg-white border-gris-medio/30"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={e =>
                        handleSettingChange('primaryColor', e.target.value)
                      }
                      className="flex-1 bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Color de acento</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={e =>
                        handleSettingChange('accentColor', e.target.value)
                      }
                      className="w-16 h-10 bg-white border-gris-medio/30"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={e =>
                        handleSettingChange('accentColor', e.target.value)
                      }
                      className="flex-1 bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Modo oscuro</Label>
                  <p className="text-sm text-gris-medio">
                    Activa el tema oscuro por defecto
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={checked =>
                    handleSettingChange('darkMode', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integraciones */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-brand-primary" />
                  Base de Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Supabase</p>
                      <p className="text-sm text-gris-medio">
                        Conectado y funcionando
                      </p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2 text-brand-primary" />
                  APIs Externas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Procesador de Pagos</p>
                      <p className="text-sm text-gris-medio">No configurado</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
                    >
                      Configurar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Servicio de Email</p>
                      <p className="text-sm text-gris-medio">No configurado</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
                    >
                      Configurar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-gris-medio">No configurado</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
                    >
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminSettings

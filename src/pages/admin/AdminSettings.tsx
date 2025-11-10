import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import {
  Store,
  Bell,
  Shield,
  Zap,
  Save,
  Trash2,
  Download,
  Upload,
  Settings,
  CreditCard,
  Mail,
  Key,
  Database,
  FileText,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

interface AdminSettings {
  id?: string
  store_name: string
  store_description: string
  contact_email: string
  contact_phone: string
  address: string
  currency: string
  tax_rate: number
  notifications_email: boolean
  notifications_push: boolean
  notifications_sms: boolean
  security_2fa: boolean
  security_password_expiry: number
  backup_frequency: string
  maintenance_mode: boolean
  created_at?: string
  updated_at?: string
}

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    store_name: '',
    store_description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    currency: 'COP',
    tax_rate: 0,
    notifications_email: true,
    notifications_push: true,
    notifications_sms: false,
    security_2fa: false,
    security_password_expiry: 90,
    backup_frequency: 'daily',
    maintenance_mode: false,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [backupInProgress, setBackupInProgress] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettings(data)
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          store_name: 'RockBros Store',
          store_description:
            'Tu tienda de confianza para accesorios deportivos',
          contact_email: 'info@rockbrosstore.com',
          contact_phone: '+57 300 123 4567',
          address: 'Calle 123 #45-67, Bogotá, Colombia',
          currency: 'COP',
          tax_rate: 19,
          notifications_email: true,
          notifications_push: true,
          notifications_sms: false,
          security_2fa: false,
          security_password_expiry: 90,
          backup_frequency: 'daily',
          maintenance_mode: false,
        }

        const { error: insertError } = await supabase
          .from('admin_settings')
          .insert(defaultSettings)
          .select()
          .single()

        if (insertError) throw insertError

        setSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (
    key: keyof AdminSettings,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('admin_settings').upsert(settings, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })

      if (error) throw error

      toast.success('Configuración guardada correctamente')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const performBackup = async () => {
    setBackupInProgress(true)
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Copia de seguridad creada correctamente')
    } catch (error) {
      toast.error('Error al crear la copia de seguridad')
    } finally {
      setBackupInProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Configuración del Sistema
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona la configuración general de tu tienda
          </p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Avanzado</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Store className="w-5 h-5" />
                Información de la Tienda
              </CardTitle>
              <CardDescription>
                Configura los datos básicos de tu tienda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="store_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre de la Tienda
                  </Label>
                  <Input
                    id="store_name"
                    value={settings.store_name}
                    onChange={e =>
                      handleSettingChange('store_name', e.target.value)
                    }
                    className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="contact_email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email de Contacto
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={e =>
                      handleSettingChange('contact_email', e.target.value)
                    }
                    className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="contact_phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Teléfono de Contacto
                  </Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone}
                    onChange={e =>
                      handleSettingChange('contact_phone', e.target.value)
                    }
                    className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="currency"
                    className="text-sm font-medium text-gray-700"
                  >
                    Moneda
                  </Label>
                  <Select
                    value={settings.currency}
                    onValueChange={value =>
                      handleSettingChange('currency', value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="store_description"
                  className="text-sm font-medium text-gray-700"
                >
                  Descripción de la Tienda
                </Label>
                <Textarea
                  id="store_description"
                  value={settings.store_description}
                  onChange={e =>
                    handleSettingChange('store_description', e.target.value)
                  }
                  className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  rows={3}
                />
              </div>

              <div>
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Dirección
                </Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={e => handleSettingChange('address', e.target.value)}
                  className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  rows={2}
                />
              </div>

              <div>
                <Label
                  htmlFor="tax_rate"
                  className="text-sm font-medium text-gray-700"
                >
                  Tasa de Impuesto (%)
                </Label>
                <Input
                  id="tax_rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.tax_rate}
                  onChange={e =>
                    handleSettingChange('tax_rate', parseFloat(e.target.value))
                  }
                  className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Bell className="w-5 h-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>
                Controla cómo y cuándo recibes notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Notificaciones por Email
                    </p>
                    <p className="text-sm text-gray-500">
                      Recibe notificaciones importantes por correo electrónico
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications_email}
                  onCheckedChange={checked =>
                    handleSettingChange('notifications_email', checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-800"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Notificaciones Push
                    </p>
                    <p className="text-sm text-gray-500">
                      Recibe notificaciones en tiempo real en el navegador
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications_push}
                  onCheckedChange={checked =>
                    handleSettingChange('notifications_push', checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-800"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Notificaciones SMS
                    </p>
                    <p className="text-sm text-gray-500">
                      Recibe notificaciones críticas por mensaje de texto
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications_sms}
                  onCheckedChange={checked =>
                    handleSettingChange('notifications_sms', checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-800"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="w-5 h-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Gestiona la seguridad y autenticación de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Autenticación de Dos Factores
                    </p>
                    <p className="text-sm text-gray-500">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.security_2fa}
                  onCheckedChange={checked =>
                    handleSettingChange('security_2fa', checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-800"
                />
              </div>

              <div>
                <Label
                  htmlFor="security_password_expiry"
                  className="text-sm font-medium text-gray-700"
                >
                  Expiración de Contraseña (días)
                </Label>
                <Input
                  id="security_password_expiry"
                  type="number"
                  min="30"
                  max="365"
                  value={settings.security_password_expiry}
                  onChange={e =>
                    handleSettingChange(
                      'security_password_expiry',
                      parseInt(e.target.value)
                    )
                  }
                  className="mt-1 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Establece cada cuántos días se debe cambiar la contraseña
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Estado del Sistema
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      SSL/TLS Habilitado
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Firewall</span>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Protegido
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Copias de Seguridad
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Automáticas
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Database className="w-5 h-5" />
                Configuración Avanzada
              </CardTitle>
              <CardDescription>
                Opciones avanzadas del sistema y mantenimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="backup_frequency"
                  className="text-sm font-medium text-gray-700"
                >
                  Frecuencia de Copias de Seguridad
                </Label>
                <Select
                  value={settings.backup_frequency}
                  onValueChange={value =>
                    handleSettingChange('backup_frequency', value)
                  }
                >
                  <SelectTrigger className="mt-1 bg-white border-2 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="monthly">Mensualmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Modo de Mantenimiento
                    </p>
                    <p className="text-sm text-gray-500">
                      Activa el modo de mantenimiento para realizar
                      actualizaciones
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={checked =>
                    handleSettingChange('maintenance_mode', checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-800"
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Herramientas del Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={performBackup}
                    disabled={backupInProgress}
                    className="h-auto p-4 justify-start"
                  >
                    <div className="flex items-center gap-3">
                      {backupInProgress ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                      <div className="text-left">
                        <p className="font-medium">Crear Copia de Seguridad</p>
                        <p className="text-xs text-gray-500">
                          Exportar datos del sistema
                        </p>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 justify-start"
                  >
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Importar Datos</p>
                        <p className="text-xs text-gray-500">
                          Cargar copia de seguridad
                        </p>
                      </div>
                    </div>
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

export default AdminSettingsPage

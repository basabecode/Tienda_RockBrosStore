import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Settings,
  Package,
  Heart,
  MapPin,
  ArrowLeft,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function AccountRedirect() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    // Auto-redirigir después de 3 segundos si no hay interacción
    const timer = setTimeout(() => {
      navigate('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  const quickActions = isAdmin
    ? [
        {
          icon: Shield,
          title: 'Panel de Administración',
          description: 'Gestionar tienda y usuarios',
          action: () => navigate('/admin'),
          color:
            'bg-brand-primary/5 border-brand-primary/20 hover:bg-brand-primary/10',
        },
        {
          icon: User,
          title: 'Mi Perfil Personal',
          description: 'Configuración de mi cuenta',
          action: () => navigate('/cuenta/perfil'),
          color: 'bg-green-50 border-green-200 hover:bg-green-100',
        },
      ]
    : [
        {
          icon: User,
          title: 'Mi Perfil',
          description: 'Información personal y configuración',
          action: () => navigate('/cuenta/perfil'),
          color:
            'bg-brand-primary/5 border-brand-primary/20 hover:bg-brand-primary/10',
        },
        {
          icon: Package,
          title: 'Mis Pedidos',
          description: 'Historial de compras y seguimiento',
          action: () => navigate('/cuenta/pedidos'),
          color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        },
        {
          icon: Heart,
          title: 'Lista de Deseos',
          description: 'Productos guardados como favoritos',
          action: () => navigate('/cuenta/favoritos'),
          color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
        },
        {
          icon: MapPin,
          title: 'Direcciones',
          description: 'Gestionar direcciones de envío',
          action: () => navigate('/cuenta/direcciones'),
          color: 'bg-green-50 border-green-200 hover:bg-green-100',
        },
        {
          icon: Settings,
          title: 'Seguridad',
          description: 'Cambiar contraseña y configuración',
          action: () => navigate('/cuenta/seguridad'),
          color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        },
      ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.profile?.full_name || user?.full_name || 'Cliente'}!
            👋
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isAdmin
              ? 'Como administrador, puedes acceder tanto al panel de administración como a tus configuraciones personales.'
              : 'Usa el menú de tu avatar en cualquier momento para acceder rápidamente a estas funciones.'}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 ${action.color} border-2`}
                onClick={action.action}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/70">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                💡
              </div>
              <span>Consejo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              Puedes acceder a todas estas funciones desde el{' '}
              <strong>menú de tu avatar</strong> en la esquina superior derecha
              de cualquier página. ¡No necesitas venir aquí cada vez!
            </p>
            <div className="mt-4 text-xs text-gray-500">
              Serás redirigido automáticamente a la tienda en unos segundos...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

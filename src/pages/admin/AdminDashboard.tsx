import { useAuth } from '@/hooks/use-auth'
import { useAdminData } from '@/hooks/use-admin-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  Package,
  BarChart3,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Shield,
  Store,
  Clock,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Usar hook optimizado para datos de admin
  const { stats, isLoading, error } = useAdminData()

  // Protección de acceso admin
  if (!user || !isAdmin) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder al panel de administración.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">
                  Error al cargar el panel de administración
                </h3>
                <p className="text-red-700 mt-1">
                  {error instanceof Error
                    ? error.message
                    : 'Ha ocurrido un error inesperado'}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Acciones rápidas
  const quickActions = [
    {
      title: 'Gestionar Productos',
      description: 'Agregar, editar o eliminar productos',
      icon: Package,
      action: () => navigate('/admin/productos'),
      color: 'bg-verde-bosque hover:bg-verde-neon text-white',
    },
    {
      title: 'Ver Usuarios',
      description: 'Administrar usuarios registrados',
      icon: Users,
      action: () => navigate('/admin/usuarios'),
      color: 'bg-gris-oscuro hover:bg-verde-bosque text-white',
    },
    {
      title: 'Análisis de Ventas',
      description: 'Reportes y métricas detalladas',
      icon: BarChart3,
      action: () => navigate('/admin/ventas'),
      color:
        'bg-verde-neon hover:bg-verde-bosque text-gris-oscuro hover:text-white',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gris-oscuro">
            Panel de Administración
          </h1>
          <p className="text-gris-medio mt-2">
            Bienvenido, {user?.email}. Gestiona tu tienda desde aquí.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-verde-neon/10 text-verde-bosque border-verde-neon/30">
            <Shield className="h-3 w-3 mr-1" />
            Administrador
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-white/50">
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-1/2 bg-gris-medio/20 rounded"></div>
                  <div className="h-8 w-3/4 bg-gris-medio/20 rounded"></div>
                  <div className="h-4 w-full bg-gris-medio/20 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estadísticas principales */}
      {stats && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Productos */}
          <Card className="bg-gradient-to-br from-verde-bosque to-verde-neon text-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Total Productos
                  </p>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="h-12 w-12 text-white/60" />
              </div>
            </CardContent>
          </Card>

          {/* Total Usuarios */}
          <Card className="bg-white border-gris-medio/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gris-medio">
                    Total Usuarios
                  </p>
                  <p className="text-3xl font-bold text-gris-oscuro">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="h-12 w-12 text-verde-bosque" />
              </div>
            </CardContent>
          </Card>

          {/* Pedidos */}
          <Card className="bg-white border-gris-medio/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gris-medio">
                    Pedidos Totales
                  </p>
                  <p className="text-3xl font-bold text-gris-oscuro">
                    {stats.totalOrders}
                  </p>
                  {stats?.recentOrders &&
                    stats.recentOrders.filter(
                      order => order.status === 'pending'
                    ).length > 0 && (
                      <p className="text-sm text-orange-600">
                        {
                          stats.recentOrders.filter(
                            order => order.status === 'pending'
                          ).length
                        }{' '}
                        pendientes
                      </p>
                    )}
                </div>
                <ShoppingCart className="h-12 w-12 text-verde-bosque" />
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="bg-gradient-to-br from-gris-oscuro to-gris-medio text-white shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold">
                    ${stats?.totalRevenue?.toLocaleString('es-CO') || '0'} COP
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-verde-neon" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map(action => {
          const Icon = action.icon
          return (
            <Card
              key={action.title}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-gris-medio/20"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} transition-colors duration-200`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gris-oscuro mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gris-medio">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actividad reciente */}
      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedidos recientes */}
          <Card className="bg-white border-gris-medio/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gris-oscuro">
                <Clock className="h-5 w-5 text-verde-bosque" />
                <span>Pedidos Recientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gris-oscuro/70"
                  >
                    <div>
                      <p className="font-medium text-sm text-white">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-white/80">
                        {order.profiles?.email || 'Usuario desconocido'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-white">
                        ${order.total.toLocaleString('es-CO')} COP
                      </p>
                      <Badge
                        variant={
                          order.status === 'completed' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productos con poco stock */}
          <Card className="bg-white border-gris-medio/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gris-oscuro">
                <Package className="h-5 w-5 text-orange-500" />
                <span>Stock Bajo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.lowStockProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-orange-50/50"
                    >
                      <div>
                        <p className="font-medium text-sm text-gris-oscuro">
                          {product.name}
                        </p>
                        <p className="text-xs text-gris-medio">
                          ${product.price.toLocaleString('es-CO')} COP
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {product.stock} unidades
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gris-medio text-center py-4">
                  Todos los productos tienen stock suficiente
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

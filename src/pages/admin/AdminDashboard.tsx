import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Package,
  BarChart3,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Shield,
  Store,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  Edit,
  MoreHorizontal,
  Calendar,
  Star,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Obtener estadísticas reales de la base de datos
  const {
    data: dashboardStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Obtener conteo de productos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Obtener conteo de usuarios
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      // Obtener pedidos del último mes
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      const { data: recentOrders } = await supabase
        .from('orders')
        .select('total, created_at')
        .gte('created_at', lastMonth.toISOString())

      // Obtener productos con stock bajo
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 10)

      const totalRevenue =
        recentOrders?.reduce((sum, order) => sum + order.total, 0) || 0
      const totalOrders = recentOrders?.length || 0

      return {
        totalRevenue,
        totalOrders,
        totalProducts: productsCount || 0,
        totalUsers: usersCount || 0,
        lowStockCount: lowStockCount || 0,
      }
    },
  })

  // Obtener pedidos recientes reales
  const { data: recentOrders = [] } = useQuery({
    queryKey: ['recent-orders-dashboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select(
          `
          id, total, status, created_at,
          user_profiles(full_name, email, avatar_url)
        `
        )
        .order('created_at', { ascending: false })
        .limit(4)

      return data || []
    },
  })

  // Obtener productos top reales
  const { data: topProducts = [] } = useQuery({
    queryKey: ['top-products-dashboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, sold_count, price, main_image')
        .order('sold_count', { ascending: false })
        .limit(3)

      return data || []
    },
  })

  // Formatear números para mostrar
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // KPIs con datos reales de la base de datos
  const kpiData = dashboardStats
    ? [
        {
          title: 'Ingresos del Mes',
          value: formatCurrency(dashboardStats.totalRevenue),
          icon: DollarSign,
          description: 'Total del mes actual',
        },
        {
          title: 'Pedidos',
          value: dashboardStats.totalOrders.toString(),
          icon: ShoppingCart,
          description: 'este mes',
        },
        {
          title: 'Productos Totales',
          value: dashboardStats.totalProducts.toString(),
          icon: Package,
          description: 'en catálogo',
        },
        {
          title: 'Usuarios Registrados',
          value: dashboardStats.totalUsers.toString(),
          icon: Users,
          description: 'total registrados',
        },
      ]
    : []

  // Función para calcular tiempo relativo
  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const orderTime = new Date(dateString)
    const diffInMinutes = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 60) return `${diffInMinutes} min`
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hora${
        Math.floor(diffInMinutes / 60) !== 1 ? 's' : ''
      }`
    return `${Math.floor(diffInMinutes / 1440)} día${
      Math.floor(diffInMinutes / 1440) !== 1 ? 's' : ''
    }`
  }

  // Procesar pedidos recientes reales
  const processedRecentOrders = recentOrders.map(order => {
    const userProfile = Array.isArray(order.user_profiles)
      ? order.user_profiles[0]
      : order.user_profiles
    return {
      id: order.id.slice(-8),
      customer: userProfile?.full_name || 'Usuario Anónimo',
      email: userProfile?.email || 'sin-email@ejemplo.com',
      total: order.total,
      status: order.status,
      time: getRelativeTime(order.created_at),
      avatar:
        (userProfile?.full_name || 'U').charAt(0).toUpperCase() +
        ((userProfile?.full_name || 'U').split(' ')[1] || 'U')
          .charAt(0)
          .toUpperCase(),
    }
  })

  // Procesar productos top reales
  const processedTopProducts = topProducts.map(product => ({
    id: product.id,
    name: product.name,
    sales: product.sold_count || 0,
    revenue: (product.sold_count || 0) * product.price,
    image: product.main_image || null,
  }))

  // Protección de acceso admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder al panel de administración.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-verde-bosque mx-auto mb-4" />
          <p className="text-gris-medio font-medium">
            Cargando panel de administración...
          </p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-lg border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">
                  Error al cargar el panel
                </h3>
                <p className="text-red-700 mt-1 text-sm">
                  {error instanceof Error ? error.message : 'Error inesperado'}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
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

  // Función para obtener el color del estado del pedido
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-verde-bosque/10 text-verde-bosque border-verde-bosque/30'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-gris-medio/10 text-gris-oscuro border-gris-medio/30'
    }
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'processing':
        return 'Procesando'
      case 'shipped':
        return 'Enviado'
      case 'pending':
        return 'Pendiente'
      default:
        return status
    }
  }

  return (
    <div>
      {/* Header con paleta corporativa RockBros */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-verde-bosque to-verde-neon rounded-xl flex items-center justify-center shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gris-oscuro leading-tight">
              Dashboard
            </h1>
            <p className="text-gris-medio font-medium">
              Centro de control RockBros Store
            </p>
          </div>
          <div className="flex-1"></div>
          {/*<Badge
            variant="outline"
            className="bg-verde-neon/10 text-verde-bosque border-verde-neon/30 font-semibold"
          >
            <Activity className="w-3 h-3 mr-1" />
            En línea
          </Badge>*/}
        </div>

        {/* Saludo personalizado */}
        <div className="bg-gradient-to-r from-verde-neon/5 to-verde-bosque/5 border border-verde-neon/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gris-oscuro mb-2">
            ¡Hola, {user?.email?.split('@')[0]}! 👋
          </h2>
          <p className="text-gris-medio font-medium">
            Aquí tienes un resumen de tu tienda hoy -{' '}
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* KPIs con paleta corporativa RockBros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <Card
            key={index}
            className="border border-verde-neon/20 bg-white hover:shadow-lg hover:shadow-verde-bosque/10 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-start mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-verde-bosque/10 to-verde-neon/10 border border-verde-neon/20">
                  <kpi.icon className="h-6 w-6 text-verde-bosque" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gris-oscuro mb-2">
                  {kpi.value}
                </h3>
                <p className="text-sm font-semibold text-gris-oscuro mb-1">
                  {kpi.title}
                </p>
                <p className="text-xs text-gris-medio font-medium">
                  {kpi.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pedidos recientes con paleta corporativa */}
        <Card className="border border-verde-neon/20 bg-white shadow-lg">
          <CardHeader className="pb-4 border-b border-gris-medio/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gris-oscuro flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-verde-bosque" />
                <span>Pedidos Recientes</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/ventas')}
                className="text-verde-bosque hover:text-verde-neon hover:bg-verde-neon/10 font-semibold"
              >
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {processedRecentOrders.length > 0 ? (
              processedRecentOrders.map(order => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-verde-neon/5 to-transparent hover:from-verde-neon/10 transition-colors cursor-pointer border border-verde-neon/10"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-verde-bosque/10 text-verde-bosque text-sm font-semibold">
                        {order.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gris-oscuro">
                        #{order.id}
                      </p>
                      <p className="text-sm text-gris-oscuro">
                        {order.customer}
                      </p>
                      <p className="text-xs text-gris-medio">{order.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gris-oscuro">
                      {formatCurrency(order.total)}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getOrderStatusColor(order.status)}`}
                    >
                      {getOrderStatusText(order.status)}
                    </Badge>
                    <p className="text-xs text-gris-medio mt-1">
                      hace {order.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gris-medio mx-auto mb-4" />
                <p className="text-gris-medio font-medium">
                  No hay pedidos recientes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productos más vendidos con paleta corporativa */}
        <Card className="border border-verde-neon/20 bg-white shadow-lg">
          <CardHeader className="pb-4 border-b border-gris-medio/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gris-oscuro flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-verde-bosque" />
                <span>Productos Más Vendidos</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/productos')}
                className="text-verde-bosque hover:text-verde-neon hover:bg-verde-neon/10 font-semibold"
              >
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {processedTopProducts.length > 0 ? (
              processedTopProducts.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-verde-neon/5 to-transparent hover:from-verde-neon/10 transition-colors cursor-pointer border border-verde-neon/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-verde-bosque/10 rounded-lg flex items-center justify-center border border-verde-neon/20">
                      <Package className="h-6 w-6 text-verde-bosque" />
                    </div>
                    <div>
                      <p className="font-semibold text-gris-oscuro">
                        {product.name}
                      </p>
                      <p className="text-sm text-gris-medio">
                        {product.sales} vendidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gris-oscuro">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gris-medio mx-auto mb-4" />
                <p className="text-gris-medio font-medium">
                  No hay productos vendidos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas con paleta corporativa */}
      <div>
        <h3 className="text-lg font-bold text-gris-oscuro mb-4 flex items-center space-x-2">
          <Plus className="h-5 w-5 text-verde-bosque" />
          <span>Acciones Rápidas</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/admin/productos')}
            className="h-auto p-6 bg-gradient-to-br from-verde-bosque to-verde-neon hover:from-verde-bosque/90 hover:to-verde-neon/90 text-white justify-start group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Package className="h-6 w-6 mr-4 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-semibold text-lg">Gestionar Productos</div>
              <div className="text-sm text-white/90">
                Agregar, editar productos
              </div>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/admin/usuarios')}
            className="h-auto p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white justify-start group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Users className="h-6 w-6 mr-4 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-semibold text-lg">Ver Usuarios</div>
              <div className="text-sm text-white/90">Administrar clientes</div>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/admin/ventas')}
            className="h-auto p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white justify-start group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <BarChart3 className="h-6 w-6 mr-4 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-semibold text-lg">Análisis de Ventas</div>
              <div className="text-sm text-white/90">Reportes y métricas</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

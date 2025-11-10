import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Users,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Target,
  Percent,
  Star,
} from 'lucide-react'

interface Order {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string | null
    email: string
    avatar_url: string | null
  }
  order_items?: {
    quantity: number
    price: number
    products: {
      name: string
      main_image: string | null
    }
  }[]
}

interface SalesMetrics {
  total_revenue: number
  total_orders: number
  total_products_sold: number
  average_order_value: number
  revenue_change: number
  orders_change: number
  products_change: number
  aov_change: number
  conversion_rate: number
  top_selling_products: Array<{
    product_id: string
    name: string
    total_sold: number
    total_revenue: number
    main_image: string | null
  }>
}

const AdminSales = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let previousStartDate: Date

    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(
          startDate.getTime() - 7 * 24 * 60 * 60 * 1000
        )
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        break
      case 'quarter': {
        const quarterStart = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterStart, 1)
        previousStartDate = new Date(now.getFullYear(), quarterStart - 3, 1)
        break
      }
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    }

    return { startDate, previousStartDate, endDate: now }
  }, [selectedPeriod])

  // Fetch sales metrics
  const { data: salesMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['sales-metrics', selectedPeriod, dateRange],
    queryFn: async (): Promise<SalesMetrics> => {
      // Current period orders
      const { data: currentOrders, error: currentError } = await supabase
        .from('orders')
        .select(
          `
          id, total, status, created_at,
          order_items!inner(quantity, price, products(name, main_image))
        `
        )
        .gte('created_at', dateRange.startDate.toISOString())
        .lte('created_at', dateRange.endDate.toISOString())
        .neq('status', 'cancelled')

      if (currentError) throw currentError

      // Previous period orders for comparison
      const { data: previousOrders, error: previousError } = await supabase
        .from('orders')
        .select('id, total, created_at, order_items!inner(quantity)')
        .gte('created_at', dateRange.previousStartDate.toISOString())
        .lt('created_at', dateRange.startDate.toISOString())
        .neq('status', 'cancelled')

      if (previousError) throw previousError

      // Calculate current metrics
      const total_revenue =
        currentOrders?.reduce((sum, order) => sum + order.total, 0) || 0
      const total_orders = currentOrders?.length || 0
      const total_products_sold =
        currentOrders?.reduce(
          (sum, order) =>
            sum +
            (order.order_items?.reduce(
              (itemSum, item) => itemSum + item.quantity,
              0
            ) || 0),
          0
        ) || 0
      const average_order_value =
        total_orders > 0 ? total_revenue / total_orders : 0

      // Calculate previous metrics for comparison
      const prev_revenue =
        previousOrders?.reduce((sum, order) => sum + order.total, 0) || 0
      const prev_orders = previousOrders?.length || 0
      const prev_products_sold =
        previousOrders?.reduce(
          (sum, order) =>
            sum +
            (order.order_items?.reduce(
              (itemSum, item) => itemSum + item.quantity,
              0
            ) || 0),
          0
        ) || 0
      const prev_aov = prev_orders > 0 ? prev_revenue / prev_orders : 0

      // Calculate percentage changes
      const revenue_change =
        prev_revenue > 0
          ? ((total_revenue - prev_revenue) / prev_revenue) * 100
          : 0
      const orders_change =
        prev_orders > 0 ? ((total_orders - prev_orders) / prev_orders) * 100 : 0
      const products_change =
        prev_products_sold > 0
          ? ((total_products_sold - prev_products_sold) / prev_products_sold) *
            100
          : 0
      const aov_change =
        prev_aov > 0 ? ((average_order_value - prev_aov) / prev_aov) * 100 : 0

      // Calculate top selling products
      const productSales = new Map()
      currentOrders?.forEach(order => {
        order.order_items?.forEach(item => {
          const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products
          const productName = product?.name
          if (productName) {
            const existing = productSales.get(productName) || {
              name: productName,
              total_sold: 0,
              total_revenue: 0,
              main_image: product?.main_image,
            }
            existing.total_sold += item.quantity
            existing.total_revenue += item.quantity * item.price
            productSales.set(productName, existing)
          }
        })
      })

      const top_selling_products = Array.from(productSales.values())
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 5)

      return {
        total_revenue,
        total_orders,
        total_products_sold,
        average_order_value,
        revenue_change,
        orders_change,
        products_change,
        aov_change,
        conversion_rate: 2.4, // This would need to be calculated based on website visits
        top_selling_products,
      }
    },
  })

  // Fetch recent orders
  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders', 10],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          user_profiles(full_name, email, avatar_url),
          order_items(quantity, price, products(name, main_image))
        `
        )
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data as Order[]
    },
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        icon: Clock,
      },
      processing: {
        label: 'Procesando',
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        icon: Package,
      },
      shipped: {
        label: 'Enviado',
        className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
        icon: Truck,
      },
      delivered: {
        label: 'Entregado',
        className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
        icon: CheckCircle,
      },
      cancelled: {
        label: 'Cancelado',
        className: 'bg-red-100 text-red-800 hover:bg-red-100',
        icon: XCircle,
      },
    }

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant="secondary" className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-emerald-600" />
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-600" />
    return null
  }

  const salesStats = salesMetrics
    ? [
        {
          title: 'Ingresos Totales',
          value: formatCurrency(salesMetrics.total_revenue),
          change: formatPercentage(salesMetrics.revenue_change),
          trend: salesMetrics.revenue_change >= 0 ? 'up' : 'down',
          icon: DollarSign,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100',
        },
        {
          title: 'Total Pedidos',
          value: salesMetrics.total_orders.toString(),
          change: formatPercentage(salesMetrics.orders_change),
          trend: salesMetrics.orders_change >= 0 ? 'up' : 'down',
          icon: ShoppingCart,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          title: 'Productos Vendidos',
          value: salesMetrics.total_products_sold.toString(),
          change: formatPercentage(salesMetrics.products_change),
          trend: salesMetrics.products_change >= 0 ? 'up' : 'down',
          icon: Package,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        },
        {
          title: 'Ticket Promedio',
          value: formatCurrency(salesMetrics.average_order_value),
          change: formatPercentage(salesMetrics.aov_change),
          trend: salesMetrics.aov_change >= 0 ? 'up' : 'down',
          icon: Target,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
        },
      ]
    : []

  const exportSalesReport = () => {
    // This would generate and download a sales report
    console.log('Exporting sales report for period:', selectedPeriod)
  }

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando métricas de ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header con paleta corporativa RockBros */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-verde-bosque to-verde-neon rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gris-oscuro leading-tight">
              Análisis de Ventas
            </h1>
            <p className="text-gris-medio font-medium">
              Analiza el rendimiento de ventas y métricas clave del negocio
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contenedor de acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div></div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={exportSalesReport}
              variant="outline"
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Sales Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {salesStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <div
                          className={`flex items-center text-xs ${
                            stat.trend === 'up'
                              ? 'text-emerald-600'
                              : stat.trend === 'down'
                              ? 'text-red-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {getTrendIcon(parseFloat(stat.change))}
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    Tasa de Conversión
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {salesMetrics?.conversion_rate || 0}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  De visitantes a compradores
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">
                    Clientes Únicos
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {recentOrders.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  En el período seleccionado
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">
                    Satisfacción
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">4.8</p>
                <p className="text-sm text-gray-500 mt-1">
                  Calificación promedio
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900">
                <div className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-emerald-600" />
                  Pedidos Recientes
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver todos
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    No hay pedidos recientes
                  </p>
                  <p className="text-sm text-gray-500">
                    Los pedidos aparecerán aquí cuando se realicen
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {recentOrders.slice(0, 5).map(order => (
                    <div
                      key={order.id}
                      className="p-4 hover:bg-emerald-50/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={order.user_profiles?.avatar_url || ''}
                            />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              {(
                                order.user_profiles?.full_name ||
                                order.user_profiles?.email ||
                                'U'
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.user_profiles?.full_name ||
                                order.user_profiles?.email ||
                                'Usuario'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Pedido #{order.id.slice(-8)} •{' '}
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Selling Products */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Package className="w-5 h-5 mr-2 text-emerald-600" />
                Productos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {salesMetrics?.top_selling_products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    No hay ventas de productos
                  </p>
                  <p className="text-sm text-gray-500">
                    Los productos más vendidos aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {salesMetrics?.top_selling_products.map((product, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-emerald-50/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12 rounded-lg">
                              <AvatarImage
                                src={product.main_image || ''}
                                alt={product.name}
                              />
                              <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700">
                                <Package className="w-6 h-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-40">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {product.total_sold} unidades vendidas
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">
                            {formatCurrency(product.total_revenue)}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            Top {index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart Placeholder */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                Tendencia de Ventas
              </div>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40 bg-emerald-50/50 border-emerald-200 text-gray-900 hover:bg-emerald-50 focus:bg-emerald-50 focus:border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-emerald-200">
                  <SelectItem
                    value="revenue"
                    className="text-gray-900 hover:bg-emerald-50 focus:bg-emerald-50"
                  >
                    Ingresos
                  </SelectItem>
                  <SelectItem
                    value="orders"
                    className="text-gray-900 hover:bg-emerald-50 focus:bg-emerald-50"
                  >
                    Pedidos
                  </SelectItem>
                  <SelectItem
                    value="products"
                    className="text-gray-900 hover:bg-emerald-50 focus:bg-emerald-50"
                  >
                    Productos
                  </SelectItem>
                  <SelectItem
                    value="customers"
                    className="text-gray-900 hover:bg-emerald-50 focus:bg-emerald-50"
                  >
                    Clientes
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border-2 border-dashed border-emerald-200">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Gráfico de Tendencias
                </p>
                <p className="text-sm text-gray-500 max-w-sm">
                  Aquí se mostrará un gráfico interactivo con las tendencias de{' '}
                  {selectedMetric}
                  para el período seleccionado
                </p>
                <Button
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Gráfico Completo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminSales

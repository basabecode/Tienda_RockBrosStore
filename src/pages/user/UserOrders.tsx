import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Package,
  Clock,
  AlertCircle,
  Eye,
  ShoppingBag,
  Search,
  Filter,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  User,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDate } from '@/utils/formatters'

interface OrderItem {
  id: string
  quantity: number
  unit_price: number
  products: {
    name: string
    price: number
    main_image?: string
  }
}

interface Order {
  id: string
  status: string
  total: number
  created_at: string
  shipping_address?: {
    address_line_1: string
    city: string
    state?: string
    postal_code?: string
  }
  order_items?: OrderItem[]
}

interface OrderFilters {
  status: string
  dateFrom: string
  dateTo: string
  search: string
}

const UserOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
  })
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  // Consulta para verificar el historial total de compras del usuario
  const { data: userOrderHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['user-order-history', user?.email],
    queryFn: async () => {
      if (!user?.email) return { hasOrders: false, totalOrders: 0 }

      const { data, error } = await supabase
        .from('orders')
        .select('id, status')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching user order history:', error)
        return { hasOrders: false, totalOrders: 0 }
      }

      return {
        hasOrders: data && data.length > 0,
        totalOrders: data ? data.length : 0,
        hasCompletedOrders: data
          ? data.some(
              order =>
                order.status === 'completed' || order.status === 'delivered'
            )
          : false,
      }
    },
    enabled: !!user?.email,
  })

  // Consulta de pedidos con filtros
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-orders', user?.id, filters, currentPage],
    queryFn: async () => {
      if (!user?.id) return { orders: [], total: 0 }

      let query = supabase
        .from('orders')
        .select(
          `
          id,
          status,
          total,
          created_at,
          shipping_address:addresses!shipping_address_id(
            address_line_1,
            city,
            state,
            postal_code
          ),
          order_items (
            id,
            quantity,
            unit_price,
            products (
              name,
              price,
              main_image
            )
          )
        `,
          { count: 'exact' }
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo)
      }

      if (filters.search) {
        query = query.ilike('id', `%${filters.search}%`)
      }

      // Paginación
      const from = (currentPage - 1) * ordersPerPage
      const to = from + ordersPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) throw error

      return {
        orders: (data || []) as unknown as Order[],
        total: count || 0,
      }
    },
    enabled: !!user?.id,
  })

  const orders = useMemo(() => ordersData?.orders || [], [ordersData?.orders])
  const totalOrders = ordersData?.total || 0
  const totalPages = Math.ceil(totalOrders / ordersPerPage)

  // Estadísticas calculadas
  const orderStats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(
      order => order.status === 'pending'
    ).length
    const completedOrders = orders.filter(
      order => order.status === 'delivered'
    ).length

    return {
      totalSpent,
      pendingOrders,
      completedOrders,
      averageOrder: orders.length > 0 ? totalSpent / orders.length : 0,
    }
  }, [orders])

  // Estados y badges
  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: {
        label: 'Pendiente',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
      },
      processing: {
        label: 'Procesando',
        variant: 'default' as const,
        icon: Package,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      shipped: {
        label: 'Enviado',
        variant: 'outline' as const,
        icon: Truck,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      },
      delivered: {
        label: 'Entregado',
        variant: 'secondary' as const,
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      cancelled: {
        label: 'Cancelado',
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
      },
    }
    return statusMap[status as keyof typeof statusMap] || statusMap.pending
  }

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateFrom: '',
      dateTo: '',
      search: '',
    })
    setCurrentPage(1)
  }

  // Componente de estadísticas
  const OrderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-emerald-200/50 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-emerald-50/30">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200/50 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-emerald-50/30">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderStats.completedOrders}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200/50 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-emerald-50/30">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-xl shadow-sm">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Gastado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(orderStats.totalSpent)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200/50 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-emerald-50/30">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-xl shadow-sm">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderStats.pendingOrders}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Componente de pedido individual
  const OrderCard = ({ order }: { order: Order }) => {
    const statusInfo = getStatusInfo(order.status)
    const StatusIcon = statusInfo.icon
    const isExpanded = expandedOrder === order.id
    const itemsCount = order.order_items?.length || 0

    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-400 shadow-sm bg-gradient-to-r from-white to-emerald-50/20 hover:from-emerald-50/40 hover:to-emerald-50/60">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  Pedido #{order.id.slice(-8)}
                </h3>
                <Badge
                  variant={statusInfo.variant}
                  className="flex items-center gap-1 shadow-sm"
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.created_at)}
                </div>
                <Separator
                  orientation="vertical"
                  className="hidden sm:block h-4"
                />
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {itemsCount} producto{itemsCount !== 1 ? 's' : ''}
                </div>
                {order.shipping_address && (
                  <>
                    <Separator
                      orientation="vertical"
                      className="hidden sm:block h-4"
                    />
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {order.shipping_address.city}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">
                {formatPrice(order.total)}
              </p>
              <p className="text-sm text-gray-500">Total del pedido</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/orders/${order.id}`)}
              className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              className="flex-1 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 mr-2" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-2" />
              )}
              {isExpanded ? 'Ocultar' : 'Mostrar'} Productos
            </Button>
          </div>

          {/* Productos expandidos */}
          {isExpanded && order.order_items && (
            <div className="mt-6 space-y-3 border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Productos en este pedido:
              </h4>
              {order.order_items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.products.main_image ? (
                      <img
                        src={item.products.main_image}
                        alt={item.products.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 truncate">
                      {item.products.name}
                    </h5>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Cantidad: {item.quantity}</span>
                      <span>
                        Precio unitario: {formatPrice(item.unit_price)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.quantity * item.unit_price)}
                    </p>
                    <p className="text-sm text-gray-500">Subtotal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Estado para primera compra (motivacional)
  const FirstPurchaseState = () => (
    <Card className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
      <CardContent className="p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Bienvenido a RockBros Shop! 🎉
        </h3>
        <p className="text-gray-700 mb-6 max-w-lg mx-auto text-lg">
          Aún no has realizado tu primera compra. Te invitamos a explorar
          nuestro catálogo de productos de alta calidad para ciclismo y
          aventura.
        </p>
        <div className="bg-white rounded-lg p-4 border border-emerald-200 mb-6 max-w-md mx-auto">
          <p className="text-emerald-700 font-medium">
            ✨ ¡Oferta especial para nuevos clientes!
          </p>
          <p className="text-sm text-gray-600">
            Descubre productos exclusivos y obtén envío gratis en tu primera
            compra.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/#shop')}
            size="lg"
            className="h-12 bg-emerald-600 hover:bg-emerald-700"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Explorar Productos
          </Button>
          <Button
            onClick={() => navigate('/#categories')}
            variant="outline"
            size="lg"
            className="h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Ver Categorías
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Estado para usuario con compras completadas
  const ThankYouState = () => {
    const latestOrder = ordersData?.orders?.[0]
    return (
      <div className="space-y-6">
        <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              ¡Muchas gracias por tu compra! 🙏
            </h3>
            <p className="text-gray-700 text-center mb-6 text-lg">
              Apreciamos tu confianza en RockBros Shop. Tu pedido llegará pronto
              a tu domicilio.
            </p>

            {latestOrder && (
              <div className="bg-white rounded-lg border border-emerald-200 p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-emerald-600" />
                  Último Pedido #{latestOrder.id.slice(-8)}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado:</p>
                    <Badge variant="secondary" className="mb-3">
                      {getStatusInfo(latestOrder.status).label}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-1">Total:</p>
                    <p className="font-semibold text-emerald-600 text-lg">
                      {formatPrice(latestOrder.total)}
                    </p>
                  </div>
                  {latestOrder.shipping_address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Dirección de entrega:
                      </p>
                      <div className="text-sm text-gray-900">
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
                          {latestOrder.shipping_address.address_line_1}
                        </p>
                        <p className="ml-5">
                          {latestOrder.shipping_address.city}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {latestOrder.order_items &&
                  latestOrder.order_items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Productos:</p>
                      <div className="space-y-2">
                        {latestOrder.order_items
                          .slice(0, 3)
                          .map((item, index) => (
                            <div
                              key={item.id}
                              className="flex items-center text-sm"
                            >
                              <span className="font-medium text-gray-900">
                                {item.quantity}x {item.products?.name}
                              </span>
                              <span className="ml-auto text-emerald-600 font-medium">
                                {formatPrice(item.unit_price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        {latestOrder.order_items.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{latestOrder.order_items.length - 3} productos más
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/#shop')}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Estados de carga y error
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para ver tus pedidos
          </p>
          <Button onClick={() => navigate('/auth/login')} size="lg">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-11"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
              Mis Pedidos
            </h1>
            <p className="text-gray-600 mt-1">Error al cargar tus pedidos</p>
          </div>
        </div>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>
                {error.message ||
                  'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-emerald-600" />
            Mis Pedidos
          </h1>
          <p className="text-gray-600 mt-1">
            Historial completo de tus compras y seguimiento de envíos
          </p>
        </div>
        <Button
          onClick={() => navigate('/products')}
          size="lg"
          className="hidden sm:flex h-11"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Seguir Comprando
        </Button>
      </div>

      {/* Estadísticas */}
      {!isLoading && totalOrders > 0 && <OrderStats />}

      {/* Filtros */}
      {!isLoading && totalOrders > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg text-gray-900">
                <Filter className="h-5 w-5 mr-2 text-emerald-600" />
                Filtros de Búsqueda
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-sm"
              >
                Limpiar filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Número de Pedido
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por ID..."
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Estado del Pedido
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={value => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processing">Procesando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha desde */}
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-sm font-medium">
                  Desde
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={e => handleFilterChange('dateFrom', e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Fecha hasta */}
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-sm font-medium">
                  Hasta
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={e => handleFilterChange('dateTo', e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <div className="space-y-6">
          {/* Skeleton de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Skeleton de pedidos */}
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : totalOrders === 0 ? (
        // Lógica para mostrar diferentes estados según el historial del usuario
        isLoadingHistory ? (
          <div className="flex justify-center p-12">
            <RefreshCw className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : userOrderHistory?.hasOrders === false ? (
          <FirstPurchaseState />
        ) : userOrderHistory?.hasCompletedOrders ? (
          <ThankYouState />
        ) : (
          <FirstPurchaseState />
        )
      ) : (
        <div className="space-y-6">
          {/* Información de resultados */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {orders.length} de {totalOrders} pedidos
              {filters.status !== 'all' &&
                ` • Estado: ${getStatusInfo(filters.status).label}`}
              {filters.search && ` • Búsqueda: "${filters.search}"`}
            </p>
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </p>
          </div>

          {/* Lista de pedidos */}
          <div className="space-y-6">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="h-11"
              >
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (pageNumber > totalPages) return null
                  const isActive = pageNumber === currentPage
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      variant={isActive ? 'default' : 'outline'}
                      className={`h-11 w-11 p-0 ${
                        isActive ? 'bg-primary text-white' : ''
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="h-11"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UserOrders

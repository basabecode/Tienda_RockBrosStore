import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
// AdminPageLayout eliminado - ahora se usa UnifiedDashboardLayout desde App.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
} from 'lucide-react'

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  profiles: {
    full_name: string
    email: string
  }
  order_items: Array<{
    id: string
    product_id: string
    quantity: number
    price: number
    products: {
      name: string
      image_url: string
    }
  }>
}

import { TempAdminPage } from '@/components/TempAdminPage'
import { formatPrice, formatDate } from '@/utils/formatters'

const SalesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('30')

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(
          `
          *,
          profiles:user_id (
            full_name,
            email
          ),
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `
        )
        .order('created_at', { ascending: false })

      if (searchTerm) {
        query = query.or(
          `profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`
        )
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Order[]
    },
  })

  // Fetch sales stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-sales-stats', selectedPeriod],
    queryFn: async () => {
      const days = parseInt(selectedPeriod)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Total sales
      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'delivered')

      if (salesError) throw salesError

      // Total orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', startDate.toISOString())

      if (ordersError) throw ordersError

      // Total customers
      const { data: customersData, error: customersError } = await supabase
        .from('orders')
        .select('user_id')
        .gte('created_at', startDate.toISOString())

      if (customersError) throw customersError

      const totalSales =
        salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const totalOrders = ordersData?.length || 0
      const uniqueCustomers =
        new Set(customersData?.map(order => order.user_id)).size || 0
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

      return {
        totalSales,
        totalOrders,
        uniqueCustomers,
        averageOrderValue,
      }
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-brand-primary/10 text-brand-primary'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'shipped':
        return <CheckCircle className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Funciones de formateo centralizadas en utils/formatters.ts

  if (ordersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <TempAdminPage title="Gestión de Ventas">
      <div className="space-y-6">
        {/* Header de página */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3 text-green-400" />
              Revisión de Compras
            </h1>
            <p className="text-gray-300 mt-2">
              Dashboard completo de ventas, pedidos y análisis de rendimiento
              comercial
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-gray-100">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem
                  value="7"
                  className="text-gray-100 hover:bg-gray-600"
                >
                  Últimos 7 días
                </SelectItem>
                <SelectItem
                  value="30"
                  className="text-gray-100 hover:bg-gray-600"
                >
                  Últimos 30 días
                </SelectItem>
                <SelectItem
                  value="90"
                  className="text-gray-100 hover:bg-gray-600"
                >
                  Últimos 90 días
                </SelectItem>
                <SelectItem
                  value="365"
                  className="text-gray-100 hover:bg-gray-600"
                >
                  Último año
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      Ventas Totales
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatPrice(stats?.totalSales || 0)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      En los últimos {selectedPeriod} días
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      Total Pedidos
                    </p>
                    <p className="text-2xl font-bold text-blue-400">
                      {stats?.totalOrders || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Pedidos realizados
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      Clientes Únicos
                    </p>
                    <p className="text-2xl font-bold text-purple-400">
                      {stats?.uniqueCustomers || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Compradores distintos
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      Valor Promedio
                    </p>
                    <p className="text-2xl font-bold text-orange-400">
                      {formatPrice(stats?.averageOrderValue || 0)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Por pedido</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Management */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">
                Gestión de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por cliente o email..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    />
                  </div>
                </div>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-gray-100">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem
                      value="all"
                      className="text-gray-100 hover:bg-gray-600"
                    >
                      Todos los estados
                    </SelectItem>
                    <SelectItem
                      value="pending"
                      className="text-gray-100 hover:bg-gray-600"
                    >
                      Pendiente
                    </SelectItem>
                    <SelectItem
                      value="processing"
                      className="text-gray-100 hover:bg-gray-600"
                    >
                      Procesando
                    </SelectItem>
                    <SelectItem
                      value="shipped"
                      className="text-gray-100 hover:bg-gray-600"
                    >
                      Enviado
                    </SelectItem>
                    <SelectItem
                      value="delivered"
                      className="text-gray-100 hover:bg-gray-600"
                    >
                      Entregado
                    </SelectItem>
                    <SelectItem
                      value="cancelled"
                      className="text-gray-100 hover:bg-gray-600"
                    >
                      Cancelado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Pedido
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Cliente
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Productos
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Estado
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Fecha
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map(order => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-600 hover:bg-gray-700"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-100">
                            #{order.id.slice(-8)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-100">
                              {order.profiles?.full_name || 'Cliente'}
                            </p>
                            <p className="text-sm text-gray-300">
                              {order.profiles?.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-300">
                            {order.order_items?.length || 0} producto
                            {order.order_items?.length !== 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-green-400">
                            {formatPrice(order.total_amount)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status === 'pending'
                                ? 'Pendiente'
                                : order.status === 'processing'
                                ? 'Procesando'
                                : order.status === 'shipped'
                                ? 'Enviado'
                                : order.status === 'delivered'
                                ? 'Entregado'
                                : order.status === 'cancelled'
                                ? 'Cancelado'
                                : order.status}
                            </div>
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-300">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders?.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-100 mb-2">
                    No se encontraron pedidos
                  </h3>
                  <p className="text-gray-300">
                    {searchTerm || selectedStatus !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'No hay pedidos registrados en el sistema'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TempAdminPage>
  )
}

export default SalesManagement

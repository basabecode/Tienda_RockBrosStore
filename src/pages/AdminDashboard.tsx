// Tipos locales para resultados de selects (evitar any/never)
type OrderRow = {
  id: string
  total: number | string
  status: string
  created_at: string
  profiles?:
    | { id: string; full_name?: string | null; email?: string | null }
    | Array<{ id: string; full_name?: string | null; email?: string | null }>
}
type RecentOrder = {
  id: string
  total: number | string
  status: string
  created_at: string
  profiles?: {
    id: string
    full_name?: string | null
    email?: string | null
  } | null
}
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import AdminSidebar from '@/components/AdminSidebar'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react'

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // Products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (productsError) throw productsError

      // Orders stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total, status, created_at')
        .gte(
          'created_at',
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        )

      if (ordersError) throw ordersError

      // Users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (usersError) throw usersError

      // Calculate metrics
      const totalSales =
        (
          ordersData as Array<{ total: number | string; status: string }> | null
        )?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0
      const totalOrders = (ordersData as unknown[] | null)?.length || 0
      const deliveredOrders =
        (ordersData as Array<{ status: string }> | null)?.filter(
          order => order.status === 'delivered'
        ).length || 0

      return {
        productsCount: productsCount || 0,
        usersCount: usersCount || 0,
        totalSales,
        totalOrders,
        deliveredOrders,
        conversionRate:
          totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
      }
    },
  })

  // Fetch recent orders
  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          total,
          status,
          created_at,
          profiles:user_id (
            full_name,
            email
          )
        `
        )
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      // Ensure profiles is always an object, not an array
      return (data as Array<OrderRow> | null)?.map<RecentOrder>(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        profiles: Array.isArray(order.profiles)
          ? order.profiles[0] ?? null
          : order.profiles ?? null,
      }))
    },
  })

  // Fetch low stock products
  const { data: lowStockProducts } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock')
        .lt('stock', 10)
        .eq('is_active', true)
        .order('stock', { ascending: true })
        .limit(5)

      if (error) throw error
      return data as Array<{ id: string; name: string; stock: number }>
    },
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Bienvenido al panel de administración de RockBros
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Productos
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats?.productsCount || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">En catálogo</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Ventas (30d)
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(stats?.totalSales || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats?.totalOrders || 0} pedidos
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Clientes
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats?.usersCount || 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Registrados</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Conversión
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {stats?.conversionRate?.toFixed(1) || 0}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tasa de entrega
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Pedidos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders?.map(order => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.profiles?.full_name ||
                                order.profiles?.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatPrice(Number(order.total))}
                          </p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {recentOrders?.length === 0 && (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          No hay pedidos recientes
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Productos con Stock Bajo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockProducts?.map(product => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Stock: {product.stock} unidades
                          </p>
                        </div>
                        <div className="text-right">
                          <Progress
                            value={(product.stock / 10) * 100}
                            className="w-16 h-2"
                          />
                        </div>
                      </div>
                    ))}

                    {lowStockProducts?.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Todos los productos tienen stock suficiente
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    onClick={() => (window.location.href = '/admin/products')}
                  >
                    <Package className="w-6 h-6" />
                    <span>Gestionar Productos</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => (window.location.href = '/admin/users')}
                  >
                    <Users className="w-6 h-6" />
                    <span>Gestionar Usuarios</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => (window.location.href = '/admin/sales')}
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>Ver Ventas</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

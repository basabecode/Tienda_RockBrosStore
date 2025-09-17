import { useAuth } from '@/hooks/use-auth'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthUser } from '@/lib/types'
import {
  ShoppingBag,
  Heart,
  MapPin,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Shield,
  Store,
  Clock,
  CheckCircle,
} from 'lucide-react'

// Types for dashboard data
interface UserOrder {
  id: string
  total_amount: number
  status: string
  created_at: string
}

interface UserFavorite {
  id: string
}

interface UserAddress {
  id: string
}

interface AdminStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalSales: number
  pendingOrders: number
}

const DashboardOverview = () => {
  const { user } = useAuth()
  const { isAdmin } = useAdminAuth()
  const navigate = useNavigate()

  // Consultas para datos del usuario regular
  const { data: userOrders } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!user && !isAdmin,
  })

  const { data: userFavorites } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)

      if (error) throw error
      return data || []
    },
    enabled: !!user && !isAdmin,
  })

  const { data: userAddresses } = useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', user.id)

      if (error) throw error
      return data || []
    },
    enabled: !!user && !isAdmin,
  })

  // Consultas para datos del administrador
  const { data: adminStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsResult, usersResult, ordersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase
          .from('orders')
          .select('id, total_amount, status', { count: 'exact' }),
      ])

      const totalSales =
        ordersResult.data?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        ) || 0
      const pendingOrders =
        ordersResult.data?.filter(order => order.status === 'pending').length ||
        0

      return {
        totalProducts: productsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalSales,
        pendingOrders,
      }
    },
    enabled: !!user && isAdmin,
  })

  // Renderizado diferente según el rol
  if (isAdmin) {
    return (
      <AdminDashboardView
        user={user}
        adminStats={adminStats}
        navigate={navigate}
      />
    )
  }

  return (
    <ClientDashboardView
      user={user}
      userOrders={userOrders}
      userFavorites={userFavorites}
      userAddresses={userAddresses}
      navigate={navigate}
    />
  )
}

// Componente para vista del administrador
const AdminDashboardView = ({
  user,
  adminStats,
  navigate,
}: {
  user: AuthUser | null
  adminStats: AdminStats | undefined
  navigate: (path: string) => void
}) => {
  return (
    <div className="space-y-6">
      {/* Header de Administrador */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-blue-100">
                  Bienvenido, {user?.full_name || 'Administrador'}
                </p>
                <p className="text-blue-200 text-sm">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/admin')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats?.totalProducts || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats?.totalUsers || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminStats?.totalOrders || 0}
                </p>
              </div>
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ventas Totales
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${adminStats?.totalSales?.toLocaleString('es-CO') || '0'} COP
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Accesos Rápidos de Administración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/admin/products')}
            >
              <Package className="h-6 w-6 text-blue-600" />
              <span>Gestionar Productos</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="h-6 w-6 text-green-600" />
              <span>Gestionar Usuarios</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/admin/sales')}
            >
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <span>Ver Ventas</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/')}
            >
              <Store className="h-6 w-6 text-orange-600" />
              <span>Ver Tienda</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/profile')}
            >
              <Users className="h-6 w-6 text-gray-600" />
              <span>Mi Perfil Personal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente para vista del cliente
const ClientDashboardView = ({
  user,
  userOrders,
  userFavorites,
  userAddresses,
  navigate,
}: {
  user: AuthUser | null
  userOrders: UserOrder[] | undefined
  userFavorites: UserFavorite[] | undefined
  userAddresses: UserAddress[] | undefined
  navigate: (path: string) => void
}) => {
  const totalSpent =
    userOrders?.reduce(
      (sum: number, order: UserOrder) => sum + (order.total_amount || 0),
      0
    ) || 0
  const recentOrders = userOrders?.slice(0, 3) || []

  return (
    <div className="space-y-6">
      {/* Header del Cliente */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">¡Bienvenido de vuelta!</h1>
                <p className="text-green-100">{user?.full_name || 'Cliente'}</p>
                <p className="text-green-200 text-sm">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Store className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del Usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mis Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userOrders?.length || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userFavorites?.length || 0}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Direcciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userAddresses?.length || 0}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gastado
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalSpent.toLocaleString('es-CO')} COP
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos Recientes */}
      {recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Pedidos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order: UserOrder) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-500'
                          : order.status === 'shipped'
                          ? 'bg-blue-500'
                          : order.status === 'processing'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        Pedido #{order.id.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${order.total_amount.toLocaleString('es-CO')} COP
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/orders')}
            >
              Ver Todos los Pedidos
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Accesos Rápidos del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-green-600" />
            Accesos Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/profile')}
            >
              <Users className="h-6 w-6 text-blue-600" />
              <span>Editar Perfil</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/addresses')}
            >
              <MapPin className="h-6 w-6 text-green-600" />
              <span>Mis Direcciones</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/orders')}
            >
              <Package className="h-6 w-6 text-purple-600" />
              <span>Mis Pedidos</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/favorites')}
            >
              <Heart className="h-6 w-6 text-red-500" />
              <span>Favoritos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sugerencias para nuevos usuarios */}
      {userOrders?.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Comienza tu experiencia de compra!
            </h3>
            <p className="text-gray-600 mb-4">
              Explora nuestro catálogo y encuentra productos increíbles
            </p>
            <Button onClick={() => navigate('/')}>
              <Store className="h-4 w-4 mr-2" />
              Explorar Tienda
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardOverview

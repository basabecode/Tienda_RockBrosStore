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
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

// Types for dashboard data
interface UserOrder {
  id: string
  total: number
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

  // Consultas para datos del usuario regular con error handling robusto
  const {
    data: userOrders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      try {
        if (!user) return []

        const { data, error } = await supabase
          .from('orders')
          .select('id, total, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error fetching user orders:', error)
          throw new Error(`Error al cargar pedidos: ${error.message}`)
        }

        return data || []
      } catch (error) {
        console.error('Unexpected error in userOrders query:', error)
        throw error
      }
    },
    enabled: !!user && !isAdmin,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  const {
    data: userFavorites,
    isLoading: favoritesLoading,
    error: favoritesError,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      try {
        if (!user) return []

        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching user favorites:', error)
          throw new Error(`Error al cargar favoritos: ${error.message}`)
        }

        return data || []
      } catch (error) {
        console.error('Unexpected error in userFavorites query:', error)
        throw error
      }
    },
    enabled: !!user && !isAdmin,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  })

  const {
    data: userAddresses,
    isLoading: addressesLoading,
    error: addressesError,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      try {
        if (!user) return []

        const { data, error } = await supabase
          .from('addresses')
          .select('id')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching user addresses:', error)
          throw new Error(`Error al cargar direcciones: ${error.message}`)
        }

        return data || []
      } catch (error) {
        console.error('Unexpected error in userAddresses query:', error)
        throw error
      }
    },
    enabled: !!user && !isAdmin,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  })

  // Consultas para datos del administrador con error handling robusto
  const {
    data: adminStats,
    isLoading: adminStatsLoading,
    error: adminStatsError,
    refetch: refetchAdminStats,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const [productsResult, usersResult, ordersResult] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('profiles').select('id', { count: 'exact' }),
          supabase
            .from('orders')
            .select('id, total, status', { count: 'exact' }),
        ])

        // Verificar errores en cada resultado
        if (productsResult.error) {
          console.error('Error fetching products count:', productsResult.error)
          throw new Error(
            `Error al cargar productos: ${productsResult.error.message}`
          )
        }

        if (usersResult.error) {
          console.error('Error fetching users count:', usersResult.error)
          throw new Error(
            `Error al cargar usuarios: ${usersResult.error.message}`
          )
        }

        if (ordersResult.error) {
          console.error('Error fetching orders:', ordersResult.error)
          throw new Error(
            `Error al cargar pedidos: ${ordersResult.error.message}`
          )
        }

        const totalSales =
          ordersResult.data?.reduce(
            (sum, order) => sum + (order.total || 0),
            0
          ) || 0
        const pendingOrders =
          ordersResult.data?.filter(order => order.status === 'pending')
            .length || 0

        return {
          totalProducts: productsResult.count || 0,
          totalUsers: usersResult.count || 0,
          totalOrders: ordersResult.count || 0,
          totalSales,
          pendingOrders,
        }
      } catch (error) {
        console.error('Unexpected error in adminStats query:', error)
        throw error
      }
    },
    enabled: !!user && isAdmin,
    retry: 2,
    refetchInterval: 30000, // Refresh cada 30 segundos para admin
    staleTime: 2 * 60 * 1000, // 2 minutos
  })

  // Renderizado diferente según el rol
  if (isAdmin) {
    return (
      <AdminDashboardView
        user={user}
        adminStats={adminStats}
        navigate={navigate}
        isLoading={adminStatsLoading}
        error={adminStatsError}
        onRetry={refetchAdminStats}
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
      ordersLoading={ordersLoading}
      favoritesLoading={favoritesLoading}
      addressesLoading={addressesLoading}
      ordersError={ordersError}
      favoritesError={favoritesError}
      addressesError={addressesError}
      onRetryOrders={refetchOrders}
      onRetryFavorites={refetchFavorites}
      onRetryAddresses={refetchAddresses}
    />
  )
}

// Componente para vista del administrador
const AdminDashboardView = ({
  user,
  adminStats,
  navigate,
  isLoading,
  error,
  onRetry,
}: {
  user: AuthUser | null
  adminStats: AdminStats | undefined
  navigate: (path: string) => void
  isLoading: boolean
  error: Error | null
  onRetry: () => void
}) => {
  // Mostrar estado de error si hay problemas
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">
                  Error al cargar datos del administrador
                </h3>
                <p className="text-red-600 mt-1">
                  {error.message || 'Ha ocurrido un error inesperado'}
                </p>
              </div>
              <Button
                onClick={onRetry}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
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
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    adminStats?.totalProducts || 0
                  )}
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
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    adminStats?.totalUsers || 0
                  )}
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
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    adminStats?.totalOrders || 0
                  )}
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
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `$${
                      adminStats?.totalSales?.toLocaleString('es-CO') || '0'
                    } COP`
                  )}
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
              onClick={() => navigate('/dashboard/perfil')}
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
  ordersLoading,
  favoritesLoading,
  addressesLoading,
  ordersError,
  favoritesError,
  addressesError,
  onRetryOrders,
  onRetryFavorites,
  onRetryAddresses,
}: {
  user: AuthUser | null
  userOrders: UserOrder[] | undefined
  userFavorites: UserFavorite[] | undefined
  userAddresses: UserAddress[] | undefined
  navigate: (path: string) => void
  ordersLoading: boolean
  favoritesLoading: boolean
  addressesLoading: boolean
  ordersError: Error | null
  favoritesError: Error | null
  addressesError: Error | null
  onRetryOrders: () => void
  onRetryFavorites: () => void
  onRetryAddresses: () => void
}) => {
  const totalSpent =
    userOrders?.reduce(
      (sum: number, order: UserOrder) => sum + (order.total || 0),
      0
    ) || 0
  const recentOrders = userOrders?.slice(0, 3) || []

  // Mostrar errores si hay problemas críticos
  const hasErrors = ordersError || favoritesError || addressesError
  if (hasErrors) {
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
                  <p className="text-green-100">
                    {user?.full_name || 'Cliente'}
                  </p>
                  <p className="text-green-200 text-sm">{user?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mostrar errores */}
        <div className="space-y-4">
          {ordersError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-red-800 font-medium">
                        Error al cargar pedidos
                      </h4>
                      <p className="text-red-600 text-sm">
                        {ordersError.message}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onRetryOrders}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {favoritesError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-red-800 font-medium">
                        Error al cargar favoritos
                      </h4>
                      <p className="text-red-600 text-sm">
                        {favoritesError.message}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onRetryFavorites}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {addressesError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-red-800 font-medium">
                        Error al cargar direcciones
                      </h4>
                      <p className="text-red-600 text-sm">
                        {addressesError.message}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={onRetryAddresses}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header del Cliente mejorado */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="h-20 w-20 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  ¡Bienvenido de vuelta!
                </h1>
                <p className="text-xl font-semibold text-white">
                  {user?.full_name || 'Cliente'}
                </p>
                <p className="text-base font-medium text-white/90 bg-black/20 px-3 py-1 rounded-full inline-block">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="bg-white text-green-700 font-semibold hover:bg-green-50 border-0 shadow-md"
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
                  {ordersLoading ? (
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    userOrders?.length || 0
                  )}
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
                  {favoritesLoading ? (
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    userFavorites?.length || 0
                  )}
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
                  {addressesLoading ? (
                    <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    userAddresses?.length || 0
                  )}
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
                  {ordersLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `$${totalSpent.toLocaleString('es-CO')} COP`
                  )}
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
                      ${order.total.toLocaleString('es-CO')} COP
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
              onClick={() => navigate('/dashboard/pedidos')}
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
              onClick={() => navigate('/dashboard/perfil')}
            >
              <Users className="h-6 w-6 text-blue-600" />
              <span>Editar Perfil</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/direcciones')}
            >
              <MapPin className="h-6 w-6 text-green-600" />
              <span>Mis Direcciones</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/pedidos')}
            >
              <Package className="h-6 w-6 text-purple-600" />
              <span>Mis Pedidos</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/dashboard/favoritos')}
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

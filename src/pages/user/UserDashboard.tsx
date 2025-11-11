import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Breadcrumbs from '@/components/ui/breadcrumbs'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import {
  User,
  Package,
  Heart,
  MapPin,
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Mail,
  Phone,
  Edit,
} from 'lucide-react'
// Removed design-system imports - now using Tailwind CSS

const UserDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const breadcrumbs = useBreadcrumbs()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const [ordersResult, favoritesResult, addressesResult] =
        await Promise.all([
          supabase
            .from('orders')
            .select('id, status, total_amount, created_at', { count: 'exact' })
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('favorites')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('addresses')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
        ])

      return {
        totalOrders: ordersResult.count || 0,
        totalFavorites: favoritesResult.count || 0,
        totalAddresses: addressesResult.count || 0,
        recentOrders: ordersResult.data?.slice(0, 3) || [],
      }
    },
    enabled: !!user?.id,
  })

  return (
    <div className="space-y-8 p-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido de vuelta, {user?.full_name || 'Usuario'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Aquí tienes el resumen de tu actividad en RockBros Store
          </p>
        </div>

        <div className="flex space-x-3 mt-4 lg:mt-0">
          <Button
            onClick={() => navigate('/usuario/perfil')}
            className="text-white bg-emerald-600 hover:bg-emerald-700 min-h-[44px]"
          >
            <User className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
          <Button
            onClick={() => navigate('/tienda')}
            variant="outline"
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 min-h-[44px]"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ir a Tienda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-emerald-200/50 hover:border-emerald-300 bg-gradient-to-br from-white to-emerald-50/30"
          onClick={() => navigate('/usuario/pedidos')}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">
                Pedidos Realizados
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-gray-500">Total de pedidos</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 shadow-sm">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/usuario/favoritos')}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">
                Productos Favoritos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : stats?.totalFavorites || 0}
              </p>
              <p className="text-xs text-gray-500">En tu lista de deseos</p>
            </div>
            <div className="p-3 rounded-xl bg-red-100 shadow-sm">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-emerald-200/50 hover:border-emerald-300 bg-gradient-to-br from-white to-emerald-50/30"
          onClick={() => navigate('/usuario/perfil')}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">Direcciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : stats?.totalAddresses || 0}
              </p>
              <p className="text-xs text-gray-500">Direcciones guardadas</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 shadow-sm">
              <MapPin className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">
                Estado del Perfil
              </p>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-xs text-gray-500">Perfil completo</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 shadow-sm">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-emerald-100 shadow-sm">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Información Personal
                </h3>
                <p className="text-sm text-gray-500">
                  Tu información de RockBros Store
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500">Email principal</p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/usuario/perfil')}
                className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Información
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-3 rounded-full bg-emerald-100 shadow-sm">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Actividad Reciente
                </h3>
                <p className="text-sm text-gray-500">Tus últimas acciones</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {stats?.recentOrders?.length ? (
              <div className="space-y-3">
                {stats.recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-emerald-100 shadow-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Pedido #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(
                            'es-ES'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => navigate('/usuario/pedidos')}
                  className="w-full mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Ver Todos los Pedidos
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">
                  Aún no has realizado ningún pedido
                </p>
                <Button
                  onClick={() => navigate('/tienda')}
                  className="mt-3 text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Explorar Productos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserDashboard

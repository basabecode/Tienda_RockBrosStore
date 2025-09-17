import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Bike,
  Store,
  DollarSign,
} from 'lucide-react'

const AdminEcommerceDashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // KPIs principales
  const { data: stats } = useQuery({
    queryKey: ['admin-ecommerce-stats'],
    queryFn: async () => {
      const [products, users, orders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase
          .from('orders')
          .select('id, total_amount, status', { count: 'exact' }),
      ])
      const totalSales =
        orders.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      const pendingOrders =
        orders.data?.filter(o => o.status === 'pending').length || 0
      return {
        totalProducts: products.count || 0,
        totalUsers: users.count || 0,
        totalOrders: orders.count || 0,
        totalSales,
        pendingOrders,
      }
    },
    enabled: !!user && isAdmin,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bike className="h-6 w-6 text-blue-600" /> Panel Administrador Ecommerce
        Ciclismo
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-green-600" />
              <span className="text-xl font-bold">
                {stats?.totalProducts ?? '-'}
              </span>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate('/admin/products')}
            >
              Gestionar Productos
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-xl font-bold">
                {stats?.totalUsers ?? '-'}
              </span>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate('/admin/users')}
            >
              Gestionar Usuarios
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              <span className="text-xl font-bold">
                {stats?.totalOrders ?? '-'}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Pendientes: {stats?.pendingOrders ?? '-'}
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => navigate('/admin/sales')}
            >
              Gestionar Pedidos
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <span className="text-xl font-bold">
                ${stats?.totalSales?.toLocaleString('es-CO') ?? '0'} COP
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/products')}
              >
                Productos
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/users')}
              >
                Usuarios
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/sales')}
              >
                Pedidos/Ventas
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Panel de ciclismo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-600">
              Panel optimizado para administrar productos, usuarios y ventas de
              una tienda de ciclismo. Accede a todas las funciones desde aquí.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminEcommerceDashboard

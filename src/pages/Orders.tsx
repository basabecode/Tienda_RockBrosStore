import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { formatPrice, formatDate } from '@/utils/formatters'

// Types para órdenes de Supabase
interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
  product_id?: string
}

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  user_id: string
  shipping_address?: string
  order_items?: OrderItem[]
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'confirmed':
      return <Package className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente'
    case 'confirmed':
      return 'Confirmado'
    case 'shipped':
      return 'Enviado'
    case 'delivered':
      return 'Entregado'
    case 'cancelled':
      return 'Cancelado'
    default:
      return 'Desconocido'
  }
}

const getStatusVariant = (
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending':
      return 'outline'
    case 'confirmed':
      return 'secondary'
    case 'shipped':
      return 'default'
    case 'delivered':
      return 'default'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default function Orders() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Query para obtener órdenes del usuario con error handling robusto
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) {
          throw new Error('Usuario no autenticado')
        }

        const { data, error: supabaseError } = await supabase
          .from('orders')
          .select(
            `
            id,
            created_at,
            status,
            total_amount,
            user_id,
            shipping_address,
            order_items (
              id,
              product_name,
              quantity,
              price,
              product_id
            )
          `
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (supabaseError) {
          console.error('Error fetching orders:', supabaseError)
          throw new Error(`Error al cargar pedidos: ${supabaseError.message}`)
        }

        return data as Order[]
      } catch (error) {
        console.error('Unexpected error in orders query:', error)
        throw error
      }
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>
                Necesitas iniciar sesión para ver tus pedidos.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    )
  }

  // Mostrar estado de error
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800">
                      Error al cargar tus pedidos
                    </h3>
                    <p className="text-red-600 mt-1">
                      {error.message || 'Ha ocurrido un error inesperado'}
                    </p>
                  </div>
                  <Button
                    onClick={() => refetch()}
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
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                aria-label="Volver"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Mis Pedidos</h1>
                <p className="text-muted-foreground">
                  Revisa el estado de tus compras y historial de pedidos
                </p>
              </div>
            </div>
            {!isLoading && orders && orders.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implementar función limpiar historial
                }}
              >
                Limpiar Historial
              </Button>
            )}
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                      <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Lista de Pedidos */}
          {!isLoading && (!orders || orders.length === 0) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No tienes pedidos aún
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Cuando realices tu primera compra, aparecerá aquí
                </p>
                <Button onClick={() => navigate('/')}>
                  Explorar productos
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoading && orders && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map(order => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>Pedido {order.id}</span>
                          <Badge variant={getStatusVariant(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">
                              {getStatusLabel(order.status)}
                            </span>
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(order.created_at)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CreditCard className="h-3 w-3" />
                            <span>{formatPrice(order.total_amount)}</span>
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">
                        Productos ({order.order_items?.length || 0})
                      </h4>
                      {order.order_items?.map((item, index) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm">
                                {item.product_name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Cantidad: {item.quantity}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          {index < (order.order_items?.length || 0) - 1 && (
                            <Separator className="mt-2" />
                          )}
                        </div>
                      ))}
                    </div>

                    {order.status === 'shipped' && (
                      <div className="mt-4 p-3 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-brand-primary" />
                          <span className="text-sm font-medium text-brand-primary">
                            En camino
                          </span>
                        </div>
                        <p className="text-xs text-brand-primary mt-1">
                          Tu pedido ha sido enviado y llegará en 2-3 días
                          hábiles
                        </p>
                      </div>
                    )}

                    {order.status === 'delivered' && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            Entregado
                          </span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Tu pedido ha sido entregado correctamente
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

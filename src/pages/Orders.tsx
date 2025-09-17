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
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'

// Mock data para órdenes
const mockOrders = [
  {
    id: 'ORD-001',
    created_at: '2024-01-15T10:30:00Z',
    status: 'delivered',
    total: 89.99,
    items: [{ name: 'Casco RockBros Pro', quantity: 1, price: 89.99 }],
  },
  {
    id: 'ORD-002',
    created_at: '2024-01-10T14:20:00Z',
    status: 'shipped',
    total: 45.5,
    items: [
      { name: 'Kit de Reparación', quantity: 1, price: 25.5 },
      { name: 'Luz LED', quantity: 1, price: 20.0 },
    ],
  },
  {
    id: 'ORD-003',
    created_at: '2024-01-05T09:15:00Z',
    status: 'pending',
    total: 129.99,
    items: [{ name: 'Candado Anti-robo', quantity: 1, price: 129.99 }],
  },
]

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
            {mockOrders.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implementar función limpiar historial
                  console.log('Limpiar historial de pedidos')
                }}
              >
                Limpiar Historial
              </Button>
            )}
          </div>

          {/* Lista de Pedidos */}
          {mockOrders.length === 0 ? (
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
          ) : (
            <div className="space-y-6">
              {mockOrders.map(order => (
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
                            <span>{formatPrice(order.total)}</span>
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">
                        Productos ({order.items.length})
                      </h4>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-sm">{item.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Cantidad: {item.quantity}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          {index < order.items.length - 1 && (
                            <Separator className="mt-2" />
                          )}
                        </div>
                      ))}
                    </div>

                    {order.status === 'shipped' && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            En camino
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
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

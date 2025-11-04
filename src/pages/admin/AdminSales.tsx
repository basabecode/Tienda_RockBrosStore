import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const AdminSales = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const salesStats = [
    {
      title: 'Ventas Totales',
      value: '$0.00',
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pedidos',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
    },
    {
      title: 'Productos Vendidos',
      value: '0',
      change: '+0%',
      trend: 'neutral',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Ticket Promedio',
      value: '$0.00',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const recentOrders = []

  const topProducts = []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gris-oscuro">
            Reporte de Ventas
          </h1>
          <p className="text-gris-medio mt-2">
            Analiza el rendimiento de ventas de RockBros Store
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-white text-gris-oscuro border-gris-medio/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map(stat => {
          const Icon = stat.icon
          const TrendIcon =
            stat.trend === 'up'
              ? TrendingUp
              : stat.trend === 'down'
              ? TrendingDown
              : BarChart3
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendIcon
                      className={`h-4 w-4 mr-1 ${
                        stat.trend === 'up'
                          ? 'text-green-600'
                          : stat.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gris-medio'
                      }`}
                    />
                    <span
                      className={
                        stat.trend === 'up'
                          ? 'text-green-600'
                          : stat.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gris-medio'
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gris-oscuro mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gris-medio">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gráfico de ventas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-brand-primary" />
            Tendencia de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gris-oscuro/70 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-white mx-auto mb-4" />
              <p className="text-white mb-2">Gráfico de ventas</p>
              <p className="text-sm text-white/80">
                Los datos aparecerán cuando se registren ventas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-brand-primary" />
                Pedidos Recientes
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gris-oscuro hover:bg-gris-medio/10 hover:text-gris-oscuro"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gris-medio mx-auto mb-4" />
                <p className="text-gris-medio mb-2">No hay pedidos recientes</p>
                <p className="text-sm text-gris-medio">
                  Los pedidos aparecerán aquí cuando los clientes realicen
                  compras
                </p>
              </div>
            ) : (
              <div className="space-y-4">{/* Aquí irían los pedidos */}</div>
            )}
          </CardContent>
        </Card>

        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                Productos Más Vendidos
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gris-oscuro hover:bg-gris-medio/10 hover:text-gris-oscuro"
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gris-medio mx-auto mb-4" />
                <p className="text-gris-medio mb-2">
                  No hay datos de productos
                </p>
                <p className="text-sm text-gris-medio">
                  Los productos más vendidos aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">{/* Aquí irían los productos */}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-primary mb-2">0%</p>
              <p className="text-sm text-gris-medio">Tasa de conversión</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 mb-2">0</p>
              <p className="text-sm text-gris-medio">Clientes únicos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Devoluciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600 mb-2">0</p>
              <p className="text-sm text-gris-medio">Productos devueltos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminSales

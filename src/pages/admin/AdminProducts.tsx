import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Filter,
  Grid,
  List,
} from 'lucide-react'

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Datos de ejemplo - en producción vendrían de Supabase
  const products = []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gris-oscuro">
            Gestión de Productos
          </h1>
          <p className="text-gris-medio mt-2">
            Administra el catálogo de productos de RockBros Store
          </p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-secondary text-white">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gris-medio h-4 w-4" />
                <Input
                  placeholder="Buscar productos por nombre, código o categoría..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gris-oscuro placeholder:text-gris-medio border-gris-medio/30"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-gris-oscuro border-gris-medio/30 hover:bg-gris-medio/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gris-medio mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gris-oscuro mb-2">
              No hay productos registrados
            </h3>
            <p className="text-gris-medio mb-6 max-w-md mx-auto">
              Comienza agregando productos a tu catálogo para que los clientes
              puedan explorar y comprar en tu tienda.
            </p>
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Producto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Aquí irían los productos en formato grid o lista */}
          <Card>
            <CardContent className="p-6">
              <p className="text-gris-medio text-center">
                Los productos aparecerán aquí cuando se agreguen al catálogo.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gris-medio">
                  Total Productos
                </p>
                <p className="text-2xl font-bold text-gris-oscuro">0</p>
              </div>
              <Package className="h-8 w-8 text-brand-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gris-medio">En Stock</p>
                <p className="text-2xl font-bold text-verde-bosque">0</p>
              </div>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600 bg-white"
              >
                Disponible
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gris-medio">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <Badge
                variant="outline"
                className="text-red-600 border-red-600 bg-white"
              >
                Agotado
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gris-medio">
                  Categorías
                </p>
                <p className="text-2xl font-bold text-gris-oscuro">0</p>
              </div>
              <Filter className="h-8 w-8 text-brand-dark" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminProducts

import { useState, useMemo } from 'react'
import { useProductsQuery } from '@/hooks/useProductsQuery'
import { useCart } from '@/hooks/use-cart'
import { useFavorites } from '@/hooks/use-favorites'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ShoppingCart,
  Heart,
  Eye,
  Search,
  Filter,
  X,
  Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

interface ProductFilters {
  search: string
  category: string
  brand: string
  minPrice: number
  maxPrice: number
}

export default function ProductGrid() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000000,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useProductsQuery(filters)

  // Obtener categorías y marcas únicas
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.sort()
  }, [products])

  const brands = useMemo(() => {
    const brandList = [...new Set(products.map(p => p.brand))]
    return brandList.sort()
  }, [products])

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para agregar productos al carrito',
        variant: 'destructive',
      })
      return
    }

    const product = products.find(p => p.id === productId)
    if (!product) return

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        stock: product.stock,
        quantity: 1,
      })
      toast({
        title: 'Producto agregado',
        description: 'El producto se agregó correctamente al carrito',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto al carrito',
        variant: 'destructive',
      })
    }
  }

  const handleToggleFavorite = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para gestionar favoritos',
        variant: 'destructive',
      })
      return
    }

    const product = products.find(p => p.id === productId)
    if (!product) return

    try {
      const favoriteItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        stock: product.stock,
        category: product.category,
        brand: product.brand,
      }

      const wasFavorite = isFavorite(productId)
      toggleFavorite(favoriteItem)

      toast({
        title: wasFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
        description: wasFavorite
          ? 'El producto se eliminó de tus favoritos'
          : 'El producto se agregó a tus favoritos',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar favoritos',
        variant: 'destructive',
      })
    }
  }

  const handleViewDetails = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000000,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice > 0 ||
    filters.maxPrice < 1000000

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando productos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error al cargar productos</p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con búsqueda y filtros */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={filters.search}
                onChange={e =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {
                    [filters.search, filters.category, filters.brand].filter(
                      Boolean
                    ).length
                  }
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Categoría
                </label>
                <Select
                  value={filters.category}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Marca</label>
                <Select
                  value={filters.brand}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, brand: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las marcas</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Precio mínimo
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      minPrice: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Precio máximo
                </label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={filters.maxPrice === 1000000 ? '' : filters.maxPrice}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      maxPrice: Number(e.target.value) || 1000000,
                    }))
                  }
                />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Contador de productos */}
      <div className="mb-6">
        <p className="text-gray-600">
          {products.length} producto{products.length !== 1 ? 's' : ''}{' '}
          encontrado{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid de productos */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No se encontraron productos</p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map(product => (
            <Card
              key={product.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div
                className="relative overflow-hidden bg-gray-50 flex items-center justify-center"
                style={{ minHeight: '200px', maxHeight: '280px' }}
              >
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="object-contain w-full h-full max-w-full max-h-full p-2 group-hover:scale-105 transition-transform duration-300"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                  onError={e => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.is_featured && (
                    <Badge variant="default" className="bg-blue-500">
                      Destacado
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant="destructive">Agotado</Badge>
                  )}
                </div>

                {/* Botones de acción */}
                <div
                  className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={e => {
                      e.stopPropagation()
                      handleToggleFavorite(product.id)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite(product.id)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={e => {
                      e.stopPropagation()
                      handleViewDetails(product.id)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  {/* Marca */}
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </p>

                  {/* Nombre del producto */}
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Precio */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-500">
                      ${product.price.toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  {/* Botón agregar al carrito */}
                  <Button
                    className="w-full mt-4"
                    onClick={e => {
                      e.stopPropagation()
                      handleAddToCart(product.id)
                    }}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

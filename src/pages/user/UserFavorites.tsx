import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Search,
  Filter,
  Grid3X3,
  List,
  Package,
  Star,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'
import { UnifiedFavoriteItem, UnifiedFavoriteRecord } from '@/types/favorites'
import { useToast } from '@/hooks/use-toast'
import { formatPrice } from '@/utils/formatters'

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'price-asc' | 'price-desc' | 'date-added'
type FilterOption = 'all' | 'available' | 'unavailable'

export default function UserFavorites() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()

  // Estados locales
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('date-added')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  // Hook de favoritos
  const {
    favorites,
    isLoading,
    error,
    favoriteCount,
    refetch,
    removeFavorite,
  } = useUnifiedFavorites()

  // Calcular valores derivados
  const totalValue = useMemo(() => {
    return favorites.reduce((sum, item) => {
      return sum + (item.products?.price || 0)
    }, 0)
  }, [favorites])

  const availableCount = useMemo(() => {
    return favorites.filter(item => (item.products?.stock || 0) > 0).length
  }, [favorites])

  // Filtrado y ordenamiento
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites || []

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.products?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.products?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    }

    // Aplicar filtro de disponibilidad
    if (filterBy !== 'all') {
      filtered = filtered.filter(item =>
        filterBy === 'available'
          ? (item.products?.stock || 0) > 0
          : (item.products?.stock || 0) === 0
      )
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.products?.name || '').localeCompare(b.products?.name || '')
        case 'price-asc':
          return (a.products?.price || 0) - (b.products?.price || 0)
        case 'price-desc':
          return (b.products?.price || 0) - (a.products?.price || 0)
        case 'date-added':
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
      }
    })

    return filtered
  }, [favorites, searchQuery, filterBy, sortBy])

  // Handlers
  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId)
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado de tus favoritos',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto de favoritos',
        variant: 'destructive',
      })
    }
  }

  const handleAddToCart = (product: UnifiedFavoriteItem) => {
    if ((product.stock || 0) <= 0) {
      toast({
        title: 'Producto no disponible',
        description: 'Este producto no está disponible actualmente',
        variant: 'destructive',
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.main_image || product.image_url || '/placeholder.jpg',
      stock: product.stock || 0,
    })

    toast({
      title: 'Producto agregado',
      description: `${product.name} ha sido agregado al carrito`,
    })
  }

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`)
  }

  const handleExploreProducts = () => {
    navigate('/products')
  }

  // Componente de producto en vista grid
  const ProductGridCard = ({ item }: { item: UnifiedFavoriteRecord }) => {
    const product = item.products
    if (!product) return null

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
        <CardContent className="p-0">
          {/* Imagen del producto */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={
                product.main_image || product.image_url || '/placeholder.jpg'
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {(product.stock || 0) <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm font-medium">
                  Agotado
                </Badge>
              </div>
            )}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-9 w-9 p-0 bg-white/80 hover:bg-white"
                onClick={() => handleViewProduct(product.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-9 w-9 p-0 bg-white/80 hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={() => handleRemoveFavorite(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contenido del producto */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.category && (
                <Badge variant="outline" className="mt-2">
                  {product.category}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Agregado el {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Button
              className="w-full h-11"
              onClick={() => handleAddToCart(product)}
              disabled={(product.stock || 0) <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {(product.stock || 0) > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Componente de producto en vista lista
  const ProductListItem = ({ item }: { item: UnifiedFavoriteRecord }) => {
    const product = item.products
    if (!product) return null

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Imagen */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={
                  product.main_image || product.image_url || '/placeholder.jpg'
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {(product.stock || 0) <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-xs">
                    Agotado
                  </Badge>
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                  {product.category && (
                    <Badge variant="outline" className="mt-1">
                      {product.category}
                    </Badge>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Agregado el {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewProduct(product.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => handleAddToCart(product)}
                disabled={(product.stock || 0) <= 0}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveFavorite(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Componente de estadísticas
  const FavoritesStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Favoritos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {favoriteCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(totalValue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Promedio Precio
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {favoriteCount > 0
                  ? formatPrice(totalValue / favoriteCount)
                  : formatPrice(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Estado vacío mejorado y motivacional
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-32 h-32 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-8">
        <Heart className="h-16 w-16 text-emerald-600" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        ¡Tu lista de favoritos está vacía!
      </h2>

      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        Descubre productos increíbles y guárdalos aquí para encontrarlos
        fácilmente después.
      </p>

      {/* Tips útiles */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-8 mb-8 max-w-2xl mx-auto border border-emerald-200">
        <h3 className="font-semibold text-emerald-900 mb-4 text-xl">
          💡 Tips para una mejor experiencia:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-800">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 mt-0.5 text-emerald-600" />
            <span>
              Guarda productos que te interesen haciendo clic en el corazón ❤️
            </span>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 mt-0.5 text-emerald-600" />
            <span>Compara precios y características antes de comprar</span>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 text-emerald-600" />
            <span>Recibe notificaciones de ofertas especiales</span>
          </div>
          <div className="flex items-start gap-3">
            <ShoppingBag className="h-5 w-5 mt-0.5 text-emerald-600" />
            <span>Agrega múltiples productos al carrito desde aquí</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleExploreProducts}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg"
        >
          <Search className="h-5 w-5 mr-2" />
          Explorar productos
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/categories')}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-lg"
        >
          <Package className="h-5 w-5 mr-2" />
          Ver categorías
        </Button>
      </div>
    </div>
  )

  // Estados de carga y error
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Acceso Requerido
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para ver tus productos favoritos
          </p>
          <Button onClick={() => navigate('/auth/login')} size="lg">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-11"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              Mis Favoritos
            </h1>
            <p className="text-gray-600 mt-1">
              Error al cargar tus productos favoritos
            </p>
          </div>
        </div>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>
                {error.message ||
                  'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header mejorado con gradiente */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-10 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>

            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                <Heart className="h-8 w-8 text-white" />
                Mis Favoritos
              </h1>
              <p className="text-emerald-100 opacity-90">
                Productos que has guardado para más tarde • {favoriteCount}{' '}
                elementos
              </p>
            </div>
          </div>

          {/* Acciones rápidas */}
          {favoriteCount > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={refetch}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-sm font-medium text-white">
                  Valor total: {formatPrice(totalValue)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      {!isLoading && favoriteCount > 0 && <FavoritesStats />}

      {/* Controles de filtro y búsqueda mejorados */}
      {!isLoading && favoriteCount > 0 && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-lg border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Búsqueda mejorada */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar productos en favoritos..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-base"
                  />
                  {searchQuery && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Filtros y vista */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select
                    value={filterBy}
                    onValueChange={(value: FilterOption) => setFilterBy(value)}
                  >
                    <SelectTrigger className="w-[140px] h-12 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📦 Todos</SelectItem>
                      <SelectItem value="available">✅ Disponibles</SelectItem>
                      <SelectItem value="unavailable">❌ Agotados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[160px] h-12 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-added">🕐 Más recientes</SelectItem>
                    <SelectItem value="name">🔤 Nombre A-Z</SelectItem>
                    <SelectItem value="price-asc">💰 Precio menor</SelectItem>
                    <SelectItem value="price-desc">💎 Precio mayor</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-12 px-4 rounded-none ${
                      viewMode === 'grid'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-12 px-4 rounded-none ${
                      viewMode === 'list'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Estadísticas y acciones rápidas */}
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                {filteredAndSortedFavorites.length} de {favoriteCount} productos
                {searchQuery && ` • Búsqueda: "${searchQuery}"`}
              </div>
              {availableCount > 0 && (
                <Button
                  onClick={() => {
                    const availableProducts = filteredAndSortedFavorites.filter(
                      item => item.products.stock > 0
                    )
                    availableProducts.forEach(item => {
                      handleAddToCart(item.products)
                    })
                    toast({
                      title: 'Productos agregados',
                      description: `${availableProducts.length} productos agregados al carrito`,
                    })
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar disponibles al carrito ({availableCount})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card key={i}>
                <Skeleton className="aspect-square rounded-t-lg" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-20 mb-4" />
                  <Skeleton className="h-11 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : favoriteCount === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Resultados */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredAndSortedFavorites.length} de {favoriteCount} productos
              {searchQuery && ` • Búsqueda: "${searchQuery}"`}
            </p>
            {availableCount > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  // Agregar todos los disponibles al carrito
                  const availableProducts = filteredAndSortedFavorites.filter(
                    item => (item.products?.stock || 0) > 0
                  )
                  availableProducts.forEach(item => {
                    if (item.products) {
                      handleAddToCart(item.products)
                    }
                  })
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar disponibles al carrito ({availableCount})
              </Button>
            )}
          </div>

          {/* Grid/Lista de productos */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedFavorites.map(item => (
                <ProductGridCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedFavorites.map(item => (
                <ProductListItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Mensaje si no hay resultados filtrados */}
          {filteredAndSortedFavorites.length === 0 && (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay productos que coincidan con tu búsqueda o filtros
                  actuales.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterBy('all')
                  }}
                >
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { useProductsQuery } from '@/hooks/useProductsQuery'
import { useCart } from '@/hooks/use-cart'
import { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'
import { useAuth } from '@/hooks/use-auth'
import { useSearch } from '@/hooks/use-search-context'
import { useViewedProducts } from '@/hooks/use-viewed-products'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ShoppingCart,
  Heart,
  Eye,
  Loader2,
  Package,
  Filter as FilterIcon,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import SimpleSearchBar from '@/components/SimpleSearchBar'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import type { Product } from '@/lib/types'

export default function ProductGrid() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useUnifiedFavorites()
  const { searchTerm, setSearchTerm } = useSearch()
  const { addViewedProduct } = useViewedProducts()

  // Estados locales
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12) // 12 productos por página

  // Estados de filtros locales
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  })

  // Query de productos con paginación server-side
  const {
    data: productResult,
    isLoading,
    error,
    refetch,
  } = useProductsQuery({
    ...filters,
    search: searchTerm,
    page: currentPage,
    pageSize: productsPerPage,
  })

  // Extraer datos del resultado paginado
  const products = React.useMemo(
    () => productResult?.data || [],
    [productResult?.data]
  )
  const totalCount = React.useMemo(
    () => productResult?.totalCount || 0,
    [productResult?.totalCount]
  )
  const totalPages = React.useMemo(
    () => productResult?.totalPages || 0,
    [productResult?.totalPages]
  )

  // Funciones de filtros optimizadas
  const updateFilter = React.useCallback(
    (key: keyof typeof filters, value: string | number | undefined) => {
      setFilters(prev => ({ ...prev, [key]: value }))
      setCurrentPage(1) // Reset página al cambiar filtros
    },
    []
  )

  const clearFilters = React.useCallback(() => {
    setFilters({
      category: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
    })
    setCurrentPage(1)
  }, [])

  const activeFiltersCount = React.useMemo(() => {
    return (
      Object.values(filters).filter(
        value => value !== '' && value !== undefined && value !== null
      ).length + (searchTerm ? 1 : 0)
    )
  }, [filters, searchTerm])

  // Función para limpiar todos los filtros incluyendo búsqueda global
  const clearAllFilters = React.useCallback(() => {
    clearFilters()
    setSearchTerm('')
  }, [clearFilters, setSearchTerm])

  // Listener para filtrado por categoría desde Categories
  React.useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent<{ category: string }>) => {
      const categoryName = event.detail.category
      // Limpiar otros filtros y aplicar solo la categoría seleccionada
      clearFilters()
      setSearchTerm('')
      // Activar filtro de categoría
      setTimeout(() => {
        updateFilter('category', categoryName)
      }, 100)
    }

    window.addEventListener(
      'filterByCategory',
      handleCategoryFilter as EventListener
    )

    return () => {
      window.removeEventListener(
        'filterByCategory',
        handleCategoryFilter as EventListener
      )
    }
  }, [clearFilters, setSearchTerm, updateFilter])

  // Reset de página cuando cambian los filtros o búsqueda
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchTerm])

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
    const product = products.find(p => p.id === productId)
    if (!product) return

    try {
      // Verificar si ya está en favoritos
      const isCurrentlyFavorite = isFavorite(productId)

      if (isCurrentlyFavorite) {
        // Encontrar el favorito para eliminarlo
        const favoriteToRemove = favorites.find(
          fav => fav.product_id === productId
        )
        if (favoriteToRemove) {
          await removeFavorite(favoriteToRemove.id)
          toast({
            title: 'Eliminado de favoritos',
            description: `${product.name} se eliminó de tus favoritos`,
          })
        }
      } else {
        // Agregar a favoritos con el formato correcto
        const favoriteItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          main_image: product.main_image || product.images?.[0],
          image_url: product.images?.[0], // Compatibilidad
          stock: product.stock,
          category: product.category,
          brand: product.brand,
          description: product.description,
          is_active: product.is_active,
        }

        await addFavorite(favoriteItem)
        toast({
          title: 'Agregado a favoritos',
          description: `${product.name} se agregó a tus favoritos`,
        })
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar favoritos',
        variant: 'destructive',
      })
    }
  }

  const handleViewDetails = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      // Registrar como producto visto
      addViewedProduct({
        id: product.id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
      })
    }
    navigate(`/product/${productId}`)
  }

  // Funciones de paginación optimizadas para server-side
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // Scroll al inicio de los productos
      document.getElementById('products-grid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const renderProductCard = (product: Product) => (
    <Card
      key={product.id}
      className="card-dark-enhanced group cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {product.main_image ? (
            <img
              src={product.main_image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gris-medio/20 flex items-center justify-center">
              <Package className="h-16 w-16 text-gris-medio" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <Badge className="bg-verde-neon text-gris-oscuro font-semibold">
                Destacado
              </Badge>
            )}
            {product.compare_price && product.compare_price > product.price && (
              <Badge className="bg-red-500 text-white">
                -
                {Math.round(
                  ((product.compare_price - product.price) /
                    product.compare_price) *
                    100
                )}
                %
              </Badge>
            )}
            {product.stock <= 0 && <Badge variant="destructive">Agotado</Badge>}
          </div>
        </div>

        {/* Información del producto */}
        <div className="p-4 space-y-3">
          {/* Categoría y marca */}
          <div className="flex items-center justify-between text-sm">
            <Badge
              variant="outline"
              className="text-verde-neon border-verde-neon/30"
            >
              {product.category}
            </Badge>
            {product.brand && (
              <span className="text-gris-medio">{product.brand}</span>
            )}
          </div>

          {/* Nombre del producto */}
          <h3 className="text-white font-semibold line-clamp-2 hover:text-verde-neon transition-colors">
            {product.name}
          </h3>

          {/* Precio */}
          <div className="flex items-center gap-2">
            <span className="price-primary text-lg">
              ${product.price.toLocaleString('es-CO')}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-gris-medio line-through text-sm">
                ${product.compare_price.toLocaleString('es-CO')}
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            {/* Botón agregar al carrito */}
            <Button
              onClick={e => {
                e.stopPropagation()
                handleAddToCart(product.id)
              }}
              disabled={product.stock <= 0}
              className="button-primary-glow flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock <= 0 ? 'Agotado' : 'Agregar'}
            </Button>

            {/* Botón favoritos */}
            <Button
              onClick={e => {
                e.stopPropagation()
                handleToggleFavorite(product.id)
              }}
              variant="outline"
              size="icon"
              className="bg-gris-medio/20 border-gris-medio/30 text-white hover:bg-gris-medio/40 hover:border-verde-neon/50"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>

            {/* Botón ver detalles */}
            <Button
              onClick={e => {
                e.stopPropagation()
                handleViewDetails(product.id)
              }}
              variant="outline"
              size="icon"
              className="bg-gris-medio/20 border-gris-medio/30 text-white hover:bg-gris-medio/40 hover:border-verde-neon/50"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <section id="shop" className="pt-20 pb-16 bg-gris-oscuro">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-verde-neon" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="shop" className="pt-20 pb-16 bg-gris-oscuro">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Error al cargar productos
            </h2>
            <Button onClick={() => refetch()} className="button-primary-glow">
              Reintentar
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="shop"
      className="pt-20 pb-16 bg-gris-oscuro border-t-2 border-verde-neon/20"
    >
      <div className="container mx-auto">
        {/* Header con título y búsqueda */}
        <div className="bg-gris-medio/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gris-medio/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-verde-neon bg-clip-text text-transparent">
                Productos de Ciclismo
              </h2>
              <p className="text-white-900 text-lg">
                Encuentra todo lo que necesitas para tu bicicleta
              </p>
            </div>

            <div className="flex items-center gap-4">
              <SimpleSearchBar onSearch={term => setSearchTerm(term)} />

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gris-medio/30 bg-gris-medio/20 text-white hover:bg-gris-medio/30 hover:border-verde-neon/50"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Productos vistos recientemente */}
        <RecentlyViewed />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de filtros - Simplificado temporalmente */}
          {showFilters && (
            <div className="lg:w-80 bg-gris-medio/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filtros</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="text-gris-claro hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Categoría</Label>
                  <Input
                    value={filters.category}
                    onChange={e => updateFilter('category', e.target.value)}
                    placeholder="Filtrar por categoría"
                    className="bg-gris-oscuro/50 border-gris-medio text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Marca</Label>
                  <Input
                    value={filters.brand}
                    onChange={e => updateFilter('brand', e.target.value)}
                    placeholder="Filtrar por marca"
                    className="bg-gris-oscuro/50 border-gris-medio text-white"
                  />
                </div>

                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="w-full border-gris-medio text-gris-claro hover:text-white"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}

          {/* Grid de productos */}
          <div className="flex-1">
            {/* Contador de productos */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-white-900">
                Mostrando{' '}
                {products.length > 0
                  ? `${(currentPage - 1) * productsPerPage + 1}-${Math.min(
                      currentPage * productsPerPage,
                      totalCount
                    )}`
                  : '0'}{' '}
                de {totalCount} productos
                {searchTerm && (
                  <span className="text-verde-neon ml-2">
                    para "{searchTerm}"
                  </span>
                )}
                {totalPages > 1 && (
                  <span className="text-gris-medio/70 ml-2">
                    (Página {currentPage} de {totalPages})
                  </span>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gris-medio hover:text-white"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>

            {products.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gris-medio/50" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gris-medio mb-6">
                  {searchTerm
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : 'Intenta ajustar los filtros de búsqueda'}
                </p>
                {activeFiltersCount > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    className="button-primary-glow"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Grid de productos con paginación */}
                <div
                  id="products-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {products.map(renderProductCard)}
                </div>

                {/* Controles de paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="text-white border-gris-medio hover:bg-verde-neon hover:text-gris-oscuro"
                    >
                      Anterior
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={
                            currentPage === page
                              ? 'bg-verde-neon text-gris-oscuro'
                              : 'text-white border-gris-medio hover:bg-verde-neon hover:text-gris-oscuro'
                          }
                        >
                          {page}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="text-white border-gris-medio hover:bg-verde-neon hover:text-gris-oscuro"
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

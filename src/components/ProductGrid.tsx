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
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ShoppingCart,
  Heart,
  Eye,
  Loader2,
  Package,
  Filter as FilterIcon,
  X,
  ChevronDown,
  DollarSign,
  Star,
  Award,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import SimpleSearchBar from '@/components/SimpleSearchBar'
import { RecentlyViewed } from '@/components/RecentlyViewed'
import {
  ROCKBROS_CATEGORIES,
  getCategoryNames,
  isValidCategory,
  getCategoryById,
  type Category,
} from '@/lib/constants/categories'

// Fallback categories en caso de error
const FALLBACK_CATEGORIES = [
  { id: 'seguridad', name: 'Seguridad', count: 0 },
  { id: 'bolsos', name: 'Bolsos', count: 0 },
  { id: 'accesorios', name: 'Accesorios', count: 0 },
  { id: 'herramientas', name: 'Herramientas', count: 0 },
]
import type { Product } from '@/lib/types'

// FilterErrorBoundary removido - causaba conflictos de renderizado

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

  // Estados de filtros locales mejorados
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    inStock: false,
    onSale: false,
    featured: false,
  })

  // Estado local para el slider de precio
  const [priceRange, setPriceRange] = useState([0, 1000000])

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

  // Estadísticas de filtros para mejor UX
  const filterStats = React.useMemo(() => {
    const availableCategories = ROCKBROS_CATEGORIES.map(cat => cat.name)
    const availableBrands = ['RockBros']
    const priceRangeData = { min: 0, max: 1000000 } // Rango típico de productos

    return {
      totalProducts: totalCount,
      filteredCount: products.length,
      availableCategories,
      availableBrands,
      priceRange: priceRangeData,
    }
  }, [totalCount, products.length])

  // Funciones de filtros simplificadas y estables
  const updateFilter = React.useCallback(
    (
      key: keyof typeof filters,
      value: string | number | boolean | undefined
    ) => {
      console.log(`🔄 Actualizando filtro ${key}:`, value)

      // Manejar valores especiales de "reset" y valores vacíos para strings
      let processedValue = value
      if (
        typeof value === 'string' &&
        (value === '' ||
          value === null ||
          value === undefined ||
          value === 'todas-categorias' ||
          value === 'todas-marcas')
      ) {
        processedValue =
          key === 'minPrice' || key === 'maxPrice' ? undefined : ''
      }

      setFilters(prev => ({
        ...prev,
        [key]: processedValue,
      }))
      setCurrentPage(1) // Reset página al cambiar filtros
      console.log('✅ Filtro actualizado correctamente')
    },
    []
  )

  const clearFilters = React.useCallback(() => {
    setFilters({
      category: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      onSale: false,
      featured: false,
    })
    setPriceRange([0, 1000000])
    setCurrentPage(1)
  }, [])

  const activeFiltersCount = React.useMemo(() => {
    return (
      Object.entries(filters).filter(([key, value]) => {
        if (key === 'minPrice' || key === 'maxPrice') {
          return value !== undefined && value !== null
        }
        if (typeof value === 'boolean') {
          return value === true
        }
        return value !== '' && value !== undefined && value !== null
      }).length + (searchTerm ? 1 : 0)
    )
  }, [filters, searchTerm])

  // Función para manejar cambios en el slider de precio
  const handlePriceChange = React.useCallback(
    (values: number[]) => {
      setPriceRange(values)
      updateFilter('minPrice', values[0])
      updateFilter('maxPrice', values[1])
    },
    [updateFilter]
  )

  // Función para formatear precios en COP
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Función para limpiar todos los filtros incluyendo búsqueda global
  const clearAllFilters = React.useCallback(() => {
    clearFilters()
    setSearchTerm('')
  }, [clearFilters, setSearchTerm])

  // Listener mejorado para filtrado por categoría desde Categories
  React.useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent<{ category: string }>) => {
      const categoryName = event.detail.category

      console.log('🔍 Filtro de categoría activado:', categoryName)

      // Validar que la categoría sea válida
      if (!isValidCategory(categoryName)) {
        console.warn('❌ Categoría inválida:', categoryName)
        return
      }

      // Limpiar otros filtros primero
      clearFilters()
      setSearchTerm('')

      // Aplicar filtro de categoría con validación
      setTimeout(() => {
        console.log('✅ Aplicando filtro para:', categoryName)
        updateFilter('category', categoryName)

        // Scroll suave a la sección de resultados
        const resultsSection = document.getElementById('products-grid')
        if (resultsSection) {
          resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 200)
    }

    // Registrar listener
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
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isFavorite(product.id)
                    ? 'Quitar de favoritos'
                    : 'Agregar a favoritos'}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Botón ver detalles */}
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver más</p>
              </TooltipContent>
            </Tooltip>
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
    <TooltipProvider>
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
                  onClick={() => {
                    console.log(
                      '🔧 Toggling filtros, estado actual:',
                      showFilters
                    )
                    setShowFilters(prev => {
                      const newState = !prev
                      console.log('✅ Nuevo estado de filtros:', newState)
                      return newState
                    })
                  }}
                  className={`
                  border-gris-medio/30 bg-gris-medio/20 text-white transition-all duration-300
                  hover:bg-verde-neon/20 hover:border-verde-neon/70 hover:scale-105 hover:text-verde-neon
                  ${
                    showFilters
                      ? 'bg-verde-neon/20 border-verde-neon/50 text-verde-neon'
                      : ''
                  }
                `}
                >
                  <FilterIcon
                    className={`h-4 w-4 mr-2 transition-transform ${
                      showFilters ? 'rotate-180' : ''
                    }`}
                  />
                  {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-verde-neon text-gris-oscuro font-bold text-xs animate-pulse">
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
            {/* Sidebar de filtros mejorado con secciones colapsables */}
            {showFilters && (
              <div className="lg:w-80 bg-gris-medio/20 rounded-lg border border-gris-medio/30 overflow-hidden">
                {/* Header sticky mejorado */}
                <div className="p-4 border-b border-gris-medio/30 bg-gris-oscuro/95 sticky top-0 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FilterIcon className="h-5 w-5 text-verde-neon" />
                      <h3 className="text-lg font-semibold text-white">
                        Filtros Avanzados
                      </h3>
                      {activeFiltersCount > 0 && (
                        <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="text-gris-claro hover:text-white hover:bg-gris-medio/30"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gris-medio">Productos:</span>
                    <span className="text-verde-neon font-semibold">
                      {filterStats.filteredCount} de {filterStats.totalProducts}
                    </span>
                  </div>

                  {activeFiltersCount > 0 && (
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="w-full border-gris-medio/30 text-gris-medio hover:text-white hover:bg-gris-medio/20"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpiar todos los filtros
                    </Button>
                  )}
                </div>

                {/* Secciones de filtros */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {/* Sección Categorías */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span className="font-medium">Categorías</span>
                        {filters.category &&
                          filters.category !== 'todas-categorias' && (
                            <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                              1
                            </Badge>
                          )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-2 ml-6">
                      <Select
                        value={filters.category || 'todas-categorias'}
                        onValueChange={value => updateFilter('category', value)}
                      >
                        <SelectTrigger className="bg-gris-oscuro border-gris-medio text-white hover:border-verde-neon/50 transition-colors">
                          <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent className="bg-gris-oscuro border-gris-medio shadow-xl">
                          <SelectItem
                            value="todas-categorias"
                            className="text-white hover:bg-gris-medio/30"
                          >
                            📦 Todas las categorías
                          </SelectItem>
                          {ROCKBROS_CATEGORIES.map(category => (
                            <SelectItem
                              key={category.id}
                              value={category.name}
                              className="text-white hover:bg-gris-medio/30"
                            >
                              {category.name === 'Seguridad' && '🛡️ '}
                              {category.name === 'Bolsos' && '🎒 '}
                              {category.name === 'Accesorios' && '⚙️ '}
                              {category.name === 'Herramientas' && '🔧 '}
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Sección Marcas */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">Marcas</span>
                        {filters.brand && filters.brand !== 'todas-marcas' && (
                          <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                            1
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-2 ml-6">
                      <Select
                        value={filters.brand || 'todas-marcas'}
                        onValueChange={value => updateFilter('brand', value)}
                      >
                        <SelectTrigger className="bg-gris-oscuro border-gris-medio text-white hover:border-verde-neon/50 transition-colors">
                          <SelectValue placeholder="Todas las marcas" />
                        </SelectTrigger>
                        <SelectContent className="bg-gris-oscuro border-gris-medio shadow-xl">
                          <SelectItem
                            value="todas-marcas"
                            className="text-white hover:bg-gris-medio/30"
                          >
                            🏷️ Todas las marcas
                          </SelectItem>
                          <SelectItem
                            value="RockBros"
                            className="text-white hover:bg-gris-medio/30"
                          >
                            🚴 RockBros
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Sección Precio con Slider */}
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Precio</span>
                        {(filters.minPrice !== undefined ||
                          filters.maxPrice !== undefined) && (
                          <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                            Activo
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-2 ml-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gris-medio">
                          <span>{formatPrice(filterStats.priceRange.min)}</span>
                          <span>{formatPrice(filterStats.priceRange.max)}</span>
                        </div>
                        <Slider
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          max={filterStats.priceRange.max}
                          min={filterStats.priceRange.min}
                          step={10000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-verde-neon font-semibold">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gris-medio">
                            Mínimo
                          </Label>
                          <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={e => {
                              const value = Number(e.target.value)
                              setPriceRange([value, priceRange[1]])
                              updateFilter('minPrice', value)
                            }}
                            className="bg-gris-medio/20 border-gris-medio/30 text-white text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gris-medio">
                            Máximo
                          </Label>
                          <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={e => {
                              const value = Number(e.target.value)
                              setPriceRange([priceRange[0], value])
                              updateFilter('maxPrice', value)
                            }}
                            className="bg-gris-medio/20 border-gris-medio/30 text-white text-sm"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Sección Características */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-white hover:text-verde-neon hover:bg-gris-medio/10 rounded">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">Características</span>
                        {(filters.inStock ||
                          filters.onSale ||
                          filters.featured) && (
                          <Badge className="bg-verde-neon/20 text-verde-neon border-verde-neon/30 text-xs">
                            {
                              [
                                filters.inStock,
                                filters.onSale,
                                filters.featured,
                              ].filter(Boolean).length
                            }
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-2 ml-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={filters.inStock}
                          onCheckedChange={checked =>
                            updateFilter('inStock', checked as boolean)
                          }
                          className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
                        />
                        <Label
                          htmlFor="in-stock"
                          className="text-sm text-white hover:text-verde-neon cursor-pointer"
                        >
                          Solo en stock
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="on-sale"
                          checked={filters.onSale}
                          onCheckedChange={checked =>
                            updateFilter('onSale', checked as boolean)
                          }
                          className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
                        />
                        <Label
                          htmlFor="on-sale"
                          className="text-sm text-white hover:text-verde-neon cursor-pointer"
                        >
                          En oferta
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={filters.featured}
                          onCheckedChange={checked =>
                            updateFilter('featured', checked as boolean)
                          }
                          className="border-gris-medio data-[state=checked]:bg-verde-neon data-[state=checked]:border-verde-neon"
                        />
                        <Label
                          htmlFor="featured"
                          className="text-sm text-white hover:text-verde-neon cursor-pointer"
                        >
                          Destacados
                        </Label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
                    className="text-white-medio hover:text-grey-white hover:bg-verde-neon/20"
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
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
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
    </TooltipProvider>
  )
}

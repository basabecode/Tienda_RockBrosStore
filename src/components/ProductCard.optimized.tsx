import React, { memo, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Eye, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  onToggleFavorite: (productId: string) => void
  onViewDetails: (productId: string) => void
  isFavorite: boolean
  hoveredProduct?: string | null
  onMouseEnter?: (productId: string) => void
  onMouseLeave?: () => void
}

// Componente de imagen lazy loading
const LazyImage = memo(
  ({
    src,
    alt,
    className,
  }: {
    src: string
    alt: string
    className: string
  }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    const handleLoad = useCallback(() => {
      setIsLoaded(true)
    }, [])

    const handleError = useCallback(() => {
      setHasError(true)
      setIsLoaded(true)
    }, [])

    if (!src || hasError) {
      return (
        <div
          className={cn(
            'bg-gris-medio/20 flex items-center justify-center',
            className
          )}
        >
          <Package className="h-16 w-16 text-gris-medio" />
        </div>
      )
    }

    return (
      <div className={cn('relative', className)}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gris-medio/10 animate-pulse" />
        )}
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-all duration-500 group-hover:scale-110',
            !isLoaded && 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }
)

LazyImage.displayName = 'LazyImage'

const ProductCardOptimized = memo<ProductCardProps>(
  ({
    product,
    onAddToCart,
    onToggleFavorite,
    onViewDetails,
    isFavorite,
    hoveredProduct,
    onMouseEnter,
    onMouseLeave,
  }) => {
    const isHovered = hoveredProduct === product.id

    const handleAddToCart = useCallback(() => {
      onAddToCart(product.id)
    }, [onAddToCart, product.id])

    const handleToggleFavorite = useCallback(() => {
      onToggleFavorite(product.id)
    }, [onToggleFavorite, product.id])

    const handleViewDetails = useCallback(() => {
      onViewDetails(product.id)
    }, [onViewDetails, product.id])

    const handleMouseEnter = useCallback(() => {
      onMouseEnter?.(product.id)
    }, [onMouseEnter, product.id])

    // Formatear precio
    const formattedPrice = React.useMemo(() => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(product.price)
    }, [product.price])

    return (
      <Card
        className="card-dark-enhanced group cursor-pointer transition-all duration-300 hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <CardContent className="p-0">
          {/* Imagen del producto */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <LazyImage
              src={product.main_image || product.images?.[0] || ''}
              alt={product.name}
              className="w-full h-full"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_featured && (
                <Badge className="bg-verde-neon text-gris-oscuro font-semibold">
                  Destacado
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Agotado</Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge
                  variant="outline"
                  className="border-orange-500 text-orange-500"
                >
                  Pocas unidades
                </Badge>
              )}
            </div>

            {/* Botones de acción */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-gris-oscuro/80 via-transparent to-transparent',
                'flex items-end justify-center p-3',
                'opacity-0 group-hover:opacity-100 transition-all duration-300'
              )}
            >
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleViewDetails}
                  className="bg-verde-neon/90 hover:bg-verde-neon text-gris-oscuro"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={cn(
                    'border-blanco/20 hover:bg-blanco/10',
                    isFavorite && 'bg-red-500/20 border-red-500 text-red-400'
                  )}
                >
                  <Heart
                    className={cn('h-4 w-4', isFavorite && 'fill-current')}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="p-4 space-y-3">
            {/* Título y categoría */}
            <div>
              <h3
                className="font-medium text-blanco line-clamp-2 mb-1 cursor-pointer hover:text-verde-neon transition-colors"
                onClick={handleViewDetails}
              >
                {product.name}
              </h3>
              <p className="text-sm text-gris-claro capitalize">
                {product.category} • {product.brand}
              </p>
            </div>

            {/* Precio */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-verde-neon">
                {formattedPrice}
              </span>
              {product.stock > 0 && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-verde-neon hover:bg-verde-neon/80 text-gris-oscuro"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gris-claro">
                Stock: {product.stock} unidades
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

ProductCardOptimized.displayName = 'ProductCardOptimized'

export default ProductCardOptimized

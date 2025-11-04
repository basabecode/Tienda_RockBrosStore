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
import { Heart, X, ShoppingCart } from 'lucide-react'
import type { UnifiedFavoriteRecord } from '@/types/favorites'

interface CartItem {
  id: string
  name: string
  price: number
  image_url?: string
  stock?: number
  category?: string
  brand?: string
}

interface FavoriteCardProps {
  favorite: UnifiedFavoriteRecord
  onRemove: (favoriteId: string, productName: string) => Promise<void>
  onAddToCart: (item: CartItem) => void
  formatPrice: (price: number) => string
  isRemoving?: boolean
}

export function FavoriteCard({
  favorite,
  onRemove,
  onAddToCart,
  formatPrice,
  isRemoving = false,
}: FavoriteCardProps) {
  const product = favorite.products

  if (!product) {
    return null
  }

  // Usar main_image o image_url según disponibilidad
  const imageUrl = product.main_image || product.image_url || '/placeholder.svg'
  const stock = product.stock || 0
  const isOutOfStock = stock === 0

  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: imageUrl,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="relative">
          <img
            src={imageUrl}
            alt={product.name || 'Producto'}
            className="w-full h-48 object-cover rounded-md"
            loading="lazy"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
            onClick={() => onRemove(favorite.id, product.name || 'Producto')}
            disabled={isRemoving}
          >
            <X className="h-4 w-4" />
          </Button>
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Sin stock
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <CardTitle className="text-lg line-clamp-2">
            {product.name || 'Producto sin nombre'}
          </CardTitle>
          <CardDescription className="flex items-center justify-between mt-1">
            <span>{product.brand || 'Sin marca'}</span>
            <Badge variant="outline">
              {product.category || 'Sin categoría'}
            </Badge>
          </CardDescription>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price || 0)}
          </span>
          {stock > 0 && (
            <span className="text-sm text-brand-primary">
              {stock} disponibles
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(favorite.id, product.name || 'Producto')}
            disabled={isRemoving}
          >
            <Heart className="h-4 w-4 fill-current text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

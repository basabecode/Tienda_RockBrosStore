import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, X, ShoppingCart } from 'lucide-react'
import { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { AuthDialog } from './AuthDialog'
import { toast } from '@/hooks/use-toast'
import { favoriteToCartItem } from '@/utils/favorites-helpers'

import type { UnifiedFavoriteRecord } from '@/types/favorites'

interface FavoriteItemProps {
  favorite: UnifiedFavoriteRecord
  onRemove: (favoriteId: string, productName: string) => void
  onAddToCart: (favoriteId: string, productName: string) => void
}

function FavoriteItem({ favorite, onRemove, onAddToCart }: FavoriteItemProps) {
  const product = favorite.products

  if (!product) {
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const imageUrl = product.main_image || product.image_url || '/placeholder.svg'
  const isOutOfStock = (product.stock || 0) === 0

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-16 w-16 rounded-md object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>

        {product.brand && (
          <p className="text-xs text-muted-foreground">{product.brand}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {formatPrice(product.price)}
          </span>

          {product.stock !== undefined && (
            <span className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToCart(favorite.id, product.name)}
            disabled={isOutOfStock}
            className="flex-1"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={() => onRemove(favorite.id, product.name)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface FavoritesSheetProps {
  children: React.ReactNode
}

export function FavoritesSheet({ children }: FavoritesSheetProps) {
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const { favorites, favoriteCount, removeFavorite } = useUnifiedFavorites()
  const { addItem } = useCart()

  const handleAddToCart = (favoriteId: string, productName: string) => {
    try {
      // Encontrar el favorito correspondiente
      const favorite = favorites.find(fav => fav.id === favoriteId)
      if (!favorite?.products) {
        toast({
          title: 'Error',
          description: 'No se pudo encontrar la información del producto',
          variant: 'destructive',
        })
        return
      }

      // Convertir a formato de carrito
      const cartItem = favoriteToCartItem(favorite.products)
      if (!cartItem) {
        toast({
          title: 'Error',
          description:
            'El producto no tiene la información necesaria para agregarlo al carrito',
          variant: 'destructive',
        })
        return
      }

      // Agregar al carrito
      addItem(cartItem)

      toast({
        title: '¡Agregado al carrito!',
        description: `${productName} se ha agregado al carrito de compras`,
      })
    } catch (error) {
      console.error('Error adding to cart from favorites:', error)
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto al carrito',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveFavorite = async (
    favoriteId: string,
    productName: string
  ) => {
    try {
      await removeFavorite(favoriteId)
      toast({
        title: 'Eliminado de favoritos',
        description: `${productName} se ha eliminado de tus favoritos`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto de favoritos',
        variant: 'destructive',
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {favoriteCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {favoriteCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Favoritos</span>
            {favoriteCount > 0 && (
              <Badge variant="secondary">
                {favoriteCount} {favoriteCount === 1 ? 'producto' : 'productos'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <Heart className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">
                  Inicia sesión para ver tus favoritos
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Guarda tus productos favoritos para encontrarlos fácilmente
                </p>
              </div>
              <AuthDialog defaultTab="login">
                <Button className="w-full max-w-xs">Iniciar sesión</Button>
              </AuthDialog>
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <Heart className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">No tienes favoritos aún</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Explora nuestros productos y guarda los que más te gusten
                </p>
              </div>
              <Button
                onClick={() => setOpen(false)}
                className="w-full max-w-xs"
              >
                Explorar productos
              </Button>
            </div>
          ) : (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-0">
                {favorites.map((favorite, index) => (
                  <div key={favorite.id}>
                    <FavoriteItem
                      favorite={favorite}
                      onRemove={handleRemoveFavorite}
                      onAddToCart={handleAddToCart}
                    />
                    {index < favorites.length - 1 && (
                      <div className="border-t border-border" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

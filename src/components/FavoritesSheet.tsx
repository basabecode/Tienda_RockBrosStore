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
import { useFavorites } from '@/hooks/use-favorites.tsx'
import { useAuth } from '@/hooks/use-auth'
import { AuthDialog } from './AuthDialog'
import { toast } from '@/hooks/use-toast'

interface FavoriteItemProps {
  item: {
    id: string
    name: string
    price: number
    image?: string
    stock?: number
  }
  onRemove: (id: string) => void
  onAddToCart: (item: {
    id: string
    name: string
    price: number
    image?: string
    stock?: number
  }) => void
}

function FavoriteItem({ item, onRemove, onAddToCart }: FavoriteItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="flex-shrink-0">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="h-16 w-16 rounded-md object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {formatPrice(item.price)}
          </span>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToCart(item)}
              disabled={item.stock === 0}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {item.stock === 0 ? 'Sin stock' : 'Agregar'}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={() => onRemove(item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
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
  const { favorites, favoriteCount, removeFavorite } = useFavorites()

  const handleAddToCart = (item: {
    id: string
    name: string
    price: number
    image?: string
    stock?: number
  }) => {
    // TODO: Integrar con useCart
    toast({
      title: 'Función en desarrollo',
      description: 'La integración con el carrito estará disponible pronto',
    })
  }

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id)
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
                {favorites.map((item, index) => (
                  <div key={item.id}>
                    <FavoriteItem
                      item={item}
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

import React from 'react'
import { FavoriteCard } from './FavoriteCard'
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

interface FavoritesGridProps {
  favorites: UnifiedFavoriteRecord[]
  onRemoveFavorite: (favoriteId: string, productName: string) => Promise<void>
  onAddToCart: (item: CartItem) => void
  formatPrice: (price: number) => string
  isLoading?: boolean
}

export function FavoritesGrid({
  favorites,
  onRemoveFavorite,
  onAddToCart,
  formatPrice,
  isLoading = false,
}: FavoritesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map(favorite => (
        <FavoriteCard
          key={favorite.id}
          favorite={favorite}
          onRemove={onRemoveFavorite}
          onAddToCart={onAddToCart}
          formatPrice={formatPrice}
        />
      ))}
    </div>
  )
}

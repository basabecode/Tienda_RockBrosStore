import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Star, ShoppingCart } from 'lucide-react'

interface FavoritesStatsProps {
  favoriteCount: number
  totalValue: number
  availableCount: number
  formatPrice: (price: number) => string
}

export function FavoritesStats({
  favoriteCount,
  totalValue,
  availableCount,
  formatPrice,
}: FavoritesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{favoriteCount}</p>
              <p className="text-xs text-muted-foreground">
                {favoriteCount === 1
                  ? 'Producto favorito'
                  : 'Productos favoritos'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{formatPrice(totalValue)}</p>
              <p className="text-xs text-muted-foreground">Valor total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{availableCount}</p>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

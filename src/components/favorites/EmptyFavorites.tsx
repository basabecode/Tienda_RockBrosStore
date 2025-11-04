import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag } from 'lucide-react'

interface EmptyFavoritesProps {
  onExploreProducts?: () => void
}

export function EmptyFavorites({ onExploreProducts }: EmptyFavoritesProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Heart className="h-20 w-20 text-muted-foreground mb-6" />
        <h3 className="text-xl font-medium mb-2">No tienes favoritos aún</h3>
        <p className="text-muted-foreground text-center mb-8 max-w-md">
          Explora nuestros productos y haz clic en el corazón para guardar los
          que más te gusten
        </p>
        {onExploreProducts && (
          <Button onClick={onExploreProducts}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Explorar productos
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

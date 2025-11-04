import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye } from 'lucide-react'
import { useViewedProducts } from '@/hooks/use-viewed-products'
import { useNavigate } from 'react-router-dom'

export function RecentlyViewed() {
  const { viewedProducts } = useViewedProducts()
  const navigate = useNavigate()

  if (viewedProducts.length === 0) {
    return null
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    return 'Hace un momento'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-verde-neon" />
        <h3 className="text-lg font-semibold text-white">
          Vistos recientemente
        </h3>
        <Badge
          variant="outline"
          className="text-verde-neon border-verde-neon/30"
        >
          {viewedProducts.length}
        </Badge>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {viewedProducts.slice(0, 5).map(product => (
          <Card
            key={product.id}
            className="flex-shrink-0 w-48 cursor-pointer card-dark-enhanced hover:scale-105 transition-transform duration-300"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <CardContent className="p-3">
              <div className="aspect-square mb-2 bg-gris-medio/20 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Eye className="h-8 w-8 text-gris-medio" />
                )}
              </div>

              <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                {product.name}
              </h4>

              <div className="flex items-center justify-between">
                <span className="text-sm text-verde-neon font-semibold">
                  ${product.price.toLocaleString('es-CO')}
                </span>
                <span className="text-xs text-gris-medio">
                  {formatTime(product.viewedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

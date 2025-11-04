import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Heart,
  ArrowLeft,
  ShoppingCart,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'
import { useCart } from '@/hooks/use-cart'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/hooks/use-toast'
import Header from '@/components/Header'

// Componentes reutilizables
import {
  FavoritesStats,
  FavoritesGrid,
  EmptyFavorites,
} from '@/components/favorites'

// Utilidades
import {
  formatPrice,
  calculateTotalValue,
  countAvailableProducts,
  type CartItem,
} from '@/utils/favorites-helpers'

export default function FavoritesUnified() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Usar el hook unificado
  const {
    favorites,
    isLoading,
    error,
    favoriteCount,
    removeFavorite,
    refetch,
  } = useUnifiedFavorites()

  // Calcular estadísticas
  const totalValue = calculateTotalValue(favorites)
  const availableCount = countAvailableProducts(favorites)

  // Handlers
  const handleAddToCart = (item: CartItem) => {
    try {
      addItem(item)
      toast({
        title: '¡Agregado al carrito!',
        description: `${item.name} se ha agregado al carrito de compras`,
      })
    } catch (error) {
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

  const handleExploreProducts = () => {
    navigate('/')
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>
                Necesitas iniciar sesión para ver tus favoritos.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    )
  }

  // Mostrar estado de error
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800">
                      Error al cargar tus favoritos
                    </h3>
                    <p className="text-red-600 mt-1">
                      {error.message || 'Ha ocurrido un error inesperado'}
                    </p>
                  </div>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Volver"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-500" />
                <span>Mis Favoritos</span>
              </h1>
              <p className="text-muted-foreground">
                Productos que has guardado para más tarde
              </p>
            </div>
          </div>

          {/* Estado vacío */}
          {!isLoading && favoriteCount === 0 && (
            <EmptyFavorites onExploreProducts={handleExploreProducts} />
          )}

          {/* Contenido con favoritos */}
          {favoriteCount > 0 && (
            <>
              {/* Estadísticas */}
              <FavoritesStats
                favoriteCount={favoriteCount}
                totalValue={totalValue}
                availableCount={availableCount}
                formatPrice={formatPrice}
              />

              {/* Grid de favoritos */}
              <FavoritesGrid
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
                isLoading={isLoading}
              />

              {/* Acciones adicionales */}
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: 'Función en desarrollo',
                      description:
                        'Agregar todos al carrito estará disponible pronto',
                    })
                  }}
                  disabled={availableCount === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar disponibles al carrito ({availableCount})
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

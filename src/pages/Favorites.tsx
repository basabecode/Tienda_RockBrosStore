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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, ArrowLeft, ShoppingCart, X, Star } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useFavorites } from '@/hooks/use-favorites.tsx'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { toast } from '@/hooks/use-toast'

export default function Favorites() {
  const { user, isAuthenticated } = useAuth()
  const { favorites, removeFavorite } = useFavorites()
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const handleAddToCart = (item: {
    id: string
    name: string
    price: number
    image?: string
    stock?: number
    category?: string
    brand?: string
  }) => {
    // TODO: Integrar con useCart
    toast({
      title: 'Función en desarrollo',
      description: 'La integración con el carrito estará disponible pronto',
    })
  }

  const handleRemoveFavorite = (id: string, name: string) => {
    removeFavorite(id)
    toast({
      title: 'Eliminado de favoritos',
      description: `${name} se ha eliminado de tus favoritos`,
    })
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

          {/* Lista de Favoritos */}
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="h-20 w-20 text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-2">
                  No tienes favoritos aún
                </h3>
                <p className="text-muted-foreground text-center mb-8 max-w-md">
                  Explora nuestros productos y haz clic en el corazón para
                  guardar los que más te gusten
                </p>
                <Button onClick={() => navigate('/')}>
                  Explorar productos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold">{favorites.length}</p>
                        <p className="text-xs text-muted-foreground">
                          {favorites.length === 1
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
                        <p className="text-2xl font-bold">
                          {formatPrice(
                            favorites.reduce((sum, item) => sum + item.price, 0)
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Valor total
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {
                            favorites.filter(item => (item.stock || 0) > 0)
                              .length
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Disponibles
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Grid de productos favoritos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(item => (
                  <Card
                    key={item.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="relative">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleRemoveFavorite(item.id, item.name)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {(item.stock || 0) === 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 left-2"
                          >
                            Sin stock
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div>
                        <CardTitle className="text-lg line-clamp-2">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-between mt-1">
                          <span>{item.brand}</span>
                          <Badge variant="outline">{item.category}</Badge>
                        </CardDescription>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(item.price)}
                        </span>
                        {(item.stock || 0) > 0 && (
                          <span className="text-sm text-green-600">
                            {item.stock} disponibles
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleAddToCart(item)}
                          disabled={(item.stock || 0) === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {(item.stock || 0) === 0
                            ? 'Sin stock'
                            : 'Agregar al carrito'}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleRemoveFavorite(item.id, item.name)
                          }
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

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
                  disabled={
                    favorites.filter(item => (item.stock || 0) > 0).length === 0
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar disponibles al carrito (
                  {favorites.filter(item => (item.stock || 0) > 0).length})
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

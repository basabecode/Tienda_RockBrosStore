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
import {
  Heart,
  ArrowLeft,
  ShoppingCart,
  X,
  Star,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useFavorites } from '@/hooks/use-favorites.tsx'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { toast } from '@/hooks/use-toast'

// Types para favoritos de Supabase
interface FavoriteProduct {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products?: {
    id: string
    name: string
    price: number
    image_url?: string
    stock?: number
    category?: string
    brand?: string
    description?: string
    is_active?: boolean
  } | null
}

export default function Favorites() {
  const { user, isAuthenticated } = useAuth()
  const { removeFavorite } = useFavorites()
  const navigate = useNavigate()

  // Query para obtener favoritos del usuario con error handling robusto
  const {
    data: favorites,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) {
          throw new Error('Usuario no autenticado')
        }

        const { data, error: supabaseError } = await supabase
          .from('favorites')
          .select(
            `
            id,
            user_id,
            product_id,
            created_at,
            products (
              id,
              name,
              price,
              image_url,
              stock,
              category,
              brand,
              description,
              is_active
            )
          `
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (supabaseError) {
          console.error('Error fetching favorites:', supabaseError)
          throw new Error(`Error al cargar favoritos: ${supabaseError.message}`)
        }

        return (data || []) as unknown as FavoriteProduct[]
      } catch (error) {
        console.error('Unexpected error in favorites query:', error)
        throw error
      }
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 2,
    staleTime: 3 * 60 * 1000, // 3 minutos
    refetchOnWindowFocus: true,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
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

  const handleRemoveFavorite = async (
    favoriteId: string,
    productName: string
  ) => {
    try {
      await removeFavorite(favoriteId)

      // Refetch para actualizar la lista
      refetch()

      toast({
        title: 'Eliminado de favoritos',
        description: `${productName} se ha eliminado de tus favoritos`,
      })
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto de favoritos',
        variant: 'destructive',
      })
    }
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

          {/* Estado de carga */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i}>
                  <CardHeader>
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Lista de Favoritos */}
          {!isLoading && (!favorites || favorites.length === 0) && (
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
          )}

          {!isLoading && favorites && favorites.length > 0 && (
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
                            favorites.reduce(
                              (sum, favorite) =>
                                sum + (favorite.products?.price || 0),
                              0
                            )
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
                            favorites.filter(
                              item => (item.products?.stock || 0) > 0
                            ).length
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
                {favorites.map(favorite => (
                  <Card
                    key={favorite.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="relative">
                        <img
                          src={
                            favorite.products?.image_url || '/placeholder.svg'
                          }
                          alt={favorite.products?.name || 'Producto'}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleRemoveFavorite(
                              favorite.id,
                              favorite.products?.name || 'Producto'
                            )
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {(favorite.products?.stock || 0) === 0 && (
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
                          {favorite.products?.name || 'Producto sin nombre'}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-between mt-1">
                          <span>{favorite.products?.brand || 'Sin marca'}</span>
                          <Badge variant="outline">
                            {favorite.products?.category || 'Sin categoría'}
                          </Badge>
                        </CardDescription>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(favorite.products?.price || 0)}
                        </span>
                        {(favorite.products?.stock || 0) > 0 && (
                          <span className="text-sm text-green-600">
                            {favorite.products?.stock} disponibles
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          onClick={() =>
                            handleAddToCart({
                              id: favorite.products?.id || '',
                              name: favorite.products?.name || '',
                              price: favorite.products?.price || 0,
                              image: favorite.products?.image_url,
                              stock: favorite.products?.stock,
                              category: favorite.products?.category,
                              brand: favorite.products?.brand,
                            })
                          }
                          disabled={(favorite.products?.stock || 0) === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {(favorite.products?.stock || 0) === 0
                            ? 'Sin stock'
                            : 'Agregar al carrito'}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleRemoveFavorite(
                              favorite.id,
                              favorite.products?.name || 'Producto'
                            )
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
                    favorites.filter(
                      favorite => (favorite.products?.stock || 0) > 0
                    ).length === 0
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar disponibles al carrito (
                  {
                    favorites.filter(
                      favorite => (favorite.products?.stock || 0) > 0
                    ).length
                  }
                  )
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

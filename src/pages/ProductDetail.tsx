import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Loader2,
  Package,
  Eye,
  ImageIcon,
  Info,
  Zap,
  Award,
  RefreshCw,
} from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useUnifiedFavorites } from '@/hooks/useUnifiedFavorites'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { useViewedProducts } from '@/hooks/use-viewed-products'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'

// Función para obtener producto por ID
const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in fetchProductById:', error)
    return null
  }
}

// Función para obtener productos relacionados
const fetchRelatedProducts = async (
  productId: string,
  category: string
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .neq('id', productId)
      .limit(4)

    if (error) {
      console.error('Error fetching related products:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchRelatedProducts:', error)
    return []
  }
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useUnifiedFavorites()
  const { addViewedProduct } = useViewedProducts()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Query para obtener el producto
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id || ''),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Query para productos relacionados
  const { data: relatedProducts = [], isLoading: relatedLoading } = useQuery({
    queryKey: ['related-products', product?.id, product?.category],
    queryFn: () =>
      fetchRelatedProducts(product?.id || '', product?.category || ''),
    enabled: !!product?.id && !!product?.category,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })

  // Registrar producto como visto
  useEffect(() => {
    if (product) {
      addViewedProduct({
        id: product.id,
        name: product.name,
        image: product.main_image || product.images?.[0],
        price: product.price,
      })
    }
  }, [product, addViewedProduct])

  // Reset imagen seleccionada cuando cambia el producto
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(0)
    }
  }, [product])

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para agregar productos al carrito',
        variant: 'destructive',
      })
      return
    }

    if (!product) return

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image || product.images?.[0],
        stock: product.stock,
        quantity,
      })

      toast({
        title: '¡Producto agregado!',
        description: `${product.name} se agregó a tu carrito.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto al carrito',
        variant: 'destructive',
      })
    }
  }

  const handleToggleFavorite = async () => {
    if (!product) return

    try {
      const isCurrentlyFavorite = isFavorite(product.id)

      if (isCurrentlyFavorite) {
        const favoriteToRemove = favorites.find(
          fav => fav.product_id === product.id
        )
        if (favoriteToRemove) {
          await removeFavorite(favoriteToRemove.id)
          toast({
            title: 'Eliminado de favoritos',
            description: `${product.name} se eliminó de tus favoritos`,
          })
        }
      } else {
        const favoriteItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          main_image: product.main_image || product.images?.[0],
          image_url: product.images?.[0],
          stock: product.stock,
          category: product.category,
          brand: product.brand,
          description: product.description,
          is_active: product.is_active,
        }

        await addFavorite(favoriteItem)
        toast({
          title: 'Agregado a favoritos',
          description: `${product.name} se agregó a tus favoritos`,
        })
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar favoritos',
        variant: 'destructive',
      })
    }
  }

  // Funciones auxiliares
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Generar características desde campos reales de la base de datos
  const getProductFeatures = (product: Product): string[] => {
    const features = []

    // Usar campos reales disponibles en la base de datos
    if (product.material) {
      features.push(`Material: ${product.material}`)
    }
    if (product.weight) {
      features.push(`Peso: ${product.weight}kg`)
    }
    if (product.dimensions) {
      features.push(`Dimensiones: ${product.dimensions}`)
    }
    if (product.color) {
      features.push(`Color: ${product.color}`)
    }
    if (product.size) {
      features.push(`Talla: ${product.size}`)
    }
    if (product.tags && product.tags.length > 0) {
      features.push(`Características: ${product.tags.join(', ')}`)
    }

    // Solo mostrar features si hay datos reales, sino mostrar mensaje
    return features
  }

  // Estados de carga y error
  if (productLoading) {
    return (
      <div className="min-h-screen bg-gris-oscuro flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-verde-neon mx-auto mb-4" />
          <p className="text-white text-lg">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-gris-oscuro flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <Package className="h-16 w-16 text-gris-medio/50 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Producto no encontrado
          </h1>
          <p className="text-gris-medio mb-6">
            El producto que buscas no existe o no está disponible
          </p>
          <Button onClick={() => navigate('/')} className="button-primary-glow">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  // Preparar datos del producto
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.main_image
      ? [product.main_image]
      : []

  const productFeatures = getProductFeatures(product)
  const isInStock = product.stock > 0
  const hasDiscount =
    product.compare_price && product.compare_price > product.price

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gris-oscuro text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb con estilo RockBros */}
          <nav className="flex items-center space-x-2 text-sm text-gris-medio mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 h-auto text-gris-medio hover:text-verde-neon transition-colors"
            >
              Inicio
            </Button>
            <span className="text-gris-medio/50">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2 h-auto text-gris-medio hover:text-verde-neon transition-colors"
            >
              {product.category}
            </Button>
            <span className="text-gris-medio/50">/</span>
            <span className="text-verde-neon font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de imágenes mejorada */}
            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-gris-medio/20 bg-gris-medio/10">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gris-medio/20 flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-gris-medio" />
                  </div>
                )}

                {/* Badge de descuento */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white font-bold">
                      -
                      {Math.round(
                        ((product.compare_price! - product.price) /
                          product.compare_price!) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </div>
                )}

                {/* Badge de stock */}
                <div className="absolute top-4 right-4">
                  {isInStock ? (
                    <Badge className="bg-green-500 text-white">En Stock</Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">Agotado</Badge>
                  )}
                </div>
              </div>

              {/* Thumbnails mejorados */}
              {productImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-verde-neon shadow-lg shadow-verde-neon/25'
                          : 'border-gris-medio/30 hover:border-gris-medio/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto mejorada */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant="outline"
                    className="text-verde-neon border-verde-neon/30 bg-verde-neon/10"
                  >
                    {product.category}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleFavorite}
                        className="text-gris-medio hover:text-red-500 transition-colors"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            isFavorite(product.id)
                              ? 'fill-red-500 text-red-500'
                              : 'hover:fill-red-500'
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isFavorite(product.id)
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-verde-neon bg-clip-text text-transparent">
                  {product.name}
                </h1>

                {/* Rating real desde base de datos */}
                {product.rating && product.review_count ? (
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="ml-3 text-sm text-gris-medio">
                        {product.rating} ({product.review_count} reseñas)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-sm text-gris-medio">
                      Sin calificaciones aún
                    </span>
                  </div>
                )}

                {/* Precios mejorados */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-bold text-verde-neon">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-gris-medio line-through">
                      {formatPrice(product.compare_price!)}
                    </span>
                  )}
                </div>

                {/* Descripción */}
                <p className="text-gris-claro text-lg leading-relaxed mb-8">
                  {product.description}
                </p>
              </div>

              {/* Estado del stock mejorado */}
              <div className="flex items-center space-x-3">
                {isInStock ? (
                  <>
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold">
                      En stock
                    </span>
                    <span className="text-sm text-gris-medio">
                      ({product.stock} disponibles)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-red-400 font-semibold">Agotado</span>
                  </>
                )}
              </div>

              {/* Selector de cantidad mejorado */}
              <div className="flex items-center space-x-6">
                <span className="font-semibold text-white">Cantidad:</span>
                <div className="flex items-center bg-gris-medio/20 border border-gris-medio/30 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="text-white hover:bg-gris-medio/30"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-6 py-2 min-w-16 text-center text-white font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock || !isInStock}
                    className="text-white hover:bg-gris-medio/30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Botones de acción mejorados */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full button-primary-glow text-lg py-6"
                  size="lg"
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  {isInStock ? 'Agregar al carrito' : 'Producto agotado'}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-gris-medio/20 border-gris-medio/30 text-white hover:bg-gris-medio/40 hover:border-verde-neon/50"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Comprar ahora
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/')}
                    className="bg-gris-medio/20 border-gris-medio/30 text-white hover:bg-gris-medio/40 hover:border-verde-neon/50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Seguir comprando
                  </Button>
                </div>
              </div>

              {/* Información de envío mejorada */}
              <Card className="bg-gris-medio/20 border-gris-medio/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6 text-green-400" />
                      <span className="text-white">
                        Envío gratis en pedidos superiores a $200.000
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-6 w-6 text-verde-neon" />
                      <span className="text-white">
                        Garantía de 1 año en todos nuestros productos
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="h-6 w-6 text-orange-400" />
                      <span className="text-white">
                        Devoluciones gratuitas en 30 días
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Características y especificaciones mejoradas */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gris-medio/20 border-gris-medio/30">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Award className="h-6 w-6 text-verde-neon mr-3" />
                  <h3 className="text-2xl font-bold text-white">
                    Características
                  </h3>
                </div>
                {productFeatures.length > 0 ? (
                  <ul className="space-y-3">
                    {productFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-verde-neon rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-gris-claro">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-gris-medio/50 mx-auto mb-3" />
                    <p className="text-gris-medio">
                      No hay características específicas registradas para este
                      producto.
                    </p>
                    <p className="text-sm text-gris-medio/70 mt-2">
                      El administrador puede agregar detalles técnicos desde el
                      panel de productos.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gris-medio/20 border-gris-medio/30">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Info className="h-6 w-6 text-verde-neon mr-3" />
                  <h3 className="text-2xl font-bold text-white">
                    Especificaciones
                  </h3>
                </div>
                <div className="space-y-4">
                  {/* Datos básicos siempre disponibles */}
                  <div className="flex justify-between py-3 border-b border-gris-medio/20">
                    <span className="font-semibold text-white">Marca:</span>
                    <span className="text-gris-claro">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gris-medio/20">
                    <span className="font-semibold text-white">Categoría:</span>
                    <span className="text-gris-claro">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gris-medio/20">
                    <span className="font-semibold text-white">
                      Stock disponible:
                    </span>
                    <span className="text-gris-claro">
                      {product.stock} unidades
                    </span>
                  </div>

                  {/* Datos adicionales solo si están disponibles */}
                  {product.weight && (
                    <div className="flex justify-between py-3 border-b border-gris-medio/20">
                      <span className="font-semibold text-white">Peso:</span>
                      <span className="text-gris-claro">
                        {product.weight}kg
                      </span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between py-3 border-b border-gris-medio/20">
                      <span className="font-semibold text-white">
                        Dimensiones:
                      </span>
                      <span className="text-gris-claro">
                        {product.dimensions}
                      </span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between py-3 border-b border-gris-medio/20">
                      <span className="font-semibold text-white">
                        Material:
                      </span>
                      <span className="text-gris-claro">
                        {product.material}
                      </span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between py-3 border-b border-gris-medio/20">
                      <span className="font-semibold text-white">Color:</span>
                      <span className="text-gris-claro">{product.color}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex justify-between py-3 border-b border-gris-medio/20">
                      <span className="font-semibold text-white">Talla:</span>
                      <span className="text-gris-claro">{product.size}</span>
                    </div>
                  )}

                  {/* Fecha de creación */}
                  <div className="flex justify-between py-3">
                    <span className="font-semibold text-white">Agregado:</span>
                    <span className="text-gris-claro">
                      {new Date(product.created_at).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productos relacionados mejorados */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center mb-8">
                <Eye className="h-6 w-6 text-verde-neon mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  Productos relacionados
                </h2>
              </div>

              {relatedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card
                      key={i}
                      className="bg-gris-medio/20 border-gris-medio/30"
                    >
                      <CardContent className="p-6">
                        <div className="w-full h-48 bg-gris-medio/20 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gris-medio/20 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gris-medio/20 rounded w-3/4 animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map(relatedProduct => (
                    <Card
                      key={relatedProduct.id}
                      className="bg-gris-medio/20 border-gris-medio/30 cursor-pointer hover:bg-gris-medio/30 transition-all duration-300 hover:scale-105"
                      onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="aspect-square overflow-hidden rounded-lg mb-4">
                          {relatedProduct.main_image ? (
                            <img
                              src={relatedProduct.main_image}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gris-medio/20 flex items-center justify-center">
                              <Package className="h-12 w-12 text-gris-medio" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-verde-neon">
                            {formatPrice(relatedProduct.price)}
                          </span>
                          <div className="flex items-center">
                            {relatedProduct.rating ? (
                              renderStars(relatedProduct.rating)
                            ) : (
                              <span className="text-xs text-gris-medio">
                                Sin calificar
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default ProductDetail

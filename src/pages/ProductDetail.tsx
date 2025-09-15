import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
} from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useFavorites } from '@/hooks/use-favorites'
import { toast } from '@/hooks/use-toast'

// Datos de productos (en producción vendrían de una API)
const products = [
  {
    id: 1,
    name: 'Casco Road Pro',
    price: 299000,
    originalPrice: 349000,
    image: '/src/assets/product-1.jpg',
    rating: 4.8,
    reviews: 124,
    category: 'Cascos',
    brand: 'RockBros',
    description:
      'Casco aerodinámico de alto rendimiento para ruta con ventilación avanzada y sistema de retención seguro.',
    features: [
      'Material: Policarbonato de alta resistencia',
      'Peso: 280g',
      'Certificación: CE EN 1078',
      'Tallas: S/M/L/XL',
      'Color: Negro mate con detalles rojos',
    ],
    specifications: {
      Material: 'Policarbonato + EPS',
      Peso: '280g ± 10g',
      'Tallas disponibles':
        'S (52-56cm), M (56-58cm), L (58-61cm), XL (61-64cm)',
      Certificaciones: 'CE EN 1078, CPSC 1203',
      Garantía: '2 años',
    },
    images: [
      '/src/assets/product-1.jpg',
      '/src/assets/product-1.jpg',
      '/src/assets/product-1.jpg',
    ],
    inStock: true,
    stock: 15,
  },
  {
    id: 2,
    name: 'Maillot Trail',
    price: 129000,
    image: '/src/assets/product-2.jpg',
    rating: 4.9,
    reviews: 89,
    category: 'Ropa',
    brand: 'RockBros',
    description:
      'Camiseta técnica para montaña con secado rápido, mangas largas y protección UV.',
    features: [
      'Tela: Poliéster transpirable',
      'Protección UV: UPF 50+',
      'Secado rápido',
      '3 bolsillos traseros',
      'Corte ergonómico',
    ],
    specifications: {
      Material: '100% Poliéster',
      Peso: '180g/m²',
      'Tallas disponibles': 'S/M/L/XL/XXL',
      'Protección UV': 'UPF 50+',
      Garantía: '1 año',
    },
    images: ['/src/assets/product-2.jpg', '/src/assets/product-2.jpg'],
    inStock: true,
    stock: 8,
  },
  {
    id: 3,
    name: 'Luz Delantera 800lm',
    price: 89000,
    originalPrice: 129000,
    image: '/src/assets/product-3.jpg',
    rating: 4.7,
    reviews: 156,
    category: 'Iluminación',
    brand: 'RockBros',
    description:
      'Luz USB recargable con modos de alta visibilidad y batería de larga duración.',
    features: [
      'Potencia: 800 lúmenes',
      'Modos: Alto, Medio, Bajo, Flash',
      'Batería: 2000mAh recargable',
      'Autonomía: 3-20 horas',
      'Carga: USB-C',
    ],
    specifications: {
      'Potencia máxima': '800 lúmenes',
      Batería: '2000mAh Li-ion',
      'Tiempo de carga': '3 horas',
      Modos: '4 modos de iluminación',
      Garantía: '1 año',
    },
    images: ['/src/assets/product-3.jpg'],
    inStock: false,
    stock: 0,
  },
  {
    id: 4,
    name: 'Pedales Clip Pro',
    price: 149000,
    image: '/src/assets/product-4.jpg',
    rating: 4.9,
    reviews: 67,
    category: 'Componentes',
    brand: 'RockBros',
    description:
      'Pedales de carga ligera con sistema de retención profesional y plataforma amplia.',
    features: [
      'Material: Aleación de aluminio',
      'Peso: 320g par',
      'Sistema: SPD compatible',
      'Plataforma: 95mm x 90mm',
      'Rodamientos: Industriales sellados',
    ],
    specifications: {
      Material: 'Aleación 6061',
      Peso: '320g (par)',
      Dimensiones: '95mm x 90mm',
      Compatibilidad: 'Calas SPD',
      Garantía: '2 años',
    },
    images: ['/src/assets/product-4.jpg', '/src/assets/product-4.jpg'],
    inStock: true,
    stock: 12,
  },
]

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const product = products.find(p => p.id === parseInt(id || '0'))

  useEffect(() => {
    if (product?.images) {
      setSelectedImage(0)
    }
  }, [product])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })

    toast({
      title: '¡Producto agregado!',
      description: `${product.name} se agregó a tu carrito.`,
    })
  }

  const handleToggleFavorite = () => {
    if (isFavorite(product.id.toString())) {
      removeFavorite(product.id.toString())
      toast({
        title: 'Removido de favoritos',
        description: `${product.name} se eliminó de tus favoritos.`,
      })
    } else {
      addFavorite({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        brand: product.brand,
      })
      toast({
        title: '¡Agregado a favoritos!',
        description: `${product.name} se agregó a tus favoritos.`,
      })
    }
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="p-0 h-auto"
        >
          Inicio
        </Button>
        <span>/</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="p-0 h-auto"
        >
          {product.category}
        </Button>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-gray-200'
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

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={
                  isFavorite(product.id.toString()) ? 'text-red-500' : ''
                }
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite(product.id.toString()) ? 'fill-current' : ''
                  }`}
                />
              </Button>
            </div>

            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  {Math.round(
                    (1 - product.price / product.originalPrice) * 100
                  )}
                  % OFF
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>
          </div>

          {/* Estado del stock */}
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">En stock</span>
                <span className="text-sm text-muted-foreground">
                  ({product.stock} disponibles)
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">Agotado</span>
              </>
            )}
          </div>

          {/* Selector de cantidad */}
          <div className="flex items-center space-x-4">
            <span className="font-medium">Cantidad:</span>
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock ? 'Agregar al carrito' : 'Producto agotado'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg">
                Comprar ahora
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Seguir comprando
              </Button>
            </div>
          </div>

          {/* Información de envío */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">
                    Envío gratis en pedidos superiores a $200.000
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">
                    Garantía de 1 año en todos nuestros productos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">
                    Devoluciones gratuitas en 30 días
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Características y especificaciones */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Características</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Especificaciones</h3>
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-sm">{key}:</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos relacionados */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map(relatedProduct => (
              <Card
                key={relatedProduct.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <CardContent className="p-4">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      ${relatedProduct.price.toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      {renderStars(relatedProduct.rating)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

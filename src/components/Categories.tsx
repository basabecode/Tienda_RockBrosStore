import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Laptop,
  Smartphone,
  Headphones,
  Camera,
  Watch,
  Home,
  Gamepad2,
  Monitor,
  ArrowRight,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string; size?: string | number }>
  count: number
  description: string
  color: string
}

const categories: Category[] = [
  {
    id: 'cascos',
    name: 'Cascos',
    icon: Watch,
    count: 120,
    description: 'Protección y aerodinámica',
    color: 'bg-blue-500',
  },
  {
    id: 'ropa',
    name: 'Ropa',
    icon: Laptop,
    count: 98,
    description: 'Prendas técnicas para ciclismo',
    color: 'bg-green-500',
  },
  {
    id: 'iluminacion',
    name: 'Iluminación',
    icon: Headphones,
    count: 76,
    description: 'Luces y visibilidad para rodar seguro',
    color: 'bg-purple-500',
  },
  {
    id: 'componentes',
    name: 'Componentes',
    icon: Camera,
    count: 140,
    description: 'Transmisión, frenos y partes clave',
    color: 'bg-red-500',
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    icon: Smartphone,
    count: 87,
    description: 'Soportes, bombas, candados y más',
    color: 'bg-pink-500',
  },
  {
    id: 'bicicletas',
    name: 'Bicicletas',
    icon: Home,
    count: 42,
    description: 'Bicicletas de ruta y montaña seleccionadas',
    color: 'bg-yellow-500',
  },
  {
    id: 'neumaticos',
    name: 'Neumáticos',
    icon: Gamepad2,
    count: 64,
    description: 'Cubiertas y cámaras para todo tipo de terreno',
    color: 'bg-indigo-500',
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    icon: Monitor,
    count: 53,
    description: 'Mantenimiento y ajuste profesional',
    color: 'bg-teal-500',
  },
]

const Categories = () => {
  return (
    <section
      id="categories"
      className="py-20 bg-background"
      aria-labelledby="categories-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Explorar por categoría
          </Badge>
          <h2
            id="categories-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Encuentra lo que necesitas para
            <span className="block gradient-primary bg-clip-text text-transparent">
              tu bicicleta
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Navega nuestra selección de componentes, ropa y accesorios pensados
            para ciclistas.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map(category => {
            const IconComponent = category.icon

            return (
              <Card
                key={category.id}
                className="group cursor-pointer gradient-card border-0 shadow-soft hover:shadow-large transition-all duration-500 hover:scale-105"
                role="button"
                tabIndex={0}
                aria-label={`Browse ${category.name} category with ${category.count} products`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    // Handle category navigation
                    console.log(`Navigate to ${category.name} category`)
                  }
                }}
              >
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>

                  {/* Product Count */}
                  <Badge variant="outline" className="text-xs">
                    {category.count} products
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Featured Category Banner */}
        <Card className="gradient-primary text-white border-0 shadow-large overflow-hidden relative">
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-white/20 text-white border-white/30">
                  Oferta por tiempo limitado
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Promociones en accesorios
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Descuentos especiales en cascos, iluminación y mantenimiento.
                  Aprovecha y equipa tu bicicleta.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="shadow-medium hover:shadow-large"
                >
                  Ver ofertas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Gamepad2 className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Controllers</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Monitor className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Monitors</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Headphones className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Headsets</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <Laptop className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium">Gaming Laptops</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Categories

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Wrench, ArrowRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  image: string
  count: number
  description: string
  color: string
}

const categories: Category[] = [
  {
    id: 'seguridad',
    name: 'Seguridad',
    image: '/img/categories/seguridad-placeholder.svg',
    count: 120,
    description: 'Cascos y equipamiento de protección',
    color: 'bg-brand-primary', // Verde bosque - Principal
  },
  {
    id: 'bolsos',
    name: 'Bolsos',
    image: '/img/categories/bolsos-placeholder.svg',
    count: 76,
    description: 'Mochilas y bolsos para ciclismo',
    color: 'bg-brand-secondary', // Verde neón - Secundario
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    image: '/img/categories/accesorios-placeholder.svg',
    count: 87,
    description: 'Soportes, bombas, candados y más',
    color: 'bg-brand-neutral', // Gris medio - Neutro
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    image: '/img/categories/herramientas-placeholder.svg',
    count: 53,
    description: 'Mantenimiento y ajuste profesional',
    color: 'bg-brand-dark', // Gris oscuro - Profesional
  },
]

const Categories = () => {
  return (
    <section
      id="categories"
      className="py-20 bg-gris-oscuro"
      aria-labelledby="categories-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 text-sm font-medium bg-verde-neon/10 text-verde-neon border-verde-neon/30"
          >
            Explorar por categoría
          </Badge>
          <h2
            id="categories-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
          >
            Encuentra lo que necesitas para
            <span className="block text-verde-neon">tu bicicleta</span>
          </h2>
          <p className="text-lg text-gris-medio max-w-2xl mx-auto">
            Navega nuestra selección de componentes, ropa y accesorios pensados
            para ciclistas.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map(category => {
            return (
              <Card
                key={category.id}
                className="group cursor-pointer card-dark-enhanced border-gris-medio/20 hover:border-verde-neon/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden relative h-48"
                role="button"
                tabIndex={0}
                aria-label={`Browse ${category.name} category with ${category.count} productos`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    // Handle category navigation
                    console.log(`Navigate to ${category.name} category`)
                  }
                }}
              >
                <CardContent className="p-0 relative h-full">
                  {/* Category Image - Ocupa todo el espacio */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                      src={category.image}
                      alt={`${category.name} category`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Overlay gradiente */}
                    <div
                      className={`absolute inset-0 ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                    ></div>

                    {/* Overlay para mejorar legibilidad del texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Contenido superpuesto en la parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    {/* Contenedor con fondo semitransparente */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      {/* Category Name */}
                      <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-verde-neon transition-colors leading-tight">
                        {category.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-white/90 mb-2 leading-tight">
                        {category.description}
                      </p>

                      {/* Product Count */}
                      <Badge
                        variant="outline"
                        className="text-xs bg-verde-neon/20 text-verde-neon border-verde-neon/30 hover:bg-verde-neon/30 hover:border-verde-neon/50 transition-all duration-300"
                      >
                        {category.count} productos
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Featured Category Banner */}
        <Card className="card-dark-enhanced text-white border-verde-neon/20 shadow-xl overflow-hidden relative">
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4 bg-verde-neon/20 text-verde-neon border-verde-neon/30 font-medium">
                  Oferta especial
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  Kit esencial para ciclistas
                </h3>
                <p className="text-lg mb-6 opacity-90 text-white/90">
                  Equipamiento de seguridad, bolsos funcionales, herramientas y
                  accesorios esenciales para cada aventura. Promoción especial
                  este mes.
                </p>
                <Button size="lg" className="button-primary-glow">
                  Comprar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="relative group/kit">
                {/* Imagen de fondo que ocupa todo el grid */}
                <div className="relative rounded-2xl overflow-hidden min-h-[280px] bg-gradient-to-br from-white/20 to-white/5">
                  {/* Imagen placeholder de fondo */}
                  <img
                    src="/img/categories/kit-inicio-fullbg.svg"
                    alt="Kit de inicio para ciclistas"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/kit:opacity-60 group-hover/kit:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Overlay gradiente dinámico */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover/kit:from-black/40 transition-all duration-500"></div>

                  {/* Contenido superpuesto */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {/* Contenedor de texto con fondo semitransparente */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transform group-hover/kit:bg-white/20 group-hover/kit:scale-105 transition-all duration-500 ease-out">
                      {/* Título del kit */}
                      <h4 className="text-xl font-bold mb-2 text-white group-hover/kit:text-verde-neon transition-colors duration-300">
                        Kit de inicio para ciclistas
                      </h4>

                      {/* Precio especial */}
                      <div className="text-white">
                        <p className="text-sm font-medium opacity-90 mb-1 group-hover/kit:opacity-100 transition-opacity duration-300">
                          Precio especial
                        </p>
                        <div className="price-primary text-2xl md:text-3xl font-extrabold group-hover/kit:scale-110 transition-all duration-300 origin-left">
                          $99.999
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 opacity-0 group-hover/kit:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover/kit:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>

                  {/* Partículas decorativas animadas */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-verde-neon/40 rounded-full group-hover/kit:scale-150 group-hover/kit:bg-verde-neon/80 transition-all duration-500"></div>
                  <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-verde-neon/30 rounded-full group-hover/kit:scale-125 group-hover/kit:bg-verde-neon/70 transition-all duration-700 delay-100"></div>
                  <div className="absolute bottom-1/4 right-8 w-1 h-1 bg-verde-neon/50 rounded-full group-hover/kit:scale-200 group-hover/kit:bg-verde-neon/90 transition-all duration-600 delay-200"></div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-verde-neon rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-verde-neon rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default Categories

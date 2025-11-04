import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { useSearch } from '@/hooks/use-search-context'

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
    image: '/img/categories/casco.jpg',
    count: 120,
    description: 'Cascos y equipamiento de protección',
    color: 'from-emerald-600/80 to-emerald-500/60', // Verde bosque degradado
  },
  {
    id: 'bolsos',
    name: 'Bolsos',
    image: '/img/categories/bolsos.jpg',
    count: 76,
    description: 'Mochilas y bolsos para ciclismo',
    color: 'from-teal-500/80 to-cyan-400/60', // Verde neón degradado
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    image: '/img/categories/gafas3.jpg',
    count: 87,
    description: 'Soportes, bombas, candados y más',
    color: 'from-slate-600/80 to-slate-500/60', // Gris neutro degradado
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    image: '/img/categories/pedales.jpg',
    count: 53,
    description: 'Mantenimiento y ajuste profesional',
    color: 'from-zinc-700/80 to-zinc-600/60', // Gris oscuro degradado
  },
]

const Categories = () => {
  const { setSearchTerm } = useSearch()

  // Función para navegar a una categoría específica
  const handleCategoryClick = (categoryName: string) => {
    // Limpiar búsqueda anterior
    setSearchTerm('')

    // Navegar a la sección de productos
    const shopElement = document.getElementById('shop')
    if (shopElement) {
      shopElement.scrollIntoView({ behavior: 'smooth' })

      // Después del scroll, activar el filtro de categoría
      setTimeout(() => {
        // Dispatch evento personalizado para activar filtro
        const filterEvent = new CustomEvent('filterByCategory', {
          detail: { category: categoryName },
        })
        window.dispatchEvent(filterEvent)
      }, 800) // Esperar que termine la animación de scroll
    }
  }

  // El return debe estar dentro de la función Categories
  return (
    <section
      id="categories"
      className="py-20 bg-gris-oscuro"
      aria-labelledby="categories-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge
            variant="secondary"
            className="mb-6 text-sm font-medium bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 text-gray-800 border-brand-secondary/30 px-4 py-2 rounded-full"
          >
            Explorar por categoría
          </Badge>
          <h2
            id="categories-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight"
          >
            Encuentra lo que necesitas para
            <span className="block bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent mt-2">
              tu bicicleta
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Navega nuestra selección de componentes, ropa y accesorios pensados
            para ciclistas de todos los niveles.
          </p>
        </div>
      </div>
      {/* Categories Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => {
            return (
              <Card
                key={category.id}
                className="group cursor-pointer relative overflow-hidden rounded-2xl border-0 shadow-lg category-card-hover bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm h-72 sm:h-80 category-card-enter"
                role="button"
                tabIndex={0}
                aria-label={`Explorar categoría ${category.name} con ${category.count} productos`}
                onClick={() => handleCategoryClick(category.name)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCategoryClick(category.name)
                  }
                }}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0 relative h-full">
                  {/* Background Image with Improved Positioning */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={category.image}
                      alt={`Categoría ${category.name}`}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                      loading="lazy"
                    />

                    {/* Multi-layer Overlay for Better Readability */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} mix-blend-overlay transition-opacity duration-500 group-hover:opacity-80`}
                    ></div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                    {/* Subtle Border Glow on Hover */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-brand-secondary/40 transition-all duration-500"></div>
                  </div>

                  {/* Content Container with Better Spacing */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                      {/* Category Name with Enhanced Typography */}
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-brand-secondary transition-colors duration-300 leading-tight">
                        {category.name}
                      </h3>

                      {/* Description with Better Spacing */}
                      <p className="text-sm sm:text-base text-gray-200 mb-4 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        {category.description}
                      </p>

                      {/* Enhanced Product Count Badge */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium bg-black/30 text-brand-secondary border-brand-secondary/40 hover:bg-brand-secondary/20 hover:border-brand-secondary/60 transition-all duration-300 px-3 py-1 badge-enhanced"
                        >
                          {category.count} productos
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Featured Category Banner */}
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm min-h-[400px]">
          {/* Grid Layout: Exacto 50% - 50% */}
          <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[400px]">
            {/* Mitad Izquierda - Contenido */}
            <div className="flex flex-col justify-center p-8 md:p-12 space-y-6 relative z-10">
              <Badge className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 text-gray-800 border-brand-secondary/30 font-medium text-sm w-fit">
                Oferta especial
              </Badge>

              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Kit esencial para
                  <span className="block bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent">
                    ciclistas
                  </span>
                </h3>

                <p className="text-lg text-gray-300 leading-relaxed pr-4">
                  Equipamiento de seguridad, bolsos funcionales, herramientas y
                  accesorios esenciales para cada aventura. Promoción especial
                  este mes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="button-primary-glow group px-8 py-3 text-gray-900 font-semibold"
                >
                  Comprar Ahora
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
                >
                  Ver detalles
                </Button>
              </div>
            </div>

            {/* Mitad Derecha - Imagen Completa */}
            <div className="relative group/kit overflow-hidden rounded-r-3xl">
              <img
                src="/hero_ppal/kit_esencial.jpeg"
                alt="Kit de inicio para ciclistas"
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/kit:scale-105"
                loading="lazy"
              />

              {/* Overlay sutil para mejor integración */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-900/20"></div>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-l from-brand-primary/10 via-transparent to-transparent opacity-0 group-hover/kit:opacity-100 transition-all duration-500"></div>

              {/* Sutil border interno */}
              <div className="absolute inset-0 ring-1 ring-inset ring-brand-secondary/20 rounded-r-3xl"></div>
            </div>
          </div>

          {/* Background Decorations mejoradas */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-brand-secondary/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-brand-primary/10 to-transparent rounded-full blur-2xl"></div>
        </Card>
      </div>
    </section>
  )
}

export default Categories

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

import { useSearch } from '@/hooks/use-search-context'
import {
  ROCKBROS_CATEGORIES,
  getActiveCategories,
  type Category,
} from '@/lib/constants/categories'

// Interfaz para categorías con conteo real
interface CategoryWithRealCount extends Category {
  realCount: number
}

// Obtener las categorías base
const baseCategories: Category[] = getActiveCategories()

const Categories = () => {
  const { setSearchTerm } = useSearch()
  const [categories, setCategories] = useState<CategoryWithRealCount[]>([])
  const [loading, setLoading] = useState(true)

  // Función para obtener conteo real de productos por categoría
  const fetchProductCounts = async () => {
    try {
      setLoading(true)
      const categoriesWithCounts = await Promise.all(
        baseCategories.map(async category => {
          const { count, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category', category.name)
            .eq('is_active', true)

          if (error) {
            console.error(`Error fetching count for ${category.name}:`, error)
            return { ...category, realCount: category.count } // Fallback al conteo original
          }

          return { ...category, realCount: count || 0 }
        })
      )

      setCategories(categoriesWithCounts)
    } catch (error) {
      console.error('Error fetching product counts:', error)
      // En caso de error, usar categorías base con conteo original
      setCategories(
        baseCategories.map(cat => ({ ...cat, realCount: cat.count }))
      )
    } finally {
      setLoading(false)
    }
  }

  // Cargar conteos al montar el componente
  useEffect(() => {
    fetchProductCounts()
  }, [])

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
        {/* Encabezado de Sección */}
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
      {/* Grilla de Categorías */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {loading
            ? // Estado de carga
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="h-72 sm:h-80 animate-pulse bg-gray-800"
                >
                  <CardContent className="p-6 flex flex-col justify-end h-full">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-6 bg-gray-600 rounded mb-4"></div>
                    <div className="h-8 bg-gray-600 rounded"></div>
                  </CardContent>
                </Card>
              ))
            : categories.map((category, index) => {
                return (
                  <Card
                    key={category.id}
                    className="group cursor-pointer relative overflow-hidden rounded-2xl border-0 shadow-lg category-card-hover bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm h-72 sm:h-80 category-card-enter"
                    role="button"
                    tabIndex={0}
                    aria-label={`Explorar categoría ${category.name} con ${category.realCount} productos`}
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
                      {/* Imagen de Fondo con Posicionamiento Mejorado */}
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={category.image}
                          alt={`Categoría ${category.name}`}
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                          loading="lazy"
                        />

                        {/* Superposición Multicapa para Mejor Legibilidad */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${category.color} mix-blend-overlay transition-opacity duration-500 group-hover:opacity-80`}
                        ></div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                        {/* Resplandor de Borde Sutil al Pasar el Mouse */}
                        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-brand-secondary/40 transition-all duration-500"></div>
                      </div>

                      {/* Contenedor de Contenido con Mejor Espaciado */}
                      <div className="relative h-full flex flex-col justify-end p-6">
                        <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                          {/* Nombre de Categoría con Tipografía Mejorada */}
                          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-brand-secondary transition-colors duration-300 leading-tight">
                            {category.name}
                          </h3>

                          {/* Descripción con Mejor Espaciado */}
                          <p className="text-sm sm:text-base text-gray-200 mb-4 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                            {category.description}
                          </p>

                          {/* Badge Mejorado de Conteo de Productos */}
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium bg-black/30 text-brand-secondary border-brand-secondary/40 hover:bg-brand-secondary/20 hover:border-brand-secondary/60 transition-all duration-300 px-3 py-1 badge-enhanced"
                            >
                              {category.realCount} productos
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

      {/* Banner de Categoría Destacada */}
      <div className="container mx-auto px-4">
        <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm min-h-[400px]">
          {/* Diseño de Grilla: Exacto 50% - 50% */}
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

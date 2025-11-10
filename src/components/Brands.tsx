import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

// Información sobre RockBros
const rockBrosInfo = {
  name: 'RockBros',
  logo: '/logos/rockbros-logo.svg',
  foundedYear: '2010',
  description:
    'Marca líder en accesorios y equipamiento para ciclismo, especializada en productos innovadores y de alta calidad.',
  specialties: [
    'Accesorios para bicicletas',
    'Equipamiento de seguridad',
    'Herramientas de ciclismo',
    'Iluminación y reflectantes',
  ],
  brandSlides: [
    {
      id: 1,
      title: 'Calidad Premium',
      description:
        'Productos probados y certificados para máximo rendimiento en cada ruta',
      highlight: 'Certificación Internacional',
      image: '/hero_ppal/ciclista_en_carretera.jpeg',
      gradient: 'from-brand-primary/90 to-brand-dark/80',
    },
    {
      id: 2,
      title: 'Innovación Constante',
      description:
        'Diseños únicos con tecnología avanzada pensados para ciclistas profesionales y aficionados',
      highlight: 'Tecnología de Vanguardia',
      image: '/hero_ppal/bicileta_rockbros.jpeg',
      gradient: 'from-brand-secondary/90 to-brand-primary/80',
    },
    {
      id: 3,
      title: 'Distribución Nacional',
      description:
        'Envíos seguros a toda Colombia con garantía completa y soporte técnico especializado',
      highlight: 'Cobertura 100% Colombia',
      image: '/hero_ppal/66b1e23689260.jpeg',
      gradient: 'from-brand-dark/90 to-brand-neutral/80',
    },
    {
      id: 4,
      title: 'Pasión por el Ciclismo',
      description:
        'Cada producto está diseñado con la experiencia y el conocimiento de ciclistas apasionados',
      highlight: 'Hecho por Ciclistas',
      image: '/hero_ppal/66b1e90cef032.jpeg',
      gradient: 'from-brand-primary/90 to-brand-secondary/80',
    },
  ],
}

const Brands = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide cada 8 segundos
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % rockBrosInfo.brandSlides.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Función para pausar temporalmente el auto-play
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    pauseAutoPlay()
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % rockBrosInfo.brandSlides.length)
    pauseAutoPlay()
  }

  const prevSlide = () => {
    setCurrentSlide(
      prev =>
        (prev - 1 + rockBrosInfo.brandSlides.length) %
        rockBrosInfo.brandSlides.length
    )
    pauseAutoPlay()
  }

  return (
    <section
      id="brands"
      className="py-20 bg-background"
      aria-labelledby="brands-title"
    >
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-16 animate-fade-in">
        <div className="text-center">
          <Badge
            variant="secondary"
            className="mb-6 text-sm font-medium bg-gradient-to-r from-brand-secondary/20 to-brand-primary/20 text-gray-800 border-brand-secondary/30 px-4 py-2 rounded-full"
          >
            Nuestra Marca
          </Badge>
          <h2
            id="brands-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight"
          >
            Conoce
            <span className="block bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent mt-2">
              RockBros
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Somos distribuidores oficiales de RockBros en Colombia, ofreciendo
            productos de alta calidad para ciclistas apasionados como tú.
          </p>
        </div>
      </div>

      {/* Brand Info Card - Oculta temporalmente
      <div className="container mx-auto px-4 mb-16">
        <Card className="max-w-4xl mx-auto gradient-card border-0 shadow-large">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="w-24 h-24 mx-auto md:mx-0 mb-6 rounded-2xl overflow-hidden bg-white shadow-medium">
                  <img
                    src={rockBrosInfo.logo}
                    alt="RockBros Logo"
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {rockBrosInfo.name}
                </h3>
                <Badge variant="secondary" className="mb-4">
                  Fundada en {rockBrosInfo.foundedYear}
                </Badge>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {rockBrosInfo.description}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6">Especialidades</h4>
                <div className="space-y-3">
                  {rockBrosInfo.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">{specialty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      */}

      {/* Brand Values Slider - Optimizado para formato 16:9 */}
      <div className="relative w-full overflow-hidden rounded-3xl mx-4 shadow-2xl">
        {/* Slides Container - Aspecto 16:9 responsivo */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {rockBrosInfo.brandSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              {/* Background Image - Formato 16:9 optimizado */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out"
                  style={{
                    transform:
                      index === currentSlide ? 'scale(1.02)' : 'scale(1)',
                    objectPosition: 'center center',
                  }}
                />
                {/* Overlay mínimo solo para legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Content Overlay - Mejorado para mejor legibilidad */}
              <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Highlight Badge */}
                    <Badge
                      className={`inline-flex items-center mb-4 px-6 py-3 bg-black/40 text-brand-secondary border-brand-secondary/60 backdrop-blur-md text-sm font-medium rounded-full transform transition-all duration-1000 delay-300 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100 scale-100'
                          : 'translate-y-8 opacity-0 scale-95'
                      }`}
                    >
                      {slide.highlight}
                    </Badge>

                    {/* Title - Mejorada tipografía y espaciado */}
                    <h3
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-4xl mx-auto transform transition-all duration-1000 delay-500 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-12 opacity-0'
                      }`}
                      style={{
                        textShadow:
                          '0 6px 30px rgba(0, 0, 0, 0.8), 0 3px 12px rgba(0, 0, 0, 0.6), 0 1px 4px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      {slide.title}
                    </h3>

                    {/* Description - Mejorada legibilidad */}
                    <div
                      className={`transform transition-all duration-1000 delay-700 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-16 opacity-0'
                      }`}
                    >
                      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto mb-8">
                        <p className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed">
                          {slide.description}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button - Mejorado con mejor contraste */}
                    <div
                      className={`transform transition-all duration-1000 delay-900 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-20 opacity-0'
                      }`}
                    >
                      <Button
                        size="lg"
                        className="button-primary-glow px-8 py-4 text-lg font-semibold text-gray-900 shadow-2xl hover:shadow-brand-secondary/25 transform hover:scale-105 transition-all duration-300"
                      >
                        Explorar Productos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-6 bg-black/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
            {/* Prev Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-brand-secondary/20 hover:border-brand-secondary/40 hover:text-brand-secondary backdrop-blur-sm transition-all duration-300"
              aria-label="Slide anterior"
            >
              ←
            </Button>

            {/* Slide Indicators */}
            <div className="flex space-x-3">
              {rockBrosInfo.brandSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-3 bg-brand-secondary rounded-full'
                      : 'w-3 h-3 bg-white/40 hover:bg-white/60 rounded-full'
                  }`}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-brand-secondary/20 hover:border-brand-secondary/40 hover:text-brand-secondary backdrop-blur-sm transition-all duration-300"
              aria-label="Siguiente slide"
            >
              →
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-3xl">
          <div
            className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary transition-all duration-500 rounded-b-3xl"
            style={{
              width: `${
                ((currentSlide + 1) / rockBrosInfo.brandSlides.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default Brands

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
      image:
        'https://images.unsplash.com/photo-1544191696-15398b73dd9d?w=800&h=600&fit=crop&q=80',
      gradient: 'from-brand-primary/90 to-brand-dark/80',
    },
    {
      id: 2,
      title: 'Innovación Constante',
      description:
        'Diseños únicos con tecnología avanzada pensados para ciclistas profesionales y aficionados',
      highlight: 'Tecnología de Vanguardia',
      image:
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80',
      gradient: 'from-brand-secondary/90 to-brand-primary/80',
    },
    {
      id: 3,
      title: 'Distribución Nacional',
      description:
        'Envíos seguros a toda Colombia con garantía completa y soporte técnico especializado',
      highlight: 'Cobertura 100% Colombia',
      image:
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop&q=80',
      gradient: 'from-brand-dark/90 to-brand-neutral/80',
    },
    {
      id: 4,
      title: 'Pasión por el Ciclismo',
      description:
        'Cada producto está diseñado con la experiencia y el conocimiento de ciclistas apasionados',
      highlight: 'Hecho por Ciclistas',
      image:
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&q=80',
      gradient: 'from-brand-primary/90 to-brand-secondary/80',
    },
  ],
}

const Brands = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide functionality - Transiciones más lentas
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % rockBrosInfo.brandSlides.length)
    }, 8000) // Cambio cada 8 segundos (más lento)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Reactivar auto-slide después de 15 segundos
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % rockBrosInfo.brandSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const prevSlide = () => {
    setCurrentSlide(
      prev =>
        (prev - 1 + rockBrosInfo.brandSlides.length) %
        rockBrosInfo.brandSlides.length
    )
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  return (
    <section
      id="brands"
      className="py-20 bg-background"
      aria-labelledby="brands-title"
    >
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Nuestra Marca
          </Badge>
          <h2
            id="brands-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Conoce
            <span className="block gradient-primary bg-clip-text text-transparent">
              RockBros
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

      {/* Brand Values Slider - Full Width */}
      <div className="relative w-full overflow-hidden">
        {/* Slides Container - Altura responsiva */}
        <div className="relative h-[70vh] min-h-[500px] max-h-[800px]">
          {rockBrosInfo.brandSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  style={{
                    transform:
                      index === currentSlide ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
                ></div>
                {/* Additional Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              {/* Content Overlay - Centrado */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    {/* Highlight Badge */}
                    <Badge
                      className={`mb-6 bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30 backdrop-blur-sm text-sm font-medium transform transition-all duration-1000 delay-300 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-8 opacity-0'
                      }`}
                    >
                      {slide.highlight}
                    </Badge>

                    {/* Title */}
                    <h3
                      className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 delay-500 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-12 opacity-0'
                      }`}
                    >
                      {slide.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto transform transition-all duration-1000 delay-700 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-16 opacity-0'
                      }`}
                    >
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <Button
                      size="lg"
                      className={`bg-brand-secondary hover:bg-brand-primary text-brand-contrast shadow-xl hover:shadow-2xl transform transition-all duration-1000 delay-900 ${
                        index === currentSlide
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-20 opacity-0'
                      }`}
                    >
                      Explorar Productos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-4">
            {/* Prev Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md transition-all duration-300"
            >
              ←
            </Button>

            {/* Slide Indicators */}
            <div className="flex space-x-3">
              {rockBrosInfo.brandSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index === currentSlide
                      ? 'bg-brand-secondary scale-125 shadow-lg shadow-brand-secondary/50'
                      : 'bg-white/30 hover:bg-white/50 backdrop-blur-sm'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md transition-all duration-300"
            >
              →
            </Button>
          </div>
        </div>

        {/* Auto-play Indicator */}
        <div className="absolute top-8 right-8 z-20">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-brand-secondary animate-pulse shadow-lg shadow-brand-secondary/50'
                  : 'bg-white/40'
              }`}
            />
            <span className="text-white/80 text-xs font-medium">
              {isAutoPlaying ? 'Auto' : 'Manual'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-brand-secondary transition-all duration-300"
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
